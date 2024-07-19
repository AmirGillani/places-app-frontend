import React from "react";

import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";

import "./Map.css";

const style={ width: "97%", height: "65%" };

export class MapContainer extends React.Component {
  render() {
    return (
      <Map
        google={this.props.google}
        zoom={this.props.zoom}
        center={this.props.center}
        style={style}
      >
        <Marker onClick={this.onMarkerClick} name={"Current location"} />

        <InfoWindow onClose={this.onInfoWindowClose}></InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyDgLmMpKCzveJf1_yuA0fUzzhy0WRChvZA",
})(MapContainer);
