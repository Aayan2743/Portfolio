import { motion } from 'framer-motion';
import { Eye, Heart, FileText } from 'lucide-react';
const ProjectCard = ({ project, onVisit, onInterested, onDocument, index }) => {
    return (<motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }} className="group relative bg-card rounded-2xl overflow-hidden shadow-card hover-lift">
      {/* Thumbnail */}
      <div className="relative h-56 overflow-hidden">
        <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
        
        {/* Stats overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 flex gap-4 text-primary-foreground translate-y-full group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-center gap-1.5 text-sm">
            <Eye className="w-4 h-4"/>
            <span>{project.visitCount}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <Heart className="w-4 h-4"/>
            <span>{project.interestedCount}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm">
            <FileText className="w-4 h-4"/>
            <span>{project.documentedCount}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-serif font-bold text-primary mb-3 group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
          {project.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onVisit} className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium transition-all hover:shadow-elevated">
            Visit
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onInterested} className="flex-1 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-medium transition-all hover:shadow-glow">
            I'm Interested
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={onDocument} className="flex-1 px-4 py-2.5 rounded-lg border border-border text-foreground text-sm font-medium transition-all hover:bg-secondary">
            Document
          </motion.button>
        </div>
      </div>
    </motion.div>);
};
export default ProjectCard;
