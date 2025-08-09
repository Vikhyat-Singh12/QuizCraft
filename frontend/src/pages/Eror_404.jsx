import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Home, 
  Search, 
  ArrowLeft,
  Sparkles,
  MapPin,
  AlertTriangle,
  RefreshCw
} from "lucide-react";

const Error404 = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative w-full max-w-2xl text-center">
        {/* Main 404 Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 shadow-2xl">
          
          {/* Header */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-xl">
              <Sparkles className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
              QuizCraft
            </h1>
          </div>

          {/* 404 Display */}
          <div className="relative mb-8">
            <div className="text-8xl md:text-9xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full p-6 animate-bounce">
                <AlertTriangle className="text-yellow-400" size={48} />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Oops! Page Not Found
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              The page you're looking for seems to have wandered off into the digital void. 
              Don't worry, it happens to the best of us!
            </p>
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
              <MapPin size={16} />
              <span>You are currently lost in cyberspace</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={goHome}
              className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3"
            >
              <Home size={20} />
              Go Home
              <div className="group-hover:translate-x-1 transition-transform duration-200">
                →
              </div>
            </button>

            <button
              onClick={goBack}
              className="group bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center gap-3"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>

          {/* Additional Actions */}
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="flex-1 border-t border-white/20"></div>
              <span className="mx-4 text-gray-400 text-sm">or try these options</span>
              <div className="flex-1 border-t border-white/20"></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                <RefreshCw size={16} />
                Refresh Page
              </button>
              
              <button
                onClick={() => navigate("/search")}
                className="flex items-center gap-2 text-gray-300 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                <Search size={16} />
                Search Site
              </button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            If you believe this is an error, please{" "}
            <a 
              href="/contact" 
              className="text-purple-300 hover:text-purple-200 transition-colors duration-200 underline decoration-purple-400/50"
            >
              contact support
            </a>
          </p>
        </div>

        {/* Fun Animation Elements */}
        <div className="absolute -top-16 -left-16 opacity-20">
          <div className="animate-spin-slow">
            <Sparkles className="text-purple-400" size={32} />
          </div>
        </div>
        <div className="absolute -top-8 -right-20 opacity-20">
          <div className="animate-bounce delay-300">
            <Search className="text-pink-400" size={28} />
          </div>
        </div>
        <div className="absolute -bottom-12 left-12 opacity-20">
          <div className="animate-pulse delay-700">
            <Home className="text-blue-400" size={24} />
          </div>
        </div>
      </div>

      {/* Custom CSS for slow spin animation */}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default Error404;