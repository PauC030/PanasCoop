export function Label({ htmlFor, children }) {
  return (
    <label 
      htmlFor={htmlFor} 
      className="text-xs block my-1 text-[#908181] hover:text-[#322e2e] transition-colors duration-200"
    >
      {children}
    </label>
  );
}