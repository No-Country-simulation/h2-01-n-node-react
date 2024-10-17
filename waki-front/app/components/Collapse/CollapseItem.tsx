import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const CollapseItem: React.FC<{ title: React.ReactNode; content: React.ReactNode }> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="border-b last:border-b-0 border-gray-300 shadow-md">
      <button
        onClick={toggleCollapse}
        className="flex items-center justify-between w-full px-4 py-2 text-left text-xl font-medium bg-white rounded-t-md"
      >
        <span className="text-sm">{title}</span>
        {isOpen ? (
          <FaChevronUp style={{ color: "#317EF4", fontSize: "12px" }} />
        ) : (
          <FaChevronDown style={{ color: "#317EF4", fontSize: "12px" }} />
        )}
      </button>

      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-screen" : "max-h-0"}`}>
        <div className="p-4 bg-gray-100">{content}</div>
      </div>
    </div>
  );
};

export default CollapseItem;
