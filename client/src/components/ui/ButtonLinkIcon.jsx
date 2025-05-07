import { Link } from "react-router-dom";
export const ButtonLinkIcon = ({ to, children }) => (
  <Link
    to={to}
    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
  >
    {children}
  </Link>
);