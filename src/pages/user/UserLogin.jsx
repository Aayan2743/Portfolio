import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, User, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/portfolio/Navbar';
import Footer from '@/components/portfolio/Footer';
import { toast } from 'sonner';
const UserLogin = () => {
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { userLogin, userRegister, adminLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const userFrom = location.state?.from?.pathname || '/user';
    const adminFrom = '/admin';
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        let success;
        if (isAdminMode) {
            success = await adminLogin(email, password);
            if (success) {
                toast.success('Welcome back, Admin!');
                navigate(adminFrom, { replace: true });
            }
            else {
                toast.error('Invalid credentials. Please try again.');
            }
        }
        else if (isRegister) {
            success = await userRegister(email, password, name);
            if (success) {
                toast.success('Account created successfully!');
                navigate(userFrom, { replace: true });
            }
            else {
                toast.error('Email already exists. Please login instead.');
            }
        }
        else {
            success = await userLogin(email, password);
            if (success) {
                toast.success('Welcome back!');
                navigate(userFrom, { replace: true });
            }
            else {
                toast.error('Invalid credentials. Please try again.');
            }
        }
        setIsLoading(false);
    };
    return (<div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-16 px-4 min-h-[calc(100vh-220px)] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
          <div className="bg-card rounded-2xl shadow-elevated p-8">
          <div className="mb-6">
            <div className="grid grid-cols-2 p-1 rounded-xl bg-muted">
              <button type="button" onClick={() => {
            setIsAdminMode(false);
            setIsRegister(false);
        }} className={`py-2 rounded-lg text-sm font-medium transition-all ${!isAdminMode ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>
                User
              </button>
              <button type="button" onClick={() => {
            setIsAdminMode(true);
            setIsRegister(false);
        }} className={`py-2 rounded-lg text-sm font-medium transition-all ${isAdminMode ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}>
                Admin
              </button>
            </div>
          </div>
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isAdminMode ? 'bg-primary/10' : 'bg-accent/10'}`}>
              {isAdminMode ? <Shield className="w-8 h-8 text-primary"/> : <User className="w-8 h-8 text-accent"/>}
            </div>
            <h1 className="text-3xl font-serif font-bold text-primary mb-2">
              {isAdminMode ? 'Admin Login' : isRegister ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-muted-foreground">
              {isAdminMode
            ? 'Enter your credentials to access the admin panel'
            : isRegister
            ? 'Sign up to track your interested projects'
            : 'Sign in to access your dashboard'}
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isAdminMode && isRegister && (<motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
                  <Input type="text" required={!isAdminMode && isRegister} value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="pl-10"/>
                </div>
              </motion.div>)}

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
                <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="pl-10"/>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
                <Input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="pl-10 pr-10" minLength={isAdminMode ? undefined : 6}/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Button type="submit" disabled={isLoading} className="w-full accent-gradient text-accent-foreground h-12 text-base font-medium">
                {isLoading ? (<motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full"/>) : isAdminMode ? ('Sign In') : isRegister ? ('Create Account') : ('Sign In')}
              </Button>
            </motion.div>
          </form>

          {/* Toggle mode */}
          {!isAdminMode && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-6 text-center">
              <p className="text-muted-foreground">
                {isRegister ? 'Already have an account?' : "Don't have an account?"}
                <button type="button" onClick={() => setIsRegister(!isRegister)} className="ml-2 text-accent hover:underline font-medium">
                  {isRegister ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </motion.div>)}

          {/* Back to site */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-6 text-center">
            <button onClick={() => navigate('/')} className="text-sm text-muted-foreground hover:text-accent transition-colors">
              ← Back to website
            </button>
          </motion.div>
          </div>
      </motion.div>
      </div>
      <Footer />
    </div>);
};
export default UserLogin;
