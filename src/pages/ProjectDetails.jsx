import { motion } from "framer-motion";
import { ArrowLeft, Eye, Heart, FileText, ExternalLink } from "lucide-react";
import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "@/components/portfolio/Navbar";
import Footer from "@/components/portfolio/Footer";
import FloatingActions from "@/components/portfolio/FloatingActions";
import { Button } from "@/components/ui/button";
import { usePortfolio } from "@/contexts/PortfolioContext";

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
          <button
            type="button"
            onClick={handleBackToProjects}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg">Back to Projects</span>
          </button>

          {isProjectsLoading && (
            <div className="mt-10 text-muted-foreground">Loading project...</div>
          )}

          {!isProjectsLoading && projectsError && (
            <div className="mt-10 text-destructive">{projectsError}</div>
          )}

          {!isProjectsLoading && !projectsError && !project && (
            <div className="mt-10 space-y-3">
              <h1 className="text-3xl font-bold text-primary">Project not found</h1>
              <p className="text-muted-foreground">
                This project may have been removed or the link is invalid.
              </p>
            </div>
          )}

          {!isProjectsLoading && !projectsError && project && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 sm:mt-10"
            >
              <div className="text-center mb-10 sm:mb-14">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-primary">
                  {project.projectMainHeading || project.title}
                </h1>
                {project.description && (
                  <p className="text-muted-foreground text-lg mt-4 max-w-3xl mx-auto">
                    {project.description}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap items-center justify-center gap-8 text-muted-foreground text-xl">
                  <div className="inline-flex items-center gap-2">
                    <Eye className="w-6 h-6" />
                    <span>{project.visitCount ?? 0} Visits</span>
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <Heart className="w-6 h-6" />
                    <span>{project.interestedCount ?? 0} Interested</span>
                  </div>
                  <div className="inline-flex items-center gap-2">
                    <FileText className="w-6 h-6" />
                    <span>{project.documentedCount ?? 0} Docs</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
                <div className="lg:col-span-2">
                  <div className="rounded-2xl overflow-hidden border border-border bg-card">
                    {project.thumbnail ? (
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-[240px] sm:h-[360px] md:h-[460px] object-cover"
                      />
                    ) : (
                      <div className="w-full h-[240px] sm:h-[360px] md:h-[460px] bg-muted" />
                    )}
                  </div>

                  {Array.isArray(project.features) && project.features.length > 0 && (
                    <div className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-6">
                      <h2 className="text-2xl font-serif font-bold text-primary mb-5">
                        Project Features
                      </h2>
                      <div className="space-y-4">
                        {project.features.map((feature, index) => (
                          <div
                            key={`${feature.title}-${index}`}
                            className="rounded-xl border border-border bg-background p-4"
                          >
                            <h3 className="text-lg font-semibold text-foreground">
                              {feature.title || `Feature ${index + 1}`}
                            </h3>
                            {feature.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {feature.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-6">
                  {project.projectUrl && (
                    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                      <h2 className="text-xl font-serif font-bold text-primary mb-3">
                        Live Project
                      </h2>
                      <Button asChild className="w-full">
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
                    </div>
                  )}

                  {Array.isArray(project.gallery) && project.gallery.length > 0 && (
                    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                      <h2 className="text-xl font-serif font-bold text-primary mb-4">
                        Gallery
                      </h2>
                      <div className="space-y-3">
                        {project.gallery
                          .filter(Boolean)
                          .slice(0, 4)
                          .map((imageUrl, index) => (
                            <div
                              key={`${imageUrl}-${index}`}
                              className="rounded-xl overflow-hidden border border-border bg-background"
                            >
                              <img
                                src={imageUrl}
                                alt={`${project.title} screenshot ${index + 1}`}
                                className="w-full h-32 object-cover"
                              />
                            </div>
                          ))}
                      </div>
                    </div>
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
