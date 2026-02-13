// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary", // primary | secondary | accent | outline
  className = "",
  ...props
}) {
  const variants = {
    primary: "bg-[#1E3A8A] text-white hover:bg-[#152a6e]",
    secondary: "bg-[#0EA5E9] text-white hover:bg-[#0891d1]",
    accent: "bg-[#FF5733] text-white hover:bg-[#e04e2d]",
    outline: "border-2 border-[#1E3A8A] text-[#1E3A8A] hover:bg-[#1E3A8A] hover:text-white",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}        // Scales up slightly on hover
      whileTap={{ scale: 0.95 }}          // Small press effect
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`
        px-8 py-4 rounded-full font-semibold text-lg shadow-lg
        transition-all duration-300 flex items-center justify-center gap-2
        ${variants[variant]}
        ${className}
      `}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </motion.button>
  );
}