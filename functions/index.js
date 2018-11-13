const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp(functions.config().firebase)

const promisePool = require('es6-promise-pool')
const PromisePool = promisePool.PromisePool
const secureCompare = require('secure-compare')

const db = admin.firestore()
const firebase = admin.database()
db.settings({
  timestampsInSnapshots: true
})

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
  let activePlayers = []
  for (let player of players) {
    // eslint-disable-next-line
    let snapshot = await firebase.ref('/status/' + player).once('value')
    console.log(snapshot.val())
    if (snapshot.val() === 'online') activePlayers.push(player)
  }
  return activePlayers
}

exports.cleanseRooms = functions.firestore
  .document('rooms/{roomId}')
  .onUpdate(( change, context ) => {
    const data = change.after.data()
    const previousData = change.before.data()

    console.log(`Data: ${data.players}. Previous data: ${previousData.players}.`)

    // If the players havent changed, just quit
    // eslint-disable-next-line
    if (data.players == previousData.players) return null

    return getActivePlayers(data.players)
      .then(activePlayers => {
        console.log(activePlayers)

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
exports.userStatusLink = functions.database
  .ref('/status/{userId}')
  .onWrite(( change, context ) => {
    // If the write is a deletion
    if (!change.after.exists()) {
      return db.collection('users')
        .doc(context.params.userId)
        .delete()
          .then(() => {
            return admin.auth().deleteUser(context.params.userId)
          })
    }

    return db.collection('users')
      .doc(context.params.userId)
      .set({
        online: (change.after.val() === 'online'),
        lastSeen: Math.floor(Date.now()) // Firestore timestamps can eat nutz
      }, { merge: true })
  })
