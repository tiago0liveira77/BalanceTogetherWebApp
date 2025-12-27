
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  Repeat, 
  Tags, 
  Upload, 
  Settings,
  Menu,
  X,
  PlusCircle
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', label: 'Painel', icon: LayoutDashboard },
  { path: '/records', label: 'Registos', icon: Receipt },
  { path: '/recurring', label: 'Recorrentes', icon: Repeat },
  { path: '/categories', label: 'Categorias', icon: Tags },
  { path: '/import', label: 'Importar', icon: Upload },
  { path: '/settings', label: 'Definições', icon: Settings },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b sticky top-0 z-50">
        <div className="font-bold text-xl text-indigo-600 flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">D</div>
          DuoFin
        </div>
        <button onClick={toggleSidebar} className="p-2 text-gray-600">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleSidebar} />
      )}

      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r z-50 transform transition-transform duration-200 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        <div className="p-6">
          <div className="font-bold text-2xl text-indigo-600 hidden md:flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black">D</div>
            DuoFin
          </div>

          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                    ${isActive 
                      ? 'bg-indigo-50 text-indigo-700 font-semibold' 
                      : 'text-gray-600 hover:bg-gray-50'}
                  `}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 w-full p-6 border-t">
          <Link
            to="/records/new"
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg transition-transform active:scale-95"
            onClick={() => setIsSidebarOpen(false)}
          >
            <PlusCircle size={20} />
            Novo Registo
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-gray-50">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
