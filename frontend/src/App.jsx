import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Car, FileText, BookOpen } from 'lucide-react'
import Inicio from './pages/Inicio'
import Propietarios from './pages/Propietarios'
import Vehiculos from './pages/Vehiculos'
import Tarjetas from './pages/Tarjetas'
import Catalogos from './pages/Catalogos'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Inicio' },
  { to: '/tarjetas', icon: FileText, label: 'Tarjetas' },
  { to: '/propietarios', icon: Users, label: 'Propietarios' },
  { to: '/vehiculos', icon: Car, label: 'Vehículos' },
  { to: '/catalogos', icon: BookOpen, label: 'Catálogos' },
]

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50 font-sans">

        {/* SIDEBAR */}
        <aside className="w-64 flex-shrink-0 flex flex-col" style={{ backgroundColor: '#053F5C' }}>
          {/* Logo */}
          <div className="px-6 py-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F7AD19' }}>
                <Car size={18} color="#053F5C" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Gestión de</p>
                <p className="text-xs" style={{ color: '#9FE7F5' }}>Tarjetas de Circulación</p>
              </div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="flex-1 px-4 py-6 flex flex-col gap-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                  }`
                }
                style={({ isActive }) => isActive ? { backgroundColor: '#429EBD' } : {}}
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Footer sidebar */}
          <div className="px-6 py-4 border-t border-white/10">
            <p className="text-xs text-white/40 text-center">Proyecto - BDI</p>
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* NAVBAR SUPERIOR */}
          <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between flex-shrink-0">
            <div>
              <h1 className="text-lg font-bold" style={{ color: '#053F5C' }}>
                Sistema de Tarjetas de Circulación
              </h1>
            </div>
          </header>

          {/* PÁGINAS */}
          <main className="flex-1 overflow-y-auto p-8">
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/propietarios" element={<Propietarios />} />
              <Route path="/vehiculos" element={<Vehiculos />} />
              <Route path="/tarjetas" element={<Tarjetas />} />
              <Route path="/catalogos" element={<Catalogos />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App