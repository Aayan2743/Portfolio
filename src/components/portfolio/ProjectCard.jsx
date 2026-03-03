import { motion } from 'framer-motion';
import { Eye, Heart } from 'lucide-react';

const ProjectCard = ({ project, onVisit, onInterested, onLike, isLiked, isInterested, index }) => {
    return (<motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }} className="group relative bg-card rounded-2xl overflow-hidden shadow-card hover-lift">
      {/* Thumbnail */}
      <div className="relative h-44 sm:h-52 md:h-56 overflow-hidden">
        <img src={project.thumbnail_image_url || project.thumbnail_image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"/>
        
        {/* Stats overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 flex gap-3 sm:gap-4 text-primary-foreground translate-y-0 sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-500">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Eye className="w-4 h-4"/>
            <span>{project.likes_count || 0}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm">
            <Heart className="w-4 h-4"/>
            <span>{project.interested_count || 0}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-serif font-bold text-primary mb-2 sm:mb-3 group-hover:text-accent transition-colors">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6 line-clamp-2 min-h-[2.5rem] sm:min-h-[2.8rem]">
          {project.description}
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onVisit} className="px-3 sm:px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-xs sm:text-sm font-medium transition-all hover:shadow-elevated">
            Visit
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onInterested} className={`px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${isInterested ? 'bg-accent text-accent-foreground' : 'bg-accent/20 text-accent'} hover:shadow-glow`}>
            {isInterested ? 'Interested ✓' : 'I\'m Interested'}
          </motion.button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={onLike} className={`col-span-2 px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all ${isLiked ? 'bg-red-500/20 text-red-600 border border-red-500/30' : 'border border-border text-foreground hover:bg-secondary'}`}>
            {isLiked ? '❤️ Liked' : '🤍 Like'}
          </motion.button>
        </div>
      </div>
    </motion.div>);
};

export default ProjectCard;
