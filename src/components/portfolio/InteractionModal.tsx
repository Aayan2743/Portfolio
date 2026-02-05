import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Lock, CheckCircle } from 'lucide-react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface InteractionModalProps {
  isOpen: boolean;
  type: 'interested' | 'documented';
  projectId: string;
  onClose: () => void;
}

const InteractionModal: React.FC<InteractionModalProps> = ({ isOpen, type, projectId, onClose }) => {
  const { addInteraction, projects } = usePortfolio();
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const project = projects.find(p => p.id === projectId);

  const handleSendOtp = () => {
    if (mobile.length < 10) {
      setError('Please enter a valid mobile number');
      return;
    }
    setError('');
    setStep('otp');
  };

  const handleVerifyOtp = () => {
    // Mock OTP verification - accept "1234" as valid
    if (otp === '1234' || otp.length === 4) {
      addInteraction(projectId, type, mobile);
      setStep('success');
    } else {
      setError('Invalid OTP. Try 1234');
    }
  };

  const handleClose = () => {
    setStep('phone');
    setMobile('');
    setOtp('');
    setError('');
    onClose();
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: 'spring' as const, damping: 25, stiffness: 300 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      y: 50,
      transition: { duration: 0.2 }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            className="relative w-full max-w-md bg-card rounded-3xl shadow-elevated overflow-hidden"
          >
            {/* Header */}
            <div className="relative p-6 pb-4">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
              
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${
                    type === 'interested' ? 'bg-accent/10' : 'bg-primary/10'
                  }`}
                >
                  {type === 'interested' ? (
                    <Phone className={`w-8 h-8 text-accent`} />
                  ) : (
                    <Lock className={`w-8 h-8 text-primary`} />
                  )}
                </motion.div>
                <h3 className="text-2xl font-serif font-bold text-primary">
                  {step === 'success' 
                    ? 'Thank You!' 
                    : type === 'interested' 
                      ? "I'm Interested" 
                      : 'Request Document'
                  }
                </h3>
                {step !== 'success' && project && (
                  <p className="text-muted-foreground mt-2">
                    {project.title}
                  </p>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              <AnimatePresence mode="wait">
                {step === 'phone' && (
                  <motion.div
                    key="phone"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Mobile Number
                      </label>
                      <Input
                        type="tel"
                        placeholder="Enter your mobile number"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        className="h-12 rounded-xl text-lg"
                      />
                      {error && (
                        <p className="text-destructive text-sm mt-2">{error}</p>
                      )}
                    </div>
                    <Button
                      onClick={handleSendOtp}
                      className="w-full h-12 rounded-xl text-base accent-gradient text-accent-foreground font-semibold"
                    >
                      Send OTP
                    </Button>
                  </motion.div>
                )}

                {step === 'otp' && (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <p className="text-sm text-muted-foreground text-center">
                      Enter the OTP sent to {mobile}
                    </p>
                    <div>
                      <Input
                        type="text"
                        placeholder="Enter 4-digit OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        maxLength={4}
                        className="h-14 rounded-xl text-2xl text-center tracking-[0.5em] font-mono"
                      />
                      {error && (
                        <p className="text-destructive text-sm mt-2 text-center">{error}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Hint: Use "1234" for demo
                      </p>
                    </div>
                    <Button
                      onClick={handleVerifyOtp}
                      className="w-full h-12 rounded-xl text-base accent-gradient text-accent-foreground font-semibold"
                    >
                      Verify OTP
                    </Button>
                    <button
                      onClick={() => setStep('phone')}
                      className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Change mobile number
                    </button>
                  </motion.div>
                )}

                {step === 'success' && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                    >
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    </motion.div>
                    <p className="text-foreground mb-2">
                      {type === 'interested'
                        ? 'We have received your interest!'
                        : 'Document request submitted!'
                      }
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      We'll reach out to you shortly.
                    </p>
                    <Button
                      onClick={handleClose}
                      variant="outline"
                      className="rounded-xl"
                    >
                      Close
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InteractionModal;
