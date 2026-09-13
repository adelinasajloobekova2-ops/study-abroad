import { useState, useEffect } from 'react'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { db } from './config'

/**
 * Загружает туры только из Firestore коллекции 'tours'.
 * Возвращает { tours, loading, reload }
 */
export function useTours() {
  const [tours, setTours]     = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const q    = query(collection(db, 'tours'), orderBy('createdAt', 'desc'))
      const snap = await getDocs(q)
      setTours(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch {
      // Fallback: если индекс ещё не создан — грузим без сортировки
      try {
        const snap = await getDocs(collection(db, 'tours'))
        setTours(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      } catch {
        setTours([])
      }
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  return { tours, loading, reload: load }
}
