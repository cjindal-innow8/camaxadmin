import firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyB8iTbNZgcIn6GKyYY2gip6IZ3OiQmeuQ4",
  authDomain: "camax-81a85.firebaseapp.com",
  databaseURL: "https://camax-81a85-default-rtdb.firebaseio.com",
  projectId: "camax-81a85",
  storageBucket: "camax-81a85.appspot.com",
  messagingSenderId: "459302637845",
  appId: "1:459302637845:web:ffe51b488e388c933bd91c"
};
firebase.initializeApp(firebaseConfig)
export default firebase;
export const db = firebase.db()