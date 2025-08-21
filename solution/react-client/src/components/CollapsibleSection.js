import React, { useState } from 'react';
import { FaChevronDown } from 'react-icons/fa'; // usa react-icons

const CollapsibleSection = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = () => setIsOpen(!isOpen);

  return (
    <div className="collapsible-section">
      <button
        className={`collapsible-header ${isOpen ? 'active' : ''}`}
        onClick={toggleSection}
      >
        <span>{title}</span>
        <FaChevronDown className={`chevron-icon ${isOpen ? 'rotate' : ''}`} />
      </button>
      {isOpen && (
        <div className="collapsible-content">
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
