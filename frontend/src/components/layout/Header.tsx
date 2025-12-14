// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useAuthStore } from '../../store/auth.store';

// const Header: React.FC = () => {
//   const { user, logout } = useAuthStore();

//   return (
//     <header className="bg-pink-600 shadow-md">
//       <div className="container mx-auto px-4 py-3 flex justify-between items-center">
//         <Link to="/" className="text-2xl font-bold text-white tracking-wider">
//           SweetShop 🍬
//         </Link>
//         <nav className="flex items-center space-x-4">
//           {user ? (
//             <>
//               <span className="text-white text-sm hidden sm:inline">
//                 Hello, {user.email.split('@')[0]}
//               </span>
//               <button
//                 onClick={logout}
//                 className="px-4 py-2 rounded-full bg-white text-pink-600 font-semibold hover:bg-pink-100 transition duration-150"
//               >
//                 Logout
//               </button>
//             </>
//           ) : (
//             <Link
//               to="/login"
//               className="px-4 py-2 rounded-full bg-white text-pink-600 font-semibold hover:bg-pink-100 transition duration-150"
//             >
//               Login
//             </Link>
//           )}
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Header;