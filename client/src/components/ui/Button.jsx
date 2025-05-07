export function Button({ onClick, children }) {
  return (
    <button
      className="bg-gradient-to-r from-[#064349] to-[#03683E] text-white px-4 py-1 rounded-md my-2 hover:opacity-90 transition-opacity disabled:opacity-50"
      onClick={onClick}
    >
      {children}
    </button>
  );
}