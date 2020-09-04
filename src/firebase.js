import * as firebase from "firebase";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAN6BrzWq63NDIfIDgOkyi0OSKUEdNPcfI",
  authDomain: "react-router-firestore.firebaseapp.com",
  databaseURL: "https://react-router-firestore.firebaseio.com",
  projectId: "react-router-firestore",
  storageBucket: "react-router-firestore.appspot.com",
  messagingSenderId: "879025554208",
  appId: "1:879025554208:web:b39002bd68c27250d60d45",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;
