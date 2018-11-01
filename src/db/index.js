import firebase from 'firebase'

firebase.initializeApp({
  apiKey: 'AIzaSyBb3bkrYkEd3b9B4O4g-o7-hwF8Wr_8rpc',
  authDomain: 'czard-db.firebaseapp.com',
  databaseURL: 'https://czard-db.firebaseio.com',
  projectId: 'czard-db',
  storageBucket: '',
  messagingSenderId: '921443101176'
})

const db = firebase.firestore()
db.settings({
  timestampsInSnapshots: true
})

export default db
