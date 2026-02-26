import { motion } from 'framer-motion';
import { Phone, MessageCircle } from 'lucide-react';
const FloatingActions = () => {
    const handlePhoneClick = () => {
        window.open('tel:+15551234567', '_self');
    };
    const handleWhatsAppClick = () => {
        window.open('https://wa.me/15551234567?text=Hello! I am interested in your services.', '_blank');
    };
    return (<div className="fixed bottom-5 right-4 sm:bottom-8 sm:right-8 z-40 flex flex-col gap-3 sm:gap-4">
      {/* WhatsApp Button */}
      <motion.button initial={{ opacity: 0, scale: 0, x: 50 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ delay: 1, type: 'spring' }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={handleWhatsAppClick} className="group relative w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white shadow-elevated flex items-center justify-center">
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6"/>
        
        {/* Tooltip */}
        <span className="hidden sm:block absolute right-full mr-3 px-3 py-2 rounded-lg bg-card shadow-card text-sm font-medium text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Chat on WhatsApp
        </span>

        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"/>
      </motion.button>

      {/* Phone Button */}
      <motion.button initial={{ opacity: 0, scale: 0, x: 50 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ delay: 1.2, type: 'spring' }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={handlePhoneClick} className="group relative w-11 h-11 sm:w-14 sm:h-14 rounded-full accent-gradient text-accent-foreground shadow-elevated flex items-center justify-center animate-pulse-glow">
        <Phone className="w-5 h-5 sm:w-6 sm:h-6"/>
        
        {/* Tooltip */}
        <span className="hidden sm:block absolute right-full mr-3 px-3 py-2 rounded-lg bg-card shadow-card text-sm font-medium text-foreground whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Call Us
        </span>
      </motion.button>
    </div>);
};
export default FloatingActions;
