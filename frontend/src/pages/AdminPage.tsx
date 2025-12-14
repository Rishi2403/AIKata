import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSweetsStore } from '../store/sweetsStore';
import { useAuthStore } from '../store/authStore';
import type { Sweet, CreateSweetDto, UpdateSweetDto } from '../types';
import { sweetsService } from '../services/sweets.service';
import AdminSweetCard from '../components/admin/AdminSweetCard';
import AddSweetModal from '../components/admin/AddSweetModal';
import EditSweetModal from '../components/admin/EditSweetModal';
import RestockModal from '../components/admin/RestockModal';
import { Plus, Home, Shield, TrendingUp, Package, DollarSign } from 'lucide-react';

export default function AdminPage() {
  const { sweets, fetchSweets } = useSweetsStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [restockingSweet, setRestockingSweet] = useState<Sweet | null>(null);
  const [deletingSweet, setDeletingSweet] = useState<Sweet | null>(null);

  useEffect(() => {
    if (user?.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchSweets();
  }, [user, navigate, fetchSweets]);

  const handleAddSweet = async (data: CreateSweetDto) => {
    await sweetsService.create(data);
    await fetchSweets();
  };

  const handleUpdateSweet = async (id: string, data: UpdateSweetDto) => {
    await sweetsService.update(id, data);
    await fetchSweets();
  };

  const handleDeleteSweet = async (sweet: Sweet) => {
    if (window.confirm(`Are you sure you want to delete "${sweet.name}"?`)) {
      await sweetsService.delete(sweet.id);
      await fetchSweets();
      setDeletingSweet(null);
    }
  };

  const handleRestock = async (quantity: number) => {
    if (restockingSweet) {
      await sweetsService.restock(restockingSweet.id, quantity);
      await fetchSweets();
    }
  };

  // Calculate stats
  const totalSweets = sweets.length;
  const totalValue = sweets.reduce((sum, s) => sum + (s.price * s.quantity), 0);
  const lowStockCount = sweets.filter(s => s.quantity < 20).length;
  const avgPrice = totalSweets > 0 ? sweets.reduce((sum, s) => sum + s.price, 0) / totalSweets : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-sm text-gray-600">Manage your sweet inventory</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="btn-secondary flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Back to Shop
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Sweets</span>
              <Package className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{totalSweets}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Total Value</span>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">${totalValue.toFixed(2)}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Low Stock</span>
              <TrendingUp className="w-8 h-8 text-red-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">{lowStockCount}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-600 text-sm">Avg Price</span>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-gray-800">${avgPrice.toFixed(2)}</p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Sweet Inventory</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Sweet
          </button>
        </div>

        {/* Sweets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sweets.map((sweet) => (
            <AdminSweetCard
              key={sweet.id}
              sweet={sweet}
              onEdit={setEditingSweet}
              onDelete={handleDeleteSweet}
              onRestock={setRestockingSweet}
            />
          ))}
        </div>

        {/* Empty State */}
        {sweets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍬</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No sweets yet</h3>
            <p className="text-gray-500 mb-4">Add your first sweet to get started!</p>
            <button onClick={() => setShowAddModal(true)} className="btn-primary">
              Add Sweet
            </button>
          </div>
        )}
      </main>

      {/* Modals */}
      {showAddModal && (
        <AddSweetModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddSweet}
        />
      )}

      {editingSweet && (
        <EditSweetModal
          sweet={editingSweet}
          onClose={() => setEditingSweet(null)}
          onUpdate={handleUpdateSweet}
        />
      )}

      {restockingSweet && (
        <RestockModal
          sweet={restockingSweet}
          onClose={() => setRestockingSweet(null)}
          onRestock={handleRestock}
        />
      )}
    </div>
  );
}