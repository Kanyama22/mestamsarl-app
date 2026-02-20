import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { LayoutDashboard, Package, FolderOpen, LogOut, Menu, Mail } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem('adminAuth');
    if (!isAuth && !location.pathname.includes('/admin/login')) {
      navigate('/admin/login');
    }
  }, [navigate, location]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    toast({
      title: "Déconnexion réussie",
      description: "Vous avez été déconnecté avec succès.",
      duration: 3000,
    });
    navigate('/admin/login');
  };

  const navigation = [
    { name: 'Tableau de bord', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Produits', path: '/admin/products', icon: Package },
    { name: 'Catégories', path: '/admin/categories', icon: FolderOpen },
    { name: 'Messages', path: '/admin/messages', icon: Mail },
  ];

  if (location.pathname.includes('/admin/login')) {
    return <Outlet />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className={`bg-gray-900 text-white w-64 fixed inset-y-0 left-0 transform transition-transform duration-200 ease-in-out z-50 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-800">
            <Link to="/" className="text-2xl font-bold text-blue-400">MESTAM SARL</Link>
            <p className="text-sm text-gray-400 mt-1">Administration</p>
          </div>
          
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-300 hover:bg-gray-800'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-800">
            <Button
              variant="ghost"
              className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
              onClick={handleLogout}
            >
              <LogOut size={20} className="mr-3" />
              Déconnexion
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top Bar */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between lg:justify-end">
          <Button
            variant="ghost"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={24} />
          </Button>
          <Link to="/">
            <Button variant="outline">Voir le site</Button>
          </Link>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
