import React, { useState } from "react";
import "./TopNavBar.css";

const TopNavBar = ({ onMenuClick }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleMouseEnter = () => {
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    setShowDropdown(false);
  };

  const menuItems = [
    { label: "Data Visualization", url: "https://superset.edtechmarks.com" },
    {
      label: "Data Modeling",
      children: [
        { label: "Data Model Cloud", url: "https://cloud.cube.dev" },
        { label: "Data Model Management", url: "https://management.cube.dev" },
      ],
    },
  ];

  return (
    <div className="navbar">
      <div className="logo">InsightzBI</div>
      <div className="menu-items">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="menu-item"
            onMouseEnter={item.children ? handleMouseEnter : null}
            onMouseLeave={item.children ? handleMouseLeave : null}
          >
            <button onClick={() => !item.children && onMenuClick(item.url)}>
              {item.label}
            </button>
            {item.children && showDropdown && (
              <div className="dropdown">
                {item.children.map((child, idx) => (
                  <button key={idx} onClick={() => onMenuClick(child.url)}>
                    {child.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopNavBar;
