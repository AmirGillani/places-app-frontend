import React, { useState, useContext } from "react";
import "./PlaceItem.css";
import Button from "../../shared/components/FormElements/Button/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import { AuthContex } from "../../shared/contex/login-contex";
import useFetch from "../../shared/hooks/useFetch";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
function PlaceItem(props) {
  const [showMap, setMap] = useState(false);
  const [showDeleteModal, setDleteModal] = useState(false);
  const [isLoading, error, sendRequest, clearError] = useFetch();
  const auth = useContext(AuthContex);

  function openMapHandler() {
    setMap(true);
  }

  function closeMapHandler() {
    setMap(false);
  }

  function openDeleteHandler() {
    setDleteModal(true);
  }

  function closeDeleteHandler() {
    setDleteModal(false);
  }

  async function confirmDeletion() {
    try {
      await sendRequest(
        `https://places-api-phi.vercel.app/api/places/${props.id}`,
        "DELETE",
        null,
        { Authorization: "randomstring " + auth.token }
      );

      props.onDelete(props.id);
      setDleteModal(false);
    } catch (err) {}
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      {/* CALL MODAL WITH ANIMATION */}

      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        // SEND PLACE LOCATION
        header={props.location}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        //SEND FUNCTION
        footer={<Button onClick={closeMapHandler}>Close</Button>}
      >
        {/* INNER CONTENT OF MODEL */}

        <div className="map-container">
          <Map center={props.coordinates} zoom={11} />
        </div>
      </Modal>

      <Modal
        show={showDeleteModal}
        onCancel={closeDeleteHandler}
        // SEND PLACE LOCATION
        header={"Do You Want To Delete This Place?!!"}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        //SEND FUNCTION
        footer={
          <div>
            <Button onClick={confirmDeletion}>Delete</Button>
            <Button onClick={closeDeleteHandler}>Cancel</Button>
          </div>
        }
      >
        {/* INNER CONTENT OF MODEL */}

        <p>This can't be undone once you have deleted it ...</p>
      </Modal>

      <li className="place-item">
        {isLoading && <LoadingSpinner asOverlay />}
        <div className="place-item__image">
          <img src={`${props.imgURL}`} alt={props.name} />
        </div>
        <div className="place-item__info">
          <h2>{props.name}</h2>

          <h3>{props.location}</h3>

          <p>{props.description}</p>
        </div>
        <div className="place-item__actions">
          <Button inverse onClick={openMapHandler}>
            VIEW ON MAP
          </Button>
          {auth.userId == props.creator && (
            <Button to={`/places/${props.id}`}>EDIT</Button>
          )}
          {auth.userId == props.creator && (
            <Button danger onClick={openDeleteHandler}>
              DELETE
            </Button>
          )}
        </div>
      </li>
    </React.Fragment>
  );
}
export default PlaceItem;
