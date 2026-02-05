import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Heart, FileText, Search, Filter } from 'lucide-react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminUsers = () => {
  const { userInteractions, projects } = usePortfolio();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');

  const filteredInteractions = userInteractions.filter((interaction) => {
    const matchesSearch = interaction.mobile.includes(searchTerm);
    const matchesType = filterType === 'all' || interaction.type === filterType;
    const matchesProject = filterProject === 'all' || interaction.projectId === filterProject;
    return matchesSearch && matchesType && matchesProject;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'visit':
        return <Eye className="w-4 h-4" />;
      case 'interested':
        return <Heart className="w-4 h-4" />;
      case 'documented':
        return <FileText className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'visit':
        return 'bg-blue-500/10 text-blue-600';
      case 'interested':
        return 'bg-pink-500/10 text-pink-600';
      case 'documented':
        return 'bg-green-500/10 text-green-600';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">User Interactions</h1>
        <p className="text-muted-foreground">View all user interactions with your projects</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by mobile number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px]">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="visit">Visits</SelectItem>
            <SelectItem value="interested">Interested</SelectItem>
            <SelectItem value="documented">Documented</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterProject} onValueChange={setFilterProject}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by project" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-2xl p-6 shadow-card"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {userInteractions.filter(i => i.type === 'visit').length}
              </p>
              <p className="text-sm text-muted-foreground">Total Visits</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-6 shadow-card"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center">
              <Heart className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {userInteractions.filter(i => i.type === 'interested').length}
              </p>
              <p className="text-sm text-muted-foreground">Interested Users</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-6 shadow-card"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {userInteractions.filter(i => i.type === 'documented').length}
              </p>
              <p className="text-sm text-muted-foreground">Document Requests</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Interactions Table */}
      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Project</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Mobile</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredInteractions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-muted-foreground">
                    No interactions found
                  </td>
                </tr>
              ) : (
                filteredInteractions.map((interaction, index) => {
                  const project = projects.find(p => p.id === interaction.projectId);
                  return (
                    <motion.tr
                      key={interaction.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-border last:border-0"
                    >
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${getTypeColor(interaction.type)}`}>
                          {getTypeIcon(interaction.type)}
                          <span className="capitalize">{interaction.type}</span>
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-medium text-foreground">{project?.title || 'Unknown'}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-muted-foreground">{interaction.mobile || '-'}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-muted-foreground text-sm">
                          {interaction.createdAt.toLocaleString()}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
