import { useState } from 'react';
import type { Sweet } from '../../types';
import { X, Plus, Minus, Package } from 'lucide-react';

interface RestockModalProps {
  sweet: Sweet | null;
  onClose: () => void;
  onRestock: (quantity: number) => Promise<void>;
}

export default function RestockModal({ sweet, onClose, onRestock }: RestockModalProps) {
  const [quantity, setQuantity] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!sweet) return null;

  const handleRestock = async () => {
    setError('');
    setIsLoading(true);
    try {
      await onRestock(quantity);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Restock failed');
    } finally {
      setIsLoading(false);
    }
  };

  const newTotal = sweet.quantity + quantity;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Package className="w-6 h-6 text-green-600" />
            Restock Sweet
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Sweet Info */}
        <div className="mb-6 p-4 bg-gray-50 rounded-xl">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{sweet.name}</h3>
          <p className="text-sm text-gray-600">Current Stock: {sweet.quantity} units</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {/* Quantity Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Add Quantity
          </label>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 10))}
              className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
            >
              <Minus className="w-5 h-5" />
            </button>
            <div className="text-center">
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-24 text-center text-3xl font-bold border-2 border-gray-200 rounded-lg py-2"
                min="1"
              />
              <p className="text-xs text-gray-500 mt-1">units</p>
            </div>
            <button
              onClick={() => setQuantity(quantity + 10)}
              className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* New Total */}
        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">New Total:</span>
            <span className="text-2xl font-bold text-green-600">
              {newTotal} units
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            onClick={handleRestock}
            disabled={isLoading}
            className="btn-primary flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
          >
            <Package className="w-4 h-4" />
            {isLoading ? 'Restocking...' : 'Confirm Restock'}
          </button>
        </div>
      </div>
    </div>
  );
}