import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, User, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { adminLogin } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/admin';
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const success = await adminLogin(username, password);
        if (success) {
            toast.success('Welcome back, Admin!');
            navigate(from, { replace: true });
        }
        else {
            toast.error('Invalid credentials. Please try again.');
        }
        setIsLoading(false);
    };
    return (<div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-elevated p-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Shield className="w-8 h-8 text-primary"/>
            </div>
            <h1 className="text-3xl font-serif font-bold text-primary mb-2">Admin Login</h1>
            <p className="text-muted-foreground">Enter your credentials to access the admin panel</p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <label className="block text-sm font-medium text-foreground mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
                <Input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin" className="pl-10"/>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
                <Input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="pl-10 pr-10"/>
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}
                </button>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Button type="submit" disabled={isLoading} className="w-full accent-gradient text-accent-foreground h-12 text-base font-medium">
                {isLoading ? (<motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-5 h-5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full"/>) : ('Sign In')}
              </Button>
            </motion.div>
          </form>

          {/* Demo credentials hint */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-6 p-4 rounded-xl bg-muted">
            <p className="text-sm text-muted-foreground text-center">
              <strong>Admin login uses your backend API credentials.</strong>
            </p>
          </motion.div>

          {/* Back to site */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-6 text-center">
            <button onClick={() => navigate('/')} className="text-sm text-muted-foreground hover:text-accent transition-colors">
              ← Back to website
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>);
};
export default AdminLogin;
