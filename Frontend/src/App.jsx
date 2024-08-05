import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AccessAndMigrate from "./screen/AccessAndMigrate/AccessAndMigrate";
import DestinationReportUI from "./screen/DestinationReportUI/DestinationReportUI";
import NavSideBar from "./components/NavBar/NavBar";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <NavSideBar>
              <AccessAndMigrate />
            </NavSideBar>
          }
        />
        <Route
          path="/destination-report-ui"
          element={
            <NavSideBar>
              <DestinationReportUI />
            </NavSideBar>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
