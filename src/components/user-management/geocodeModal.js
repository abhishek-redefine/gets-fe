import { Box, FormControl, MenuItem, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

const GeocodeModal = ({ geocode, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState(null);
  const [lat, setLat] = useState(28.61266);
  const [lng, setLng] = useState(77.36105);
  const [marker, setMarker] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const searchTextFieldRef = useRef(null);


  const mapDetails = async () => {
    setLoading(true);
    try {
      setLat(28.61266);
      setLng(77.36105);
    } catch (error) {
      console.error("Error fetching map details", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    mapDetails();
  }, []);



  const initializeMap = async () => {
    
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    const newMap = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat, lng },
      zoom: 15,
      mapId: "4504f8b37365c3d0",
    });

    const newMarker = new AdvancedMarkerElement({
      position: { lat, lng },
      gmpDraggable: true,
      map: newMap,
      title: "This marker is draggable.",
    });

    setMap(newMap);
    setMarker(newMarker);
    setLoading(false);
  };

  useEffect(() => {
    const loadMapScript = () => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC3XA5d-1ff6W3bK_NDxqKSb05ovVtQk68&libraries=places`;
      script.async = true;
      script.onload = () => {
        initializeMap();
      };
      document.body.appendChild(script);
    };

    loadMapScript();

    return () => {
      const scripts = document.getElementsByTagName("script");
      for (let i = 0; i < scripts.length; i++) {
        if (scripts[i].src.includes("maps.googleapis.com")) {
          scripts[i].remove();
        }
      }
    };
  }, [lat, lng]);

  const fetchPlacePredictions = (input) => {
    if (!window.google || !window.google.maps) {
      return;
    }

    const service = new window.google.maps.places.AutocompleteService();

    service.getPlacePredictions({ input }, (predictions, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
        setPredictions(predictions);
      } else {
        setPredictions([]);
      }
    });
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setSearchText(value);
    if (value) {
      fetchPlacePredictions(value);
    } else {
      setPredictions([]);
    }
  };

  const handlePlaceSelect = (placeId) => {
    const service = new window.google.maps.places.PlacesService(map);
    service.getDetails({ placeId }, (place, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && place.geometry) {
        const location = place.geometry.location;
        setLat(location.lat());
        setLng(location.lng());

        if (marker) {
          marker.position = location; 
        }
        if (map) {
          map.panTo(location);
        }
        setPredictions([]);
        setSearchText(''); 
      }
    });
  };

  const handleSave = () => {
    if (typeof geocode === 'function') {
      console.log('in geocode');
      geocode(`${lat}, ${lng}`);
    }
    onClose();
    console.log("lat: ", lat, "lng :", lng)
  };



  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#FFF",
        borderRadius: 10,
        fontFamily: "DM Sans",
      }}
    >
      {/* Address autocomplete */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          // backgroundColor: "yellow"
        }}
      >
        <h3>Geocode</h3>
          <FormControl
            style={{
              fontFamily: "DM Sans",
              width: "290px",
              // backgroundColor: "pink",
            }}
          >
            <TextField
              label="Address"
              size="small"
              fullWidth
              value={searchText}
              style={{ backgroundColor: "white", height: "40px", fontSize: "15px", }}
              inputRef={searchTextFieldRef}
              onChange={handleInputChange}
            />
            {predictions.length > 0 && (
              <Box
                style={{
                  width: "100%",
                  backgroundColor: "white",
                  border: "1px solid #ccc",
                  maxHeight: "100px",
                  overflowY: "auto",
                  position: "absolute",
                  top: "41px",
                  zIndex: 2,
                }}
              >
                {predictions.map((prediction) => (
                  <MenuItem
                    key={prediction.place_id}
                    value={prediction.place_id}
                    style={{ fontSize: "15px", zIndex: 1 }}
                    onClick={() => handlePlaceSelect(prediction.place_id)}
                  >
                    {prediction.description}
                  </MenuItem>
                ))}
              </Box>
            )}
          </FormControl>
      </div>
      <Box
        style={{
          width: "100%",
          height: "400px",
        }}
      >
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div id="map" style={{ width: "100%", height: "100%" }}></div>
        )}
      </Box>

      {/* Save Button */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          type="button"
          style={{
            backgroundColor: "#f6ce47",
            color: "black",
            border: "none",
            borderRadius: "6px",
            fontSize: "15px",
            padding: "13px 50px",
            cursor: "pointer",
            marginTop: "20px",
          }}
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default GeocodeModal;
