//REACT FUNCTIONS
import React, { useState } from "react";
import { Link } from "react-router-dom";

//CUSTOM COMPONENTS
import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";

//CUSTOM COMPONENTS CSS
import "./MainNavigation.css";

//MAIN FUNCTION
function MainNavigation(props) {
  //CONDITION TO OPEN AND CLOSE SIDE BARS
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  //SET CONDITION TO TRUE
  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  //SET CONDITION TO FALSE
  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  return (
    //USED TO RETURN MULTIPLE TAGS
    <React.Fragment>
      {/* IF CONDITION IS TRUE THEN SHOW BACKDROP COMPONENT AND APPLY FUNCTION  */}

      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}

      {/* IF CONDITION IS TRUE THEN SHOW SIDEBAR COMPONENT AND APPLY FUNCTION  */}

      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>

      {/* SHOW MAIN MENU */}
      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={openDrawerHandler}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">YourPlaces</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
}

export default MainNavigation;
