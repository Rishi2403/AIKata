import { useEffect, useState } from 'react';
import { useSweetsStore } from '../store/sweetsStore';
import { useAuthStore } from '../store/authStore';
import type { Sweet } from '../types';
import SweetCard from '../components/sweets/SweetCard';
import SweetModal from '../components/sweets/SweetModal';
import { Search, Filter, LogOut, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { sweets, isLoading, fetchSweets, searchSweets, purchaseSweet } = useSweetsStore();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [selectedSweet, setSelectedSweet] = useState<Sweet | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);

  const handleSearch = () => {
    if (searchTerm || categoryFilter) {
      searchSweets({
        name: searchTerm || undefined,
        category: categoryFilter || undefined,
      });
    } else {
      fetchSweets();
    }
  };

  const handlePurchase = async (quantity: number) => {
    if (selectedSweet) {
      await purchaseSweet(selectedSweet.id, quantity);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const categories = Array.from(new Set(sweets.map(s => s.category)));

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-2xl">🍬</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Sweet Shop
              </h1>
              <p className="text-sm text-gray-600">Welcome, {user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user?.role === 'ADMIN' && (
              <button
                onClick={() => navigate('/admin')}
                className="btn-secondary flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Admin Panel
              </button>
            )}
            <button onClick={handleLogout} className="btn-secondary flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Filter */}
        <div className="mb-8 card">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search sweets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="input-field pl-11"
              />
            </div>
            <div className="relative md:w-64">
              <Filter className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="input-field pl-11 appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <button onClick={handleSearch} className="btn-primary">
              Search
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}

        {/* Sweets Grid */}
        {!isLoading && sweets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sweets.map((sweet) => (
              <SweetCard
                key={sweet.id}
                sweet={sweet}
                onPurchase={setSelectedSweet}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && sweets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍬</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No sweets found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </main>

      {/* Purchase Modal */}
      {selectedSweet && (
        <SweetModal
          sweet={selectedSweet}
          onClose={() => setSelectedSweet(null)}
          onPurchase={handlePurchase}
        />
      )}
    </div>
  );
}