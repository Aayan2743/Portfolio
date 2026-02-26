import { motion } from 'framer-motion';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { ChevronDown } from 'lucide-react';
const Hero = () => {
    const { banners } = usePortfolio();
    const activeBanner = banners.find(b => b.isActive) || banners[0];
    const scrollToProjects = () => {
        document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    };
    return (<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      {activeBanner?.mediaType === 'video' && (<video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={activeBanner.mediaUrl} type="video/mp4"/>
        </video>)}
      
      {/* Image Background */}
      {activeBanner?.mediaType === 'image' && (<img src={activeBanner.mediaUrl} alt="Hero background" className="absolute inset-0 w-full h-full object-cover"/>)}

      {/* Overlay */}
      <div className="absolute inset-0 hero-gradient opacity-80"/>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="inline-block px-4 py-2 mb-6 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium tracking-wide">
          Welcome to Heights IT Solutions
        </motion.span>

        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-primary-foreground mb-6 leading-tight">
          {activeBanner?.title || 'Crafting Digital Experiences'}
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4 }} className="text-xl md:text-2xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto font-light">
          {activeBanner?.subtitle || 'We build beautiful, functional web applications that drive results and inspire users.'}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }} className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={scrollToProjects} className="btn-hero">
            Explore Projects
          </button>
          <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="px-8 py-4 rounded-full font-semibold text-lg border-2 border-primary-foreground/30 text-primary-foreground bg-transparent transition-all duration-300 hover:bg-primary-foreground/10">
            Get in Touch
          </button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer" onClick={scrollToProjects}>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="flex flex-col items-center text-primary-foreground/60">
          <span className="text-sm font-medium mb-2">Scroll to explore</span>
          <ChevronDown className="w-6 h-6"/>
        </motion.div>
      </motion.div>
    </section>);
};
export default Hero;
