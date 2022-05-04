import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyASYD_-8R79JyrXaEA27e3Hv0uXIpi2wjk",
    authDomain: "photo-social-app-project.firebaseapp.com",
    projectId: "photo-social-app-project",
    storageBucket: "photo-social-app-project.appspot.com",
    messagingSenderId: "890083185138",
    appId: "1:890083185138:web:fd53b6fdd95384e44c9b6b",
    measurementId: "G-9HM0QJ2JCM"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp, "gs://photo-social-app-project.appspot.com");

export { firebaseApp, db, auth, storage }