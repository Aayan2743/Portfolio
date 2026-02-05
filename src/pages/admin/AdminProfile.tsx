import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Camera } from 'lucide-react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const AdminProfile = () => {
  const { adminProfile, updateAdminProfile } = usePortfolio();
  const [formData, setFormData] = useState({
    name: adminProfile.name,
    email: adminProfile.email,
    avatar: adminProfile.avatar || '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateAdminProfile(formData);
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your admin profile information</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-2xl shadow-card p-8"
      >
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center overflow-hidden">
              {formData.avatar ? (
                <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-10 h-10 text-accent" />
              )}
            </div>
            {isEditing && (
              <div className="absolute inset-0 rounded-full bg-primary/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="w-6 h-6 text-primary-foreground" />
              </div>
            )}
          </div>
          <h2 className="text-xl font-serif font-bold text-primary mt-4">{adminProfile.name}</h2>
          <p className="text-muted-foreground">{adminProfile.email}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <Input
              required
              disabled={!isEditing}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input
              required
              type="email"
              disabled={!isEditing}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-12"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Avatar URL</label>
            <Input
              disabled={!isEditing}
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              placeholder="https://example.com/avatar.jpg"
              className="h-12"
            />
          </div>

          <div className="flex gap-4">
            {isEditing ? (
              <>
                <Button type="submit" className="flex-1 accent-gradient text-accent-foreground">
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: adminProfile.name,
                      email: adminProfile.email,
                      avatar: adminProfile.avatar || '',
                    });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full accent-gradient text-accent-foreground"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminProfile;
