import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import LoaderComponent from "../loader";

const ViewMapModal = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState(null);
  const [lat, setLat] = useState(28.61266);
  const [lng, setLng] = useState(77.36105);

  const mapDetails = async () => {
    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 2000));
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
    const newMap = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat, lng },
      zoom: 15,
    });

    setMap(newMap);
    setLoading(false);
  };

  const handleModalClose = () => {
    console.log("modal closed");
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
        padding: "30px 40px",
        backgroundColor: "#FFF",
        borderRadius: 10,
        fontFamily: "DM Sans",
      }}
    >
      <h3 style={{ marginBottom: "15px" }}>View Map</h3>
      <Box
        style={{
          width: "100%",
          height: "420px",
        }}
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              // backgroundColor: "#000000",
              zIndex: 1,
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              opacity: 1,
              color: "#000000",
              // height: "100vh",
              // width: "100vw",
            }}
          >
            <LoaderComponent />
          </div>
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

export default ViewMapModal;
