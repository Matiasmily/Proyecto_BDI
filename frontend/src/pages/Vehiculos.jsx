import { useState, useEffect } from 'react'
import axios from 'axios'
import { Car, Plus, X, Search } from 'lucide-react'

function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([])
  const [lineas, setLineas] = useState([])
  const [tipos, setTipos] = useState([])
  const [colores, setColores] = useState([])
  const [usos, setUsos] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [form, setForm] = useState({
    vin: '', placa: '', modelo: '', chasis: '', serie: '', motor: '',
    asientos: '', ejes: '', cilindros: '', cc: '', toneladas: '',
    id_linea_fk: '', id_tipo_fk: '', id_uso_fk: '', id_color_fk: ''
  })

  useEffect(() => {
    cargarTodo()
  }, [])

  const cargarTodo = async () => {
    const [v, l, t, c, u] = await Promise.all([
      axios.get('http://localhost:3000/api/vehiculos'),
      axios.get('http://localhost:3000/api/lineas'),
      axios.get('http://localhost:3000/api/tipos'),
      axios.get('http://localhost:3000/api/colores'),
      axios.get('http://localhost:3000/api/usos'),
    ])
    setVehiculos(v.data)
    setLineas(l.data)
    setTipos(t.data)
    setColores(c.data)
    setUsos(u.data)
  }

  const guardar = async () => {
    try {
      await axios.post('http://localhost:3000/api/vehiculos', form)
      setForm({
        vin: '', placa: '', modelo: '', chasis: '', serie: '', motor: '',
        asientos: '', ejes: '', cilindros: '', cc: '', toneladas: '',
        id_linea_fk: '', id_tipo_fk: '', id_uso_fk: '', id_color_fk: ''
      })
      setMostrarFormulario(false)
      cargarTodo()
    } catch (error) {
      console.error(error)
      alert('Error al guardar el vehículo')
    }
  }

  const vehiculosFiltrados = vehiculos.filter(v =>
    v.placa?.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.nombre_marca?.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.nombre_linea?.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.vin?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold" style={{ color: '#053F5C' }}>Vehículos</h2>
          <p className="text-sm text-gray-400">{vehiculos.length} vehículos registrados</p>
        </div>
        <button
          onClick={() => setMostrarFormulario(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition"
          style={{ backgroundColor: '#053F5C' }}
        >
          <Plus size={16} />
          Nuevo Vehículo
        </button>
      </div>

      {/* Formulario */}
      {mostrarFormulario && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold" style={{ color: '#053F5C' }}>Nuevo Vehículo</h3>
            <button onClick={() => setMostrarFormulario(false)}>
              <X size={18} className="text-gray-400 hover:text-gray-600" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'VIN', key: 'vin', placeholder: '17 caracteres' },
              { label: 'Placa', key: 'placa', placeholder: 'Ej: P-123ABC' },
              { label: 'Modelo (año)', key: 'modelo', placeholder: 'Ej: 2020' },
              { label: 'Chasis', key: 'chasis', placeholder: 'Número de chasis' },
              { label: 'Serie', key: 'serie', placeholder: 'Número de serie' },
              { label: 'Motor', key: 'motor', placeholder: 'Número de motor' },
              { label: 'Asientos', key: 'asientos', placeholder: 'Ej: 5' },
              { label: 'Ejes', key: 'ejes', placeholder: 'Ej: 2' },
              { label: 'Cilindros', key: 'cilindros', placeholder: 'Ej: 4' },
              { label: 'CC', key: 'cc', placeholder: 'Ej: 2400' },
              { label: 'Toneladas', key: 'toneladas', placeholder: 'Ej: 1.5' },
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

            {[
              { label: 'Línea', key: 'id_linea_fk', options: lineas, valKey: 'id_linea', lblKey: v => `${v.nombre_marca} - ${v.nombre_linea}` },
              { label: 'Tipo', key: 'id_tipo_fk', options: tipos, valKey: 'id_tipo', lblKey: v => v.descripcion },
              { label: 'Color', key: 'id_color_fk', options: colores, valKey: 'id_color', lblKey: v => v.nombre_color },
              { label: 'Uso', key: 'id_uso_fk', options: usos, valKey: 'id_uso', lblKey: v => v.nombre_uso },
            ].map(({ label, key, options, valKey, lblKey }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
                <select
                  className="border border-gray-200 rounded-xl px-3 py-2 w-full text-sm focus:outline-none focus:ring-2"
                  value={form[key]}
                  onChange={e => setForm({ ...form, [key]: e.target.value })}
                >
                  <option value="">Selecciona {label.toLowerCase()}</option>
                  {options.map(o => (
                    <option key={o[valKey]} value={o[valKey]}>{lblKey(o)}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <button
            onClick={guardar}
            className="mt-5 px-6 py-2 rounded-xl text-white text-sm font-medium"
            style={{ backgroundColor: '#429EBD' }}
          >
            Guardar Vehículo
          </button>
        </div>
      )}

      {/* Buscador */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="border border-gray-200 rounded-xl pl-9 pr-4 py-2 w-full text-sm focus:outline-none bg-white"
          placeholder="Buscar por placa, marca, línea o VIN..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </div>

      {/* Cards */}
      {vehiculosFiltrados.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Car size={40} className="mx-auto mb-3 opacity-30" />
          <p>No hay vehículos registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {vehiculosFiltrados.map(v => (
            <div key={v.vin} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: '#FEF7E6' }}>
                  <Car size={20} style={{ color: '#F7AD19' }} />
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: '#053F5C' }}>{v.nombre_marca} {v.nombre_linea}</p>
                  <p className="text-xs text-gray-400">Placa: <span className="font-mono font-medium">{v.placa}</span></p>
                </div>
                <span className="ml-auto px-3 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: '#EBF6FB', color: '#429EBD' }}>
                  {v.modelo}
                </span>
              </div>

              <div className="h-px bg-gray-100 mb-4" />

              {/* Datos técnicos */}
              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                {[
                  { label: 'Tipo', value: v.tipo },
                  { label: 'Color', value: v.color },
                  { label: 'Uso', value: v.uso },
                  { label: 'Asientos', value: v.asientos },
                  { label: 'Cilindros', value: v.cilindros },
                  { label: 'CC', value: v.cc },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-xl py-2 px-1" style={{ backgroundColor: '#F8FAFB' }}>
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="text-sm font-medium" style={{ color: '#053F5C' }}>{value}</p>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">VIN: <span className="font-mono">{v.vin}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Vehiculos