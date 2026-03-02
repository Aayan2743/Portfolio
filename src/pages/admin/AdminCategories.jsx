import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Folder } from 'lucide-react';
import { usePortfolio } from '@/contexts/PortfolioContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import apiClient from '@/lib/axiosInstance';
import { toast } from 'sonner';
const AdminCategories = () => {
    const { projects } = usePortfolio();
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({ name: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

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
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);
    const openModal = (category) => {
        if (category) {
            setEditingCategory(category);
            setFormData({ name: category.name });
        }
        else {
            setEditingCategory(null);
            setFormData({ name: '' });
        }
        setIsModalOpen(true);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting)
            return;
        const trimmedName = formData.name.trim();
        if (!trimmedName)
            return;
        const payload = { name: trimmedName };
        try {
            setIsSubmitting(true);
            if (editingCategory) {
                const response = await apiClient.post(`admin-dashboard/categories/${editingCategory.id}`, payload);
                if (!response?.data?.success) {
                    throw new Error(response?.data?.message || 'Failed to update category');
                }
                toast.success(response?.data?.message || 'Category updated successfully');
            }
            else {
                const response = await apiClient.post('admin-dashboard/categories', payload);
                if (!response?.data?.success) {
                    throw new Error(response?.data?.message || 'Failed to create category');
                }
                toast.success(response?.data?.message || 'Category created successfully');
            }
            await fetchCategories();
            setIsModalOpen(false);
            setEditingCategory(null);
            setFormData({ name: '' });
        }
        catch (error) {
            toast.error(getErrorMessage(error, editingCategory ? 'Failed to update category' : 'Failed to create category'));
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDelete = async (id) => {
        if (deletingId)
            return;
        const projectCount = projects.filter(p => String(p.categoryId) === String(id)).length;
        if (projectCount > 0) {
            toast.error(`Cannot delete category with ${projectCount} projects`);
            return;
        }
        if (confirm('Are you sure you want to delete this category?')) {
            try {
                setDeletingId(id);
                const response = await apiClient.delete(`admin-dashboard/categories/${id}`);
                if (!response?.data?.success) {
                    throw new Error(response?.data?.message || 'Failed to delete category');
                }
                toast.success(response?.data?.message || 'Category deleted');
                await fetchCategories();
            }
            catch (error) {
                toast.error(getErrorMessage(error, 'Failed to delete category'));
            }
            finally {
                setDeletingId(null);
            }
        }
    };
    return (<div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-2">Categories</h1>
          <p className="text-muted-foreground">Organize your projects into categories</p>
        </div>
        <Button onClick={() => openModal()} className="accent-gradient text-accent-foreground">
          <Plus className="w-4 h-4 mr-2"/>
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => {
            const projectCount = projects.filter(p => String(p.categoryId) === String(category.id)).length;
            return (<motion.div key={category.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-card rounded-2xl p-6 shadow-card hover-lift">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                  <Folder className="w-6 h-6 text-accent"/>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openModal(category)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                    <Edit className="w-4 h-4 text-muted-foreground"/>
                  </button>
                  <button onClick={() => handleDelete(category.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors">
                    <Trash2 className="w-4 h-4 text-destructive"/>
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-serif font-bold text-primary mb-2">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{projectCount} projects</p>
            </motion.div>);
        })}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-primary/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}/>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-card rounded-2xl shadow-elevated p-6">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted">
                <X className="w-5 h-5"/>
              </button>

              <h2 className="text-2xl font-serif font-bold text-primary mb-6">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Category Name</label>
                  <Input required value={formData.name} onChange={(e) => setFormData({ name: e.target.value })} placeholder="e.g., Web Applications"/>
                </div>
                <Button type="submit" className="w-full accent-gradient text-accent-foreground">
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </Button>
              </form>
            </motion.div>
          </motion.div>)}
      </AnimatePresence>
    </div>);
};
export default AdminCategories;
