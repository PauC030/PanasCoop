export function CardActivi({ children }) {
  return (
    <div className="bg-zinc-100 shadow-md w-full max-w-[390px] p-4 rounded-md overflow-hidden break-words border-2 border-[#EAB308] hover:border-[rgb(231,182,117)] hover:bg-[rgb(251,254,200)] hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 mx-auto my-1">
      {children}
    </div>
  );
}
