import Navbar from '@/components/portfolio/Navbar';
import Hero from '@/components/portfolio/Hero';
import VerticalMarquee from '@/components/portfolio/VerticalMarquee';
import ProjectsSection from '@/components/portfolio/ProjectsSection';
import ContactSection from '@/components/portfolio/ContactSection';
import Footer from '@/components/portfolio/Footer';
import FloatingActions from '@/components/portfolio/FloatingActions';
const Index = () => {
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
