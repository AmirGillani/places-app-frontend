import React, { useState, useEffect, useCallback } from "react";

let logoutTimer;
let logoutModal;
function useAuth() {
  // USESTATE VARIABLES

  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(null);
  const [showLogoutModal, setLogoutModal] = useState(false);

  // THIS FUNCTION WHENEVER BE CALLED IT WILL FETCH USERID

  const login = useCallback((uid, token, previousExpirationTime) => {
    setToken(token);
    setUserId(uid);

    // TOKEN EXPIRATION TIME IN MILISECONDS

    //                          CURRENT TIME + TIME AFTER 1 HOUR= 3600000ms

    const expiration =
      previousExpirationTime || new Date().getTime() + 3600000;

    // GET EXACT TIME AFTER 1 HOUR USING DATE CONSTANT

    const expirationTime = new Date(expiration);

    // SET EXPIRATION TIME IN STATE

    setTokenExpirationDate(expirationTime);

    // SAVE DATA IN LOCAL STORAGE

    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expirationTime: expirationTime.toISOString(),
      })
    );
  }, []);

  // THIS FUNCTION WHENEVER BE CALLED IT CLEAR USERID

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    setTokenExpirationDate(null);
    localStorage.removeItem("userData");
  }, []);

  function clearLogoutModal() {
    setLogoutModal(false);
  }

  // THIS WILL DO AUTO LOGOUT

  useEffect(() => {
    if (token && tokenExpirationDate) {
      // CALCULATE REMAING TIME

      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();

      // CALL LOGOUT DEPENDING UPON SESSION EXPIRATION TIME

      // logout timer have id of timer created
      logoutTimer = setTimeout(() => {
        logout();
        
        setLogoutModal(true);
      }, remainingTime);
    } else {
      // WE CAN CLEAR TIME IF USER LOGOUT MANUALLY
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  // THIS WILL MAINTAIN USER SESSION BY CALLING LOGIN AUTOMATICALLY

  useEffect(() => {
    // GET LOCALSTORAGE DATA IN OBJECT FORM

    const storedDAta = JSON.parse(localStorage.getItem("userData"));

    if (
      storedDAta &&
      storedDAta.token &&
      //  CHECK IF LOCAL STORAGE EXPIRATION TIME IS GREATER THAN CURRENT TIME

      new Date(storedDAta.expirationTime) > new Date()
    ) {
      // CALL LOGIN AND PASS VALUES

      login(
        storedDAta.userId,
        storedDAta.token,
        new Date(storedDAta.expirationTime)
      );
    }
  }, [login]);

  return [token, login, logout, userId, showLogoutModal, clearLogoutModal];
}

export default useAuth;
