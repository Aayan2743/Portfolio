import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Eye, Heart, FileText, Upload, Image as ImageIcon, Search, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import apiClient from '@/lib/axiosInstance';
import { toast } from 'sonner';

const EMPTY_FEATURE = {
    title: '',
    description: '',
    image: '',
    imagePreview: '',
    imageFile: null,
};

const mapProjectFromApi = (project) => ({
    id: project.id,
    title: project.title || '',
    thumbnail: project.thumbnail_image_url || '',
    projectImageUrl: project.project_image_url || '',
    projectMainHeading: project.main_heading || '',
    categoryId: String(project.category_id ?? ''),
    description: project.description || '',
    features: Array.isArray(project.features) && project.features.length > 0
        ? project.features.map(feature => ({
            id: feature.id,
            title: feature.title || '',
            description: feature.description || '',
            image: feature.image_url || '',
            imagePreview: feature.image_url || '',
            imageFile: null,
        }))
        : [{ ...EMPTY_FEATURE }],
    visitCount: 0,
    interestedCount: 0,
    documentedCount: 0,
});

const isApiSuccess = (response) => {
    const payload = response?.data;
    if (typeof payload?.status === 'boolean')
        return payload.status;
    if (typeof payload?.success === 'boolean')
        return payload.success;
    return true;
};

const getApiMessage = (response, fallbackMessage) => response?.data?.message || fallbackMessage;

const getErrorMessage = (error, fallbackMessage) => {
    const responseData = error?.response?.data;
    if (responseData?.message) {
        return responseData.message;
    }
    const validationErrors = responseData?.errors;
    if (validationErrors && typeof validationErrors === 'object') {
        const firstErrorGroup = Object.values(validationErrors)[0];
        if (Array.isArray(firstErrorGroup) && firstErrorGroup.length > 0) {
            return firstErrorGroup[0];
        }
        if (typeof firstErrorGroup === 'string') {
            return firstErrorGroup;
        }
    }
    if (error?.message) {
        return error.message;
    }
    return fallbackMessage;
};

const AdminProjects = () => {
    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingProjectId, setDeletingProjectId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        thumbnail: '',
        projectMainHeading: '',
        categoryId: '',
        description: '',
        features: [{ ...EMPTY_FEATURE }],
    });
    const [projectImageFile, setProjectImageFile] = useState(null);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [thumbnailFile, setThumbnailFile] = useState(null);

    const imagesInputRef = useRef(null);
    const thumbnailInputRef = useRef(null);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await apiClient.get('admin-dashboard/categories');
            const apiCategories = response?.data?.data?.data || [];
            setCategories(apiCategories);
        }
        catch (error) {
            toast.error(getErrorMessage(error, 'Failed to load categories'));
        }
    }, []);

    const fetchProjects = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await apiClient.get('admin-dashboard/projects');
            const apiProjects = response?.data?.data?.data || [];
            setProjects(apiProjects.map(mapProjectFromApi));
        }
        catch (error) {
            toast.error(getErrorMessage(error, 'Failed to load projects'));
        }
        finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
        fetchProjects();
    }, [fetchCategories, fetchProjects]);

    const openModal = (project) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title,
                thumbnail: project.thumbnail || '',
                projectMainHeading: project.projectMainHeading || '',
                categoryId: String(project.categoryId || ''),
                description: project.description,
                features: project.features.length > 0
                    ? project.features.map(feature => ({
                        title: feature.title || '',
                        description: feature.description || '',
                        image: feature.image || '',
                        imagePreview: feature.imagePreview || feature.image || '',
                        imageFile: null,
                    }))
                    : [{ ...EMPTY_FEATURE }],
            });
            setThumbnailFile(null);
            setProjectImageFile(null);
            setImagePreviews(project.projectImageUrl ? [project.projectImageUrl] : []);
        }
        else {
            setEditingProject(null);
            setFormData({
                title: '',
                thumbnail: '',
                projectMainHeading: '',
                categoryId: categories[0] ? String(categories[0].id) : '',
                description: '',
                features: [{ ...EMPTY_FEATURE }],
            });
            setThumbnailFile(null);
            setProjectImageFile(null);
            setImagePreviews([]);
        }
        setIsModalOpen(true);
    };

    const handleImagesUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Project image must be under 10MB');
            return;
        }
        setProjectImageFile(file);
        setImagePreviews([URL.createObjectURL(file)]);
    };

    const removeImage = () => {
        setProjectImageFile(null);
        setImagePreviews([]);
    };

    const handleFeatureImageUpload = (index, e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image is too large. Max 5MB.');
            return;
        }
        const newFeatures = [...formData.features];
        newFeatures[index] = {
            ...newFeatures[index],
            imageFile: file,
            imagePreview: URL.createObjectURL(file),
        };
        setFormData({ ...formData, features: newFeatures });
    };

    const handleThumbnailUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Thumbnail must be under 5MB');
            return;
        }
        setThumbnailFile(file);
        setFormData({
            ...formData,
            thumbnail: URL.createObjectURL(file),
        });
    };

    const buildProjectFormData = (isUpdate) => {
        const payload = new FormData();
        payload.append('title', formData.title.trim());
        payload.append('category_id', String(Number(formData.categoryId)));
        payload.append('main_heading', formData.projectMainHeading.trim());
        payload.append('description', formData.description.trim());

        if (!isUpdate || thumbnailFile) {
            if (thumbnailFile) {
                payload.append('thumbnail_image', thumbnailFile);
            }
        }

        if (!isUpdate || projectImageFile) {
            if (projectImageFile) {
                payload.append('project_image', projectImageFile);
            }
        }

        const cleanedFeatures = formData.features.filter(feature => feature.title.trim() || feature.description.trim() || feature.imageFile);
        if (cleanedFeatures.length > 0) {
            cleanedFeatures.forEach((feature, index) => {
                payload.append(`features[${index}][title]`, feature.title.trim());
                payload.append(`features[${index}][description]`, feature.description.trim());
                if (feature.imageFile) {
                    payload.append(`features[${index}][image]`, feature.imageFile);
                }
            });
        }
        else if (!isUpdate) {
            payload.append('features', '[]');
        }

        return payload;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting)
            return;

        if (!formData.title.trim()) {
            toast.error('Title is required');
            return;
        }
        if (!formData.categoryId) {
            toast.error('Category is required');
            return;
        }
        if (!formData.projectMainHeading.trim()) {
            toast.error('Main heading is required');
            return;
        }
        if (!formData.description.trim()) {
            toast.error('Description is required');
            return;
        }
        if (!editingProject && !thumbnailFile) {
            toast.error('Thumbnail image is required');
            return;
        }
        if (!editingProject && !projectImageFile) {
            toast.error('Project image is required');
            return;
        }

        try {
            setIsSubmitting(true);
            const payload = buildProjectFormData(Boolean(editingProject));
            let response;

            if (editingProject) {
                response = await apiClient.post(`admin-dashboard/projects/update/${editingProject.id}`, payload);
                if (!isApiSuccess(response)) {
                    throw new Error(getApiMessage(response, 'Failed to update project'));
                }
                toast.success(getApiMessage(response, 'Project updated successfully'));
            }
            else {
                response = await apiClient.post('admin-dashboard/projects/store', payload);
                if (!isApiSuccess(response)) {
                    throw new Error(getApiMessage(response, 'Failed to create project'));
                }
                toast.success(getApiMessage(response, 'Project created successfully'));
            }

            await fetchProjects();
            setIsModalOpen(false);
            setEditingProject(null);
            setThumbnailFile(null);
            setProjectImageFile(null);
            setImagePreviews([]);
            setFormData({
                title: '',
                thumbnail: '',
                projectMainHeading: '',
                categoryId: categories[0] ? String(categories[0].id) : '',
                description: '',
                features: [{ ...EMPTY_FEATURE }],
            });
        }
        catch (error) {
            toast.error(getErrorMessage(error, editingProject ? 'Failed to update project' : 'Failed to create project'));
        }
        finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (deletingProjectId)
            return;
        if (!confirm('Are you sure you want to delete this project?')) {
            return;
        }

        try {
            setDeletingProjectId(id);
            let response;
            try {
                response = await apiClient.delete(`admin-dashboard/projects/delete/${id}`);
            }
            catch (error) {
                if (error?.response?.status === 405) {
                    response = await apiClient.post(`admin-dashboard/projects/delete/${id}`);
                }
                else {
                    throw error;
                }
            }

            if (!isApiSuccess(response)) {
                throw new Error(getApiMessage(response, 'Failed to delete project'));
            }
            toast.success(getApiMessage(response, 'Project deleted'));
            await fetchProjects();
        }
        catch (error) {
            toast.error(getErrorMessage(error, 'Failed to delete project'));
        }
        finally {
            setDeletingProjectId(null);
        }
    };

    const addFeature = () => {
        setFormData({
            ...formData,
            features: [...formData.features, { ...EMPTY_FEATURE }],
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
        newFeatures[index] = { ...newFeatures[index], image: '', imagePreview: '', imageFile: null };
        setFormData({ ...formData, features: newFeatures });
    };

    // Filter and paginate projects
    const filteredProjects = projects.filter(project => {
        const searchLower = searchQuery.toLowerCase();
        const category = categories.find(c => String(c.id) === String(project.categoryId));
        return (
            project.title.toLowerCase().includes(searchLower) ||
            project.description.toLowerCase().includes(searchLower) ||
            category?.name.toLowerCase().includes(searchLower)
        );
    });

    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProjects = filteredProjects.slice(startIndex, endIndex);

    // Reset to page 1 when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

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

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-10"
        />
      </div>

      {/* Projects Table */}
      <div className="bg-card rounded-2xl shadow-card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : (
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
                {currentProjects.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-muted-foreground">
                      {searchQuery ? 'No projects found matching your search' : 'No projects yet'}
                    </td>
                  </tr>
                ) : (
                  currentProjects.map((project, index) => {
            const category = categories.find(c => String(c.id) === String(project.categoryId));
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
                          {project.visitCount ?? 0}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Heart className="w-4 h-4"/>
                          {project.interestedCount ?? 0}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <FileText className="w-4 h-4"/>
                          {project.documentedCount ?? 0}
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
          })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && filteredProjects.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredProjects.length)} of {filteredProjects.length} projects
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "accent-gradient text-accent-foreground" : ""}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
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
                        {categories.map((category) => (<SelectItem key={category.id} value={String(category.id)}>
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
                          <button type="button" onClick={() => {
                    setThumbnailFile(null);
                    setFormData({ ...formData, thumbnail: '' });
                }} className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-destructive-foreground hover:opacity-90">
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
                <Button type="submit" className="w-full accent-gradient text-accent-foreground" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {isSubmitting ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
                </Button>
              </form>
            </motion.div>
          </motion.div>)}
      </AnimatePresence>
    </div>);
};
export default AdminProjects;
