import React, { useEffect, useState ,useContext} from "react";
import { useParams , useHistory } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input/Input";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/useForm";
import useFetch from "../../shared/hooks/useFetch";
import { AuthContex } from "../../shared/contex/login-contex";
import Button from "../../shared/components/FormElements/Button/Button";

import "./NewPlace.css";


// UPDATE FUNCTION

function UpdatePlace() {

  const auth = useContext(AuthContex);

  const history = useHistory();

  // GET PLACE ID FROM URL

  const placeId = useParams().placeid;

  // USE CUSTUM HOOK TO UPDATE OBJECT AND LHS HAVE EXPORTED
  // FUNCTIONS AND OBJECTS WHICH WE CAN USE HERE

  const [formState, inputHandler, setInput] = useForm(
    {
      title: { value: "", isValid: false },
      description: { value: "", isValid: false },
    },
    false
  );

  const [isLoading, error, sendRequest, clearError] = useFetch();

  const [placeToEdit, setPlace] = useState();

  useEffect(() => {

    async function fetchPlace() {

      const responseData = await sendRequest(
        `https://places-api-phi.vercel.app/api/places/${placeId}`
      );

      setPlace(responseData.place);

      setInput(
        {
          title: { value: responseData.title, isValid: true },
          description: { value: responseData.description, isValid: true },
        },
        true
      );
    }
    fetchPlace();
  }, [sendRequest, placeId]);

  async function submitHandler(event) {

    event.preventDefault();

    await sendRequest(
      `https://places-api-phi.vercel.app/api/places/${placeId}`,
      "PATCH",
      JSON.stringify({
        title: formState.inputs.title.value,
        description: formState.inputs.description.value,
      }),
      {
        "Content-Type": "application/json",
        Authorization:"randomstring " + auth.token
      }
    );

    history.push("/");
  }

  if (isLoading) {
    return (
      <form className="center">
        <Card>
          <LoadingSpinner />
        </Card>
      </form>
    );
  }

  if (!placeToEdit && !error) {
    return (
      <form className="center">
        <Card>
          <h2>No Place Found</h2>
        </Card>
      </form>
    );
  }

  return (
    <React.Fragment>
    <ErrorModal error={error} onClear={clearError} />
      {!isLoading && placeToEdit && (
        <form
          className="place-form"
          onSubmit={submitHandler}
        >
          <Input
            id="title"
            element="input"
            type="text"
            label="Title"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a valid title."
            onInput={inputHandler}
            previousInput={placeToEdit.title}
            previousValidation={formState.inputs.title.isValid}
          />
          <Input
            id="description"
            element="textarea"
            label="Description"
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText="Please enter a valid description (at least 5 characters)."
            onInput={inputHandler}
            previousInput={placeToEdit.description}
            previousValidation={formState.inputs.description.isValid}
          />
          <Button type="submit" disabled={!formState.isValid}>
            Update
          </Button>
        </form>
      )}
      ;
    </React.Fragment>
  );
}

export default UpdatePlace;
