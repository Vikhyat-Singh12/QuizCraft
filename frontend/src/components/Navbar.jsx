import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { 
  User, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Sparkles,
  Menu,
  X
} from "lucide-react";
import {  useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout,getMe } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <Link 
            to="/" 
            className="flex items-center gap-3 text-2xl font-bold bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent hover:from-purple-300 hover:via-pink-300 hover:to-blue-300 transition-all duration-300"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-xl">
              <Sparkles className="text-white" size={20} />
            </div>
            QuizCraft
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                    <User className="text-white" size={16} />
                  </div>
                  <div>
                    <span className="text-white font-medium">Welcome back!</span>
                    <div className="text-purple-300 text-sm font-semibold">{user.name}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to="/form"
                    className="text-white hover:text-purple-300 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 font-medium"
                  >
                    Create Quiz
                  </Link>
                </div>

                <button
                  onClick={handleLogout}
                  className="group bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 text-red-300 hover:text-red-200 px-4 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <LogOut size={16} className="group-hover:rotate-12 transition-transform duration-200" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="group bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 hover:border-green-400/50 text-green-300 hover:text-green-200 px-6 py-2 rounded-xl font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <LogIn size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                >
                  <UserPlus size={16} />
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden bg-white/10 backdrop-blur-sm border border-white/20 text-white p-2 rounded-lg hover:bg-white/20 transition-all duration-200"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
            <div className="p-6 space-y-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 mb-6">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                      <User className="text-white" size={20} />
                    </div>
                    <div>
                      <div className="text-white font-medium">Welcome back!</div>
                      <div className="text-purple-300 text-lg font-semibold">{user.name}</div>
                    </div>
                  </div>

                  <Link
                    to="/form"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-white hover:text-purple-300 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 font-medium"
                  >
                    Create Quiz
                  </Link>
                  <Link
                    to="/explore"
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-white hover:text-purple-300 px-4 py-3 rounded-xl hover:bg-white/10 transition-all duration-200 font-medium"
                  >
                    Explore
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full group bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 hover:border-red-400/50 text-red-300 hover:text-red-200 px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} className="group-hover:rotate-12 transition-transform duration-200" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full group bg-green-500/20 hover:bg-green-500/30 border border-green-400/30 hover:border-green-400/50 text-green-300 hover:text-green-200 px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <LogIn size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full group bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <UserPlus size={16} />
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}