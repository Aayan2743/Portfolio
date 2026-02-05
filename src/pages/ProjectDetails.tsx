// import { useParams, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { ArrowLeft, Eye, Heart, FileText, CheckCircle } from 'lucide-react';
// import { usePortfolio } from '@/contexts/PortfolioContext';
// import { useEffect } from 'react';
// import Navbar from '@/components/portfolio/Navbar';
// import Footer from '@/components/portfolio/Footer';
// import FloatingActions from '@/components/portfolio/FloatingActions';

// const ProjectDetails = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { projects, incrementVisit } = usePortfolio();
  
//   const project = projects.find(p => p.id === id);

//   useEffect(() => {
//     if (project) {
//       incrementVisit(project.id);
//     }
//   }, [project?.id]);

//   if (!project) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-background">
//         <div className="text-center">
//           <h1 className="text-4xl font-serif font-bold text-primary mb-4">Project Not Found</h1>
//           <button onClick={() => navigate('/')} className="btn-hero">
//             Back to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />
      
//       {/* Hero Section with Video */}
//       <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
//         {project.videoUrl ? (
//           <video
//             autoPlay
//             loop
//             muted
//             playsInline
//             className="absolute inset-0 w-full h-full object-cover"
//           >
//             <source src={project.videoUrl} type="video/mp4" />
//           </video>
//         ) : (
//           <img
//             src={project.thumbnail}
//             alt={project.title}
//             className="absolute inset-0 w-full h-full object-cover"
//           />
//         )}
        
//         {/* Overlay */}
//         <div className="absolute inset-0 hero-gradient opacity-80" />

//         {/* Content */}
//         <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
//           <motion.button
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             onClick={() => navigate('/')}
//             className="absolute top-8 left-8 flex items-center gap-2 text-primary-foreground/80 hover:text-primary-foreground transition-colors"
//           >
//             <ArrowLeft className="w-5 h-5" />
//             <span>Back to Projects</span>
//           </motion.button>

//           <motion.h1
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8 }}
//             className="text-5xl md:text-7xl font-serif font-bold text-primary-foreground mb-6"
//           >
//             {project.title}
//           </motion.h1>

//           <motion.p
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.2 }}
//             className="text-xl text-primary-foreground/80 mb-8"
//           >
//             {project.description}
//           </motion.p>

//           {/* Stats */}
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.8, delay: 0.4 }}
//             className="flex justify-center gap-8"
//           >
//             <div className="flex items-center gap-2 text-primary-foreground">
//               <Eye className="w-5 h-5" />
//               <span>{project.visitCount} Visits</span>
//             </div>
//             <div className="flex items-center gap-2 text-primary-foreground">
//               <Heart className="w-5 h-5" />
//               <span>{project.interestedCount} Interested</span>
//             </div>
//             <div className="flex items-center gap-2 text-primary-foreground">
//               <FileText className="w-5 h-5" />
//               <span>{project.documentedCount} Documents</span>
//             </div>
//           </motion.div>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section className="py-24 bg-background">
//         <div className="container mx-auto px-4">
//           <motion.div
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="text-center mb-16"
//           >
//             <span className="inline-block px-4 py-2 mb-4 rounded-full bg-accent/10 text-accent text-sm font-medium">
//               Features
//             </span>
//             <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
//               What's Inside
//             </h2>
//             <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
//               Explore the key features and modules that make this project stand out.
//             </p>
//           </motion.div>

//           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
//             {project.features.map((feature, index) => (
//               <motion.div
//                 key={feature.title}
//                 initial={{ opacity: 0, y: 40 }}
//                 whileInView={{ opacity: 1, y: 0 }}
//                 viewport={{ once: true }}
//                 transition={{ delay: index * 0.1 }}
//                 className="bg-card rounded-2xl p-8 shadow-card hover-lift"
//               >
//                 <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
//                   <CheckCircle className="w-6 h-6 text-accent" />
//                 </div>
//                 <h3 className="text-xl font-serif font-bold text-primary mb-3">
//                   {feature.title}
//                 </h3>
//                 <p className="text-muted-foreground">
//                   {feature.description}
//                 </p>
//               </motion.div>
//             ))}
//           </div>
//         </div>
//       </section>

//       <Footer />
//       <FloatingActions />
//     </div>
//   );
// };

// export default ProjectDetails;

import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Heart,
  FileText,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { useEffect, useState } from 'react';

import Navbar from '@/components/portfolio/Navbar';
import Footer from '@/components/portfolio/Footer';
import FloatingActions from '@/components/portfolio/FloatingActions';

const PROJECTS_ROUTE = "/";

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, incrementVisit } = usePortfolio();

  const project = projects.find((p) => p.id === id);

  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (project) incrementVisit(project.id);
  }, [project?.id]);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">
            Project Not Found
          </h1>
<button
  onClick={() => navigate(PROJECTS_ROUTE)}
  className="absolute -top-16 left-0 flex items-center gap-2
             text-muted-foreground hover:text-primary transition
             relative z-50 pointer-events-auto"
>
  <ArrowLeft className="w-5 h-5" />
  Back to Projects
</button>

        </div>
      </div>
    );
  }

  // ✅ Safe gallery
  const images =
    (project as any).gallery?.length > 0
      ? (project as any).gallery
      : [project.thumbnail];

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setActiveImage((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);
  /* ============================================= */

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ===================== HERO ===================== */}
      <section className="relative py-28 bg-gradient-to-b from-accent/10 to-background">
        <div className="container mx-auto px-4 max-w-4xl text-center relative">

          <button
            onClick={() => navigate(PROJECTS_ROUTE)}
            className="absolute -top-16 left-0 flex items-center gap-2 text-muted-foreground hover:text-primary transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Projects
          </button>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif font-bold text-primary mb-6"
          >
            {project.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-lg text-muted-foreground"
          >
            {project.description}
          </motion.p>

          <div className="flex justify-center gap-10 mt-10 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              {project.visitCount} Visits
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              {project.interestedCount} Interested
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {project.documentedCount} Docs
            </div>
          </div>
        </div>
      </section>

      {/* ===================== OVERVIEW + CAROUSEL ===================== */}
      <section className="py-28">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-20 items-center">

          {/* Carousel */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden shadow-xl bg-card"
          >
            <img
              src={images[activeImage]}
              alt="Project preview"
              className="w-full h-[420px] object-cover transition-all duration-700"
            />

            {images.length > 1 && (
              <>
                {/* Left */}
                <button
                  onClick={() =>
                    setActiveImage(
                      activeImage === 0
                        ? images.length - 1
                        : activeImage - 1
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur p-2 rounded-full shadow hover:bg-background transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Right */}
                <button
                  onClick={() =>
                    setActiveImage(
                      activeImage === images.length - 1
                        ? 0
                        : activeImage + 1
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur p-2 rounded-full shadow hover:bg-background transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`w-2.5 h-2.5 rounded-full transition ${
                        i === activeImage
                          ? 'bg-primary'
                          : 'bg-primary/30'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </motion.div>

          {/* Overview */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
              Project Overview
            </h2>

            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              This project demonstrates a well-structured approach to modern UI
              development, combining elegant design systems, reusable
              components, smooth motion, and scalability for production-ready
              applications.
            </p>

            {(project as any).projectUrl && (
              <button
                onClick={() =>
                  window.open((project as any).projectUrl, '_blank')
                }
                className="inline-flex items-center gap-3 px-10 py-4 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition"
              >
                Visit Project
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
{/* ===================== FEATURES (TRUE ZIG-ZAG) ===================== */}
<section className="py-32 bg-muted/30">
  <div className="container mx-auto px-4 max-w-6xl">

    {/* Header */}
    <div className="text-center mb-28">
      <span className="inline-block mb-4 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm">
        Core Features
      </span>
      <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
        Designed With Purpose
      </h2>
      <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
        Each feature is carefully crafted to enhance usability, performance,
        and maintainability across the application.
      </p>
    </div>

    {/* Features */}
    <div className="space-y-32">
      {project.features.map((feature, index) => {
        const isEven = index % 2 === 0;

        return (
          <div
            key={feature.title}
            className="grid md:grid-cols-2 gap-16 items-center"
          >
            {/* IMAGE */}
            <motion.div
              initial={{ opacity: 0, x: isEven ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className={`rounded-3xl overflow-hidden shadow-xl ${
                isEven ? 'md:order-1' : 'md:order-2'
              }`}
            >
              <img
                src={feature.image || project.thumbnail}
                alt={feature.title}
                className="w-full h-[360px] object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>

            {/* CONTENT */}
            <motion.div
              initial={{ opacity: 0, x: isEven ? 60 : -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className={`bg-card rounded-3xl p-12 shadow-card ${
                isEven ? 'md:order-2' : 'md:order-1'
              }`}
            >
              <div className="w-14 h-14 mb-8 rounded-2xl bg-accent/10 flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-accent" />
              </div>

              <h3 className="text-3xl font-serif font-bold text-primary mb-6">
                {feature.title}
              </h3>

              <p className="text-muted-foreground text-lg leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          </div>
        );
      })}
    </div>
  </div>
</section>


      <Footer />
      <FloatingActions />
    </div>
  );
};

export default ProjectDetails;
