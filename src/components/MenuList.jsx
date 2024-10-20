import React from "react";
import { Menu } from "antd";
import {
  HomeOutlined,
  GoldOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const MenuList = ({ darkTheme, userType }) => {
  const homeLink = () => {
    switch (userType) {
      case "supplier":
        return "/supplier-home";
      case "transporter":
        return "/transporter-home";
      case "manufacturer":
        return "/manufacturer-home";
      case "distributor":
        return "/distributor-home";
      case "retailer":
        return "/retailer-home";
      case "admin":
        return "/admin-home";
      default:
        return "/";
    }
  };
  return (
    <Menu
      theme={darkTheme ? "dark" : "light"}
      mode="inline"
      className="menu-bar"
    >
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <Link to={homeLink()}>Home</Link>
      </Menu.Item>

      {userType === "supplier" && (
        <React.Fragment>
          <Menu.SubMenu
            key="manageRawMaterial"
            icon={<GoldOutlined />}
            title="Manage Raw Material"
          >
            <Menu.Item key="addRawMaterial">
              <Link to="/addRawMaterial">Add Raw Material</Link>
            </Menu.Item>
            <Menu.Item key="viewRawMaterial">
              <Link to="/viewRawMaterial">View Raw Material</Link>
            </Menu.Item>
            <Menu.Item key="updateRawMaterial">
              <Link to="/updateRawMaterial">Update Raw Material</Link>
            </Menu.Item>
            <Menu.Item key="deleteRawMaterial">
              <Link to="/deleteRawMaterial">Delete Raw Material</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu
            key="manageMaterialRequests"
            icon={<SnippetsOutlined />}
            title="Manage Requests"
          >
            <Menu.Item key="sCurrent">
              <Link to="/currentRequests">Current Requests</Link>
            </Menu.Item>
            <Menu.Item key="sPrevious">
              <Link to="/previousRequests">Previous Requests</Link>
            </Menu.Item>
            <Menu.Item key="sSearchRequests">
              <Link to="/searchRequests">Search for Request</Link>
            </Menu.Item>
          </Menu.SubMenu>
        </React.Fragment>
      )}

      {userType === "transporter" && (
        <React.Fragment>
          <Menu.SubMenu
            key="manageTransportRequests"
            icon={<SnippetsOutlined />}
            title="Manage Requests"
          >
            <Menu.Item key="tCurrent">
              <Link to="/currentTransportRequests">Current Requests</Link>
            </Menu.Item>
            <Menu.Item key="tPrevious">
              <Link to="/previousTransportRequests">Previous Requests</Link>
            </Menu.Item>
            <Menu.Item key="tSearchRequest">
              <Link to="/searchTransportRequests">Search for Request</Link>
            </Menu.Item>
          </Menu.SubMenu>
        </React.Fragment>
      )}

      {userType === "manufacturer" && (
        <React.Fragment>
          <Menu.SubMenu
            key="manageManufacturerGoods"
            icon={<GoldOutlined />}
            title="Manage Goods"
          >
            <Menu.Item key="addGoods">
              <Link to="/addGoods">Add Goods</Link>
            </Menu.Item>
            <Menu.Item key="viewGoods">
              <Link to="/viewGoods">View Goods</Link>
            </Menu.Item>
            <Menu.Item key="updateGoods">
              <Link to="/updateGoods">Update Goods</Link>
            </Menu.Item>
            <Menu.Item key="deleteGoods">
              <Link to="/deleteGoods">Delete Goods</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu
            key="manageRawMaterialOrders"
            icon={<GoldOutlined />}
            title="Manage Orders"
          >
            <Menu.Item key="addSuppliers">
              <Link to="/addSuppliers">Add Suppliers</Link>
            </Menu.Item>
            <Menu.Item key="viewSuppliers">
              <Link to="/viewSuppliers">View Suppliers</Link>
            </Menu.Item>
            <Menu.Item key="viewRawMaterials">
              <Link to="/viewRawMaterials">View Raw Materials</Link>
            </Menu.Item>
            <Menu.Item key="shoppingCarts">
              <Link to="/shoppingCarts">Shopping Carts</Link>
            </Menu.Item>
            <Menu.Item key="viewOrders">
              <Link to="/viewOrders">View Orders</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu
            key="manageManufacturerRequests"
            icon={<SnippetsOutlined />}
            title="Manage Requests"
          >
            <Menu.Item key="mCurrent">
              <Link to="/currentManufacturerRequests">Current Requests</Link>
            </Menu.Item>
            <Menu.Item key="mPrevious">
              <Link to="/previousManufacturerRequests">Previous Requests</Link>
            </Menu.Item>
            <Menu.Item key="mSearchRequest">
              <Link to="/searchManufacturerRequests">Search for Request</Link>
            </Menu.Item>
          </Menu.SubMenu>
        </React.Fragment>
      )}

      {userType === "distributor" && (
        <React.Fragment>
          {/* قائمة العناصر التي تخص الـ "distributor" */}
        </React.Fragment>
      )}

      {userType === "retailer" && (
        <React.Fragment>
          {/* قائمة العناصر التي تخص الـ "retailer" */}
        </React.Fragment>
      )}
    </Menu>
  );
};

export default MenuList;
