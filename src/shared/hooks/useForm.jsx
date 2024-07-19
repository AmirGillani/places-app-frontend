import { useCallback, useReducer } from "react";

  // THIS WILL BE CALLED WHENEVER USER WRITE IN INPUTS 
  // OR WE ASSIGN NEW INPUTS TO FORM

const formReducer = (state, action) => {

  switch (action.type) {
    case "INPUT_CHANGE":
      let formIsValid = true;

    // INTRATE INPUTS OBJECT AND CHECK IF ALL ATTRIBUTES ARE VALID
    // USING FOR IN LOOP (FOR IN LOOP CHECKS OBJECT ATTRIBUTE IN EACH
    // ITRATION AND THEIR VALUES CAN BE CHECKED BY [ATTRIBUTE])

      for (const inputId in state.inputs) {
        if(!state.inputs[inputId])
        {
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      // UPDATE INPUTS AND VALIDATION VALUES
      return {
        ...state,
        inputs: {
          // PREVIOUS VALUES REMANE SAME ONLY THAT INPUT IN WHICH USER HAS
          // WRITTEN SOMETHING WILL BE CHANGED
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid },
        },
        isValid: formIsValid,
      };

    case "SET_INPUT":
      return {
        inputs: action.newInputs,
        isValid: action.newValidation,
      };
    default:
      return {...state};
  }
};

function useForm(initialFormState, initialFormValidation) {

  // WITH THE HELP OF DISPATCH WE CAN CHANGE FORMSTATE OBJECT
  // WHENEVER DISPATCH IS CALLED IT AUTOMATICALLY CALLS FORM REDUCER 
  
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialFormState,
    isValid: initialFormValidation,
  });

  //this will put values calculated from input component
  // AND WILL CHECKS VALIDATION

  const inputHandler = useCallback((id, value, isValid) => {
    dispatch({
      type: "INPUT_CHANGE",
      value: value,
      isValid: isValid,
      inputId: id,
    });
  }, []);

  const setInput = useCallback((newInputs, newValidation) => {
    dispatch({
      type: "SET_INPUT",
      newInputs:newInputs,
      newValidation: newValidation,
    });
  }, []);

  return [formState, inputHandler, setInput];
}

export { useForm };
