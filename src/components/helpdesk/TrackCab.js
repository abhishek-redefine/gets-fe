import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";

const TrackCab = ({ onClose }) => {
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState(null);
  const [lat, setLat] = useState(28.61266);
  const [lng, setLng] = useState(77.36105);

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
    const newMap = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat, lng },
      zoom: 15,
    });

    setMap(newMap);
    setLoading(false);
  };

  const handleTrackCabClose = () => {
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
      style={{ backgroundColor: "#f9f9f9", padding: "25px 30px", marginTop: "20px" }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "20px",
          // backgroundColor: "pink",
        }}
      >
        <img
          src="/images/cross.png"
          height={30}
          width={30}
          style={{
            cursor: "pointer",
            // backgroundColor: "green",
          }}
          onClick={handleTrackCabClose}
        />
      </Box>
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
            height: "600px",
          }}
        >
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div id="map" style={{ width: "100%", height: "100%" }}></div>
          )}
        </Box>
      </div>
    </div>
  );
};

export default TrackCab;
