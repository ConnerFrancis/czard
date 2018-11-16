const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const promisePool = require('es6-promise-pool')
const PromisePool = promisePool.PromisePool
const secureCompare = require('secure-compare')

var FieldValue = require('firebase-admin').firestore.FieldValue

const db = admin.firestore()
const firebase = admin.database()
db.settings({
  timestampsInSnapshots: true
})

const rooms = db.collection('rooms')
const users = db.collection('users')
const decks = db.collection('decks')

/**
 * Cleansing data
 *
 * Cleans rooms and users accounts
 *
 * WARNING: This uses like a bajillion reads. RIP quota :(
 */

// Get all the inactive users
const cutoff = 8
function getInactiveUsers () {
  const users = []

  return db.collection('users')
    .where('anonymous', '==', true)
    .where('online', '==', false)
    .where('lastSeen', '<', Date.now() - (cutoff * 60 * 60 * 1000))
    .get()
    .then(snapshot => {
      snapshot.forEach(doc => {
        console.log('Grabbed user ' + doc.id + '.')
        users.push(doc.id)
      })
      return users
    })
}

// Delete all inactive users
function deleteInactiveUsers (users) {
  if (users.length > 0) {
    const user = users.pop()

    // This should trigger the userStatusLink removal sequence
    firebase.ref('/status/' + user).remove()
  }

  return null
}

// Add the function to firebase
exports.cleanseUsers = functions.https.onRequest((req, res) => {
  const key = req.query.key

  // Check if the https key matches or not
  if (!secureCompare(key, functions.config().cron.key)) {
    console.log('HTTPS key in cleanseUsers does not match. (Given ' + key + ')')
    res.status(403).send('The key given does not match.')
    return null // firebase nonsense
  }

  return getInactiveUsers()
    .then(users => {
      const pool = new PromisePool(() => deleteInactiveUsers(users), 3)
      return pool.start()
    })
    .then(() => {
      console.log('Cleansing user data.')
      res.send('Cleansing user data, see the Functions Logs for information.')
      return null
    })
})

/**
 * Cleans all rooms that have no players
 */

async function getActivePlayers (players) {
  const activePlayers = []
  for (let player of players) {
    // eslint-disable-next-line
    let snapshot = await firebase.ref('/status/' + player).once('value')
    if (snapshot.val() === 'online') activePlayers.push(player)
  }
  return activePlayers
}

// TODO: deprecate this intesive function. no bueno amigo
//       - or use cronjob to run like every 8 hours idk
exports.cleanseRooms = functions.firestore
  .document('rooms/{roomId}')
  .onUpdate(( change, context ) => {
    const data = change.after.data()
    const previousData = change.before.data()

    // If the players havent changed, just quit
    // eslint-disable-next-line
    if (data.players == previousData.players) return null

    return getActivePlayers(data.players)
      .then(activePlayers => {
        console.log(`#${context.params.roomId}# active player list: ${activePlayers}.`)

        if (activePlayers.length === 0) change.after.ref.delete()
        if (activePlayers.length > 0) change.after.ref.set({
          players: activePlayers
        })

      return null
      })
  })

/**
 * When a user's status changes in the realtime db
 */

async function getOldRoom (user) {
  return users.doc(user)
    .get()
    .then(doc => {
      return doc.data().room
    })
    .catch(e => reject(e))
}

// This functions returns a janky array. Don't worry about it.
async function playerFiltered (room, player) {
  return rooms.doc(room)
    .get()
    .then(doc => {
      let filtered = doc.data().players.filter(p => p !== player)
      return [
        filtered,
        room
      ]
    })
}

exports.userStatusLink = functions.database
  .ref('/status/{userId}')
  .onWrite(( change, context ) => {
    // If the write is a deletion...
    if (!change.after.exists()) {
      return db.collection('users')
        .doc(context.params.userId)
        .delete()
          .then(() => {
            return admin.auth().deleteUser(context.params.userId)
          })
    }

    // ... otherwise continue operations.
    const batch = db.batch()

    return getOldRoom(context.params.userId)
      .then(oldRoom => {
        return playerFiltered(oldRoom, context.params.userId)
      })
      .then(data => {
        // data[0] filtered players
        // data[1] room id
        if (data[0].length > 1) batch.update(rooms.doc(data[1]), {
          players: data[0]
        })
        if (data[0].length === 0) batch.delete(rooms.doc(data[1]))
        batch.update(users.doc(context.params.userId), {
          online: (change.after.val() === 'online'),
          room: null,
          lastSeen: Math.floor(Date.now())
        })
        return batch.commit()
      })
      .catch(e => console.error(e))
  })
