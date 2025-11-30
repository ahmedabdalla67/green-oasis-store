import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, ShoppingCart, MapPin, Settings, LogOut, 
  Leaf, Menu, X, MessageSquare, TrendingUp
} from 'lucide-react';
import { useAdmin } from '@/contexts/AdminContext';
import { useData } from '@/contexts/DataContext';
import { Button } from '@/components/ui/button';
import { AdminProducts } from '@/components/admin/AdminProducts';
import { AdminOrders } from '@/components/admin/AdminOrders';
import { AdminShipping } from '@/components/admin/AdminShipping';
import { AdminConsultations } from '@/components/admin/AdminConsultations';
import { AdminSettings } from '@/components/admin/AdminSettings';

type TabType = 'overview' | 'products' | 'orders' | 'shipping' | 'consultations' | 'settings';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout, isAuthenticated } = useAdmin();
  const { products, orders, consultations, shippingZones } = useData();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/admin');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const menuItems = [
    { id: 'overview' as TabType, label: 'نظرة عامة', icon: TrendingUp },
    { id: 'products' as TabType, label: 'المنتجات', icon: Package },
    { id: 'orders' as TabType, label: 'الطلبات', icon: ShoppingCart },
    { id: 'shipping' as TabType, label: 'مناطق الشحن', icon: MapPin },
    { id: 'consultations' as TabType, label: 'الاستشارات', icon: MessageSquare },
    { id: 'settings' as TabType, label: 'الإعدادات', icon: Settings },
  ];

  const stats = [
    { label: 'المنتجات', value: products.length, icon: Package, color: 'bg-primary' },
    { label: 'الطلبات', value: orders.length, icon: ShoppingCart, color: 'bg-accent' },
    { label: 'الاستشارات', value: consultations.filter(c => c.status === 'new').length, icon: MessageSquare, color: 'bg-warning' },
    { label: 'مناطق الشحن', value: shippingZones.length, icon: MapPin, color: 'bg-success' },
  ];

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const newConsultations = consultations.filter(c => c.status === 'new').length;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 right-0 z-50
        w-64 bg-card border-l border-border
        transform transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg">زراعتي</h1>
                <p className="text-xs text-muted-foreground">لوحة التحكم</p>
              </div>
            </div>
          </div>

          {/* Menu */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-colors font-medium
                    ${isActive 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-secondary text-foreground/80'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                  {item.id === 'orders' && pendingOrders > 0 && (
                    <span className="mr-auto bg-destructive text-destructive-foreground text-xs px-2 py-0.5 rounded-full">
                      {pendingOrders}
                    </span>
                  )}
                  {item.id === 'consultations' && newConsultations > 0 && (
                    <span className="mr-auto bg-warning text-warning-foreground text-xs px-2 py-0.5 rounded-full">
                      {newConsultations}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 ml-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Header */}
        <header className="bg-card border-b border-border p-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h2>
            <div className="w-6 lg:hidden" />
          </div>
        </header>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-card rounded-xl p-6 border border-border">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="text-3xl font-bold">{stat.value}</p>
                          <p className="text-muted-foreground text-sm">{stat.label}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Recent Orders */}
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-bold text-lg mb-4">أحدث الطلبات</h3>
                {orders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">لا توجد طلبات بعد</p>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <div>
                          <p className="font-medium">{order.customerName}</p>
                          <p className="text-sm text-muted-foreground">{order.governorate} - {order.area}</p>
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-primary">{order.totalAmount} جنيه</p>
                          <p className="text-sm text-muted-foreground">
                            {order.status === 'pending' && 'قيد الانتظار'}
                            {order.status === 'processing' && 'قيد التجهيز'}
                            {order.status === 'shipped' && 'تم الشحن'}
                            {order.status === 'delivered' && 'تم التوصيل'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'products' && <AdminProducts />}
          {activeTab === 'orders' && <AdminOrders />}
          {activeTab === 'shipping' && <AdminShipping />}
          {activeTab === 'consultations' && <AdminConsultations />}
          {activeTab === 'settings' && <AdminSettings />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
