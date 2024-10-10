import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const CollapseItem: React.FC<{ title: string; content: string }> = ({
  title,
  content,
}) => {
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

      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="p-4 bg-gray-100">{content}</div>
      </div>
    </div>
  );
};

export default function SimpleCollapses() {
  return (
    <div className="max-w-md mx-auto bg-white border w-60 border-gray-300 rounded-md shadow-md text-sm">
      <CollapseItem
        title="Collapse 1"
        content="Este es el contenido del primer collapse."
      />
      <CollapseItem
        title="Collapse 2"
        content="Este es el contenido del segundo collapse."
      />
      <CollapseItem
        title="Collapse 3"
        content="Este es el contenido del tercer collapse."
      />
    </div>
  );
}
