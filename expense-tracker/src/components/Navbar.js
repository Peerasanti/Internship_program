import { NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <div className="navbar">
      <NavLink to="/" className="nav-link">แดชบอร์ด</NavLink>
      <NavLink to="/add-expense" className="nav-link">บันทึกค่าใช้จ่าย</NavLink>
      <NavLink to="/add-category" className="nav-link">เพิ่มหมวดหมู่ค่าใช้จ่าย</NavLink>
    </div>
  );
}
