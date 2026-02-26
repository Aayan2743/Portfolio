import { motion } from 'framer-motion';
import { Heart, User, Eye, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePortfolio } from '@/contexts/PortfolioContext';
const UserDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { userInteractions, projects } = usePortfolio();
    // Get user's interested projects
    const userInterestedCount = userInteractions.filter(i => i.type === 'interested' && i.mobile === user?.phone).length;
    const stats = [
        {
            icon: Heart,
            label: 'Interested Projects',
            value: userInterestedCount,
            color: 'bg-pink-100 text-pink-600',
            link: '/user/interested',
        },
        {
            icon: Eye,
            label: 'Available Projects',
            value: projects.length,
            color: 'bg-blue-100 text-blue-600',
            link: '/#projects',
        },
    ];
    return (<div className="space-y-8">
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">
          Welcome back, {user?.name || 'User'}!
        </h1>
        <p className="text-muted-foreground">
          Manage your profile and track projects you're interested in.
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, index) => (<motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} onClick={() => navigate(stat.link)} className="bg-card rounded-2xl p-6 shadow-card cursor-pointer hover:shadow-elevated transition-shadow group">
            <div className="flex items-center justify-between">
              <div>
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${stat.color} mb-4`}>
                  <stat.icon className="w-6 h-6"/>
                </div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-accent transition-colors"/>
            </div>
          </motion.div>))}
      </div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-2xl p-6 shadow-card">
        <h2 className="text-xl font-serif font-bold text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button onClick={() => navigate('/user/profile')} className="flex items-center gap-3 p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-left">
            <User className="w-5 h-5 text-accent"/>
            <div>
              <p className="font-medium text-foreground">Update Profile</p>
              <p className="text-sm text-muted-foreground">Edit your personal information</p>
            </div>
          </button>
          <button onClick={() => navigate('/')} className="flex items-center gap-3 p-4 rounded-xl bg-muted hover:bg-muted/80 transition-colors text-left">
            <Eye className="w-5 h-5 text-accent"/>
            <div>
              <p className="font-medium text-foreground">Browse Projects</p>
              <p className="text-sm text-muted-foreground">Explore our portfolio</p>
            </div>
          </button>
        </div>
      </motion.div>
    </div>);
};
export default UserDashboard;
