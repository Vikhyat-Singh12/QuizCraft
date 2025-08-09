import {  FaTwitter, FaLinkedinIn, FaGithub, FaInstagram } from "react-icons/fa";
import { Sparkles, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-gray-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2.5 rounded-xl">
                <Sparkles className="text-white" size={22} />
              </div>
              <h2 className="text-2xl font-bold text-white">QuizCraft</h2>
            </div>
            <p className="text-gray-400 text-lg leading-relaxed mb-8 max-w-md">
              Create stunning interactive quizzes with ease. Perfect for educators, students, and anyone who loves learning.
            </p>
            
            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/vikhyat.singh_/"
                className="bg-slate-800 hover:bg-purple-600 text-gray-400 hover:text-white p-3 rounded-xl transition-all duration-300 hover:scale-110"
              >
                <FaInstagram size={18} />
              </a>
              <a
                href="https://x.com/VikhyatSingh001"
                className="bg-slate-800 hover:bg-blue-500 text-gray-400 hover:text-white p-3 rounded-xl transition-all duration-300 hover:scale-110"
              >
                <FaTwitter size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/vikhyat-singh-b19454294/"
                className="bg-slate-800 hover:bg-blue-600 text-gray-400 hover:text-white p-3 rounded-xl transition-all duration-300 hover:scale-110"
              >
                <FaLinkedinIn size={18} />
              </a>
              <a
                href="https://github.com/Vikhyat-Singh12"
                className="bg-slate-800 hover:bg-gray-700 text-gray-400 hover:text-white p-3 rounded-xl transition-all duration-300 hover:scale-110"
              >
                <FaGithub size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <a href="/" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Home
                </a>
              </li>
              <li>
                <a href="/form" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Create Quiz
                </a>
              </li>
              <li>
                <a href="/explore" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Explore
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-white transition-colors duration-200">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-4">
              <li>
                <a href="/help" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>© {new Date().getFullYear()} QuizCraft. All rights reserved.</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="text-red-400 fill-current" size={14} />
              <span>for learners everywhere</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}