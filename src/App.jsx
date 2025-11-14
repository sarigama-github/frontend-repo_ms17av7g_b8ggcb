import { useEffect, useMemo, useState } from 'react'
import { Search, Upload, Megaphone, BookOpen, Send } from 'lucide-react'

function Header() {
  return (
    <header className="w-full py-6 bg-white/70 backdrop-blur sticky top-0 z-10 border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 grid place-items-center text-white font-bold">
            KIR
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Komunitas Karya Ilmiah Remaja</h1>
            <p className="text-sm text-gray-500">Pengumuman terbaru & wadah unggah karya anak muda</p>
          </div>
        </div>
        <a href="/test" className="text-sm text-blue-600 hover:text-blue-700">Cek Koneksi</a>
      </div>
    </header>
  )
}

function Announcements({ items, loading }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-indigo-600">
        <Megaphone className="h-5 w-5" />
        <h2 className="font-semibold">Pengumuman</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && [1,2,3,4,5,6].map(i => (
          <div key={i} className="p-4 rounded-xl bg-white shadow-sm border border-gray-100 animate-pulse h-28" />
        ))}
        {!loading && items.length === 0 && (
          <div className="col-span-full text-center text-gray-500">Belum ada pengumuman</div>
        )}
        {!loading && items.map((a, idx) => (
          <div key={a.id || idx} className="p-4 rounded-xl bg-white shadow-sm border border-gray-100">
            <div className="text-sm text-gray-400">{a.author || 'Admin'}</div>
            <h3 className="font-semibold text-gray-800 mt-1">{a.title}</h3>
            <p className="text-sm text-gray-600 mt-2 line-clamp-3">{a.content}</p>
            {a.tags && a.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {a.tags.map((t, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded bg-indigo-50 text-indigo-700">#{t}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

function UploadWorkForm({ onSubmitted }) {
  const [form, setForm] = useState({
    title: '',
    author: '',
    email: '',
    description: '',
    category: '',
    file_url: '',
    thumbnail_url: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const backend = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const res = await fetch(`${backend}/api/works`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error(`Gagal ${res.status}`)
      const data = await res.json()
      setMessage({ type: 'success', text: 'Karya berhasil dikirim!'} )
      setForm({ title: '', author: '', email: '', description: '', category: '', file_url: '', thumbnail_url: '' })
      onSubmitted?.(data)
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Terjadi kesalahan' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 text-blue-600">
        <Upload className="h-5 w-5" />
        <h2 className="font-semibold">Unggah Karya</h2>
      </div>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">Judul</label>
          <input name="title" value={form.title} onChange={handleChange} required className="mt-1 w-full border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Penulis/Tim</label>
          <input name="author" value={form.author} onChange={handleChange} required className="mt-1 w-full border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 p-2" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="mt-1 w-full border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 p-2" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Kategori</label>
          <input name="category" value={form.category} onChange={handleChange} className="mt-1 w-full border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 p-2" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-gray-600">Deskripsi</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="mt-1 w-full border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 p-2" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Link File (Drive, dll)</label>
          <input name="file_url" value={form.file_url} onChange={handleChange} placeholder="https://..." className="mt-1 w-full border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 p-2" />
        </div>
        <div>
          <label className="text-sm text-gray-600">Thumbnail (opsional)</label>
          <input name="thumbnail_url" value={form.thumbnail_url} onChange={handleChange} placeholder="https://..." className="mt-1 w-full border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 p-2" />
        </div>
        <div className="md:col-span-2 flex items-center justify-end gap-3">
          {message && (
            <span className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</span>
          )}
          <button disabled={loading} className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold px-4 py-2 rounded-lg transition-colors">
            <Send className="h-4 w-4" /> {loading ? 'Mengirim...' : 'Kirim Karya'}
          </button>
        </div>
      </form>
    </section>
  )
}

function Works({ items, loading, onSearch }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-emerald-600">
          <BookOpen className="h-5 w-5" />
          <h2 className="font-semibold">Eksplor Karya</h2>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
          <Search className="h-4 w-4 text-gray-400" />
          <input onChange={(e) => onSearch(e.target.value)} placeholder="Cari judul/penulis" className="focus:outline-none text-sm" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && [1,2,3,4,5,6].map(i => (
          <div key={i} className="p-4 rounded-xl bg-white shadow-sm border border-gray-100 animate-pulse h-40" />
        ))}
        {!loading && items.length === 0 && (
          <div className="col-span-full text-center text-gray-500">Belum ada karya diunggah</div>
        )}
        {!loading && items.map((w, idx) => (
          <a key={w.id || idx} href={w.file_url || '#'} target="_blank" rel="noreferrer" className="group p-4 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow transition">
            <div className="aspect-video w-full rounded-lg bg-gray-100 overflow-hidden">
              {w.thumbnail_url ? (
                <img src={w.thumbnail_url} alt={w.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-gray-400 text-sm">No Thumbnail</div>
              )}
            </div>
            <h3 className="font-semibold text-gray-800 mt-3 group-hover:text-emerald-600">{w.title}</h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{w.description}</p>
            <div className="text-xs text-gray-500 mt-2">{w.author}{w.category ? ` • ${w.category}` : ''}</div>
          </a>
        ))}
      </div>
    </section>
  )
}

function App() {
  const backend = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])
  const [announcements, setAnnouncements] = useState([])
  const [works, setWorks] = useState([])
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true)
  const [loadingWorks, setLoadingWorks] = useState(true)

  const fetchAnnouncements = async () => {
    setLoadingAnnouncements(true)
    try {
      const res = await fetch(`${backend}/api/announcements`)
      const data = await res.json()
      setAnnouncements(data.data || [])
    } catch (e) {
      setAnnouncements([])
    } finally {
      setLoadingAnnouncements(false)
    }
  }

  const fetchWorks = async (q) => {
    setLoadingWorks(true)
    try {
      const url = new URL(`${backend}/api/works`)
      if (q) url.searchParams.set('q', q)
      const res = await fetch(url)
      const data = await res.json()
      setWorks(data.data || [])
    } catch (e) {
      setWorks([])
    } finally {
      setLoadingWorks(false)
    }
  }

  useEffect(() => {
    fetchAnnouncements()
    fetchWorks()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-emerald-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        <Announcements items={announcements} loading={loadingAnnouncements} />
        <UploadWorkForm onSubmitted={() => fetchWorks()} />
        <Works items={works} loading={loadingWorks} onSearch={(q) => fetchWorks(q)} />
      </main>
      <footer className="py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Komunitas KIR • Dibangun untuk remaja pencinta sains
      </footer>
    </div>
  )
}

export default App
