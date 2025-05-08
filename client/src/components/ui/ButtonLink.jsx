import { Link } from "react-router-dom";

export const ButtonLink = ({ to, children }) => (
  <Link to={to} className="bg-[#0865FE] px-4 py-1  md:px-4 md:py-1 rounded-md 
             text-white hover:bg-[#0654D0] transition-colors duration-200
             text-sm md:text-base whitespace-nowrap 
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
             active:scale-95 transform inline-block text-center">
    {children}
  </Link>
);
