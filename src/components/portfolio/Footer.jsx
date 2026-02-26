import { motion } from 'framer-motion';
import { Facebook, Github, Linkedin, Instagram } from 'lucide-react';
const Footer = () => {
    const socialLinks = [
        { icon: Facebook, href: 'https://www.facebook.com/profile.php?id=100063559856661', label: 'Facebook' },
        { icon: Linkedin, href: 'https://www.linkedin.com/company/31073362/admin/dashboard/', label: 'LinkedIn' },
        { icon: Github, href: '#', label: 'GitHub' },
        { icon: Instagram, href: '#', label: 'Instagram' },
    ];
    const footerLinks = [
        { label: 'Home', href: '#' },
        { label: 'Projects', href: '#projects' },
        { label: 'Contact', href: '#contact' },
        { label: 'Admin', href: '/admin' },
    ];
    return (<footer className="bg-primary text-primary-foreground py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 sm:gap-12 mb-8 sm:mb-12">
          {/* Brand */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="text-xl sm:text-2xl font-serif font-bold mb-3 sm:mb-4">Portfolio</h3>
            <p className="text-sm sm:text-base text-primary-foreground/70 max-w-xs">
              Crafting exceptional digital experiences that inspire and engage.
            </p>
          </motion.div>

          {/* Links */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (<li key={link.label}>
                  <a href={link.href} className="text-primary-foreground/70 hover:text-primary-foreground transition-colors">
                    {link.label}
                  </a>
                </li>))}
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Follow Us</h4>
            <div className="flex gap-3">
              {socialLinks.map((social) => (<a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-all" aria-label={social.label}>
                  <social.icon className="w-5 h-5"/>
                </a>))}
            </div>
          </motion.div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-6 sm:pt-8 text-center text-primary-foreground/60 text-xs sm:text-sm">
          <p>© {new Date().getFullYear()} Heights IT Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>);
};
export default Footer;
