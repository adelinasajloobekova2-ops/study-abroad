import { useEffect, useState } from 'react'
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../firebase/AuthContext'
import { useLang } from '../i18n/LanguageContext'
import { tours as localTours } from '../data/tours'
import './Admin.css'

const TABS = ['dashboard', 'bookings', 'users', 'tours']

export default function AdminPanel() {
  const { user, logout } = useAuth()
  const { lang, setLang } = useLang()
  const [tab, setTab]         = useState('dashboard')
  const [bookings, setBookings] = useState([])
  const [users, setUsers]       = useState([])
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    if (tab === 'bookings') loadBookings()
    if (tab === 'users')    loadUsers()
  }, [tab])

  const loadBookings = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, 'bookings'))
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch { setBookings([]) }
    setLoading(false)
  }

  const loadUsers = async () => {
    setLoading(true)
    try {
      const snap = await getDocs(collection(db, 'users'))
      setUsers(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch { setUsers([]) }
    setLoading(false)
  }

  const deleteBooking = async (id) => {
    if (!confirm('Удалить заявку?')) return
    await deleteDoc(doc(db, 'bookings', id))
    setBookings(prev => prev.filter(b => b.id !== id))
  }

  const updateBookingStatus = async (id, status) => {
    await updateDoc(doc(db, 'bookings', id), { status })
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  const statusColor = { new: '#e8a020', confirmed: '#27ae60', cancelled: '#c0392b' }
  const statusLabel = { new: 'Новая', confirmed: 'Подтверждена', cancelled: 'Отменена' }

  return (
    <div className="admin">
      {/* Sidebar */}
      <aside className="admin__sidebar">
        <div className="admin__sidebar-logo">
          <span>🏔️</span>
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
              onClick={() => setTab(t)}
            >
              {tabIcon(t)} {tabLabel(t)}
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
            🚪 Выйти
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="admin__main">
        <div className="admin__topbar">
          <h1 className="admin__page-title">{tabLabel(tab)}</h1>
          <span className="admin__badge">🛡️ Администратор</span>
        </div>

        {/* ── Dashboard ── */}
        {tab === 'dashboard' && (
          <div className="admin__content">
            <div className="admin__stats-grid">
              <div className="admin__stat-card">
                <div className="admin__stat-icon">🗺️</div>
                <div className="admin__stat-val">{localTours.length}</div>
                <div className="admin__stat-label">Всего туров</div>
              </div>
              <div className="admin__stat-card">
                <div className="admin__stat-icon">📋</div>
                <div className="admin__stat-val">{bookings.length || '—'}</div>
                <div className="admin__stat-label">Заявок</div>
              </div>
              <div className="admin__stat-card">
                <div className="admin__stat-icon">👥</div>
                <div className="admin__stat-val">{users.length || '—'}</div>
                <div className="admin__stat-label">Пользователей</div>
              </div>
              <div className="admin__stat-card">
                <div className="admin__stat-icon">⭐</div>
                <div className="admin__stat-val">4.9</div>
                <div className="admin__stat-label">Средний рейтинг</div>
              </div>
            </div>

            <div className="admin__welcome">
              <h2>Добро пожаловать, {user?.displayName || 'Администратор'}! 👋</h2>
              <p>Управляйте заявками, пользователями и турами через левое меню.</p>
              <div className="admin__quick-links">
                <button className="admin__quick-btn" onClick={() => setTab('bookings')}>
                  📋 Открыть заявки
                </button>
                <button className="admin__quick-btn" onClick={() => setTab('users')}>
                  👥 Пользователи
                </button>
                <button className="admin__quick-btn" onClick={() => setTab('tours')}>
                  🗺️ Туры
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Bookings ── */}
        {tab === 'bookings' && (
          <div className="admin__content">
            {loading ? (
              <div className="admin__loading">⏳ Загрузка...</div>
            ) : bookings.length === 0 ? (
              <div className="admin__empty">
                <span>📭</span>
                <p>Заявок пока нет. Они появятся после отправки форм на сайте.</p>
              </div>
            ) : (
              <div className="admin__table-wrap">
                <table className="admin__table">
                  <thead>
                    <tr>
                      <th>Имя</th>
                      <th>Email</th>
                      <th>Тур</th>
                      <th>Чел.</th>
                      <th>Статус</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id}>
                        <td><strong>{b.name}</strong></td>
                        <td>{b.email}</td>
                        <td>{b.tour || '—'}</td>
                        <td>{b.people || '—'}</td>
                        <td>
                          <select
                            className="admin__status-select"
                            value={b.status || 'new'}
                            onChange={e => updateBookingStatus(b.id, e.target.value)}
                            style={{ borderColor: statusColor[b.status || 'new'] }}
                          >
                            <option value="new">Новая</option>
                            <option value="confirmed">Подтверждена</option>
                            <option value="cancelled">Отменена</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className="admin__del-btn"
                            onClick={() => deleteBooking(b.id)}
                          >🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Users ── */}
        {tab === 'users' && (
          <div className="admin__content">
            {loading ? (
              <div className="admin__loading">⏳ Загрузка...</div>
            ) : users.length === 0 ? (
              <div className="admin__empty">
                <span>👤</span>
                <p>Пользователей пока нет.</p>
              </div>
            ) : (
              <div className="admin__table-wrap">
                <table className="admin__table">
                  <thead>
                    <tr>
                      <th>Имя</th>
                      <th>Email</th>
                      <th>Роль</th>
                      <th>Дата регистрации</th>
                    </tr>
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
                            {u.role === 'admin' ? '🛡️ Админ' : '👤 Пользователь'}
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
            <div className="admin__tours-grid">
              {localTours.map(tour => (
                <div key={tour.id} className="admin__tour-card">
                  <img src={tour.image} alt={tour.title} />
                  <div className="admin__tour-info">
                    <h3>{tour.title}</h3>
                    <p>{tour.duration} · {tour.groupSize}</p>
                    <div className="admin__tour-footer">
                      <span className="admin__tour-price">
                        {tour.price.toLocaleString('ru')} с
                      </span>
                      <span className="admin__tour-rating">⭐ {tour.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function tabIcon(t) {
  return { dashboard: '📊', bookings: '📋', users: '👥', tours: '🗺️' }[t]
}
function tabLabel(t) {
  return { dashboard: 'Дашборд', bookings: 'Заявки', users: 'Пользователи', tours: 'Туры' }[t]
}
