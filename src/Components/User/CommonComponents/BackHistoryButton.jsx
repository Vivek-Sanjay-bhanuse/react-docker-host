import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

export default function BackHistoryButton() {
  const location = useLocation();
  const navigate = useNavigate();

  const [historyStack, setHistoryStack] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem("userHistoryStack")) || [];
    } catch {
      return [];
    }
  });

  const currentPath = location.pathname;

  const isAdminRoute =
    currentPath.startsWith("/admin") || currentPath === "/login";

  // ⛔ Hide button & stop tracking inside Admin pages
  if (isAdminRoute) return null;

  // Track visited routes (Stack logic)
  useEffect(() => {
    if (
      historyStack.length === 0 ||
      historyStack[historyStack.length - 1] !== currentPath
    ) {
      const updated = [...historyStack, currentPath];
      setHistoryStack(updated);
      sessionStorage.setItem("userHistoryStack", JSON.stringify(updated));
    }
  }, [currentPath]);

  const handleBack = () => {
    if (historyStack.length > 1) {
      const updated = [...historyStack];
      updated.pop(); // remove current page
      const lastPage = updated[updated.length - 1];

      setHistoryStack(updated);
      sessionStorage.setItem("userHistoryStack", JSON.stringify(updated));
      navigate(lastPage);
    }
  };

  // If only 1 page in stack → Hide button
  if (historyStack.length <= 1) return null;

  return (
    <button
      onClick={handleBack}
      className="
        fixed bottom-6 left-6 z-[2000]
        bg-[#e25a1d] hover:bg-[#c54c15]
        text-white text-sm font-semibold
        px-4 py-2 rounded-full shadow-lg
        flex items-center gap-2
        animate-fadeIn
      "
    >
      <FaArrowLeft size={16} />
      <span>Back</span>
    </button>
  );
}
