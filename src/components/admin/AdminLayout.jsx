import { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Image, Folder, FileCode, Users, Settings, Menu, X, LogOut, Home, } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminBanners from '@/pages/admin/AdminBanners';
import AdminCategories from '@/pages/admin/AdminCategories';
import AdminProjects from '@/pages/admin/AdminProjects';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminProfile from '@/pages/admin/AdminProfile';
const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const { adminUser, adminLogout } = useAuth();
    const handleLogout = () => {
        adminLogout();
        navigate('/admin/login');
    };
    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Image, label: 'Banners', path: '/admin/banners' },
        { icon: Folder, label: 'Categories', path: '/admin/categories' },
        { icon: FileCode, label: 'Projects', path: '/admin/projects' },
        { icon: Users, label: 'User Data', path: '/admin/users' },
        { icon: Settings, label: 'Profile', path: '/admin/profile' },
    ];
    return (<div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside initial={{ x: -280 }} animate={{ x: isSidebarOpen ? 0 : -280 }} className="fixed left-0 top-0 bottom-0 w-[280px] bg-card border-r border-border z-50 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-serif font-bold text-primary">Admin Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {adminUser?.email || 'Portfolio Management'}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (<li key={item.path}>
                <NavLink to={item.path} end={item.path === '/admin'} className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                ? 'bg-accent/10 text-accent'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                  <item.icon className="w-5 h-5"/>
                  {item.label}
                </NavLink>
              </li>))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="p-4 border-t border-border space-y-2">
          <button onClick={() => navigate('/')} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
            <Home className="w-5 h-5"/>
            Back to Website
          </button>
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all">
            <LogOut className="w-5 h-5"/>
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-0'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 h-16 bg-card/80 backdrop-blur-sm border-b border-border flex items-center px-6">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-lg hover:bg-muted transition-colors mr-4">
            {isSidebarOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
          </button>
          <h2 className="text-lg font-semibold text-foreground">Welcome back!</h2>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Routes>
            <Route index element={<AdminDashboard />}/>
            <Route path="banners" element={<AdminBanners />}/>
            <Route path="categories" element={<AdminCategories />}/>
            <Route path="projects" element={<AdminProjects />}/>
            <Route path="users" element={<AdminUsers />}/>
            <Route path="profile" element={<AdminProfile />}/>
          </Routes>
        </main>
      </div>
    </div>);
};
export default AdminLayout;
