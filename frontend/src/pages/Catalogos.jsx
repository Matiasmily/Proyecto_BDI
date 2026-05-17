import { useState, useEffect } from 'react'
import axios from 'axios'
import { BookOpen, Plus, X } from 'lucide-react'

function Catalogos() {
  const [marcas, setMarcas] = useState([])
  const [lineas, setLineas] = useState([])
  const [tipos, setTipos] = useState([])
  const [colores, setColores] = useState([])
  const [usos, setUsos] = useState([])
  const [tab, setTab] = useState('marcas')
  const [formMarca, setFormMarca] = useState({ nombre_marca: '' })
  const [formLinea, setFormLinea] = useState({ nombre_linea: '', id_marca_fk: '' })
  const [formTipo, setFormTipo] = useState({ descripcion: '' })
  const [formColor, setFormColor] = useState({ nombre_color: '' })
  const [formUso, setFormUso] = useState({ nombre_uso: '' })

  useEffect(() => { cargarTodo() }, [])

  const cargarTodo = async () => {
    const [m, l, t, c, u] = await Promise.all([
      axios.get('http://localhost:3000/api/marcas'),
      axios.get('http://localhost:3000/api/lineas'),
      axios.get('http://localhost:3000/api/tipos'),
      axios.get('http://localhost:3000/api/colores'),
      axios.get('http://localhost:3000/api/usos'),
    ])
    setMarcas(m.data)
    setLineas(l.data)
    setTipos(t.data)
    setColores(c.data)
    setUsos(u.data)
  }

  const guardarMarca = async () => { await axios.post('http://localhost:3000/api/marcas', formMarca); setFormMarca({ nombre_marca: '' }); cargarTodo() }
  const guardarLinea = async () => { await axios.post('http://localhost:3000/api/lineas', formLinea); setFormLinea({ nombre_linea: '', id_marca_fk: '' }); cargarTodo() }
  const guardarTipo = async () => { await axios.post('http://localhost:3000/api/tipos', formTipo); setFormTipo({ descripcion: '' }); cargarTodo() }
  const guardarColor = async () => { await axios.post('http://localhost:3000/api/colores', formColor); setFormColor({ nombre_color: '' }); cargarTodo() }
  const guardarUso = async () => { await axios.post('http://localhost:3000/api/usos', formUso); setFormUso({ nombre_uso: '' }); cargarTodo() }

  const tabs = [
    { key: 'marcas', label: 'Marcas', count: marcas.length },
    { key: 'lineas', label: 'Líneas', count: lineas.length },
    { key: 'tipos', label: 'Tipos', count: tipos.length },
    { key: 'colores', label: 'Colores', count: colores.length },
    { key: 'usos', label: 'Usos', count: usos.length },
  ]

  const CardItem = ({ children }) => (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between">
      {children}
    </div>
  )

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold" style={{ color: '#053F5C' }}>Catálogos</h2>
        <p className="text-sm text-gray-400">Administra los datos de referencia del sistema</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition"
            style={tab === t.key
              ? { backgroundColor: '#053F5C', color: 'white' }
              : { backgroundColor: 'white', color: '#053F5C', border: '1px solid #e5e7eb' }
            }
          >
            {t.label}
            <span className="px-1.5 py-0.5 rounded-full text-xs"
              style={tab === t.key
                ? { backgroundColor: '#429EBD', color: 'white' }
                : { backgroundColor: '#EBF6FB', color: '#429EBD' }
              }>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* MARCAS */}
      {tab === 'marcas' && (
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex gap-3">
            <input
              className="border border-gray-200 rounded-xl px-3 py-2 flex-1 text-sm focus:outline-none focus:ring-2"
              placeholder="Nombre de la marca"
              value={formMarca.nombre_marca}
              onChange={e => setFormMarca({ nombre_marca: e.target.value })}
            />
            <button onClick={guardarMarca}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium"
              style={{ backgroundColor: '#429EBD' }}>
              <Plus size={15} /> Agregar
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {marcas.map(m => (
              <CardItem key={m.id_marca}>
                <div>
                  <p className="font-medium text-sm" style={{ color: '#053F5C' }}>{m.nombre_marca}</p>
                  <p className="text-xs text-gray-400">ID: {m.id_marca}</p>
                </div>
              </CardItem>
            ))}
          </div>
        </div>
      )}

      {/* LINEAS */}
      {tab === 'lineas' && (
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex gap-3">
            <input
              className="border border-gray-200 rounded-xl px-3 py-2 flex-1 text-sm focus:outline-none"
              placeholder="Nombre de la línea"
              value={formLinea.nombre_linea}
              onChange={e => setFormLinea({ ...formLinea, nombre_linea: e.target.value })}
            />
            <select
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none"
              value={formLinea.id_marca_fk}
              onChange={e => setFormLinea({ ...formLinea, id_marca_fk: e.target.value })}
            >
              <option value="">Selecciona marca</option>
              {marcas.map(m => <option key={m.id_marca} value={m.id_marca}>{m.nombre_marca}</option>)}
            </select>
            <button onClick={guardarLinea}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium"
              style={{ backgroundColor: '#429EBD' }}>
              <Plus size={15} /> Agregar
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {lineas.map(l => (
              <CardItem key={l.id_linea}>
                <div>
                  <p className="font-medium text-sm" style={{ color: '#053F5C' }}>{l.nombre_linea}</p>
                  <p className="text-xs text-gray-400">{l.nombre_marca}</p>
                </div>
              </CardItem>
            ))}
          </div>
        </div>
      )}

      {/* TIPOS */}
      {tab === 'tipos' && (
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex gap-3">
            <input
              className="border border-gray-200 rounded-xl px-3 py-2 flex-1 text-sm focus:outline-none"
              placeholder="Descripción del tipo"
              value={formTipo.descripcion}
              onChange={e => setFormTipo({ descripcion: e.target.value })}
            />
            <button onClick={guardarTipo}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium"
              style={{ backgroundColor: '#429EBD' }}>
              <Plus size={15} /> Agregar
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {tipos.map(t => (
              <CardItem key={t.id_tipo}>
                <div>
                  <p className="font-medium text-sm" style={{ color: '#053F5C' }}>{t.descripcion}</p>
                  <p className="text-xs text-gray-400">ID: {t.id_tipo}</p>
                </div>
              </CardItem>
            ))}
          </div>
        </div>
      )}

      {/* COLORES */}
      {tab === 'colores' && (
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex gap-3">
            <input
              className="border border-gray-200 rounded-xl px-3 py-2 flex-1 text-sm focus:outline-none"
              placeholder="Nombre del color"
              value={formColor.nombre_color}
              onChange={e => setFormColor({ nombre_color: e.target.value })}
            />
            <button onClick={guardarColor}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium"
              style={{ backgroundColor: '#429EBD' }}>
              <Plus size={15} /> Agregar
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {colores.map(c => (
              <CardItem key={c.id_color}>
                <div>
                  <p className="font-medium text-sm" style={{ color: '#053F5C' }}>{c.nombre_color}</p>
                  <p className="text-xs text-gray-400">ID: {c.id_color}</p>
                </div>
              </CardItem>
            ))}
          </div>
        </div>
      )}

      {/* USOS */}
      {tab === 'usos' && (
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-4 flex gap-3">
            <input
              className="border border-gray-200 rounded-xl px-3 py-2 flex-1 text-sm focus:outline-none"
              placeholder="Nombre del uso"
              value={formUso.nombre_uso}
              onChange={e => setFormUso({ nombre_uso: e.target.value })}
            />
            <button onClick={guardarUso}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium"
              style={{ backgroundColor: '#429EBD' }}>
              <Plus size={15} /> Agregar
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {usos.map(u => (
              <CardItem key={u.id_uso}>
                <div>
                  <p className="font-medium text-sm" style={{ color: '#053F5C' }}>{u.nombre_uso}</p>
                  <p className="text-xs text-gray-400">ID: {u.id_uso}</p>
                </div>
              </CardItem>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Catalogos