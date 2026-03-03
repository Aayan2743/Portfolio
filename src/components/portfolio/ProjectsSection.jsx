import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { isUserAuthenticated } from '@/lib/userAuth';
import apiClient from '@/lib/axiosInstance';
import ProjectCard from './ProjectCard';
import InteractionModal from './InteractionModal';

const ProjectsSection = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isProjectsLoading, setIsProjectsLoading] = useState(true);
    const [projectsError, setProjectsError] = useState(null);
    const [activeCategorySlug, setActiveCategorySlug] = useState(null);
    const [modalState, setModalState] = useState({ isOpen: false, type: 'interested', projectId: '', redirectPath: null });
    const [likedProjects, setLikedProjects] = useState(new Set());
    const [interestedProjects, setInterestedProjects] = useState(new Set());

    // Fetch projects from API
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                setIsProjectsLoading(true);
                setProjectsError(null);
                const response = await apiClient.get('public/projects');
                
                if (response.data.status && response.data.data) {
                    const projectsData = response.data.data.data || [];
                    setProjects(projectsData);
                    
                    // Extract unique categories
                    const uniqueCategories = [];
                    const categoryMap = new Map();
                    
                    projectsData.forEach(project => {
                        if (project.category && !categoryMap.has(project.category.id)) {
                            categoryMap.set(project.category.id, project.category);
                            uniqueCategories.push(project.category);
                        }
                    });
                    
                    setCategories(uniqueCategories);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
                setProjectsError('Failed to load projects. Please try again later.');
                toast.error('Failed to load projects');
            } finally {
                setIsProjectsLoading(false);
            }
        };

        fetchProjects();
    }, []);
    
    // Find category by slug to get its ID for filtering
    const activeCategory = activeCategorySlug 
        ? categories.find(cat => cat.slug === activeCategorySlug)
        : null;
    
    const filteredProjects = activeCategory
        ? projects.filter(p => String(p.category_id) === String(activeCategory.id))
        : projects;
    
    const handleLike = async (projectId) => {
        if (!isUserAuthenticated()) {
            toast.error('Please log in to like projects');
            return;
        }

        try {
            const response = await apiClient.post(`user-dashboard/projects/${projectId}/like`);
            
            if (response.data.success) {
                setLikedProjects(prev => {
                    const newSet = new Set(prev);
                    if (response.data.liked) {
                        newSet.add(projectId);
                    } else {
                        newSet.delete(projectId);
                    }
                    return newSet;
                });
                
                toast.success(response.data.liked ? 'Added to likes!' : 'Removed from likes');
                
                // Update project likes count
                setProjects(prev => prev.map(p => 
                    p.id === projectId 
                        ? { ...p, likes_count: response.data.liked ? p.likes_count + 1 : p.likes_count - 1 }
                        : p
                ));
            }
        } catch (error) {
            console.error('Error liking project:', error);
            const errorMessage = error.response?.data?.message || 'Failed to like project';
            toast.error(errorMessage);
        }
    };

    const handleInterested = async (projectId) => {
        if (!isUserAuthenticated()) {
            setModalState({
                isOpen: true,
                type: 'interested',
                projectId,
                redirectPath: null,
            });
            return;
        }

        try {
            const response = await apiClient.post(`user-dashboard/projects/${projectId}/interested`);
            
            if (response.data.success) {
                setInterestedProjects(prev => {
                    const newSet = new Set(prev);
                    if (response.data.interested) {
                        newSet.add(projectId);
                    } else {
                        newSet.delete(projectId);
                    }
                    return newSet;
                });
                
                toast.success(response.data.interested ? 'Marked as interested!' : 'Removed from interested');
                
                // Update project interested count
                setProjects(prev => prev.map(p => 
                    p.id === projectId 
                        ? { ...p, interested_count: response.data.interested ? p.interested_count + 1 : p.interested_count - 1 }
                        : p
                ));
            }
        } catch (error) {
            console.error('Error marking interested:', error);
            const errorMessage = error.response?.data?.message || 'Failed to mark as interested';
            toast.error(errorMessage);
        }
    };
    
    const openModal = (projectId, type) => {
        // If user is already authenticated, skip modal and redirect directly
        if (isUserAuthenticated()) {
            if (type === 'visit') {
                navigate(`/project/${projectId}`);
            } else if (type === 'interested') {
                handleInterested(projectId);
            }
            return;
        }
        
        // Show modal for unauthenticated users
        setModalState({
            isOpen: true,
            type,
            projectId,
            redirectPath: type === 'visit' ? `/project/${projectId}` : null,
        });
    };
    return (<section id="projects" className="py-14 sm:py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-8 sm:mb-12">
          <span className="inline-block px-4 py-2 mb-4 rounded-full bg-accent/10 text-accent text-sm font-medium">
            Portfolio
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Our Projects
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Explore our diverse range of projects across different industries
          </p>
        </motion.div>
        {/* Category Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-12">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActiveCategorySlug(null)} className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${activeCategorySlug === null
            ? 'bg-primary text-primary-foreground shadow-elevated'
            : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}>
            All Projects
          </motion.button>
          {categories.map((category) => (<motion.button key={category.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setActiveCategorySlug(category.slug)} className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${activeCategorySlug === category.slug
                ? 'bg-primary text-primary-foreground shadow-elevated'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'}`}>
              {category.name}
            </motion.button>))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7 md:gap-8">
          <AnimatePresence mode="popLayout">
            {isProjectsLoading ? (<motion.div key="projects-loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-center text-muted-foreground">
                Loading projects...
              </motion.div>) : projectsError ? (<motion.div key="projects-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-center text-destructive">
                {projectsError}
              </motion.div>) : filteredProjects.length === 0 ? (
              <motion.div 
                key="no-projects" 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -20 }}
                className="col-span-full text-center py-12"
              >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                  <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No Projects Available
                </h3>
                <p className="text-muted-foreground">
                  {activeCategorySlug 
                    ? `No projects found in "${activeCategory?.name}" category.` 
                    : 'No projects available at the moment.'}
                </p>
              </motion.div>
            ) : filteredProjects.map((project, index) => (<motion.div key={project.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }}>
                <ProjectCard 
                  project={project} 
                  index={index} 
                  onVisit={() => openModal(project.id, 'visit')} 
                  onInterested={() => handleInterested(project.id)}
                  onLike={() => handleLike(project.id)}
                  isLiked={likedProjects.has(project.id)}
                  isInterested={interestedProjects.has(project.id)}
                />
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
