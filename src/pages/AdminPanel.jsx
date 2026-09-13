import { useEffect, useState } from 'react'
import {
  collection, getDocs, deleteDoc, doc,
  updateDoc, addDoc, serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../firebase/AuthContext'
import { toast } from 'react-toastify'
import logoImg from '../assets/WhatsApp Image 2026-09-08 at 20.41.48.jpeg'
import {
  FiGrid, FiClipboard, FiUsers, FiMap, FiLogOut, FiShield,
  FiTrash2, FiPlus, FiEdit3, FiStar, FiCheck, FiX, FiSave,
  FiMessageSquare, FiEye, FiEyeOff, FiRefreshCw, FiImage
} from 'react-icons/fi'
import './Admin.css'

const TABS = ['dashboard', 'bookings', 'reviews', 'users', 'tours', 'add-tour']

const TAB_ICONS = {
  dashboard:  <FiGrid size={16} />,
  bookings:   <FiClipboard size={16} />,
  reviews:    <FiMessageSquare size={16} />,
  users:      <FiUsers size={16} />,
  tours:      <FiMap size={16} />,
  'add-tour': <FiPlus size={16} />,
}

const TAB_LABELS = {
  dashboard:  'Дашборд',
  bookings:   'Заявки',
  reviews:    'Отзывы',
  users:      'Пользователи',
  tours:      'Туры',
  'add-tour': 'Создать тур',
}

const EMPTY_TOUR = {
  title: '', subtitle: '', category: 'горы', duration: '',
  groupSize: '', price: '', difficulty: 'Лёгкий',
  image: '', imageUrl: '', imageBase64: '',
  description: '', location: '',
  includes: '', highlights: '', featured: false,
}

const STATUS_COLOR  = { new: '#e8a020', confirmed: '#27ae60', cancelled: '#c0392b' }
const REVIEW_STATUS = {
  pending:  { label: 'На проверке',  color: '#e8a020', bg: 'rgba(232,160,32,0.1)'  },
  approved: { label: 'Одобрен',      color: '#27ae60', bg: 'rgba(39,174,96,0.1)'   },
  rejected: { label: 'Отклонён',     color: '#c0392b', bg: 'rgba(192,57,43,0.1)'   },
}

export default function AdminPanel() {
  const { user, logout } = useAuth()

  const [tab, setTab]           = useState('dashboard')
  const [bookings, setBookings] = useState([])
  const [users, setUsers]       = useState([])
  const [reviews, setReviews]   = useState([])
  const [loading, setLoading]   = useState(false)
  const [dynamicTours, setDynamicTours] = useState([])
  const [editingTour, setEditingTour]   = useState(null)
  const [tourForm, setTourForm] = useState(EMPTY_TOUR)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [reviewFilter, setReviewFilter] = useState('all') // all | pending | approved | rejected

  // Load data when tab changes
  useEffect(() => {
    if (tab === 'bookings') loadBookings()
    if (tab === 'users')    loadUsers()
    if (tab === 'tours')    loadDynamicTours()
    if (tab === 'reviews')  loadReviews()
  }, [tab])

  /* ─── Loaders ─── */
  const loadBookings = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, 'bookings'))
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch { toast.error('Не удалось загрузить заявки.'); setBookings([]) }
    setLoading(false)
  }

  const loadUsers = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, 'users'))
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch { toast.error('Не удалось загрузить пользователей.'); setUsers([]) }
    setLoading(false)
  }

  const loadDynamicTours = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, 'tours'))
      setDynamicTours(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch { toast.error('Не удалось загрузить туры.'); setDynamicTours([]) }
    setLoading(false)
  }

  const loadReviews = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, 'reviews'))
      const list = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0))
      setReviews(list)
    } catch { toast.error('Не удалось загрузить отзывы.'); setReviews([]) }
    setLoading(false)
  }

  /* ─── Bookings ─── */
  const deleteBooking = async (id) => {
    if (!window.confirm('Удалить заявку?')) return
    try {
      await deleteDoc(doc(db, 'bookings', id))
      setBookings(prev => prev.filter(b => b.id !== id))
      toast.success('Заявка удалена.')
    } catch { toast.error('Ошибка при удалении заявки.') }
  }
  const updateBookingStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status })
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
      toast.info('Статус заявки обновлён.')
    } catch { toast.error('Не удалось обновить статус.') }
  }

  /* ─── Reviews ─── */
  const updateReviewStatus = async (id, status) => {
    try {
      await updateDoc(doc(db, 'reviews', id), { status })
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r))
      if (status === 'approved') toast.success('Отзыв одобрен и опубликован на сайте.')
      else if (status === 'rejected') toast.warning('Отзыв скрыт.')
    } catch { toast.error('Не удалось обновить статус отзыва.') }
  }
  const deleteReview = async (id) => {
    if (!window.confirm('Удалить отзыв?')) return
    try {
      await deleteDoc(doc(db, 'reviews', id))
      setReviews(prev => prev.filter(r => r.id !== id))
      toast.success('Отзыв удалён.')
    } catch { toast.error('Ошибка при удалении отзыва.') }
  }

  const filteredReviews = reviewFilter === 'all'
    ? reviews
    : reviews.filter(r => r.status === reviewFilter)

  /* ─── Tours ─── */
  const deleteDynamicTour = async (id) => {
    if (!window.confirm('Удалить тур из Firestore?')) return
    try {
      await deleteDoc(doc(db, 'tours', id))
      setDynamicTours(prev => prev.filter(t => t.id !== id))
      toast.success('Тур удалён.')
    } catch { toast.error('Ошибка при удалении тура.') }
  }

  const startEdit = (tour) => {
    setEditingTour(tour.id)
    setTourForm({
      title:       tour.title || '',
      subtitle:    tour.subtitle || '',
      category:    tour.category || 'горы',
      duration:    tour.duration || '',
      groupSize:   tour.groupSize || '',
      price:       tour.price || '',
      difficulty:  tour.difficulty || 'Лёгкий',
      image:       tour.image || '',
      imageUrl:    tour.image?.startsWith('http') ? tour.image : '',
      imageBase64: tour.image?.startsWith('data:') ? tour.image : '',
      description: tour.description || '',
      location:    tour.location || '',
      includes:    Array.isArray(tour.includes) ? tour.includes.join(', ') : (tour.includes || ''),
      highlights:  Array.isArray(tour.highlights) ? tour.highlights.join(', ') : (tour.highlights || ''),
      featured:    tour.featured || false,
    })
    setTab('add-tour')
  }

  const handleTourFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setTourForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  // Конвертация выбранного файла в base64
  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Ограничение 3 MB
    if (file.size > 3 * 1024 * 1024) {
      toast.warning('Файл слишком большой. Максимум 3 МБ.')
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      const base64 = ev.target.result
      setTourForm(prev => ({
        ...prev,
        image:       base64,
        imageBase64: base64,
        imageUrl:    '',
      }))
      toast.success('Фото загружено!')
    }
    reader.onerror = () => toast.error('Не удалось прочитать файл.')
    reader.readAsDataURL(file)

    // сброс input чтобы можно было выбрать тот же файл снова
    e.target.value = ''
  }

  const handleTourSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const data = {
        ...tourForm,
        price:      Number(tourForm.price) || 0,
        rating:     5.0,
        reviews:    0,
        includes:   tourForm.includes.split(',').map(s => s.trim()).filter(Boolean),
        highlights: tourForm.highlights.split(',').map(s => s.trim()).filter(Boolean),
        slug:       tourForm.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        createdAt:  serverTimestamp(),
      }
      if (editingTour) {
        await updateDoc(doc(db, 'tours', editingTour), data)
        setDynamicTours(prev => prev.map(t => t.id === editingTour ? { ...t, ...data, id: editingTour } : t))
        toast.success('Тур успешно обновлён!')
      } else {
        const ref = await addDoc(collection(db, 'tours'), data)
        setDynamicTours(prev => [...prev, { ...data, id: ref.id }])
        toast.success('Тур успешно создан!')
      }
      setSaved(true)
      setTimeout(() => { setSaved(false); setTourForm(EMPTY_TOUR); setEditingTour(null); setTab('tours') }, 1200)
    } catch (err) {
      toast.error('Ошибка: ' + err.message)
    }
    setSaving(false)
  }

  const cancelEdit = () => { setTourForm(EMPTY_TOUR); setEditingTour(null); setTab('tours') }

  const pendingCount   = reviews.filter(r => r.status === 'pending').length
  const approvedCount  = reviews.filter(r => r.status === 'approved').length

  /* ─── Render ─── */
  return (
    <div className="admin">
      {/* Sidebar */}
      <aside className="admin__sidebar">
        <div className="admin__sidebar-logo">
          <img src={logoImg} alt="Nomad Tour KG" className="admin__sidebar-logo-img" />
          <div>
            <div className="admin__sidebar-title">Nomad Tour KG</div>
            <div className="admin__sidebar-role">Admin Panel</div>
          </div>
        </div>

        <nav className="admin__nav">
          {TABS.map(t => (
            <button
              key={t}
              className={`admin__nav-btn ${tab === t ? 'active' : ''}`}
              onClick={() => {
                setTab(t)
                if (t !== 'add-tour') { setEditingTour(null); setTourForm(EMPTY_TOUR) }
              }}
            >
              {TAB_ICONS[t]}
              <span>{TAB_LABELS[t]}</span>
              {t === 'reviews' && pendingCount > 0 && (
                <span className="admin__nav-badge">{pendingCount}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="admin__sidebar-footer">
          <div className="admin__user">
            <div className="admin__user-avatar">
              {user?.displayName?.[0] || 'A'}
            </div>
            <div>
              <div className="admin__user-name">{user?.displayName || 'Admin'}</div>
              <div className="admin__user-email">{user?.email}</div>
            </div>
          </div>
          <button className="admin__logout-btn" onClick={logout}>
            <FiLogOut size={14} /> Выйти
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin__main">
        <div className="admin__topbar">
          <h1 className="admin__page-title">{TAB_LABELS[tab]}</h1>
          <div className="admin__topbar-right">
            <button
              className="admin__refresh-btn"
              title="Обновить данные"
              onClick={() => {
                if (tab === 'bookings') loadBookings()
                if (tab === 'users')   loadUsers()
                if (tab === 'tours')   loadDynamicTours()
                if (tab === 'reviews') loadReviews()
                toast.info('Данные обновлены.')
              }}
            >
              <FiRefreshCw size={15} />
            </button>
            <span className="admin__badge"><FiShield size={14} /> Администратор</span>
          </div>
        </div>

        {/* ── Dashboard ── */}
        {tab === 'dashboard' && (
          <div className="admin__content">
            <div className="admin__stats-grid">
              <div className="admin__stat-card">
                <div className="admin__stat-icon"><FiMap size={22} /></div>
                <div className="admin__stat-val">{dynamicTours.length || '—'}</div>
                <div className="admin__stat-label">Всего туров</div>
              </div>
              <div className="admin__stat-card">
                <div className="admin__stat-icon"><FiClipboard size={22} /></div>
                <div className="admin__stat-val">{bookings.length || '—'}</div>
                <div className="admin__stat-label">Заявок</div>
              </div>
              <div className="admin__stat-card">
                <div className="admin__stat-icon"><FiMessageSquare size={22} /></div>
                <div className="admin__stat-val">{approvedCount || '—'}</div>
                <div className="admin__stat-label">Одобрено отзывов</div>
              </div>
              <div className="admin__stat-card">
                <div className="admin__stat-icon"><FiStar size={22} /></div>
                <div className="admin__stat-val">4.9</div>
                <div className="admin__stat-label">Средний рейтинг</div>
              </div>
            </div>

            <div className="admin__welcome">
              <h2>Добро пожаловать, {user?.displayName || 'Администратор'}! 👋</h2>
              <p>Управляйте заявками, отзывами и турами через левое меню.</p>
              <div className="admin__quick-links">
                <button className="admin__quick-btn" onClick={() => setTab('bookings')}>
                  <FiClipboard size={15} /> Заявки
                </button>
                <button className="admin__quick-btn" onClick={() => setTab('reviews')}>
                  <FiMessageSquare size={15} /> Отзывы
                  {pendingCount > 0 && <span className="admin__quick-badge">{pendingCount}</span>}
                </button>
                <button className="admin__quick-btn" onClick={() => setTab('add-tour')}>
                  <FiPlus size={15} /> Создать тур
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Bookings ── */}
        {tab === 'bookings' && (
          <div className="admin__content">
            {loading ? (
              <div className="admin__loading"><span className="admin__spinner" /></div>
            ) : bookings.length === 0 ? (
              <div className="admin__empty">
                <FiClipboard size={40} color="var(--gray-400)" />
                <p>Заявок пока нет. Они появятся после отправки форм на сайте.</p>
              </div>
            ) : (
              <div className="admin__table-wrap">
                <table className="admin__table">
                  <thead>
                    <tr>
                      <th>Имя</th><th>Email</th><th>Телефон</th>
                      <th>Тур</th><th>Чел.</th><th>Сообщение</th>
                      <th>Статус</th><th>Дата</th><th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id}>
                        <td><strong>{b.name}</strong></td>
                        <td>{b.email}</td>
                        <td>{b.phone || '—'}</td>
                        <td>{b.tour || '—'}</td>
                        <td>{b.people || '—'}</td>
                        <td>
                          <span className="admin__msg-preview" title={b.message}>
                            {b.message ? (b.message.length > 40 ? b.message.slice(0, 40) + '…' : b.message) : '—'}
                          </span>
                        </td>
                        <td>
                          <select
                            className="admin__status-select"
                            value={b.status || 'new'}
                            onChange={e => updateBookingStatus(b.id, e.target.value)}
                            style={{ borderColor: STATUS_COLOR[b.status || 'new'] }}
                          >
                            <option value="new">Новая</option>
                            <option value="confirmed">Подтверждена</option>
                            <option value="cancelled">Отменена</option>
                          </select>
                        </td>
                        <td className="admin__date-cell">
                          {b.createdAt?.toDate
                            ? b.createdAt.toDate().toLocaleDateString('ru')
                            : '—'}
                        </td>
                        <td>
                          <button className="admin__del-btn" onClick={() => deleteBooking(b.id)}>
                            <FiTrash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Reviews ── */}
        {tab === 'reviews' && (
          <div className="admin__content">
            {/* Filter tabs */}
            <div className="admin__review-filters">
              {['all', 'pending', 'approved', 'rejected'].map(f => (
                <button
                  key={f}
                  className={`admin__review-filter-btn ${reviewFilter === f ? 'active' : ''}`}
                  onClick={() => setReviewFilter(f)}
                >
                  {f === 'all'      && 'Все'}
                  {f === 'pending'  && <>На проверке {pendingCount > 0 && <span className="admin__filter-count">{pendingCount}</span>}</>}
                  {f === 'approved' && 'Одобренные'}
                  {f === 'rejected' && 'Отклонённые'}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="admin__loading"><span className="admin__spinner" /></div>
            ) : filteredReviews.length === 0 ? (
              <div className="admin__empty">
                <FiMessageSquare size={40} color="var(--gray-400)" />
                <p>
                  {reviewFilter === 'all'
                    ? 'Отзывов пока нет. Они появятся после отправки на странице отзывов.'
                    : `Нет отзывов со статусом "${REVIEW_STATUS[reviewFilter]?.label || reviewFilter}".`}
                </p>
              </div>
            ) : (
              <div className="admin__reviews-list">
                {filteredReviews.map(r => {
                  const st = REVIEW_STATUS[r.status] || REVIEW_STATUS.pending
                  return (
                    <div key={r.id} className="admin__review-card">
                      {/* Header */}
                      <div className="admin__review-head">
                        <div className="admin__review-author">
                          <div className="admin__user-avatar-sm">
                            {(r.avatar || r.name?.[0] || '?').toUpperCase()}
                          </div>
                          <div>
                            <div className="admin__review-name">{r.name}</div>
                            <div className="admin__review-meta">
                              {r.country && <span>{r.country}</span>}
                              {r.tour && <span>· {r.tour}</span>}
                              {r.createdAt?.toDate && (
                                <span>· {r.createdAt.toDate().toLocaleDateString('ru')}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="admin__review-right">
                          {/* Stars */}
                          <div className="admin__review-stars">
                            {[1,2,3,4,5].map(s => (
                              <FiStar key={s} size={13}
                                className={s <= (r.rating || 5) ? 'star-filled' : 'star-empty'} />
                            ))}
                          </div>
                          {/* Status badge */}
                          <span
                            className="admin__review-status"
                            style={{ color: st.color, background: st.bg }}
                          >
                            {st.label}
                          </span>
                        </div>
                      </div>

                      {/* Text */}
                      <p className="admin__review-text">"{r.text}"</p>

                      {/* Actions */}
                      <div className="admin__review-actions">
                        {r.status !== 'approved' && (
                          <button
                            className="admin__review-btn admin__review-btn--approve"
                            onClick={() => updateReviewStatus(r.id, 'approved')}
                          >
                            <FiEye size={14} /> Показать на сайте
                          </button>
                        )}
                        {r.status === 'approved' && (
                          <button
                            className="admin__review-btn admin__review-btn--reject"
                            onClick={() => updateReviewStatus(r.id, 'rejected')}
                          >
                            <FiEyeOff size={14} /> Скрыть
                          </button>
                        )}
                        {r.status === 'pending' && (
                          <button
                            className="admin__review-btn admin__review-btn--reject"
                            onClick={() => updateReviewStatus(r.id, 'rejected')}
                          >
                            <FiX size={14} /> Отклонить
                          </button>
                        )}
                        <button
                          className="admin__del-btn"
                          onClick={() => deleteReview(r.id)}
                          title="Удалить"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Users ── */}
        {tab === 'users' && (
          <div className="admin__content">
            {loading ? (
              <div className="admin__loading"><span className="admin__spinner" /></div>
            ) : users.length === 0 ? (
              <div className="admin__empty">
                <FiUsers size={40} color="var(--gray-400)" />
                <p>Пользователей пока нет.</p>
              </div>
            ) : (
              <div className="admin__table-wrap">
                <table className="admin__table">
                  <thead>
                    <tr><th>Имя</th><th>Email</th><th>Роль</th><th>Дата регистрации</th></tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div className="admin__user-row">
                            <div className="admin__user-avatar-sm">
                              {(u.displayName || u.email || '?')[0].toUpperCase()}
                            </div>
                            {u.displayName || '—'}
                          </div>
                        </td>
                        <td>{u.email}</td>
                        <td>
                          <span className={`admin__role-badge ${u.role === 'admin' ? 'admin' : ''}`}>
                            {u.role === 'admin' ? 'Админ' : 'Пользователь'}
                          </span>
                        </td>
                        <td>
                          {u.createdAt?.toDate
                            ? u.createdAt.toDate().toLocaleDateString('ru')
                            : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Tours ── */}
        {tab === 'tours' && (
          <div className="admin__content">
            <div className="admin__tours-header">
              <p className="admin__tours-note">
                Всего туров в Firestore: <strong>{dynamicTours.length}</strong>
              </p>
              <button className="btn-primary admin__add-btn" onClick={() => setTab('add-tour')}>
                <FiPlus size={15} /> Добавить тур
              </button>
            </div>

            {loading ? (
              <div className="admin__loading"><span className="admin__spinner" /></div>
            ) : dynamicTours.length === 0 ? (
              <div className="admin__empty">
                <FiMap size={40} color="var(--gray-400)" />
                <p>Туров пока нет. Нажмите «Добавить тур», чтобы создать первый.</p>
              </div>
            ) : (
              <div className="admin__tours-grid">
                {dynamicTours.map(tour => (
                  <div key={tour.id} className="admin__tour-card">
                    {tour.image
                      ? <img src={tour.image} alt={tour.title} />
                      : <div className="admin__tour-no-img"><FiMap size={28} /></div>
                    }
                    <div className="admin__tour-info">
                      {tour.featured && (
                        <span className="admin__tour-badge admin__tour-badge--featured">На главной</span>
                      )}
                      <h3>{tour.title}</h3>
                      <p>{tour.duration || '—'} · {tour.groupSize || '—'}</p>
                      <div className="admin__tour-footer">
                        <span className="admin__tour-price">
                          {Number(tour.price || 0).toLocaleString('ru')} с
                        </span>
                        <div className="admin__tour-actions">
                          <button className="admin__edit-btn" onClick={() => startEdit(tour)}>
                            <FiEdit3 size={14} />
                          </button>
                          <button className="admin__del-btn" onClick={() => deleteDynamicTour(tour.id)}>
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Add / Edit Tour ── */}
        {tab === 'add-tour' && (
          <div className="admin__content">
            <div className="admin__form-wrap">
              <div className="admin__form-header">
                <h2>{editingTour ? 'Редактировать тур' : 'Создать новый тур'}</h2>
                <p>Заполните форму. Тур будет сохранён в Firestore.</p>
              </div>

              {saved && (
                <div className="admin__form-success">
                  <FiCheck size={18} /> Тур успешно {editingTour ? 'обновлён' : 'создан'}!
                </div>
              )}

              <form className="admin__tour-form" onSubmit={handleTourSubmit}>
                <div className="admin__form-grid">
                  <div className="admin__form-group">
                    <label>Название тура *</label>
                    <input name="title" value={tourForm.title} onChange={handleTourFormChange}
                      placeholder="напр. Иссык-Куль" required />
                  </div>
                  <div className="admin__form-group">
                    <label>Подзаголовок</label>
                    <input name="subtitle" value={tourForm.subtitle} onChange={handleTourFormChange}
                      placeholder="напр. Жемчужина Кыргызстана" />
                  </div>
                </div>

                <div className="admin__form-grid">
                  <div className="admin__form-group">
                    <label>Категория</label>
                    <select name="category" value={tourForm.category} onChange={handleTourFormChange}>
                      <option value="горы">Горы</option>
                      <option value="озёра">Озёра</option>
                      <option value="культура">Культура</option>
                      <option value="приключения">Приключения</option>
                    </select>
                  </div>
                  <div className="admin__form-group">
                    <label>Сложность</label>
                    <select name="difficulty" value={tourForm.difficulty} onChange={handleTourFormChange}>
                      <option value="Лёгкий">Лёгкий</option>
                      <option value="Средний">Средний</option>
                      <option value="Сложный">Сложный</option>
                    </select>
                  </div>
                </div>

                <div className="admin__form-grid">
                  <div className="admin__form-group">
                    <label>Продолжительность</label>
                    <input name="duration" value={tourForm.duration} onChange={handleTourFormChange}
                      placeholder="напр. 5 дней / 4 ночи" />
                  </div>
                  <div className="admin__form-group">
                    <label>Размер группы</label>
                    <input name="groupSize" value={tourForm.groupSize} onChange={handleTourFormChange}
                      placeholder="напр. 2–12 чел." />
                  </div>
                </div>

                <div className="admin__form-grid">
                  <div className="admin__form-group">
                    <label>Цена (сом) *</label>
                    <input name="price" type="number" value={tourForm.price} onChange={handleTourFormChange}
                      placeholder="напр. 12500" required min="0" />
                  </div>
                  <div className="admin__form-group">
                    <label>Локация</label>
                    <input name="location" value={tourForm.location} onChange={handleTourFormChange}
                      placeholder="напр. Иссык-Кульская область" />
                  </div>
                </div>

                <div className="admin__form-group admin__form-group--full">
                  <label>Изображение тура</label>
                  <div className="admin__img-upload">
                    {/* Кнопка выбора файла */}
                    <label className="admin__img-upload-btn" htmlFor="tour-img-input">
                      <FiImage size={18} />
                      {tourForm.image ? 'Заменить фото' : 'Выбрать из галереи'}
                    </label>
                    <input
                      id="tour-img-input"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleImageUpload}
                    />

                    {/* Или вставить URL */}
                    <span className="admin__img-or">или</span>
                    <input
                      className="admin__img-url-input"
                      name="imageUrl"
                      type="url"
                      value={tourForm.imageUrl || ''}
                      onChange={e => setTourForm(prev => ({
                        ...prev,
                        imageUrl: e.target.value,
                        image: e.target.value,
                        imageBase64: '',
                      }))}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>

                  {/* Preview */}
                  {tourForm.image && (
                    <div className="admin__img-preview-wrap">
                      <img src={tourForm.image} alt="preview" className="admin__img-preview" />
                      <button
                        type="button"
                        className="admin__img-remove-btn"
                        onClick={() => setTourForm(prev => ({ ...prev, image: '', imageUrl: '', imageBase64: '' }))}
                      >
                        <FiX size={14} /> Удалить
                      </button>
                      {tourForm.imageBase64 && (
                        <span className="admin__img-source-badge">📁 Из галереи</span>
                      )}
                      {tourForm.imageUrl && !tourForm.imageBase64 && (
                        <span className="admin__img-source-badge admin__img-source-badge--url">🔗 URL</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="admin__form-group admin__form-group--full">
                  <label>Описание</label>
                  <textarea name="description" rows={3} value={tourForm.description}
                    onChange={handleTourFormChange} placeholder="Опишите тур подробно..." />
                </div>

                <div className="admin__form-group admin__form-group--full">
                  <label>Включено (через запятую)</label>
                  <input name="includes" value={tourForm.includes} onChange={handleTourFormChange}
                    placeholder="Проживание, Питание, Трансфер, Гид" />
                </div>

                <div className="admin__form-group admin__form-group--full">
                  <label>Особенности (через запятую)</label>
                  <input name="highlights" value={tourForm.highlights} onChange={handleTourFormChange}
                    placeholder="Пляжи, Каньоны, Горячие источники" />
                </div>

                <div className="admin__form-group">
                  <label className="admin__checkbox-label">
                    <input type="checkbox" name="featured" checked={tourForm.featured}
                      onChange={handleTourFormChange} />
                    Показать на главной странице
                  </label>
                </div>

                <div className="admin__form-actions">
                  <button type="button" className="admin__cancel-btn" onClick={cancelEdit}>
                    <FiX size={15} /> Отмена
                  </button>
                  <button type="submit" className="btn-primary" disabled={saving}>
                    {saving
                      ? 'Сохранение...'
                      : <><FiSave size={15} /> {editingTour ? 'Сохранить' : 'Создать тур'}</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
