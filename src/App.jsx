import { useEffect, useMemo, useState } from 'react'
import { Search, Upload, Megaphone, BookOpen, Send, Atom, Microscope, FlaskConical } from 'lucide-react'

function LabBackdrop() {
  // Subtle sciencey background: gradient + molecular svg pattern
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900" />
      <div className="absolute inset-0 opacity-20 mix-blend-screen" style={{
        backgroundImage:
          "radial-gradient(1200px 600px at -10% -10%, rgba(34,211,238,0.25), transparent 60%)," +
          "radial-gradient(800px 400px at 110% 120%, rgba(34,197,94,0.25), transparent 60%)"
      }} />
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='192' height='192' viewBox='0 0 192 192' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23a5f3fc' stroke-opacity='0.35' stroke-width='1'%3E%3Ccircle cx='16' cy='16' r='2'/%3E%3Ccircle cx='96' cy='96' r='2'/%3E%3Ccircle cx='176' cy='176' r='2'/%3E%3Cpath d='M16 16 L96 96 L176 16 M96 96 L16 176 L176 176'/%3E%3C/g%3E%3C/svg%3E")`
      }} />
    </div>
  )
}

function Header() {
  return (
    <header className="w-full py-5 bg-slate-800/60 backdrop-blur sticky top-0 z-10 border-b border-cyan-400/20">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 grid place-items-center text-white">
            <Atom className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-cyan-100 tracking-tight">Lab Karya Ilmiah Remaja</h1>
            <p className="text-sm text-cyan-200/70">Pengumuman komunitas & laboratorium unggah karya</p>
          </div>
        </div>
        <a href="/test" className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200">
          <FlaskConical className="h-4 w-4" />
          <span className="text-sm">Cek Koneksi</span>
        </a>
      </div>
    </header>
  )
}

function SectionTitle({ icon: Icon, title, color }) {
  return (
    <div className={`flex items-center gap-2 ${color}`}>
      <Icon className="h-5 w-5" />
      <h2 className="font-semibold">{title}</h2>
    </div>
  )
}

function Announcements({ items, loading }) {
  return (
    <section className="space-y-4">
      <SectionTitle icon={Megaphone} title="Pengumuman" color="text-cyan-300" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && [1,2,3,4,5,6].map(i => (
          <div key={i} className="p-4 rounded-xl bg-slate-800/60 border border-cyan-400/20 animate-pulse h-28" />
        ))}
        {!loading && items.length === 0 && (
          <div className="col-span-full text-center text-cyan-200/70">Belum ada pengumuman</div>
        )}
        {!loading && items.map((a, idx) => (
          <div key={a.id || idx} className="p-4 rounded-xl bg-slate-800/70 border border-cyan-400/20 shadow-sm">
            <div className="text-xs text-cyan-200/70 flex items-center gap-2">
              <Microscope className="h-3.5 w-3.5" />
              <span>{a.author || 'Admin Lab'}</span>
            </div>
            <h3 className="font-semibold text-white mt-1">{a.title}</h3>
            <p className="text-sm text-cyan-100/80 mt-2 line-clamp-3">{a.content}</p>
            {a.tags && a.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {a.tags.map((t, i) => (
                  <span key={i} className="text-[11px] px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-400/20">#{t}</span>
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
      <SectionTitle icon={Upload} title="Unggah Karya" color="text-emerald-300" />
      <form onSubmit={handleSubmit} className="bg-slate-800/70 p-6 rounded-xl border border-emerald-400/20 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="text-sm text-cyan-200/80">Judul</label>
          <input name="title" value={form.title} onChange={handleChange} required className="mt-1 w-full border-cyan-400/20 rounded-lg bg-slate-900 text-cyan-50 placeholder:text-cyan-200/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 p-2" />
        </div>
        <div>
          <label className="text-sm text-cyan-200/80">Penulis/Tim</label>
          <input name="author" value={form.author} onChange={handleChange} required className="mt-1 w-full border-cyan-400/20 rounded-lg bg-slate-900 text-cyan-50 focus:ring-2 focus:ring-emerald-400/40 p-2" />
        </div>
        <div>
          <label className="text-sm text-cyan-200/80">Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} className="mt-1 w-full border-cyan-400/20 rounded-lg bg-slate-900 text-cyan-50 focus:ring-2 focus:ring-emerald-400/40 p-2" />
        </div>
        <div>
          <label className="text-sm text-cyan-200/80">Kategori</label>
          <input name="category" value={form.category} onChange={handleChange} className="mt-1 w-full border-cyan-400/20 rounded-lg bg-slate-900 text-cyan-50 focus:ring-2 focus:ring-emerald-400/40 p-2" />
        </div>
        <div className="md:col-span-2">
          <label className="text-sm text-cyan-200/80">Deskripsi</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="mt-1 w-full border-cyan-400/20 rounded-lg bg-slate-900 text-cyan-50 focus:ring-2 focus:ring-emerald-400/40 p-2" />
        </div>
        <div>
          <label className="text-sm text-cyan-200/80">Link File (Drive, dll)</label>
          <input name="file_url" value={form.file_url} onChange={handleChange} placeholder="https://..." className="mt-1 w-full border-cyan-400/20 rounded-lg bg-slate-900 text-cyan-50 placeholder:text-cyan-200/40 focus:ring-2 focus:ring-emerald-400/40 p-2" />
        </div>
        <div>
          <label className="text-sm text-cyan-200/80">Thumbnail (opsional)</label>
          <input name="thumbnail_url" value={form.thumbnail_url} onChange={handleChange} placeholder="https://..." className="mt-1 w-full border-cyan-400/20 rounded-lg bg-slate-900 text-cyan-50 placeholder:text-cyan-200/40 focus:ring-2 focus:ring-emerald-400/40 p-2" />
        </div>
        <div className="md:col-span-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-cyan-200/70">
            <FlaskConical className="h-3.5 w-3.5" />
            <span>Pastikan link dapat diakses publik</span>
          </div>
          {message && (
            <span className={`text-sm ${message.type === 'success' ? 'text-emerald-400' : 'text-rose-400'}`}>{message.text}</span>
          )}
          <button disabled={loading} className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-slate-900 font-semibold px-4 py-2 rounded-lg transition-colors">
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
        <SectionTitle icon={BookOpen} title="Eksplor Karya" color="text-emerald-300" />
        <div className="flex items-center gap-2 bg-slate-900 border border-cyan-400/20 rounded-lg px-3 py-2 shadow-sm">
          <Search className="h-4 w-4 text-cyan-300" />
          <input onChange={(e) => onSearch(e.target.value)} placeholder="Cari judul/penulis" className="focus:outline-none text-sm bg-transparent text-cyan-50 placeholder:text-cyan-200/50" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && [1,2,3,4,5,6].map(i => (
          <div key={i} className="p-4 rounded-xl bg-slate-800/60 border border-cyan-400/20 animate-pulse h-40" />
        ))}
        {!loading && items.length === 0 && (
          <div className="col-span-full text-center text-cyan-200/70">Belum ada karya diunggah</div>
        )}
        {!loading && items.map((w, idx) => (
          <a key={w.id || idx} href={w.file_url || '#'} target="_blank" rel="noreferrer" className="group p-4 rounded-xl bg-slate-800/70 border border-cyan-400/20 hover:border-emerald-400/30 hover:shadow-lg hover:shadow-emerald-500/10 transition">
            <div className="aspect-video w-full rounded-lg bg-slate-900 overflow-hidden ring-1 ring-cyan-400/20">
              {w.thumbnail_url ? (
                <img src={w.thumbnail_url} alt={w.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-cyan-300/60 text-sm">
                  <Microscope className="h-5 w-5 mr-2" /> No Thumbnail
                </div>
              )}
            </div>
            <h3 className="font-semibold text-white mt-3 group-hover:text-emerald-300">{w.title}</h3>
            <p className="text-sm text-cyan-100/80 mt-1 line-clamp-2">{w.description}</p>
            <div className="text-xs text-cyan-200/80 mt-2">{w.author}{w.category ? ` • ${w.category}` : ''}</div>
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
    <div className="min-h-screen text-cyan-50">
      <LabBackdrop />
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-10">
            <Announcements items={announcements} loading={loadingAnnouncements} />
            <UploadWorkForm onSubmitted={() => fetchWorks()} />
          </div>
          <aside className="space-y-4">
            <div className="rounded-xl bg-slate-800/70 border border-cyan-400/20 p-4">
              <div className="flex items-center gap-2 text-cyan-300 mb-2">
                <FlaskConical className="h-4 w-4" />
                <span className="font-medium">Panel Lab</span>
              </div>
              <ul className="text-sm text-cyan-200/80 space-y-1 list-disc list-inside">
                <li>Gunakan kata kunci spesifik saat mencari</li>
                <li>Pastikan metadata karya lengkap</li>
                <li>Thumbnail membantu kurasi</li>
              </ul>
            </div>
            <div className="rounded-xl bg-slate-800/70 border border-cyan-400/20 p-4">
              <div className="flex items-center gap-2 text-emerald-300 mb-2">
                <Microscope className="h-4 w-4" />
                <span className="font-medium">Eksperimen Populer</span>
              </div>
              <div className="text-sm text-cyan-200/80">Lihat karya dengan dokumentasi rapi dan data lengkap untuk inspirasi.</div>
            </div>
          </aside>
        </div>
        <Works items={works} loading={loadingWorks} onSearch={(q) => fetchWorks(q)} />
      </main>
      <footer className="py-8 text-center text-sm text-cyan-300/80">
        © {new Date().getFullYear()} Lab KIR • Dibangun untuk remaja pencinta sains
      </footer>
    </div>
  )
}

export default App
