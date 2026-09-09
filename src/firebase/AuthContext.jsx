import { createContext, useContext, useEffect, useState } from 'react'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db, googleProvider } from './config'

const ADMIN_EMAIL = 'admin123@gmail.com'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const ref  = doc(db, 'users', firebaseUser.uid)
        const snap = await getDoc(ref)

        let profile = {}

        if (snap.exists()) {
          profile = snap.data()
        } else {
          // Документа нет — создаём (актуально для admin и старых пользователей)
          profile = {
            uid:         firebaseUser.uid,
            email:       firebaseUser.email,
            displayName: firebaseUser.displayName || '',
            photoURL:    firebaseUser.photoURL || '',
            role:        firebaseUser.email === ADMIN_EMAIL ? 'admin' : 'user',
            createdAt:   serverTimestamp(),
          }
          await setDoc(ref, profile)
        }

        const isAdmin = firebaseUser.email === ADMIN_EMAIL || profile.role === 'admin'
        setUser({ ...firebaseUser, profile, isAdmin })
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const saveUser = async (firebaseUser, extra = {}) => {
    const ref  = doc(db, 'users', firebaseUser.uid)
    const snap = await getDoc(ref)
    if (!snap.exists()) {
      await setDoc(ref, {
        uid:         firebaseUser.uid,
        email:       firebaseUser.email,
        displayName: firebaseUser.displayName || extra.displayName || '',
        photoURL:    firebaseUser.photoURL || '',
        role:        firebaseUser.email === ADMIN_EMAIL ? 'admin' : 'user',
        createdAt:   serverTimestamp(),
        ...extra,
      })
    }
  }

  const register = async (email, password, displayName) => {
    const { user: u } = await createUserWithEmailAndPassword(auth, email, password)
    await updateProfile(u, { displayName })
    await saveUser(u, { displayName })
    return u
  }

  const login = async (email, password) => {
    const { user: u } = await signInWithEmailAndPassword(auth, email, password)
    return u
  }

  const loginWithGoogle = async () => {
    const { user: u } = await signInWithPopup(auth, googleProvider)
    await saveUser(u)
    return u
  }

  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, loading, register, login, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
