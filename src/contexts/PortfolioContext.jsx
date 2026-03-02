import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import apiClient from '@/lib/axiosInstance';

const initialBanners = [
    {
        id: '1',
        title: 'Crafting Digital Experiences',
        subtitle: 'We build beautiful, functional web & Mobile  applications that drive results.',
        mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
        mediaType: 'video',
        isActive: true,
    },
];

const PortfolioContext = createContext(undefined);
const ADMIN_SESSION_KEY = 'portfolio_admin_session';
const ADMIN_PROFILE_GET_ENDPOINT = import.meta.env.VITE_ADMIN_PROFILE_GET_ENDPOINT || '';
const ADMIN_PROFILE_UPDATE_ENDPOINT = import.meta.env.VITE_ADMIN_PROFILE_UPDATE_ENDPOINT || '';

const mapProjectFromApi = (project) => ({
    id: String(project.id),
    title: project.title || '',
    slug: project.slug || '',
    categoryId: String(project.category_id ?? ''),
    categoryName: project.category?.name || '',
    thumbnail: project.thumbnail_image_url || '',
    gallery: [project.project_image_url, project.thumbnail_image_url].filter(Boolean),
    projectMainHeading: project.main_heading || '',
    projectUrl: project.project_url || '',
    description: project.description || '',
    features: Array.isArray(project.features)
        ? project.features.map(feature => ({
            title: feature.title || '',
            description: feature.description || '',
            image: feature.image_url || '',
        }))
        : [],
    visitCount: Number(project.visit_count ?? 0),
    interestedCount: Number(project.interested_count ?? 0),
    documentedCount: Number(project.documented_count ?? 0),
    createdAt: project.created_at || '',
    updatedAt: project.updated_at || '',
});

const mapCategoriesFromProjects = (projects) => {
    const categoryMap = new Map();
    projects.forEach((project) => {
        const categoryId = String(project.category?.id ?? project.category_id ?? '');
        if (!categoryId)
            return;
        if (!categoryMap.has(categoryId)) {
            categoryMap.set(categoryId, {
                id: categoryId,
                name: project.category?.name || `Category ${categoryId}`,
            });
        }
    });
    return Array.from(categoryMap.values());
};

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
    if (typeof validationErrors === 'string') {
        return validationErrors;
    }
    if (error?.message) {
        return error.message;
    }
    return fallbackMessage;
};

const firstString = (...values) => {
    const validValue = values.find(value => typeof value === 'string' && value.trim().length > 0);
    return validValue ? validValue.trim() : '';
};

const mapAdminProfileFromApi = (payload = {}) => ({
    name: firstString(payload.name, payload.full_name, payload.username),
    email: firstString(payload.email),
    avatar: firstString(payload.avatar, payload.avatar_url, payload.profile_image, payload.profile_image_url, payload.image, payload.image_url),
});

const extractApiPayload = (data) => data?.data?.user || data?.data || data?.user || data || {};

const getSessionAdminProfile = () => {
    if (typeof window === 'undefined') {
        return null;
    }
    try {
        const rawSession = localStorage.getItem(ADMIN_SESSION_KEY);
        if (!rawSession) {
            return null;
        }
        const parsedSession = JSON.parse(rawSession);
        const profile = mapAdminProfileFromApi(parsedSession);
        if (!profile.name && !profile.email && !profile.avatar) {
            return null;
        }
        return profile;
    }
    catch {
        return null;
    }
};

export const PortfolioProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [banners, setBanners] = useState(initialBanners);
    const [userInteractions, setUserInteractions] = useState([]);
    const [isProjectsLoading, setIsProjectsLoading] = useState(true);
    const [projectsError, setProjectsError] = useState('');
    const [adminProfile, setAdminProfile] = useState(() => {
        const sessionAdminProfile = getSessionAdminProfile();
        return {
            name: sessionAdminProfile?.name || 'Admin User',
            email: sessionAdminProfile?.email || 'admin@portfolio.com',
            avatar: sessionAdminProfile?.avatar || '',
        };
    });

    const generateId = () => Math.random().toString(36).slice(2, 11);

    const refreshPublicProjects = useCallback(async () => {
        try {
            setIsProjectsLoading(true);
            setProjectsError('');

            // Fetch projects and categories in parallel
            const [projectsResponse, categoriesResponse] = await Promise.all([
                apiClient.get('public/projects'),
                apiClient.get('public/categories')
            ]);

            const apiProjects = projectsResponse?.data?.data?.data || [];
            const apiCategories = categoriesResponse?.data?.data || [];

            setProjects(apiProjects.map(mapProjectFromApi));
            
            // Map categories from API
            const mappedCategories = apiCategories.map(cat => ({
                id: String(cat.id),
                name: cat.name || '',
                slug: cat.slug || '',
            }));
            
            setCategories(mappedCategories);
        }
        catch (error) {
            setProjects([]);
            setCategories([]);
            setProjectsError(getErrorMessage(error, 'Failed to load projects'));
        }
        finally {
            setIsProjectsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshPublicProjects();
    }, [refreshPublicProjects]);

    const addProject = (project) => {
        setProjects(prev => [...prev, { ...project, id: generateId(), visitCount: 0, interestedCount: 0, documentedCount: 0 }]);
    };

    const updateProject = (id, updatedProject) => {
        setProjects(prev => prev.map(project => project.id === id ? { ...project, ...updatedProject } : project));
    };

    const deleteProject = (id) => {
        setProjects(prev => prev.filter(project => project.id !== id));
    };

    const addCategory = (category) => {
        setCategories(prev => [...prev, { ...category, id: generateId() }]);
    };

    const updateCategory = (id, updatedCategory) => {
        setCategories(prev => prev.map(category => category.id === id ? { ...category, ...updatedCategory } : category));
    };

    const deleteCategory = (id) => {
        setCategories(prev => prev.filter(category => category.id !== id));
    };

    const addBanner = (banner) => {
        setBanners(prev => [...prev, { ...banner, id: generateId() }]);
    };

    const updateBanner = (id, updatedBanner) => {
        setBanners(prev => prev.map(banner => banner.id === id ? { ...banner, ...updatedBanner } : banner));
    };

    const deleteBanner = (id) => {
        setBanners(prev => prev.filter(banner => banner.id !== id));
    };

    const incrementVisit = (projectId) => {
        setProjects(prev => prev.map(project => String(project.id) === String(projectId)
            ? { ...project, visitCount: Number(project.visitCount || 0) + 1 }
            : project));
        setUserInteractions(prev => [...prev, {
                id: generateId(),
                projectId,
                type: 'visit',
                mobile: '',
                createdAt: new Date(),
            }]);
    };

    const addInteraction = (projectId, type, mobile) => {
        setProjects(prev => prev.map(project => {
            if (String(project.id) === String(projectId)) {
                return {
                    ...project,
                    visitCount: type === 'visit' ? Number(project.visitCount || 0) + 1 : Number(project.visitCount || 0),
                    interestedCount: type === 'interested' ? Number(project.interestedCount || 0) + 1 : Number(project.interestedCount || 0),
                    documentedCount: type === 'documented' ? Number(project.documentedCount || 0) + 1 : Number(project.documentedCount || 0),
                };
            }
            return project;
        }));

        setUserInteractions(prev => [...prev, {
                id: generateId(),
                projectId,
                type,
                mobile,
                createdAt: new Date(),
            }]);
    };

    const syncAdminSessionProfile = useCallback((nextProfile) => {
        if (typeof window === 'undefined') {
            return;
        }
        try {
            const rawSession = localStorage.getItem(ADMIN_SESSION_KEY);
            if (!rawSession) {
                return;
            }
            const parsedSession = JSON.parse(rawSession);
            const updatedSession = {
                ...parsedSession,
                name: nextProfile.name,
                email: nextProfile.email,
            };
            if (nextProfile.avatar) {
                updatedSession.avatar = nextProfile.avatar;
            }
            localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(updatedSession));
        }
        catch {
        }
    }, []);

    const applyAdminProfilePatch = useCallback((patch) => {
        setAdminProfile(prev => {
            const nextProfile = { ...prev, ...patch };
            syncAdminSessionProfile(nextProfile);
            return nextProfile;
        });
    }, [syncAdminSessionProfile]);

    const fetchAdminProfile = useCallback(async () => {
        if (!ADMIN_PROFILE_GET_ENDPOINT) {
            const sessionProfile = getSessionAdminProfile();
            if (sessionProfile) {
                applyAdminProfilePatch(sessionProfile);
            }
            return sessionProfile;
        }
        try {
            const response = await apiClient.get(ADMIN_PROFILE_GET_ENDPOINT);
            const apiProfile = mapAdminProfileFromApi(extractApiPayload(response?.data));
            if (apiProfile.name || apiProfile.email || apiProfile.avatar) {
                applyAdminProfilePatch(apiProfile);
            }
            return apiProfile;
        }
        catch (error) {
            throw new Error(getErrorMessage(error, 'Failed to load profile'));
        }
    }, [applyAdminProfilePatch]);

    const updateAdminProfile = async (profile) => {
        const patch = {};
        if (profile instanceof FormData) {
            const name = profile.get('name');
            const email = profile.get('email');
            const avatar = profile.get('avatar');
            if (typeof name === 'string') {
                patch.name = name;
            }
            if (typeof email === 'string') {
                patch.email = email;
            }
            if (typeof avatar === 'string') {
                patch.avatar = avatar;
            }
            if (avatar instanceof File && typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function') {
                patch.avatar = URL.createObjectURL(avatar);
            }
        }
        else if (profile && typeof profile === 'object') {
            if (typeof profile.name === 'string') {
                patch.name = profile.name;
            }
            if (typeof profile.email === 'string') {
                patch.email = profile.email;
            }
            if (typeof profile.avatar === 'string') {
                patch.avatar = profile.avatar;
            }
        }
        if (ADMIN_PROFILE_UPDATE_ENDPOINT) {
            try {
                const response = await apiClient.post(ADMIN_PROFILE_UPDATE_ENDPOINT, profile);
                const apiPatch = mapAdminProfileFromApi(extractApiPayload(response?.data));
                const mergedPatch = { ...patch, ...apiPatch };
                applyAdminProfilePatch(mergedPatch);
                return mergedPatch;
            }
            catch (error) {
                throw new Error(getErrorMessage(error, 'Failed to update profile'));
            }
        }
        applyAdminProfilePatch(patch);
        return patch;
    };

    return (<PortfolioContext.Provider value={{
            projects,
            categories,
            banners,
            userInteractions,
            adminProfile,
            isProjectsLoading,
            projectsError,
            refreshPublicProjects,
            fetchAdminProfile,
            addProject,
            updateProject,
            deleteProject,
            addCategory,
            updateCategory,
            deleteCategory,
            addBanner,
            updateBanner,
            deleteBanner,
            incrementVisit,
            addInteraction,
            updateAdminProfile,
        }}>
      {children}
    </PortfolioContext.Provider>);
};

export const usePortfolio = () => {
    const context = useContext(PortfolioContext);
    if (!context) {
        throw new Error('usePortfolio must be used within a PortfolioProvider');
    }
    return context;
};
