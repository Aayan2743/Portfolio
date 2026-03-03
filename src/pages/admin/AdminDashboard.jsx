import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Eye, Heart, TrendingUp, Folder, Loader2 } from 'lucide-react';
import apiClient from '@/lib/axiosInstance';
import { toast } from 'sonner';

const AdminDashboard = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        totalVisits: 0,
        totalInterested: 0,
        totalProjects: 0,
        totalCategories: 0,
        users: [],
        projects: [],
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Fetch user dashboard data
            const userResponse = await apiClient.get('public/user-dashboard');
            
            if (userResponse.data.status && userResponse.data.data) {
                const users = userResponse.data.data.data || [];
                
                // Calculate stats from users data
                let totalVisits = 0;
                let totalInterested = 0;
                
                users.forEach(user => {
                    totalVisits += user.projects_visited?.length || 0;
                    totalInterested += user.projects_interested?.length || 0;
                });

                // Fetch projects data
                const projectsResponse = await apiClient.get('public/projects');
                const projects = projectsResponse.data.data?.data || [];
                
                // Extract categories
                const categoriesSet = new Set();
                projects.forEach(project => {
                    if (project.category?.id) {
                        categoriesSet.add(project.category.id);
                    }
                });

                setDashboardData({
                    totalVisits,
                    totalInterested,
                    totalProjects: projects.length,
                    totalCategories: categoriesSet.size,
                    users,
                    projects,
                });
            }
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
            const errorMessage = err.response?.data?.message || 'Failed to load dashboard data';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const stats = [
        { label: 'Total Visits', value: dashboardData.totalVisits, icon: Eye, color: 'bg-blue-500/10 text-blue-600' },
        { label: 'Interested Users', value: dashboardData.totalInterested, icon: Heart, color: 'bg-pink-500/10 text-pink-600' },
        { label: 'Total Projects', value: dashboardData.totalProjects, icon: TrendingUp, color: 'bg-accent/10 text-accent' },
        { label: 'Categories', value: dashboardData.totalCategories, icon: Folder, color: 'bg-purple-500/10 text-purple-600' },
    ];
    return (<div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your portfolio statistics</p>
      </div>

      {/* Error State */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4 text-destructive"
        >
          <p className="font-medium">Error loading dashboard</p>
          <p className="text-sm mt-1">{error}</p>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (<motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-card rounded-2xl p-6 shadow-card hover-lift">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-foreground">{stat.value.toLocaleString()}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6"/>
                  </div>
                </div>
              </motion.div>))}
          </div>

          {/* Top Projects */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card rounded-2xl p-6 shadow-card">
            <h2 className="text-xl font-serif font-bold text-primary mb-6">Top Projects</h2>
            {dashboardData.projects.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No projects available</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Project</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Likes</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Interested</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.projects
                      .sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0))
                      .slice(0, 5)
                      .map((project) => (<tr key={project.id} className="border-b border-border last:border-0">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img src={project.thumbnail_image_url || project.thumbnail_image} alt={project.title} className="w-10 h-10 rounded-lg object-cover"/>
                              <span className="font-medium text-foreground">{project.title}</span>
                            </div>
                          </td>
                          <td className="text-right py-4 px-4 text-foreground">{project.likes_count || 0}</td>
                          <td className="text-right py-4 px-4 text-foreground">{project.interested_count || 0}</td>
                        </tr>))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
          {/* Users Overview */}
          {/* <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-card rounded-2xl p-6 shadow-card">
            <h2 className="text-xl font-serif font-bold text-primary mb-6">Users Overview</h2>
            {dashboardData.users.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No users yet</p>
            ) : (
              <div className="space-y-3">
                {dashboardData.users.slice(0, 10).map((user) => (
                  <div key={user.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{user.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{user.email || user.phone || 'No contact'}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 text-xs">
                      <span className="text-muted-foreground">
                        Visited: <span className="font-semibold text-foreground">{user.projects_visited?.length || 0}</span>
                      </span>
                      <span className="text-muted-foreground">
                        Interested: <span className="font-semibold text-foreground">{user.projects_interested?.length || 0}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div> */}
        </>
      )}
    </div>);
};
export default AdminDashboard;
