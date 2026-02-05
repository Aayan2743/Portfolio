import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Project {
  id: string;
  title: string;
  thumbnail: string;

  // ✅ NEW (for carousel)
  gallery?: string[];

  // ✅ OPTIONAL (for Visit Project button)
  projectUrl?: string;

  categoryId: string;
  videoUrl?: string;
  description: string;
  features: { title: string; description: string ; image?: string;}[];
  visitCount: number;
  interestedCount: number;
  documentedCount: number;
}


export interface Category {
  id: string;
  name: string;
  icon?: string;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  isActive: boolean;
}

export interface UserInteraction {
  id: string;
  projectId: string;
  type: 'visit' | 'interested' | 'documented';
  mobile: string;
  createdAt: Date;
}

export interface AdminProfile {
  name: string;
  email: string;
  avatar?: string;
}

interface PortfolioContextType {
  projects: Project[];
  categories: Category[];
  banners: Banner[];
  userInteractions: UserInteraction[];
  adminProfile: AdminProfile;
  addProject: (project: Omit<Project, 'id' | 'visitCount' | 'interestedCount' | 'documentedCount'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  updateBanner: (id: string, banner: Partial<Banner>) => void;
  deleteBanner: (id: string) => void;
  incrementVisit: (projectId: string) => void;
  addInteraction: (projectId: string, type: 'interested' | 'documented', mobile: string) => void;
  updateAdminProfile: (profile: Partial<AdminProfile>) => void;
}

const initialCategories: Category[] = [
  { id: '1', name: 'Web Applications' },
  { id: '2', name: 'Mobile Apps' },
  { id: '3', name: 'E-Commerce' },
  { id: '4', name: 'SaaS Platforms' },
];

const initialProjects: Project[] = [
{
  id: '1',
  title: 'FinTech Dashboard',
  categoryId: '1',

  thumbnail:
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900',

  // ✅ THIS IS THE KEY
  gallery: [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900',
    'https://images.unsplash.com/photo-1556155092-8707de31f9c4?w=900',
    'https://images.unsplash.com/photo-1554260570-9140fd3b7614?w=900',
    'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=900',
  ],

  projectUrl: 'https://fintech-demo.vercel.app',

  description:
    'A comprehensive financial technology dashboard with real-time analytics and trading capabilities.',

features: [
  {
    title: 'Real-time Analytics',
    description:
      'Live data visualization with interactive charts and graphs.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900',
  },
  {
    title: 'Trading Module',
    description:
      'Execute trades directly from the dashboard with one-click actions.',
    image:
      'https://images.unsplash.com/photo-1556155092-8707de31f9c4?w=900',
  },
  {
    title: 'Portfolio Management',
    description:
      'Track and manage investment portfolios with AI-powered insights.',
    image:
      'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=900',
  },
],


  visitCount: 245,
  interestedCount: 89,
  documentedCount: 34,
}
,
  {
    id: '2',
    title: 'Health & Fitness App',
    thumbnail: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&h=400&fit=crop',
    categoryId: '2',

      gallery: [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900',
    'https://images.unsplash.com/photo-1556155092-8707de31f9c4?w=900',
    'https://images.unsplash.com/photo-1554260570-9140fd3b7614?w=900',
    'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=900',
  ],

  projectUrl: 'https://fintech-demo.vercel.app',
    description: 'Mobile application for tracking fitness goals, workouts, and nutrition.',
    features: [
      { title: 'Workout Tracking', description: 'Log exercises with detailed metrics and progress tracking.' },
      { title: 'Nutrition Planner', description: 'AI-powered meal planning and calorie tracking.' },
      { title: 'Social Features', description: 'Connect with friends and join fitness challenges.' },
    ],
    visitCount: 312,
    interestedCount: 156,
    documentedCount: 67,
  },
  {
    id: '3',
    title: 'Luxury E-Commerce',
    thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop',
    categoryId: '3',
  gallery: [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900',
    'https://images.unsplash.com/photo-1556155092-8707de31f9c4?w=900',
    'https://images.unsplash.com/photo-1554260570-9140fd3b7614?w=900',
    'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=900',
  ],

  projectUrl: 'https://fintech-demo.vercel.app',

    description: 'Premium online shopping experience for luxury goods and designer products.',
    features: [
      { title: 'Virtual Try-On', description: 'AR-powered feature for trying products virtually.' },
      { title: 'Personalized Recommendations', description: 'AI-driven product suggestions based on preferences.' },
      { title: 'Secure Checkout', description: 'Multi-layer security with cryptocurrency support.' },
    ],
    visitCount: 189,
    interestedCount: 78,
    documentedCount: 45,
  },
  {
    id: '4',
    title: 'Project Management SaaS',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop',
    categoryId: '4',
  gallery: [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900',
    'https://images.unsplash.com/photo-1556155092-8707de31f9c4?w=900',
    'https://images.unsplash.com/photo-1554260570-9140fd3b7614?w=900',
    'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=900',
  ],

  projectUrl: 'https://fintech-demo.vercel.app',

    description: 'Enterprise-grade project management solution with team collaboration features.',
    features: [
      { title: 'Kanban Boards', description: 'Visual project management with drag-and-drop functionality.' },
      { title: 'Time Tracking', description: 'Automated time logging and productivity analytics.' },
      { title: 'Team Chat', description: 'Built-in messaging with file sharing and video calls.' },
    ],
    visitCount: 423,
    interestedCount: 201,
    documentedCount: 89,
  },
  {
    id: '5',
    title: 'Real Estate Platform',
    thumbnail: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&h=400&fit=crop',
    categoryId: '1',
  gallery: [
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900',
    'https://images.unsplash.com/photo-1556155092-8707de31f9c4?w=900',
    'https://images.unsplash.com/photo-1554260570-9140fd3b7614?w=900',
    'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=900',
  ],

  projectUrl: 'https://fintech-demo.vercel.app',

    description: 'Comprehensive real estate platform with virtual tours and smart matching.',
    features: [
      { title: '3D Virtual Tours', description: 'Immersive property tours using VR technology.' },
      { title: 'Smart Matching', description: 'AI algorithm matching buyers with perfect properties.' },
      { title: 'Document Management', description: 'Secure handling of all property documents.' },
    ],
    visitCount: 156,
    interestedCount: 67,
    documentedCount: 28,
  },
  {
    id: '6',
    title: 'Food Delivery App',
    thumbnail: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop',
    categoryId: '2',
    description: 'Fast and reliable food delivery application with real-time tracking.',
    features: [
      { title: 'Live Tracking', description: 'Real-time order tracking with estimated delivery time.' },
      { title: 'Restaurant Partners', description: 'Wide network of restaurants and cuisines.' },
      { title: 'Loyalty Program', description: 'Rewards and discounts for regular customers.' },
    ],
    visitCount: 534,
    interestedCount: 234,
    documentedCount: 112,
  },
];

const initialBanners: Banner[] = [
  {
    id: '1',
    title: 'Crafting Digital Experiences',
    subtitle: 'We build beautiful, functional web applications that drive results.',
    mediaUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    mediaType: 'video',
    isActive: true,
  },
];

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [userInteractions, setUserInteractions] = useState<UserInteraction[]>([]);
  const [adminProfile, setAdminProfile] = useState<AdminProfile>({
    name: 'Admin User',
    email: 'admin@portfolio.com',
  });

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addProject = (project: Omit<Project, 'id' | 'visitCount' | 'interestedCount' | 'documentedCount'>) => {
    setProjects([...projects, { ...project, id: generateId(), visitCount: 0, interestedCount: 0, documentedCount: 0 }]);
  };

  const updateProject = (id: string, updatedProject: Partial<Project>) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updatedProject } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    setCategories([...categories, { ...category, id: generateId() }]);
  };

  const updateCategory = (id: string, updatedCategory: Partial<Category>) => {
    setCategories(categories.map(c => c.id === id ? { ...c, ...updatedCategory } : c));
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
  };

  const addBanner = (banner: Omit<Banner, 'id'>) => {
    setBanners([...banners, { ...banner, id: generateId() }]);
  };

  const updateBanner = (id: string, updatedBanner: Partial<Banner>) => {
    setBanners(banners.map(b => b.id === id ? { ...b, ...updatedBanner } : b));
  };

  const deleteBanner = (id: string) => {
    setBanners(banners.filter(b => b.id !== id));
  };

  const incrementVisit = (projectId: string) => {
    setProjects(projects.map(p => 
      p.id === projectId ? { ...p, visitCount: p.visitCount + 1 } : p
    ));
    setUserInteractions([...userInteractions, {
      id: generateId(),
      projectId,
      type: 'visit',
      mobile: '',
      createdAt: new Date(),
    }]);
  };

  const addInteraction = (projectId: string, type: 'interested' | 'documented', mobile: string) => {
    setProjects(projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          interestedCount: type === 'interested' ? p.interestedCount + 1 : p.interestedCount,
          documentedCount: type === 'documented' ? p.documentedCount + 1 : p.documentedCount,
        };
      }
      return p;
    }));
    setUserInteractions([...userInteractions, {
      id: generateId(),
      projectId,
      type,
      mobile,
      createdAt: new Date(),
    }]);
  };

  const updateAdminProfile = (profile: Partial<AdminProfile>) => {
    setAdminProfile({ ...adminProfile, ...profile });
  };

  return (
    <PortfolioContext.Provider value={{
      projects,
      categories,
      banners,
      userInteractions,
      adminProfile,
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
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
