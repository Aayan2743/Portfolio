import { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Heart, User, Menu, X, LogOut, Home } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserDashboard from '@/pages/user/UserDashboard';
import UserProfile from '@/pages/user/UserProfile';
import UserInterested from '@/pages/user/UserInterested';

const UserLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { user, userLogout } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/user' },
    { icon: User, label: 'Profile', path: '/user/profile' },
    { icon: Heart, label: 'Interested Projects', path: '/user/interested' },
  ];

  const handleLogout = () => {
    userLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isSidebarOpen ? 0 : -280 }}
        className="fixed left-0 top-0 bottom-0 w-[280px] bg-card border-r border-border z-50 flex flex-col"
      >
        {/* Logo */}
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-serif font-bold text-primary">User Panel</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome, {user?.name || 'User'}
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/user'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-accent/10 text-accent'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Actions */}
        <div className="p-4 border-t border-border space-y-2">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <Home className="w-5 h-5" />
            Back to Website
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-[280px]' : 'ml-0'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 h-16 bg-card/80 backdrop-blur-sm border-b border-border flex items-center px-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-muted transition-colors mr-4"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <h2 className="text-lg font-semibold text-foreground">My Dashboard</h2>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Routes>
            <Route index element={<UserDashboard />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="interested" element={<UserInterested />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default UserLayout;
