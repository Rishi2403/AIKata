import type { Sweet } from '../../types';
import { ShoppingCart, Tag } from 'lucide-react';

interface SweetCardProps {
  sweet: Sweet;
  onPurchase: (sweet: Sweet) => void;
}

export default function SweetCard({ sweet, onPurchase }: SweetCardProps) {
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

  const isOutOfStock = sweet.quantity === 0;

  return (
    <div className="card group hover:scale-105 relative overflow-hidden">
      {/* Category Badge */}
      <div className={`absolute top-4 right-4 bg-gradient-to-r ${getCategoryColor(sweet.category)} text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}>
        <Tag className="w-3 h-3" />
        {sweet.category}
      </div>

      {/* Sweet Image Placeholder */}
      <div className={`w-full h-48 bg-gradient-to-br ${getCategoryColor(sweet.category)} rounded-xl mb-4 flex items-center justify-center relative`}>
        <div className="text-6xl animate-bounce-slow">🍬</div>
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
            <span className="text-white font-bold text-xl">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Sweet Info */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
          {sweet.name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            ${sweet.price.toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">
            Stock: <span className={`font-semibold ${isOutOfStock ? 'text-red-500' : 'text-green-600'}`}>
              {sweet.quantity}
            </span>
          </div>
        </div>

        <button
          onClick={() => onPurchase(sweet)}
          disabled={isOutOfStock}
          className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart className="w-4 h-4" />
          {isOutOfStock ? 'Out of Stock' : 'Purchase'}
        </button>
      </div>
    </div>
  );
}