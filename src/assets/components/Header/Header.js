import React from "react";
import Logo from "./Logo";
import SearchBar from "./SearchBar";
import UserMenus from "./UserMenus";
import Navbar from "../NavDrob-Dwon/Navbar"; // 👈 استدعاء الكاتيجوري

import "./Headr.css";

function Header() {
  return (
    <header className="header">

      {/* الجزء العلوي */}
      <div className="header-container">
        <Logo />
        <SearchBar />
        <UserMenus />
      </div>

      {/* 👇 الكاتيجوري (Navbar) */}
      <div className="header-categories">
        <Navbar />
      </div>

    </header>
  );
}

export default Header;