import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser, FiMenu } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-slate-200/50 h-16 flex items-center justify-between px-6 sticky top-0 z-40 transition-all duration-300">
      <div className="flex items-center gap-3">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all duration-300">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 17h.01M12 17h.01M16 17h.01M3 11l2-6h14l2 6M5 17h14a2 2 0 002-2v-2H3v2a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-indigo-600 transition-all duration-300">
            AutoVault
          </span>
        </Link>
      </div>
      
      <div className="flex items-center space-x-3">
        <Link 
          to="/profile"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-slate-100 text-slate-600 hover:text-blue-600 transition-all duration-200 group"
        >
          <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
            <FiUser className="w-4 h-4" />
          </div>
          <span className="font-semibold text-sm">{user?.firstName} {user?.lastName}</span>
        </Link>
        
        <div className="h-6 w-px bg-slate-200 mx-1"></div>
        
        <button 
          onClick={logout}
          className="flex items-center justify-center w-9 h-9 rounded-full text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 group"
          title="Logout"
        >
          <FiLogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
