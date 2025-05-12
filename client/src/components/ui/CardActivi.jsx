export function CardActivi({ children }) {
  return (
    <div className="bg-zinc-100 shadow-md w-full max-w-[390px] p-4 rounded-md overflow-hidden break-words border border-[#EAB308] hover:border-[#b58802] hover:bg-[rgb(251,254,200)] hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 mx-auto my-1">
      {children}
    </div>
  );
}
