import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/portfolio/Navbar';
import Hero from '@/components/portfolio/Hero';
import VerticalMarquee from '@/components/portfolio/VerticalMarquee';
import ProjectsSection from '@/components/portfolio/ProjectsSection';
import ContactSection from '@/components/portfolio/ContactSection';
import Footer from '@/components/portfolio/Footer';
import FloatingActions from '@/components/portfolio/FloatingActions';
const Index = () => {
    const location = useLocation();
    useEffect(() => {
        if (!location.hash) {
            return;
        }
        const id = location.hash.slice(1);
        const targetElement = document.getElementById(id);
        if (!targetElement) {
            return;
        }
        const navOffset = 92;
        const top = targetElement.getBoundingClientRect().top + window.scrollY - navOffset;
        window.scrollTo({ top, behavior: 'smooth' });
    }, [location.hash]);
    return (<div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
            <ProjectsSection />
      <VerticalMarquee />
      <ContactSection />
      <Footer />
      <FloatingActions />
    </div>);
};
export default Index;
