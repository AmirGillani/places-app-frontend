import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import { AuthContex } from "../../shared/contex/login-contex";
import Card from "../../shared/components/UIElements/Card";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import useFetch from "../../shared/hooks/useFetch";

function UserPlace() {

  const userId = useParams().userId;

  const auth = useContext(AuthContex);

  const [userPlaces, setUserPlaces] = useState([]);

  const [isLoading, error, sendRequest, clearError] = useFetch();

  useEffect(() => {

    async function fetchPlaces() {

      try{
        const result = await sendRequest(
          `https://places-api-phi.vercel.app/api/places/user/${userId}`
        );
  
        setUserPlaces(result);
      }catch(err){}


    }

    fetchPlaces();

  }, [sendRequest, userId]);

  // THIS WILL REMOVE DELETED PLACE FROM USESTATE VARIABLE USEPLACES
  // AND RERENDER PLACE LIST

  function deleteHandler(placeToDeleteId)
  {
    
    setUserPlaces(function(prevPlaces)
    {
     return prevPlaces.filter(place => place.id !== placeToDeleteId);
    });

  }

   if(!isLoading && userPlaces.length == 0 )
   {
     return (<Card className="center"><h1>No Places Found</h1></Card>)
   }
   
  return (
    <React.Fragment>

      <ErrorModal error={error} onClear={clearError} />

      <div>{isLoading && <LoadingSpinner asOverlay />}</div>

      <PlaceList userPlaces={userPlaces} onDelete={deleteHandler} />

    </React.Fragment>
  );
}

export default UserPlace;
