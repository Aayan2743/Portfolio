import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Eye, Heart, FileText, Upload, Image as ImageIcon } from 'lucide-react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
const AdminProjects = () => {
    const { projects, categories, addProject, updateProject, deleteProject } = usePortfolio();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        thumbnail: '',
        projectMainHeading: '',
        categoryId: '',
        description: '',
        features: [{ title: '', description: '', image: '' }],
    });
    const [projectImages, setProjectImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const imagesInputRef = useRef(null);
    const openModal = (project) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title,
                thumbnail: project.thumbnail,
                projectMainHeading: project.projectMainHeading || '',
                categoryId: project.categoryId,
                description: project.description,
                features: project.features.length > 0
                    ? project.features.map(f => ({ ...f, imagePreview: f.image }))
                    : [{ title: '', description: '', image: '' }],
            });
            setProjectImages(project.gallery || []);
            setImagePreviews(project.gallery || []);
        }
        else {
            setEditingProject(null);
            setFormData({
                title: '',
                thumbnail: '',
                projectMainHeading: '',
                categoryId: categories[0]?.id || '',
                description: '',
                features: [{ title: '', description: '', image: '' }],
            });
            setProjectImages([]);
            setImagePreviews([]);
        }
        setIsModalOpen(true);
    };
    const handleImagesUpload = (e) => {
        const files = Array.from(e.target.files || []);
        files.forEach(file => {
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`${file.name} is too large. Max 10MB per image.`);
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target?.result;
                setProjectImages(prev => [...prev, base64]);
                setImagePreviews(prev => [...prev, base64]);
            };
            reader.readAsDataURL(file);
        });
    };
    const removeImage = (index) => {
        setProjectImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };
    const handleFeatureImageUpload = (index, e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image is too large. Max 5MB.');
                return;
            }
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target?.result;
                const newFeatures = [...formData.features];
                newFeatures[index] = { ...newFeatures[index], image: base64, imagePreview: base64 };
                setFormData({ ...formData, features: newFeatures });
            };
            reader.readAsDataURL(file);
        }
    };
    const thumbnailInputRef = useRef(null);
    const handleThumbnailUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Thumbnail must be under 5MB');
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            const result = event.target?.result;
            if (typeof result !== 'string')
                return;
            setFormData({
                ...formData,
                thumbnail: result,
            });
        };
        reader.readAsDataURL(file);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const cleanedFeatures = formData.features
            .filter(f => f.title.trim() !== '')
            .map(({ imagePreview, ...rest }) => rest);
        const projectData = {
            ...formData,
            features: cleanedFeatures,
            gallery: projectImages.length > 0 ? projectImages : undefined,
        };
        if (editingProject) {
            updateProject(editingProject.id, projectData);
            toast.success('Project updated successfully');
        }
        else {
            addProject(projectData);
            toast.success('Project created successfully');
        }
        setIsModalOpen(false);
    };
    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this project?')) {
            deleteProject(id);
            toast.success('Project deleted');
        }
    };
    const addFeature = () => {
        setFormData({
            ...formData,
            features: [...formData.features, { title: '', description: '', image: '' }],
        });
    };
    const updateFeature = (index, field, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setFormData({ ...formData, features: newFeatures });
    };
    const removeFeature = (index) => {
        if (formData.features.length > 1) {
            setFormData({
                ...formData,
                features: formData.features.filter((_, i) => i !== index),
            });
        }
    };
    const removeFeatureImage = (index) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = { ...newFeatures[index], image: '', imagePreview: '' };
        setFormData({ ...formData, features: newFeatures });
    };
    return (<div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Projects</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
        </div>
        <Button onClick={() => openModal()} className="accent-gradient text-accent-foreground">
          <Plus className="w-4 h-4 mr-2"/>
          Add Project
        </Button>
      </div>

      {/* Projects Table */}
      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Project</th>
                <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Category</th>
                <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground">Stats</th>
                <th className="text-right py-4 px-6 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => {
            const category = categories.find(c => c.id === project.categoryId);
            return (<motion.tr key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="border-b border-border last:border-0">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <img src={project.thumbnail} alt={project.title} className="w-16 h-12 rounded-lg object-cover"/>
                        <div>
                          <p className="font-medium text-foreground">{project.title}</p>
                          <p className="text-sm text-muted-foreground line-clamp-1">{project.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm">
                        {category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Eye className="w-4 h-4"/>
                          {project.visitCount}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Heart className="w-4 h-4"/>
                          {project.interestedCount}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <FileText className="w-4 h-4"/>
                          {project.documentedCount}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => openModal(project)}>
                          <Edit className="w-4 h-4"/>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(project.id)} className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4"/>
                        </Button>
                      </div>
                    </td>
                  </motion.tr>);
        })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto">
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}/>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-4xl bg-card rounded-2xl shadow-elevated p-6 my-8 max-h-[90vh] overflow-y-auto">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted">
                <X className="w-5 h-5"/>
              </button>

              <h2 className="text-2xl font-serif font-bold text-primary mb-6">
                {editingProject ? 'Edit Project' : 'Create Project'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title</label>
                    <Input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="Project title"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category"/>
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (<SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="rounded-xl border border-border p-4 bg-muted/20 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 items-start">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Thumbnail Image
                      </label>
                      <input type="file" accept="image/*" ref={thumbnailInputRef} onChange={handleThumbnailUpload} className="hidden"/>
                      {formData.thumbnail ? (<div className="relative w-full h-32 rounded-xl overflow-hidden border border-border bg-muted">
                          <img src={formData.thumbnail} alt="Thumbnail preview" className="w-full h-full object-cover"/>
                          <button type="button" onClick={() => setFormData({ ...formData, thumbnail: "" })} className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground hover:opacity-90">
                            <X className="w-3 h-3"/>
                          </button>
                        </div>) : (<button type="button" onClick={() => thumbnailInputRef.current?.click()} className="w-full h-32 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-accent hover:text-accent transition-colors">
                          <ImageIcon className="w-6 h-6"/>
                          <span className="text-xs">Upload Thumbnail</span>
                        </button>)}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Project Main Heading</label>
                      <Input value={formData.projectMainHeading} onChange={(e) => setFormData({ ...formData, projectMainHeading: e.target.value })} placeholder="Enter main heading for project page"/>
                    </div>
                  </div>
                </div>
                {/* Multiple Images Upload */}
                <div className="rounded-xl border border-border p-4 bg-muted/20">
                  <label className="block text-sm font-medium mb-2">Project Images</label>
                  <input ref={imagesInputRef} type="file" accept="image/*" multiple onChange={handleImagesUpload} className="hidden"/>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {imagePreviews.map((img, index) => (<div key={index} className="relative aspect-square rounded-xl overflow-hidden bg-muted">
                        <img src={img} alt="" className="w-full h-full object-cover"/>
                        <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground">
                          <X className="w-3 h-3"/>
                        </button>
                      </div>))}
                    <button type="button" onClick={() => imagesInputRef.current?.click()} className="aspect-square border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-accent hover:text-accent transition-colors">
                      <ImageIcon className="w-6 h-6"/>
                      <span className="text-xs">Add Images</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Project description" className="min-h-[100px]"/>
                </div>

                {/* Features with Image Upload */}
                <div className="rounded-xl border border-border p-4 bg-muted/20">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium">Features</label>
                    <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                      <Plus className="w-4 h-4 mr-1"/>
                      Add Feature
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {formData.features.map((feature, index) => (<div key={index} className="p-4 rounded-xl bg-background border border-border">
                        <div className="flex flex-col sm:flex-row gap-3">
                          {/* Feature Image */}
                          <div className="flex-shrink-0 self-start">
                            <input type="file" accept="image/*" onChange={(e) => handleFeatureImageUpload(index, e)} className="hidden" id={`feature-image-${index}`}/>
                            {feature.imagePreview || feature.image ? (<div className="relative w-20 h-20 rounded-lg overflow-hidden">
                                <img src={feature.imagePreview || feature.image} alt="" className="w-full h-full object-cover"/>
                                <button type="button" onClick={() => removeFeatureImage(index)} className="absolute top-1 right-1 p-0.5 rounded-full bg-destructive text-destructive-foreground">
                                  <X className="w-3 h-3"/>
                                </button>
                              </div>) : (<label htmlFor={`feature-image-${index}`} className="w-20 h-20 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-accent hover:text-accent transition-colors cursor-pointer">
                                <Upload className="w-5 h-5"/>
                                <span className="text-[10px]">Image</span>
                              </label>)}
                          </div>
                          {/* Feature Fields */}
                          <div className="flex-1 space-y-2">
                            <Input value={feature.title} onChange={(e) => updateFeature(index, 'title', e.target.value)} placeholder="Feature title"/>
                            <Textarea value={feature.description} onChange={(e) => updateFeature(index, 'description', e.target.value)} placeholder="Feature description" className="min-h-[60px]"/>
                          </div>
                          {/* Remove Button */}
                          <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(index)} className="self-end sm:self-start flex-shrink-0 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4"/>
                          </Button>
                        </div>
                      </div>))}
                  </div>
                </div>

                <Button type="submit" className="w-full accent-gradient text-accent-foreground">
                  {editingProject ? 'Update Project' : 'Create Project'}
                </Button>
              </form>
            </motion.div>
          </motion.div>)}
      </AnimatePresence>
    </div>);
};
export default AdminProjects;
