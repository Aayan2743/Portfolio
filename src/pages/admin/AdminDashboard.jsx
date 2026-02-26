import { motion } from 'framer-motion';
import { Eye, Heart, FileText, TrendingUp, Folder, Image } from 'lucide-react';
import { usePortfolio } from '@/contexts/PortfolioContext';
const AdminDashboard = () => {
    const { projects, categories, banners, userInteractions } = usePortfolio();
    const totalVisits = projects.reduce((sum, p) => sum + p.visitCount, 0);
    const totalInterested = projects.reduce((sum, p) => sum + p.interestedCount, 0);
    const totalDocumented = projects.reduce((sum, p) => sum + p.documentedCount, 0);
    const stats = [
        { label: 'Total Visits', value: totalVisits, icon: Eye, color: 'bg-blue-500/10 text-blue-600' },
        { label: 'Interested Users', value: totalInterested, icon: Heart, color: 'bg-pink-500/10 text-pink-600' },
        { label: 'Document Requests', value: totalDocumented, icon: FileText, color: 'bg-green-500/10 text-green-600' },
        { label: 'Total Projects', value: projects.length, icon: TrendingUp, color: 'bg-accent/10 text-accent' },
        { label: 'Categories', value: categories.length, icon: Folder, color: 'bg-purple-500/10 text-purple-600' },
        { label: 'Active Banners', value: banners.filter(b => b.isActive).length, icon: Image, color: 'bg-orange-500/10 text-orange-600' },
    ];
    const recentInteractions = userInteractions.slice(-10).reverse();
    return (<div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your portfolio statistics</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Project</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Visits</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Interested</th>
                <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Documents</th>
              </tr>
            </thead>
            <tbody>
              {projects
            .sort((a, b) => b.visitCount - a.visitCount)
            .slice(0, 5)
            .map((project) => (<tr key={project.id} className="border-b border-border last:border-0">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img src={project.thumbnail} alt={project.title} className="w-10 h-10 rounded-lg object-cover"/>
                        <span className="font-medium text-foreground">{project.title}</span>
                      </div>
                    </td>
                    <td className="text-right py-4 px-4 text-foreground">{project.visitCount}</td>
                    <td className="text-right py-4 px-4 text-foreground">{project.interestedCount}</td>
                    <td className="text-right py-4 px-4 text-foreground">{project.documentedCount}</td>
                  </tr>))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Recent Interactions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-card rounded-2xl p-6 shadow-card">
        <h2 className="text-xl font-serif font-bold text-primary mb-6">Recent Interactions</h2>
        {recentInteractions.length === 0 ? (<p className="text-muted-foreground text-center py-8">No interactions yet</p>) : (<div className="space-y-3">
            {recentInteractions.map((interaction) => {
                const project = projects.find(p => p.id === interaction.projectId);
                return (<div key={interaction.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${interaction.type === 'visit' ? 'bg-blue-500/10' :
                        interaction.type === 'interested' ? 'bg-pink-500/10' : 'bg-green-500/10'}`}>
                      {interaction.type === 'visit' && <Eye className="w-4 h-4 text-blue-600"/>}
                      {interaction.type === 'interested' && <Heart className="w-4 h-4 text-pink-600"/>}
                      {interaction.type === 'documented' && <FileText className="w-4 h-4 text-green-600"/>}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{project?.title || 'Unknown'}</p>
                      <p className="text-xs text-muted-foreground capitalize">{interaction.type}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {interaction.createdAt.toLocaleString()}
                  </span>
                </div>);
            })}
          </div>)}
      </motion.div>
    </div>);
};
export default AdminDashboard;
