import React, { useState } from "react";
import { Layout, Menu, Tooltip } from "antd";
import "./NavBar.css";
import logo from "../../assets/images/logo2.png";
import { Link, useLocation } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const NavSideBar = ({ children }) => {
  const location = useLocation();
  const [activeKey, setActiveKey] = useState(
    getDefaultActiveKey(location.pathname)
  );

  function getDefaultActiveKey(pathname) {
    const menuItems = {
      "/": "1",
      "/destination-report-ui": "2",
      "/help": "3",
    };

    return menuItems[pathname] || "1";
  }

  const menuItems = [
    {
      key: "1",
      label: (
        <Tooltip title="Assess & Migrate">
          <Link to={"/"}>Assess & Migrate</Link>
        </Tooltip>
      ),
    },
    {
      key: "2",
      label: (
        <Tooltip title="Destination Report WebUI">
          <Link to={"/destination-report-ui"}>Destination Report WebUI</Link>
        </Tooltip>
      ),
    },
    {
      key: "3",
      label: (
        <Tooltip title="Help">
          <Link to={"/help"}>Help</Link>
        </Tooltip>
      ),
    },
    
  ];

  return (
    <Layout style={{ height: "100vh" }} className="site-layout">
      <Header className="navbar-header">
        <div className="logo">
          <Link to={"/"} onClick={() => setActiveKey("1")}>
            <img
              className="logo-image"
              style={{ objectFit: "contain" }}
              src={logo}
              alt="Logo"
            />
          </Link>
        </div>
      </Header>
      <Layout className="site-layout-content">
        <Sider
          className="site-sider"
          width={250}
          style={{
            background: "white",
          }}
        >
          <Menu
            items={menuItems}
            mode="vertical"
            selectedKeys={[activeKey]}
            onClick={({ key }) => setActiveKey(key)}
          />
        </Sider>
        <Content>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default NavSideBar;
