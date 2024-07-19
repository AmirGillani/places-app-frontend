import React, { useState, useCallback, useEffect } from "react";
import Modal from "./shared/components/UIElements/Modal";
import Button from "./shared/components/FormElements/Button/Button";
//PERFORM ROUTING
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";

//CUSTOM COMPONENTS
import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlace from "./places/pages/UserPlace";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./user/pages/Auth";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import { AuthContex } from "./shared/contex/login-contex";
import useAuth from "./shared/hooks/useAuth";

const App = () => {
  const [token, login, logout, userId, showLogoutModal, clearLogoutModal] =
    useAuth();

  let routes;

  // ROUTES VARIABLE WILL HAVE TWO ROUTES

  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlace />
        </Route>
        <Route path="/places/new" exact>
          <NewPlace />
        </Route>
        <Route path="/places/:placeid">
          <UpdatePlace />
        </Route>
        <Redirect to="/" />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>
        <Route path="/:userId/places" exact>
          <UserPlace />
        </Route>
        <Route path="/auth">
          <Auth />
        </Route>
        <Redirect to="/auth" />
      </Switch>
    );
  }

  return (
    // WE ARE SENDING CONTEXT VARIABLE TO ALL COMPONENTS OF APP
    <React.Fragment>
      <Modal
        show={showLogoutModal}
        onCancel={clearLogoutModal}
        // SEND PLACE LOCATION
        header={"LOGIN REQUIRED !!"}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        //SEND FUNCTION
        footer={
          <div>
            <Button onClick={clearLogoutModal}>Close</Button>
            {/* <Button onClick={closeDeleteHandler}>Cancel</Button> */}
          </div>
        }
      >
        {/* INNER CONTENT OF MODEL */}

        <p>Session expired Login again ...</p>
      </Modal>

      <AuthContex.Provider
        value={{
          // IF TOKEN IS STRING THEN !! CONVERTS IT TO TRUE
          // IF IT IS NULL THEN !! CONVERTS IT TO FALSE
          isLoggedIn: !!token,
          token: token,
          userId: userId,
          login: login,
          logout: logout,
        }}
      >
        {/* HERE ROUTING IS PERFORMED */}

        <Router>
          <MainNavigation />
          <main>{routes}</main>
        </Router>
      </AuthContex.Provider>
    </React.Fragment>
  );
};

export default App;
