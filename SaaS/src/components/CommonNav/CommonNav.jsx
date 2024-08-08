import React, { useState } from "react";
import TopNavBar from "../TopNavBar/TopNavBar";

const CommonNav = ({ children }) => {
  const [currentUrl, setCurrentUrl] = useState("");

  const handleMenuClick = (url) => {
    setCurrentUrl(url);
  };
  return (
    <>
      <TopNavBar onMenuClick={handleMenuClick} />
      {currentUrl && (
        <iframe
          src={currentUrl}
          title="iframe"
          style={{ width: "100%", height: "100vh" }}
        ></iframe>
      )}
      {children}
    </>
  );
};

export default CommonNav;
