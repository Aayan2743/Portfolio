import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, Image, Video, X } from 'lucide-react';
import { usePortfolio, Banner } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

const AdminBanners = () => {
  const { banners, addBanner, updateBanner, deleteBanner } = usePortfolio();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    mediaUrl: '',
    mediaType: 'video' as 'image' | 'video',
    isActive: true,
  });

  const openModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || '',
        mediaUrl: banner.mediaUrl,
        mediaType: banner.mediaType,
        isActive: banner.isActive,
      });
    } else {
      setEditingBanner(null);
      setFormData({ title: '', subtitle: '', mediaUrl: '', mediaType: 'video', isActive: true });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBanner) {
      updateBanner(editingBanner.id, formData);
      toast.success('Banner updated successfully');
    } else {
      addBanner(formData);
      toast.success('Banner created successfully');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      deleteBanner(id);
      toast.success('Banner deleted');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Banners</h1>
          <p className="text-muted-foreground">Manage your hero banners</p>
        </div>
        <Button onClick={() => openModal()} className="accent-gradient text-accent-foreground">
          <Plus className="w-4 h-4 mr-2" />
          Add Banner
        </Button>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {banners.map((banner, index) => (
          <motion.div
            key={banner.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card rounded-2xl overflow-hidden shadow-card"
          >
            <div className="relative h-48">
              {banner.mediaType === 'video' ? (
                <video
                  src={banner.mediaUrl}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  autoPlay
                />
              ) : (
                <img
                  src={banner.mediaUrl}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-primary-foreground">
                <h3 className="font-serif font-bold text-xl">{banner.title}</h3>
                {banner.subtitle && (
                  <p className="text-sm text-primary-foreground/80 mt-1">{banner.subtitle}</p>
                )}
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  banner.isActive 
                    ? 'bg-green-500/20 text-green-600' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {banner.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                  banner.mediaType === 'video' 
                    ? 'bg-blue-500/20 text-blue-600' 
                    : 'bg-purple-500/20 text-purple-600'
                }`}>
                  {banner.mediaType === 'video' ? <Video className="w-3 h-3" /> : <Image className="w-3 h-3" />}
                  {banner.mediaType}
                </span>
              </div>
            </div>
            <div className="p-4 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openModal(banner)}
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(banner.id)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-card rounded-2xl shadow-elevated p-6"
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-2xl font-serif font-bold text-primary mb-6">
                {editingBanner ? 'Edit Banner' : 'Create Banner'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Banner title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Subtitle</label>
                  <Input
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="Optional subtitle"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Media URL</label>
                  <Input
                    required
                    value={formData.mediaUrl}
                    onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                    placeholder="https://example.com/media.mp4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Media Type</label>
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, mediaType: 'video' })}
                      className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                        formData.mediaType === 'video'
                          ? 'border-accent bg-accent/10'
                          : 'border-border'
                      }`}
                    >
                      Video
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, mediaType: 'image' })}
                      className={`flex-1 py-2 rounded-lg border-2 transition-all ${
                        formData.mediaType === 'image'
                          ? 'border-accent bg-accent/10'
                          : 'border-border'
                      }`}
                    >
                      Image
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Active</label>
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                </div>
                <Button type="submit" className="w-full accent-gradient text-accent-foreground">
                  {editingBanner ? 'Update Banner' : 'Create Banner'}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminBanners;
