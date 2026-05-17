import { useState, useEffect } from 'react'
import axios from 'axios'
import { Users, Plus, X, Search, User } from 'lucide-react'

function Propietarios() {
  const [propietarios, setPropietarios] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [form, setForm] = useState({ nit: '', cui: '', nombres: '', apellidos: '' })

  useEffect(() => {
    cargarPropietarios()
  }, [])

  const cargarPropietarios = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/propietarios')
      setPropietarios(res.data)
    } catch (error) {
      console.error(error)
    }
  }

  const guardar = async () => {
    try {
      await axios.post('http://localhost:3000/api/propietarios', form)
      setForm({ nit: '', cui: '', nombres: '', apellidos: '' })
      setMostrarFormulario(false)
      cargarPropietarios()
    } catch (error) {
      console.error(error)
    }
  }

  const propietariosFiltrados = propietarios.filter(p =>
    p.nombres?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.apellidos?.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.nit?.includes(busqueda)
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#053F5C' }}>Propietarios</h2>
          <p className="text-sm text-gray-400">{propietarios.length} propietarios registrados</p>
        </div>
        <button
          onClick={() => setMostrarFormulario(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition"
          style={{ backgroundColor: '#053F5C' }}
        >
          <Plus size={16} />
          Nuevo Propietario
        </button>
      </div>

      {/* Formulario */}
      {mostrarFormulario && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold" style={{ color: '#053F5C' }}>Nuevo Propietario</h3>
            <button onClick={() => setMostrarFormulario(false)}>
              <X size={18} className="text-gray-400 hover:text-gray-600" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'NIT', key: 'nit', placeholder: 'Ej: 1234567-8' },
              { label: 'CUI', key: 'cui', placeholder: '13 dígitos' },
              { label: 'Nombres', key: 'nombres', placeholder: 'Nombres' },
              { label: 'Apellidos', key: 'apellidos', placeholder: 'Apellidos' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
                <input
                  className="border border-gray-200 rounded-xl px-3 py-2 w-full text-sm focus:outline-none focus:ring-2"
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                />
              </div>
            ))}
          </div>
          <button
            onClick={guardar}
            className="mt-5 px-6 py-2 rounded-xl text-white text-sm font-medium"
            style={{ backgroundColor: '#429EBD' }}
          >
            Guardar
          </button>
        </div>
      )}

      {/* Buscador */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="border border-gray-200 rounded-xl pl-9 pr-4 py-2 w-full text-sm focus:outline-none bg-white"
          placeholder="Buscar por nombre o NIT..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      {/* Cards */}
      {propietariosFiltrados.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Users size={40} className="mx-auto mb-3 opacity-30" />
          <p>No hay propietarios registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {propietariosFiltrados.map(p => (
            <div key={p.nit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: '#429EBD' }}>
                  {p.nombres?.charAt(0)}{p.apellidos?.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: '#053F5C' }}>{p.nombres} {p.apellidos}</p>
                  <p className="text-xs text-gray-400">NIT: {p.nit}</p>
                </div>
              </div>
              <div className="h-px bg-gray-100 mb-3" />
              <div className="flex items-center gap-2">
                <User size={13} style={{ color: '#429EBD' }} />
                <p className="text-xs text-gray-500">CUI: <span className="font-mono">{p.cui}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Propietarios