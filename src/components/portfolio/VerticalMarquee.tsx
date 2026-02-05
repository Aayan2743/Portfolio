import { motion } from 'framer-motion';
import { usePortfolio } from '@/contexts/PortfolioContext';

const MarqueeColumn = ({ items, direction }: { items: string[]; direction: 'up' | 'down' }) => {
  const duplicatedItems = [...items, ...items];

  return (
    <div className="relative h-[600px] overflow-hidden">
      <motion.div
        className={`flex flex-col gap-4 ${direction === 'up' ? 'animate-marquee-up' : 'animate-marquee-down'}`}
        style={{ willChange: 'transform' }}
      >
        {duplicatedItems.map((src, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative group"
          >
            <div className="w-64 h-48 rounded-2xl overflow-hidden shadow-card hover-lift">
              <img
                src={src}
                alt={`Portfolio item ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

const VerticalMarquee = () => {
  const { projects } = usePortfolio();
  
  const leftImages = projects.slice(0, Math.ceil(projects.length / 2)).map(p => p.thumbnail);
  const rightImages = projects.slice(Math.ceil(projects.length / 2)).map(p => p.thumbnail);

  // Add more images for continuous effect
  const extendedLeft = [...leftImages, ...leftImages.reverse(), ...leftImages];
  const extendedRight = [...rightImages, ...rightImages.reverse(), ...rightImages];

  return (
    <section className="py-24 bg-secondary overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 mb-4 rounded-full bg-accent/10 text-accent text-sm font-medium">
            Our Work
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
            Featured Projects
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A glimpse into our diverse portfolio of digital solutions
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 md:gap-8">
          <MarqueeColumn items={extendedLeft} direction="up" />
          <MarqueeColumn items={extendedRight} direction="down" />
          <div className="hidden lg:block">
            <MarqueeColumn items={extendedLeft.reverse()} direction="up" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerticalMarquee;
