import { motion } from "framer-motion";
import { ArrowLeft, Eye, Heart, FileText, ExternalLink, Tag } from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";
import FloatingActions from "@/components/portfolio/FloatingActions";
import { Button } from "@/components/ui/button";
import { usePortfolio } from "@/contexts/PortfolioContext";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { projects, isProjectsLoading, projectsError } = usePortfolio();

  const project = useMemo(
    () => projects.find((item) => String(item.id) === String(id)),
    [projects, id]
  );

  const handleBackToProjects = () => {
    navigate("/#projects");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 sm:pt-28 pb-16 sm:pb-20">
        <div className="container mx-auto px-4">
          <motion.button
            type="button"
            onClick={handleBackToProjects}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            whileHover={{ x: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg">Back to Projects</span>
          </motion.button>

          {isProjectsLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-10 text-center"
            >
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              <p className="mt-4 text-muted-foreground">Loading project...</p>
            </motion.div>
          )}

          {!isProjectsLoading && projectsError && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
                <FileText className="w-8 h-8 text-destructive" />
              </div>
              <p className="text-destructive text-lg">{projectsError}</p>
            </motion.div>
          )}

          {!isProjectsLoading && !projectsError && !project && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-10 text-center space-y-3"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
                <Tag className="w-10 h-10 text-muted-foreground" />
              </div>
              <h1 className="text-3xl font-bold text-primary">Project not found</h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                This project may have been removed or the link is invalid.
              </p>
            </motion.div>
          )}

          {!isProjectsLoading && !projectsError && project && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mt-4 sm:mt-6"
            >
              {/* Header Section */}
              <motion.div variants={itemVariants} className="text-center mb-8 sm:mb-10">
                <motion.h1 
                  className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-primary mb-6"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {project.projectMainHeading || project.title}
                </motion.h1>

                {/* Stats */}
                <motion.div 
                  variants={itemVariants}
                  className="flex flex-wrap items-center justify-center gap-6 sm:gap-8"
                >
                  <motion.div 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Eye className="w-5 h-5 text-primary" />
                    <span className="text-foreground font-medium">{project.visitCount ?? 0} Visits</span>
                  </motion.div>
                  <motion.div 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Heart className="w-5 h-5 text-accent" />
                    <span className="text-foreground font-medium">{project.interestedCount ?? 0} Interested</span>
                  </motion.div>
                  <motion.div 
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FileText className="w-5 h-5 text-secondary-foreground" />
                    <span className="text-foreground font-medium">{project.documentedCount ?? 0} Docs</span>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                {/* Left Column - Main Image & Features */}
                <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                  {/* Main Project Image */}
                  <motion.div 
                    variants={imageVariants}
                    className="rounded-2xl overflow-hidden border border-border bg-card shadow-lg"
                  >
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-[240px] sm:h-[360px] md:h-[460px] object-cover hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-[240px] sm:h-[360px] md:h-[460px] bg-muted flex items-center justify-center">
                        <Tag className="w-16 h-16 text-muted-foreground" />
                      </div>
                    )}
                  </motion.div>

                  {/* Project Description */}
                  {project.description && (
                    <motion.div 
                      variants={itemVariants}
                      className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-lg"
                    >
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-4">
                        About This Project
                      </h2>
                      <p className="text-muted-foreground text-base leading-relaxed whitespace-pre-line">
                        {project.description}
                      </p>
                    </motion.div>
                  )}

                  {/* Project Features */}
                  {Array.isArray(project.features) && project.features.length > 0 && (
                    <motion.div 
                      variants={itemVariants}
                      className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-lg"
                    >
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-primary mb-5 sm:mb-6">
                        Project Features
                      </h2>
                      <div className="space-y-4">
                        {project.features.map((feature, index) => (
                          <motion.div
                            key={`${feature.title}-${index}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group rounded-xl border border-border bg-background p-4 sm:p-5 hover:shadow-md hover:border-primary/50 transition-all duration-300"
                          >
                            <div className="flex items-start gap-4">
                              {feature.image && (
                                <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-muted">
                                  <img
                                    src={feature.image}
                                    alt={feature.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                </div>
                              )}
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                  {feature.title || `Feature ${index + 1}`}
                                </h3>
                                {feature.description && (
                                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                    {feature.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Right Column - Sidebar */}
                <div className="space-y-6">
                  {/* Project Info Card */}
                  <motion.div 
                    variants={itemVariants}
                    className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-lg"
                  >
                    <h2 className="text-xl font-serif font-bold text-primary mb-4">
                      Project Info
                    </h2>
                    <div className="space-y-3">
                      {project.categoryName && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Category</p>
                          <p className="text-base font-medium text-foreground">{project.categoryName}</p>
                        </div>
                      )}
                      {project.title && (
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Project Name</p>
                          <p className="text-base font-medium text-foreground">{project.title}</p>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* Live Project Link */}
                  {project.projectUrl && (
                    <motion.div 
                      variants={itemVariants}
                      className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-lg"
                    >
                      <h2 className="text-xl font-serif font-bold text-primary mb-4">
                        Live Project
                      </h2>
                      <Button asChild className="w-full h-12 text-base">
                        <a
                          href={project.projectUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center gap-2"
                        >
                          Visit Website
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </motion.div>
                  )}

                  {/* Gallery */}
                  {Array.isArray(project.gallery) && project.gallery.length > 0 && (
                    <motion.div 
                      variants={itemVariants}
                      className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-lg"
                    >
                      <h2 className="text-xl font-serif font-bold text-primary mb-4">
                        Gallery
                      </h2>
                      <div className="space-y-3">
                        {project.gallery
                          .filter(Boolean)
                          .map((imageUrl, index) => (
                            <motion.div
                              key={`${imageUrl}-${index}`}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className="rounded-xl overflow-hidden border border-border bg-background hover:shadow-md transition-shadow duration-300"
                            >
                              <img
                                src={imageUrl}
                                alt={`${project.title} screenshot ${index + 1}`}
                                className="w-full h-40 object-cover hover:scale-105 transition-transform duration-500"
                              />
                            </motion.div>
                          ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
};

export default ProjectDetails;
