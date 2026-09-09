import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyAQ7NabL4-qL9GpBvfjnglzLnQQ4_roR-o",
  authDomain: "study-abroad-ecb4b.firebaseapp.com",
  projectId: "study-abroad-ecb4b",
  storageBucket: "study-abroad-ecb4b.firebasestorage.app",
  messagingSenderId: "475462374587",
  appId: "1:475462374587:web:ef99de3af23961ac8b859e",
  measurementId: "G-NMRDH5170P"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db   = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
export const analytics = getAnalytics(app)
