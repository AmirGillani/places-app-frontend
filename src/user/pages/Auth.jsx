// BUILT IN MODULES

import React, { useState, useContext } from "react";

// CUSTOM MODULES

import Input from "../../shared/components/FormElements/Input/Input";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button/Button";
import ImageUpload from "../../shared/components/FormElements/ImageUpload/ImageUpload";
import { useForm } from "../../shared/hooks/useForm";
import useFetch from "../../shared/hooks/useFetch";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
  VALIDATOR_EMAIL,
} from "../../shared/util/validators";
import { AuthContex } from "../../shared/contex/login-contex";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";

// CUSTOM CSS

import "./Auth.css";

function Auth() {
  // USE CONTEXT VARAIBLE

  const auth = useContext(AuthContex);

  // PUT EMPTY VALUES INSIDE OUR CUSTOM HOOK AND THIS HOOK WILL
  // FETCH USER ENTERED VALUES AND STORE THEM INSIDE FORMSTATE

  const [formState, inputHandler, setInput] = useForm(
    {
      email: { val: "", isValid: false },
      password: { val: "", isValid: false },
    },
    false
  );

  // USE CUSTOM HOOK

  const [isLoading, error, sendRequest, clearError] = useFetch();

  // THIS VARIABLE WILL HELP US TO CREATE DUAL FORM USING ONE DOCUMRENT

  const [isLoggedIn, setIsLoggedIn] = useState(true);

  function handleSwitch(event) {
    // THIS CODE WILL RUN BEFORE SWITCHING FROM LOGIN TO SIGNUP

    event.preventDefault();

    if (isLoggedIn) {
      //BEFORE GOING TO SIGNUP FORM ADD NAME FIELD INSIDE FORM STATE
      //USING SETINPUT FUNCTION

      setInput(
        {
          ...formState.inputs,
          name: { val: "", isValid: false },
          image: { val: null, isValid: false },
        },
        false
      );
    }

    // THIS CODE WILL RUN BEFORE SWITCHING FROM SIGNUP TO LOGIN
    else {
      //BEFORE GOING TO LOGIN FORM ADD NAME FIELD INSIDE FORM STATE
      //AS UNDEFINED USING SETINPUT FUNCTION

      setInput(
        { ...formState.inputs, name: undefined, image: undefined },
        false
      );
    }

    // THIS WILL MAKE ISLOGGEDIN VALUE TRUE => FALSE AND FALSE => TRUE

    setIsLoggedIn((preVal) => {
      return !preVal;
    });
  }

  // THIS WILL BE CALLED AT SUBMIT

  async function submitHandler(event) {
    event.preventDefault();

    // SAVE OR RETRIVE DATA IN DATABASE

    if (isLoggedIn) {
      try {
        const resultData = await sendRequest(
          "https://places-api-phi.vercel.app/api/user/login",
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );

        // SEND USERID TO EVERY PAGE USING CONTEXT VAR

        console.log(resultData);

        auth.login(resultData.userId,resultData.token);
      } catch (err) {}
    } else {
      try {
        // FOR FORMS CONTAINING FILES WE USE FORMDATA FORMAT NOT JSON FORMAT

        const formData = new FormData();

        // ADD ALL DATA IN FORMDATA

        formData.append("name", formState.inputs.name.value);
        formData.append("email", formState.inputs.email.value);
        formData.append("password", formState.inputs.password.value);
        formData.append("image", formState.inputs.image.value);

        const resultData = await sendRequest(
          "https://places-api-phi.vercel.app/api/user/signup",
          "POST",
          formData
        );
        
        auth.login(resultData.userId,resultData.token );
      } catch (err) {}
    }
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}

        <h2>Login Required</h2>
        <hr />
        <form>
          {!isLoggedIn && <ImageUpload id="image" onInput={inputHandler} />}
          {!isLoggedIn && (
            <Input
              id="name"
              element="input"
              type="text"
              placeholder="Enter Your Name"
              errormsg="Name is required"
              label="Name"
              onInput={inputHandler}
              validators={[VALIDATOR_REQUIRE()]}
            />
          )}

          <Input
            id="email"
            element="input"
            type="email"
            placeholder="Enter Valid Email"
            errormsg="Write correct email"
            label="Email"
            onInput={inputHandler}
            validators={[VALIDATOR_EMAIL()]}
          />
          <Input
            id="password"
            element="input"
            type="password"
            placeholder="Enter Valid Password"
            errormsg="Write correct password"
            label="Password"
            onInput={inputHandler}
            validators={[VALIDATOR_MINLENGTH(5)]}
          />
          <Button
            type="submit"
            disabled={!formState.isValid}
            onClick={submitHandler}
          >
            {!isLoggedIn ? "Sign Up" : "Login"}
          </Button>
          <Button inverse onClick={handleSwitch}>
            Switch to {isLoggedIn ? "Sign Up" : "Login"}
          </Button>
        </form>
      </Card>
    </React.Fragment>
  );
}

export default Auth;
