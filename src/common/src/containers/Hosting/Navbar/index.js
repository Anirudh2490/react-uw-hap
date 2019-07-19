import React, { useContext } from "react";
import Link from "next/link";
import PropTypes from "prop-types";
import NavbarWrapper from "../../../../../elements/Navbar";
import Drawer from "../../../../../elements/Drawer";
import Button from "../../../../../elements/Button";
import Logo from "../../../../../elements/UI/Logo";
import Box from "../../../../../elements/Box";
import HamburgMenu from "../../../components/HamburgMenu";
import Container from "../../../components/UI/Container";
import { DrawerContext } from "../../../contexts/DrawerContext";
import "./index.css";
import { AuthUserContext } from "../../../../../component/Session/";
import { MENU_ITEMS } from "../../../data/Hosting/data";
import ScrollSpyMenu from "../../../components/ScrollSpyMenu";

import LogoImage from "../../../assets/image/hosting/logo.png";
import { withFirebase } from "../../../../../component/Firebase";

const NavbarBase = ({
  navbarStyle,
  logoStyle,
  button,
  row,
  firebase,
  menuWrapper,
  alert
}) => {
  const { state, dispatch } = useContext(DrawerContext);

  // Toggle drawer
  const toggleHandler = () => {
    dispatch({
      type: "TOGGLE"
    });
  };

  return (
    <NavbarWrapper {...navbarStyle}>
      <Container>
        <Box {...row}>
          <Logo
            href="#"
            logoSrc={LogoImage}
            title="Agency"
            logoStyle={logoStyle}
          />
          <Box {...menuWrapper}>
            <ScrollSpyMenu
              className="main_menu"
              menuItems={MENU_ITEMS}
              offset={-70}
            />
            <AuthUserContext.Consumer>
              {authUser =>
                authUser ? (
                    <a
                      onClick={firebase.doSignOut}
                      className="navbar_drawer_button"
                    >
                      <Button {...button} title="Sign Out" />
                    </a>
                ) : (
                  <Link href="tel:030 233 277 42">
                    <a href="tel:03023327742" className="navbar_drawer_button">
                      <Button {...button} title="Jetzt anrufen" />
                    </a>
                  </Link>
                )
              }
            </AuthUserContext.Consumer>

            <Drawer
              width="420px"
              placement="right"
              drawerHandler={<HamburgMenu barColor="#eb4d4b" />}
              open={state.isOpen}
              toggleHandler={toggleHandler}
            >
              <ScrollSpyMenu
                className="mobile_menu"
                menuItems={MENU_ITEMS}
                drawerClose={true}
                offset={-100}
              />
              <Link href="tel:030 233 277 42">
                <a className="navbar_drawer_button">
                  <Button {...button} title="Jetzt anrufen" />
                </a>
              </Link>
            </Drawer>
          </Box>
        </Box>
      </Container>
    </NavbarWrapper>
  );
};

const Navbar = withFirebase(NavbarBase);

NavbarBase.propTypes = {
  navbarStyle: PropTypes.object,
  logoStyle: PropTypes.object,
  button: PropTypes.object,
  alert: PropTypes.func,
  row: PropTypes.object,
  menuWrapper: PropTypes.object
};

NavbarBase.defaultProps = {
  navbarStyle: {
    className: "hosting_navbar",
    minHeight: "70px",
    display: "block"
  },
  row: {
    flexBox: true,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%"
  },
  logoStyle: {
    maxWidth: ["120px", "130px"]
  },
  button: {
    type: "button",
    fontSize: "13px",
    fontWeight: "600",
    color: "white",
    borderRadius: "4px",
    pl: "15px",
    pr: "15px",
    colors: "primaryWithBg",
    minHeight: "auto",
    height: `${1}`
  },
  menuWrapper: {
    flexBox: true,
    alignItems: "center"
  }
};

export default Navbar;
