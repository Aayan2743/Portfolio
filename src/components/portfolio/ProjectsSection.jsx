import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useNavigate } from 'react-router-dom';
import ProjectCard from './ProjectCard';
import InteractionModal from './InteractionModal';
const ProjectsSection = () => {
    const { projects, categories } = usePortfolio();
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState(null);
    const [modalState, setModalState] = useState({ isOpen: false, type: 'interested', projectId: '', redirectPath: null });
    const filteredProjects = activeCategory
        ? projects.filter(p => p.categoryId === activeCategory)
        : projects;
    const openModal = (projectId, type) => {
        setModalState({
            isOpen: true,
            type,
            projectId,
            redirectPath: type === 'visit' ? `/project/${projectId}` : null,
        });
    };
    return (<section id="projects" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-12">
          <span className="inline-block px-4 py-2 mb-4 rounded-full bg-accent/10 text-accent text-sm font-medium">
            Portfolio
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Our Projects
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our diverse range of projects across different industries
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-wrap justify-center gap-3 mb-12">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActiveCategory(null)} className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === null
            ? 'bg-primary text-primary-foreground shadow-elevated'
            : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}>
            All Projects
          </motion.button>
          {categories.map((category) => (<motion.button key={category.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActiveCategory(category.id)} className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${activeCategory === category.id
                ? 'bg-primary text-primary-foreground shadow-elevated'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}>
              {category.name}
            </motion.button>))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (<motion.div key={project.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }}>
                <ProjectCard project={project} index={index} onVisit={() => openModal(project.id, 'visit')} onInterested={() => openModal(project.id, 'interested')} onDocument={() => openModal(project.id, 'documented')}/>
              </motion.div>))}
          </AnimatePresence>
        </motion.div>
      </div>

      <InteractionModal isOpen={modalState.isOpen} type={modalState.type} projectId={modalState.projectId} onClose={() => setModalState({ ...modalState, isOpen: false })} onSuccess={() => {
            if (modalState.redirectPath) {
                navigate(modalState.redirectPath);
            }
        }}/>
    </section>);
};
export default ProjectsSection;
