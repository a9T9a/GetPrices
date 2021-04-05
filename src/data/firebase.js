import firebase from "firebase/app"
require('firebase/firestore')

const firebaseConfig = {
    apiKey: "AIzaSyAOX8Cmu4zfbdviI7n16dGAM5vQMAksXhU",
    authDomain: "scrapethings-e4356.firebaseapp.com",
    projectId: "scrapethings-e4356",
    storageBucket: "gs://scrapethings-e4356.appspot.com",
    messagingSenderId: "599998440858",
    appId: "1:599998440858:web:b50a918995d20eed3f4623"
  };

  firebase.initializeApp(firebaseConfig);

  export const db = firebase.firestore()