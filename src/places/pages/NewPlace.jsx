// BUILT IN MODULES

import React,{useContext} from "react";
import { useHistory } from 'react-router-dom';

// CUSTOM MODULES

import { useForm } from "../../shared/hooks/useForm";
import Input from "../../shared/components/FormElements/Input/Input";
import Button from "../../shared/components/FormElements/Button/Button";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import useFetch from "../../shared/hooks/useFetch";
import { AuthContex } from "../../shared/contex/login-contex";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/ImageUpload/ImageUpload";
// CUSTOM CSS

import "./NewPlace.css";

const NewPlace = () => {

  const [isLoading, error, sendRequest, clearError] = useFetch();

  const auth = useContext(AuthContex);

  //useform will rerender NewPlace when ever its initial state is changed
  //and initial state will be changed by usecallback hook which will execute
  //inputHandler function we have to write both hooks returned values in here

  //inputHandler will be called which will call useform which will
  //change initial state

  const [formState, inputHandler] = useForm(
    {
      title: { value: "", isValid: false },
      image:{value:null, isValid: false},
      description: { value: "", isValid: false },
      address: { value: "", isValid: false },
    },
    false
  );

  // THIS HELP TO REDIRECT

  const history = useHistory();

  // WILL BE CALLED AT SUBMIT

  const placeSubmitHandler = async (event) => {

    event.preventDefault();

    const formData = new FormData();
    formData.append("title",formState.inputs.title.value);
    formData.append("image",formState.inputs.image.value);
    formData.append("description",formState.inputs.description.value);
    formData.append("location",formState.inputs.address.value);
    formData.append("creator",auth.userId);
    
    try{

      await sendRequest(
        'https://places-api-phi.vercel.app/api/places',
        'POST',
         formData,
        //  SEND THIS HEADER WHILE SENDING REQUEST
         {Authorization:"randomstring " + auth.token}
      );

      // AFTER CREATING PLACE REDIRECT TO HOMEPAGE

      history.push('/');

    }catch(err)
    {
      
    }
   
  };

  return (
    <React.Fragment>
    <ErrorModal error={error} onClear={clearError}/>
    <form className="place-form" onSubmit={placeSubmitHandler}>
    {isLoading && <LoadingSpinner asOverlay/>}

      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
      />
      <ImageUpload id="image" onInput={inputHandler}/>
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
      />
      <Input
        id="address"
        element="input"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid address."
        onInput={inputHandler}
      />
      <Button type="submit" disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
    </React.Fragment>
  );
};

export default NewPlace;
