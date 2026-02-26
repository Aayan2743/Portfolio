import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Mock submission
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success('Message sent successfully! We\'ll get back to you soon.');
        setFormData({ name: '', email: '', phone: '', message: '' });
        setIsSubmitting(false);
    };
    const contactInfo = [
        { icon: MapPin, label: 'Address', value: '5 th floor, Nulife Apartments, BK Guda, Sanjeeva Reddy Nagar, Hyderabad, Telangana 500034' },
        { icon: Mail, label: 'Email', value: 'heightsitsolutions@gmail.com' },
        { icon: Phone, label: 'Phone', value: '99664 65050' },
    ];
    return (<section id="contact" className="py-12 sm:py-16 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-10 sm:mb-16">
          <span className="inline-block px-4 py-2 mb-4 rounded-full bg-accent/10 text-accent text-sm font-medium">
            Get in Touch
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Contact Us
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            Have a project in mind? We'd love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="space-y-5 sm:space-y-8">
            <div className="bg-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-card">
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-primary mb-4 sm:mb-6">
                Let's Start a Conversation
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8">
                Whether you have a question about our projects, want to collaborate, or just want to say hello, we're here for you.
              </p>
              
              <div className="space-y-4 sm:space-y-6">
                {contactInfo.map((item, index) => (<motion.div key={item.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-accent/10 flex items-center justify-center">
                      <item.icon className="w-4 h-4 sm:w-5 sm:h-5 text-accent"/>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-muted-foreground">{item.label}</p>
                      <p className="text-sm sm:text-base text-foreground font-medium break-words">{item.value}</p>
                    </div>
                  </motion.div>))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <form onSubmit={handleSubmit} className="bg-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-card space-y-5 sm:space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Name
                  </label>
                  <Input required placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="h-12 rounded-xl"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <Input required type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="h-12 rounded-xl"/>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Phone
                </label>
                <Input type="tel" placeholder="+1 (555) 123-4567" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="h-12 rounded-xl"/>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Message
                </label>
                <Textarea required placeholder="Tell us about your project..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="min-h-[120px] sm:min-h-[150px] rounded-xl resize-none"/>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full h-12 rounded-xl text-base accent-gradient text-accent-foreground font-semibold">
                {isSubmitting ? (<motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    Sending...
                  </motion.span>) : (<>
                    Send Message
                    <Send className="w-4 h-4 ml-2"/>
                  </>)}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>);
};
export default ContactSection;
