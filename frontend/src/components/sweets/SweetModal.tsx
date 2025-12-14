import { useState } from 'react';
import type { Sweet } from '../../types';
import { X, Minus, Plus, ShoppingCart } from 'lucide-react';

interface SweetModalProps {
  sweet: Sweet | null;
  onClose: () => void;
  onPurchase: (quantity: number) => Promise<void>;
}

export default function SweetModal({ sweet, onClose, onPurchase }: SweetModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!sweet) return null;

  const handlePurchase = async () => {
    setError('');
    setIsLoading(true);
    try {
      await onPurchase(quantity);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Purchase failed');
    } finally {
      setIsLoading(false);
    }
  };

  const total = sweet.price * quantity;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Purchase Sweet</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Sweet Info */}
        <div className="mb-6">
          <div className="text-6xl text-center mb-4">🍬</div>
          <h3 className="text-xl font-bold text-center mb-2">{sweet.name}</h3>
          <p className="text-gray-600 text-center">{sweet.category}</p>
          <p className="text-3xl font-bold text-center mt-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            ${sweet.price.toFixed(2)}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {/* Quantity Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quantity
          </label>
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(sweet.quantity, quantity + 1))}
              className="w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <p className="text-sm text-gray-500 text-center mt-2">
            Available: {sweet.quantity}
          </p>
        </div>

        {/* Total */}
        <div className="bg-purple-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total:</span>
            <span className="text-2xl font-bold text-purple-600">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button
            onClick={handlePurchase}
            disabled={isLoading}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            {isLoading ? 'Processing...' : 'Confirm Purchase'}
          </button>
        </div>
      </div>
    </div>
  );
}