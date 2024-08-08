import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen/HomeScreen";
import CommonNav from "./components/CommonNav/CommonNav";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <CommonNav>
              <HomeScreen />
            </CommonNav>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
