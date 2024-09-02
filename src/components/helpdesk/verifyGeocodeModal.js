import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";

const VerifyGeocodeModal = ({ onClose, geocodeLat, geocodeLng}) => {
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState(null);
  const [lat, setLat] = useState(geocodeLat);
  const [lng, setLng] = useState(geocodeLng);
  

  const mapDetails = async () => {
    setLoading(true);
    try {
      setLat(geocodeLat);
      setLng(geocodeLng);
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
      gmpDraggable: false,
      map: newMap,
      title: "This marker is draggable.",
    });

    setMap(newMap);
    setLoading(false);
  };

  const handleModalClose = () => {
    console.log("Verify geocode modal closed");
    onClose();
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

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#FFF",
        borderRadius: 10,
        fontFamily: "DM Sans",
      }}
    >
      <h3 style={{ marginBottom: "15px" }}>View Map</h3>
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
          onClick={handleModalClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default VerifyGeocodeModal;
