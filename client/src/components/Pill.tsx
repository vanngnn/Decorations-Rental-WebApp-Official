export function Pill({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={
        "rounded-full border border-black px-5 py-2 text-sm hover:bg-black hover:text-white transition " +
        className
      }
    >
      {children}
    </button>
  );
}
