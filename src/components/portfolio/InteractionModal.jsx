import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Lock, CheckCircle, Eye, Loader2 } from 'lucide-react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import apiClient from '@/lib/axiosInstance';
import { setUserAuth } from '@/lib/userAuth';

const VISITOR_MOBILE_KEY = 'portfolio_visitor_mobile';
const InteractionModal = ({ isOpen, type, projectId, onClose, onSuccess }) => {
    const { addInteraction, projects } = usePortfolio();
    const [step, setStep] = useState('phone');
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    
    const project = projects.find(p => p.id === projectId);

    // Timer for resend OTP
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);
    const handleSendOtp = async () => {
        // Validate mobile number
        const cleanMobile = mobile.trim();
        if (!cleanMobile) {
            setError('Mobile number is required');
            return;
        }
        if (cleanMobile.length < 10) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }
        if (!/^\d+$/.test(cleanMobile)) {
            setError('Mobile number should contain only digits');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await apiClient.post('/auth/send-otp', {
                identifier: cleanMobile
            });

            if (response.data.status) {
                toast.success(response.data.message || 'OTP sent successfully!');
                setStep('otp');
                setResendTimer(60); // 60 seconds cooldown
            } else {
                setError(response.data.message || 'Failed to send OTP');
                toast.error(response.data.message || 'Failed to send OTP');
            }
        } catch (err) {
            const errorMessage = err?.response?.data?.message || 'Failed to send OTP. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
            
            // Handle validation errors
            if (err?.response?.data?.errors) {
                const validationErrors = Object.values(err.response.data.errors).flat();
                validationErrors.forEach(msg => toast.error(msg));
            }
        } finally {
            setLoading(false);
        }
    };
    const handleVerifyOtp = async () => {
        // Validate OTP
        const cleanOtp = otp.trim();
        if (!cleanOtp) {
            setError('OTP is required');
            return;
        }
        if (cleanOtp.length < 4) {
            setError('Please enter a valid OTP');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const response = await apiClient.post('/auth/verify-login-otp', {
                identifier: mobile.trim(),
                otp: cleanOtp
            });

            if (response.data.status) {
                toast.success(response.data.message || 'OTP verified successfully!');
                
                // Store user token and data using utility function
                setUserAuth(response.data.token, response.data.user);
                
                // Store mobile for visit tracking
                if (type === 'visit') {
                    localStorage.setItem(VISITOR_MOBILE_KEY, mobile);
                    window.dispatchEvent(new Event('visitor-mobile-updated'));
                }

                // Add interaction tracking
                addInteraction(projectId, type, mobile);
                
                setStep('success');
                
                // Redirect after success
                if (onSuccess) {
                    setTimeout(() => {
                        handleClose();
                        onSuccess();
                    }, 1500);
                }
            } else {
                const errorMessage = response.data.message || 'Invalid OTP';
                setError(errorMessage);
                toast.error(errorMessage);
            }
        } catch (err) {
            const errorMessage = err?.response?.data?.message || 'Invalid OTP. Please try again.';
            setError(errorMessage);
            toast.error(errorMessage);
            
            // Handle validation errors
            if (err?.response?.data?.errors) {
                const validationErrors = Object.values(err.response.data.errors).flat();
                validationErrors.forEach(msg => toast.error(msg));
            }
        } finally {
            setLoading(false);
        }
    };
    const handleClose = () => {
        setStep('phone');
        setMobile('');
        setOtp('');
        setError('');
        setLoading(false);
        setResendTimer(0);
        onClose();
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;
        
        setOtp('');
        setError('');
        await handleSendOtp();
    };
    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 50 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: 'spring', damping: 25, stiffness: 300 }
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
    return (<AnimatePresence>
      {isOpen && (<motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4" initial="hidden" animate="visible" exit="exit">
          {/* Overlay */}
          <motion.div variants={overlayVariants} className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={handleClose}/>

          {/* Modal */}
          <motion.div variants={modalVariants} className="relative w-full max-w-md bg-card rounded-3xl shadow-elevated overflow-hidden">
            {/* Header */}
            <div className="relative p-6 pb-4">
              <button onClick={handleClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-muted-foreground"/>
              </button>
              
              <div className="text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${type === 'interested' ? 'bg-accent/10' : 'bg-primary/10'}`}>
                  {type === 'interested' ? (<Phone className={`w-8 h-8 text-accent`}/>) : type === 'visit' ? (<Eye className={`w-8 h-8 text-primary`}/>) : (<Lock className={`w-8 h-8 text-primary`}/>)}
                </motion.div>
                <h3 className="text-2xl font-serif font-bold text-primary">
                  {step === 'success'
                ? 'Thank You!'
                : type === 'interested'
                    ? "I'm Interested"
                    : type === 'visit'
                        ? 'Visit Project'
                    : 'Request Document'}
                </h3>
                {step !== 'success' && project && (<p className="text-muted-foreground mt-2">
                    {project.title}
                  </p>)}
              </div>
            </div>

            {/* Content */}
            <div className="px-6 pb-6">
              <AnimatePresence mode="wait">
                {step === 'phone' && (<motion.div key="phone" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Mobile Number
                      </label>
                      <Input type="tel" placeholder="Enter your mobile number" value={mobile} onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setMobile(value);
                          setError('');
                        }} maxLength={10} className="h-12 rounded-xl text-lg" disabled={loading}/>
                      {error && (<p className="text-destructive text-sm mt-2">{error}</p>)}
                    </div>
                    <Button onClick={handleSendOtp} disabled={loading || mobile.length < 10} className="w-full h-12 rounded-xl text-base accent-gradient text-accent-foreground font-semibold">
                      {loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Sending...</>) : 'Send OTP'}
                    </Button>
                  </motion.div>)}

                {step === 'otp' && (<motion.div key="otp" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                    <p className="text-sm text-muted-foreground text-center">
                      Enter the OTP sent to {mobile}
                    </p>
                    <div>
                      <Input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          setOtp(value);
                          setError('');
                        }} maxLength={6} className="h-14 rounded-xl text-2xl text-center tracking-[0.5em] font-mono" disabled={loading} autoFocus/>
                      {error && (<p className="text-destructive text-sm mt-2 text-center">{error}</p>)}
                    </div>
                    <Button onClick={handleVerifyOtp} disabled={loading || otp.length < 4} className="w-full h-12 rounded-xl text-base accent-gradient text-accent-foreground font-semibold">
                      {loading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Verifying...</>) : 'Verify OTP'}
                    </Button>
                    <div className="flex items-center justify-between text-sm">
                      <button onClick={() => {
                          setStep('phone');
                          setOtp('');
                          setError('');
                        }} className="text-muted-foreground hover:text-foreground transition-colors" disabled={loading}>
                        Change number
                      </button>
                      <button onClick={handleResendOtp} disabled={resendTimer > 0 || loading} className={`transition-colors ${resendTimer > 0 || loading ? 'text-muted-foreground cursor-not-allowed' : 'text-primary hover:text-primary/80'}`}>
                        {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                      </button>
                    </div>
                  </motion.div>)}

                {step === 'success' && (<motion.div key="success" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-4">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}>
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4"/>
                    </motion.div>
                    <p className="text-foreground mb-2">
                      {type === 'interested'
                    ? 'We have received your interest!'
                    : type === 'visit'
                        ? 'Verification successful! Redirecting...'
                    : 'Document request submitted!'}
                    </p>
                    <p className="text-sm text-muted-foreground mb-6">
                      We'll reach out to you shortly.
                    </p>
                    <Button onClick={handleClose} variant="outline" className="rounded-xl">
                      Close
                    </Button>
                  </motion.div>)}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>)}
    </AnimatePresence>);
};
export default InteractionModal;
