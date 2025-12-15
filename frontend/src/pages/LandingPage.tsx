import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';
import { 
  Candy, 
  ShoppingBag, 
  Sparkles, 
  Shield, 
  Zap, 
  Heart,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: <Candy className="w-8 h-8" />,
      title: "Wide Selection",
      description: "Browse through hundreds of delicious sweets from chocolates to gummies"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Instant Purchase",
      description: "Quick and easy checkout process with real-time inventory updates"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure & Safe",
      description: "Your data is protected with industry-standard security measures"
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Quality Products",
      description: "All sweets are carefully selected for the best taste and quality"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Sweet Lover",
      comment: "Best online sweet shop! The selection is amazing and delivery is super fast!",
      avatar: "👩‍💼"
    },
    {
      name: "Mike Chen",
      role: "Regular Customer",
      comment: "I love how easy it is to find my favorite candies. Highly recommend!",
      avatar: "👨‍💻"
    },
    {
      name: "Emma Davis",
      role: "Party Planner",
      comment: "Perfect for ordering sweets in bulk for events. Great quality and prices!",
      avatar: "👩‍🎨"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      {/* Header/Nav */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Candy className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Sweet Shop
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="btn-secondary px-6 py-2"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/register')}
              className="btn-primary px-6 py-2"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
              <Sparkles className="w-4 h-4" />
              #1 Sweet Shop Online
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Your <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Sweet</span> Paradise Awaits
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Discover the finest collection of candies, chocolates, and gummies. 
              From classic favorites to exotic treats, we've got something for everyone!
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/register')}
                className="btn-primary px-8 py-4 text-lg flex items-center justify-center gap-2 group"
              >
                Start Shopping
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="btn-secondary px-8 py-4 text-lg"
              >
                Sign In
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8 border-t border-gray-200">
              <div>
                <div className="text-3xl font-bold text-gray-800">500+</div>
                <div className="text-sm text-gray-600">Sweet Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">10K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-800">4.9★</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative animate-fade-in">
            <div className="relative z-10">
              {/* Floating Sweet Cards */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { emoji: '🍫', name: 'Chocolate', color: 'from-amber-400 to-orange-500' },
                  { emoji: '🍬', name: 'Candy', color: 'from-pink-400 to-red-500' },
                  { emoji: '🍭', name: 'Lollipop', color: 'from-purple-400 to-pink-500' },
                  { emoji: '🍪', name: 'Cookie', color: 'from-yellow-400 to-orange-500' }
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`card hover:scale-110 cursor-pointer bg-gradient-to-br ${item.color} text-white transition-all duration-300`}
                    style={{
                      animationDelay: `${i * 0.1}s`,
                      animation: 'float 3s ease-in-out infinite'
                    }}
                  >
                    <div className="text-6xl mb-2">{item.emoji}</div>
                    <div className="font-semibold">{item.name}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full blur-3xl opacity-30 -z-10"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">Sweet Shop</span>?
            </h2>
            <p className="text-xl text-gray-600">
              We make buying sweets online easy, fun, and delightful
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card hover:scale-105 cursor-pointer text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-purple-600">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Simple as 1-2-3
            </h2>
            <p className="text-xl text-gray-600">
              Get your favorite sweets in just three easy steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Browse & Choose', desc: 'Explore our wide selection of sweets' },
              { step: '02', title: 'Add to Cart', desc: 'Select your favorites and quantities' },
              { step: '03', title: 'Purchase', desc: 'Complete your order securely' }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="card text-center hover:shadow-2xl transition-all">
                  <div className="text-6xl font-bold text-transparent bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.desc}</p>
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mt-6" />
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 text-4xl text-purple-300">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-br from-purple-100 to-pink-100 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Loved by Sweet Lovers
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers have to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="card hover:scale-105 transition-all">
                <div className="text-5xl mb-4">{testimonial.avatar}</div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.comment}"</p>
                <div className="border-t pt-4">
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
                <div className="flex gap-1 mt-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="card bg-gradient-to-br from-pink-500 to-purple-600 text-white p-12">
            <ShoppingBag className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Satisfy Your Sweet Tooth?
            </h2>
            <p className="text-xl mb-8 text-purple-100">
              Join thousands of happy customers and start your sweet journey today!
            </p>
            <button
              onClick={() => navigate('/register')}
              className="bg-white text-purple-600 px-10 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-all shadow-xl"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Candy className="w-6 h-6" />
                <span className="font-bold text-xl">Sweet Shop</span>
              </div>
              <p className="text-gray-400">
                Your one-stop destination for all things sweet and delicious.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <div className="space-y-2 text-gray-400">
                <div className="hover:text-white cursor-pointer">About Us</div>
                <div className="hover:text-white cursor-pointer">Products</div>
                <div className="hover:text-white cursor-pointer">Contact</div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Categories</h3>
              <div className="space-y-2 text-gray-400">
                <div className="hover:text-white cursor-pointer">Chocolates</div>
                <div className="hover:text-white cursor-pointer">Candies</div>
                <div className="hover:text-white cursor-pointer">Gummies</div>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <div className="space-y-2 text-gray-400">
                <div className="hover:text-white cursor-pointer">FAQ</div>
                <div className="hover:text-white cursor-pointer">Shipping</div>
                <div className="hover:text-white cursor-pointer">Returns</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2025 Sweet Shop. All rights reserved. Made with 💜 by AI Kata Team</p>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
}