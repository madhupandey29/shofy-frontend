import React, { useState } from "react";
import Link from "next/link";
// import Image from 'next/image'; // ❌ remove (unused)
import { mobile_menu } from "@/data/menu-data";

const MobileMenus = () => {
  const [isActiveMenu, setIsActiveMenu] = useState("");

  const toggleMenu = (title) => {
    setIsActiveMenu(prev => (prev === title ? "" : title));
  };

  return (
    <nav className="tp-main-menu-content">
      {mobile_menu.map((menu) => (
        <ul key={menu.id}>
          {menu.single_link ? (
            <li>
              <Link href={menu.link}>{menu.title}</Link>
            </li>
          ) : menu.sub_menu ? (
            <li className={`has-dropdown ${isActiveMenu === menu.title ? "dropdown-opened" : ""}`}>
              {/* use a <button> for toggles to avoid a11y warnings */}
              <button
                className={`menu-toggle ${isActiveMenu === menu.title ? "expanded" : ""}`}
                onClick={() => toggleMenu(menu.title)}
                type="button"
              >
                {menu.title}
                <span className="dropdown-toggle-btn">
                  <i className="fa-regular fa-plus" />
                </span>
              </button>
              <ul className={`tp-submenu ${isActiveMenu === menu.title ? "active" : ""}`}>
                {menu.sub_menus.map((b) => (
                  <li key={b.link}>
                    <Link href={b.link}>{b.title}</Link>
                  </li>
                ))}
              </ul>
            </li>
          ) : null}
        </ul>
      ))}
    </nav>
  );
};

export default MobileMenus;
