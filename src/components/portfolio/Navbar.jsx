import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, LogOut, Menu, User, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import heightsLogo from '@/assets/heights_logo.png';
import { toast } from 'sonner';
const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [visitorMobile, setVisitorMobile] = useState(() => localStorage.getItem('portfolio_visitor_mobile') || '');
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const closeMenuTimerRef = useRef(null);
    const navigate = useNavigate();
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const handleUserLogin = () => {
        setIsUserMenuOpen(false);
        navigate('/user/login');
    };
    const handleVisitorLogout = () => {
        localStorage.removeItem('portfolio_visitor_mobile');
        window.dispatchEvent(new Event('visitor-mobile-updated'));
        setIsUserMenuOpen(false);
        toast.success('User logout successful');
    };
    const openUserMenu = () => {
        if (closeMenuTimerRef.current) {
            clearTimeout(closeMenuTimerRef.current);
            closeMenuTimerRef.current = null;
        }
        setIsUserMenuOpen(true);
    };
    const closeUserMenuWithDelay = () => {
        if (closeMenuTimerRef.current) {
            clearTimeout(closeMenuTimerRef.current);
        }
        closeMenuTimerRef.current = setTimeout(() => {
            setIsUserMenuOpen(false);
        }, 180);
    };
    useEffect(() => {
        const syncVisitorMobile = () => {
            setVisitorMobile(localStorage.getItem('portfolio_visitor_mobile') || '');
        };
        window.addEventListener('visitor-mobile-updated', syncVisitorMobile);
        window.addEventListener('storage', syncVisitorMobile);
        return () => {
            window.removeEventListener('visitor-mobile-updated', syncVisitorMobile);
            window.removeEventListener('storage', syncVisitorMobile);
        };
    }, []);
    const navLinks = [
        { label: 'Home', href: '#' },
        { label: 'Projects', href: '#projects' },
        { label: 'Contact', href: '#contact' },
    ];
    const scrollToSection = (href) => {
        setIsMobileMenuOpen(false);
        if (href === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        else {
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }
    };
    return (<>
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6 }} className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? 'py-4 glass shadow-soft'
            : 'py-6 bg-transparent'}`}>
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className={`rounded-md px-2 py-1 transition-all ${isScrolled ? 'bg-transparent' : 'bg-white/10 backdrop-blur-sm'}`}>
              <img src={heightsLogo} alt="Heights Logo" className={`h-10 md:h-11 w-auto object-contain transition-all ${isScrolled ? '' : 'mix-blend-multiply'}`}/>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (<button key={link.label} onClick={() => scrollToSection(link.href)} className={`text-sm font-medium transition-colors hover:text-accent ${isScrolled ? 'text-foreground' : 'text-primary-foreground'}`}>
                {link.label}
              </button>))}
            <div className="relative" onMouseEnter={openUserMenu} onMouseLeave={closeUserMenuWithDelay}>
              <button type="button" className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${isScrolled
            ? 'bg-primary text-primary-foreground hover:shadow-elevated'
            : 'bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30'}`}>
                <span className="inline-flex items-center gap-2">
                  <User className="w-4 h-4"/>
                  {visitorMobile || 'User'}
                  <ChevronDown className="w-4 h-4 opacity-80"/>
                </span>
              </button>
              {isUserMenuOpen && (<div className="absolute right-0 top-full pt-2 w-44 z-50" onMouseEnter={openUserMenu} onMouseLeave={closeUserMenuWithDelay}>
                  <div className="rounded-xl border border-border bg-card shadow-elevated p-1">
                  <button type="button" onClick={handleUserLogin} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-muted flex items-center gap-2">
                    <User className="w-4 h-4"/>
                    Login as User
                  </button>
                  <button type="button" onClick={handleVisitorLogout} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-muted flex items-center gap-2 text-destructive">
                    <LogOut className="w-4 h-4"/>
                    Logout
                  </button>
                  </div>
                </div>)}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className={`md:hidden p-2 rounded-lg transition-colors ${isScrolled ? 'text-foreground' : 'text-primary-foreground'}`}>
            {isMobileMenuOpen ? <X className="w-6 h-6"/> : <Menu className="w-6 h-6"/>}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (<motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-x-0 top-[72px] z-40 bg-card shadow-elevated md:hidden">
            <div className="container mx-auto px-4 py-6 space-y-4">
              {navLinks.map((link) => (<button key={link.label} onClick={() => scrollToSection(link.href)} className="block w-full text-left text-foreground text-lg font-medium py-2">
                  {link.label}
                </button>))}
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center py-3 rounded-xl bg-primary text-primary-foreground font-medium">
                Admin Panel
              </Link>
            </div>
          </motion.div>)}
      </AnimatePresence>
    </>);
};
export default Navbar;
