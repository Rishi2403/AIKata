import type { Sweet } from '../../types';
import { Edit2, Trash2, Package } from 'lucide-react';

interface AdminSweetCardProps {
  sweet: Sweet;
  onEdit: (sweet: Sweet) => void;
  onDelete: (sweet: Sweet) => void;
  onRestock: (sweet: Sweet) => void;
}

export default function AdminSweetCard({ 
  sweet, 
  onEdit, 
  onDelete, 
  onRestock 
}: AdminSweetCardProps) {
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Chocolate: 'from-amber-500 to-yellow-600',
      Candy: 'from-pink-500 to-red-500',
      Gummy: 'from-green-500 to-emerald-600',
      Lollipop: 'from-purple-500 to-pink-500',
      default: 'from-blue-500 to-indigo-600',
    };
    return colors[category] || colors.default;
  };

  const isLowStock = sweet.quantity < 20;

  return (
    <div className="card hover:scale-102 relative">
      {/* Low Stock Badge */}
      {isLowStock && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold animate-pulse">
          Low Stock!
        </div>
      )}

      {/* Sweet Image */}
      <div className={`w-full h-40 bg-gradient-to-br ${getCategoryColor(sweet.category)} rounded-xl mb-4 flex items-center justify-center`}>
        <div className="text-5xl">🍬</div>
      </div>

      {/* Sweet Info */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{sweet.name}</h3>
          <p className="text-sm text-gray-600">{sweet.category}</p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-purple-600">
            ${sweet.price.toFixed(2)}
          </span>
          <span className={`text-sm font-semibold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
            Stock: {sweet.quantity}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <button
            onClick={() => onRestock(sweet)}
            className="flex items-center justify-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
          >
            <Package className="w-4 h-4" />
            Restock
          </button>
          <button
            onClick={() => onEdit(sweet)}
            className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onDelete(sweet)}
            className="flex items-center justify-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}