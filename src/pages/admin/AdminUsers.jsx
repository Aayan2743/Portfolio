import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Search, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import apiClient from '@/lib/axiosInstance';
import { toast } from 'sonner';

const AdminUsers = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage]);

    useEffect(() => {
        // Filter users based on search term
        if (searchTerm.trim()) {
            const filtered = users.filter((user) => {
                const phoneStr = String(user.phone || '');
                const nameStr = (user.name || '').toLowerCase();
                const emailStr = (user.email || '').toLowerCase();
                const searchLower = searchTerm.toLowerCase();
                
                return phoneStr.includes(searchTerm) || 
                       nameStr.includes(searchLower) ||
                       emailStr.includes(searchLower);
            });
            setFilteredUsers(filtered);
            setCurrentPage(1); // Reset to first page on search
        } else {
            setFilteredUsers(users);
        }
    }, [searchTerm, users]);

    const fetchUsers = async (page = 1) => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await apiClient.get(`public/user-dashboard?page=${page}`);
            
            if (response.data.status && response.data.data) {
                const data = response.data.data;
                const usersData = data.data || [];
                setUsers(usersData);
                setFilteredUsers(usersData);
                setTotalUsers(data.total || 0);
                setTotalPages(data.last_page || 1);
                setCurrentPage(data.current_page || 1);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            const errorMessage = err.response?.data?.message || 'Failed to load users';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageClick = (page) => {
        setCurrentPage(page);
    };
    return (<div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-primary mb-2">User Interactions</h1>
        <p className="text-muted-foreground">View all user interactions with your projects</p>
      </div>

      {/* Error State */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-destructive/10 border border-destructive/30 rounded-2xl p-4 text-destructive"
        >
          <p className="font-medium">Error loading users</p>
          <p className="text-sm mt-1">{error}</p>
          <button 
            onClick={fetchUsers}
            className="mt-3 px-4 py-2 bg-destructive text-white rounded-lg text-sm font-medium hover:bg-destructive/90 transition-colors"
          >
            Try Again
          </button>
        </motion.div>
      )}

      {/* Search Filter */}
      <div className="w-full max-w-xs">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"/>
          <Input 
            placeholder="Search..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            className="pl-10 h-9 text-sm"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto mb-4" />
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Users Table */}
          <div>
            <h2 className="text-2xl font-serif font-bold text-primary mb-4">Users Directory</h2>
            <div className="bg-card rounded-2xl shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Phone</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Email</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Projects Interested</th>
                      <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground">Projects Visited</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-muted-foreground">
                          {users.length === 0 ? 'No users found' : 'No users match your search'}
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user, index) => (
                        <motion.tr 
                          key={user.id} 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          transition={{ delay: index * 0.03 }} 
                          className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-4 px-6">
                            <span className="font-medium text-foreground">{user.name || 'N/A'}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-muted-foreground">{user.phone || 'N/A'}</span>
                          </td>
                          <td className="py-4 px-6">
                            <span className="text-muted-foreground text-sm">{user.email || 'N/A'}</span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-wrap gap-2">
                              {user.projects_interested && user.projects_interested.length > 0 ? (
                                user.projects_interested.map((project, idx) => (
                                  <span key={idx} className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-pink-500/10 text-pink-600">
                                    {project}
                                  </span>
                                ))
                              ) : (
                                <span className="text-muted-foreground text-sm">-</span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-wrap gap-2">
                              {user.projects_visited && user.projects_visited.length > 0 ? (
                                user.projects_visited.map((project, idx) => (
                                  <span key={idx} className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-600">
                                    {project}
                                  </span>
                                ))
                              ) : (
                                <span className="text-muted-foreground text-sm">-</span>
                              )}
                            </div>
                          </td>
                        </motion.tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Results Count */}
            {!isLoading && users.length > 0 && (
              <p className="text-sm text-muted-foreground mt-4">
                Showing {filteredUsers.length} of {users.length} users
              </p>
            )}

            {/* Pagination */}
            {!isLoading && totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="h-9 w-9 p-0"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageClick(page)}
                        className="h-9 w-9 p-0 text-xs"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="h-9 w-9 p-0"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>);
};
export default AdminUsers;
