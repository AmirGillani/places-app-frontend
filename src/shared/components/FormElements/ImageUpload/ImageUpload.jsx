import React, { useRef, useState , useEffect} from "react";

import Button from "../Button/Button";

import "./ImageUpload.css";

function ImageUpload(props) {

  const filePickerRef = useRef();

  const [selectedFile, setFile] = useState();

  const [previewURL, setPreviewURL] = useState();

  const [isValid, setIsValid] = useState(false);

//   UPDATE PREVIEW EVERY TIME FILE IS SELECTED

  useEffect(() => {

    if (!selectedFile) {
      return;
    }

// FILE READER API WILL READ FILE AND CAN CONVERT IT INTO URL OR TEXT ETC

    const fileReader = new FileReader();

    // FILE USER HAS SELECTED IS IN BINARY FORMAT USE READ AS URL
    // TO CONVERT IT INTO HUMAN READABLE URL

    fileReader.readAsDataURL(selectedFile);

    // ONCE FILE IS READED IT SHOULD ALWAYS USE ON LOAD FUNCTION 
    // WHICH WILL GIVE US .RESULT ATTRIBUTE WHICH WE CAN USE

    fileReader.onload = () => {

        // SELECTED FILE URL WILL BE PRESENT IN RESULT
        
        setPreviewURL(fileReader.result);
    };

  }, [selectedFile]);

//   THIS WILL RUN WHEN USER SELECT ONE IMG

  function pickHandler(event) {

    // THESE TWO VARIABLES ARE CREATED BECAUSE SET FUNCTIONS
    // WILL TAKE SOME TIMES TO RESET USESTATE VALUE SO TEMPORARLY
    // STORE THEIR UPDATED VALUES IN THESE VARIABLES

    let pickedFile;
    let fileIsValid = isValid;

    // IF USER HAS SELECTED FILE 
    if (event.target.files && event.target.files.length === 1) {

        //PICK THAT FILE USING EVENTS

      pickedFile = event.target.files[0];

        //SET THAT FILE IN USESTATE VARIABLES

      setFile(pickedFile);
      setIsValid(true);

      fileIsValid= true;
    }
    else{

        // IF FILE IS NOT SELECTED THEN UPDATE USESTATES AS FOLLOW

        setIsValid(false);
        fileIsValid= false;
    }

    // CALL ONINPUT FUNCTION AND PUT TEMPORARY VARIABLES VALUES THERE 
    // BECAUSE ACTUAL USESTATE VALUES ARE NOT UPDATED YET

    props.onInput(props.id , pickedFile , fileIsValid )
  }

  function pickImageHandler() {
    // THIS CLICK METHOD WILL OPEN INPUT TAG
    // WHICH IS FILE UPLOAD BUTTON WHICH IS CLICKED

    filePickerRef.current.click();
  }

  return (
    <div className="form-control">
      <input
        id={props.id}
        type="file"
        // DONT SHOW THIS BUTTON DIRECTLY BUT PICK IMAGE BUTTON WILL
        // INDIRECTLY OPEN THIS INPUT BUTTON TAG

        style={{ display: "none" }}
        accept=".jpg,.png,.jpeg"
        ref={filePickerRef}
        onChange={pickHandler}
      />
      <div className={`image-upload ${props.center || "center"}`}>
        <div className="image-upload__preview">
         {previewURL && <img src={previewURL} alt="preview" />} 
         {!previewURL && <p>Please Upload One Image</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          PICK IMAGE
        </Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
}

export default ImageUpload;
