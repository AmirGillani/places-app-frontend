import React, { useEffect, useState } from "react";

import UsersList from "../components/UsersList";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";

import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import useFetch from "../../shared/hooks/useFetch";

const Users = () => {
  
  const [users, setUsers]= useState();

  const [isLoading, error, sendRequest, clearError] = useFetch();

  // FETCH ALL USERS FROM BACKEND

  // HERE USE EFFECT IS USED JUST BECAUSE WHENEVVER USERS PAGE IS RERENDERED
  // EVERY TIMES SEND REQUEST FUNCTION WILL BE CALLED THIS WILL CREATE INFINITE
  // LOOP CAN CAUSE YOUR APP TO CRASH SO ALWAYS WRITE FUNCTION CALLS INSIDE
  // USE EFFECT OR USE CALLBACK


  useEffect(() => {

    // WE CAN NOT MAKE USE EFFECT FUNCTION ASYNC SO INSIDE IT I HAVE CREATED NEW 
    // FUNCTION USERS

    async function Users() {

      try {

        const resultData = await sendRequest("https://places-api-phi.vercel.app/api/user/");

        //PUT FETCHED USERS INSIDE USERS VARIABLE

        setUsers(resultData.users);

      } catch (err) {}
    }

    Users();

    //THIS FUNCTION WILL BER CALLED ONCE ONLY WHEN FIRST TIME SEND REQUEST
    //IS CALLED

  },[sendRequest]);

  return (
    // REACT FRAGMENT IS USED BECAUSE ITS VANILA JAVA SCRIPT RULE THAT A 
    // FUNCTION CAN NOT SEND MULTIPLE VALUES SO TRAP EVERY THING INSIDE
    // SPECIAL DIV CALLED FRAGMENT

    <React.Fragment>

    {/* ERROR MODAL WILL BE CALLED DEPENDING UPON ERROR OBJECT THIS OBJECT
    IS CALCULATED INSIDE OUR CUSTOM HOOK CALLED USEFETCH */}

      <ErrorModal error={error} onClear={clearError} />

      {/* ISLOADING VAR IS USED INSIDE USEFETCH AND IT WILL LOAD
      SPINNER WHENEVER ISLOADING VALUE IS TRUE INSIDE USEFETCH  */}

      {isLoading && <LoadingSpinner asOverlay />}

      {/* SHOW ALL USERS ONLY WHEN ISLOADING IS FALSE MEANS DATA IS CALCULATED */}
      {!isLoading && users && <UsersList items={users} />}
      
    </React.Fragment>
  );
};

export default Users;
