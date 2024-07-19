import React, { useRef, useEffect } from 'react';

import './Map.css';

const Map = props => {

  //create reference variable
 const mapRef= useRef();

  //destructured props
  const { center, zoom } = props;

  //load this code when params changes
  useEffect(() => {
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom
    });

    new window.google.maps.Marker({ position: center, map: map });
  }, [center, zoom]);

  return (
    <div
    // attach map creating functiond to div
      ref={mapRef}
      id="map"
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;


