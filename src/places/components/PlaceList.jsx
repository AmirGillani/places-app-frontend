import React from "react";
import PlaceItem from "./PlaceItem";
import Card from "../../shared/components/UIElements/Card";
import "./PlaceList.css";
function PlaceList(props) {
  if(props.userPlaces.length === 0)
  {
    return (
      <Card>
        <h2>No places found</h2> <button>Add Places</button>
      </Card>
    );
  }
  
  return (
    <ul className="place-list">
      <Card>
        {props.userPlaces.map((place) => {
          return (
            <PlaceItem
              key={place.id}
              id={place.id}
              name={place.name}
              description={place.description}
              location={place.location}
              coordinates={place.coordinates}
              imgURL={place.img}
              creator={place.creator}
              onDelete= {props.onDelete}
            />
          );
        })}
      </Card>
    </ul>
  );
}

export default PlaceList;
