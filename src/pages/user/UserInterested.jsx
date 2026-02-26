import { motion } from 'framer-motion';
import { Heart, ExternalLink, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
const UserInterested = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { userInteractions, projects } = usePortfolio();
    // Get user's interested project IDs
    const interestedProjectIds = userInteractions
        .filter(i => i.type === 'interested' && i.mobile === user?.phone)
        .map(i => i.projectId);
    // Get unique project IDs and their projects
    const uniqueProjectIds = [...new Set(interestedProjectIds)];
    const interestedProjects = projects.filter(p => uniqueProjectIds.includes(p.id));
    // Get interaction dates
    const getInteractionDate = (projectId) => {
        const interaction = userInteractions.find(i => i.projectId === projectId && i.type === 'interested' && i.mobile === user?.phone);
        return interaction?.createdAt;
    };
    return (<div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Interested Projects</h1>
        <p className="text-muted-foreground">Projects you've marked as interested</p>
      </motion.div>

      {interestedProjects.length === 0 ? (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-2xl p-12 shadow-card text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Heart className="w-8 h-8 text-muted-foreground"/>
          </div>
          <h2 className="text-xl font-serif font-bold text-foreground mb-2">No Projects Yet</h2>
          <p className="text-muted-foreground mb-6">
            You haven't marked any projects as interested yet. Browse our portfolio to find projects you like!
          </p>
          <Button onClick={() => navigate('/')} className="accent-gradient text-accent-foreground">
            Browse Projects
          </Button>
        </motion.div>) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interestedProjects.map((project, index) => {
                const interactionDate = getInteractionDate(project.id);
                return (<motion.div key={project.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-card rounded-2xl shadow-card overflow-hidden group">
                <div className="relative h-40 overflow-hidden">
                  <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                  <div className="absolute top-3 right-3 bg-accent/90 backdrop-blur-sm text-accent-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-current"/>
                    Interested
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {project.description}
                  </p>
                  {interactionDate && (<div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                      <Calendar className="w-3 h-3"/>
                      Added {new Date(interactionDate).toLocaleDateString()}
                    </div>)}
                  <Button variant="outline" size="sm" onClick={() => navigate(`/project/${project.id}`)} className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2"/>
                    View Details
                  </Button>
                </div>
              </motion.div>);
            })}
        </div>)}
    </div>);
};
export default UserInterested;
