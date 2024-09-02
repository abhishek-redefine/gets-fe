import { Autocomplete, Box, Grid, Modal, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import VerifyGeocodeModal from "./verifyGeocodeModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  bgcolor: "background.paper",
  height: "auto",
  borderRadius: 5,
};

const AddressChangeRequestModal = (props) => {
  const { onClose } = props;
  const [remarks, setRemarks] = useState("");
  const [remarksError, setRemarksError] = useState(false);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [openGeocodeModal, setOpenGeocodeModal] = useState(false);

  const requestData = [
    {
      oldAddress: {
        Address: "Noida Sector 59",
        Landmark: "Near Wave Mall",
        Geocode: "28.5586, 77.3422",
        Zone: "Noida",
        Area: "Sector 59",
        "Nodal Point": "Sector 59 Metro Station",
      },
      newAddress: {
        Address: "Laxmi Nagar",
        Landmark: "Near Laxmi Nagar Metro Station",
        Geocode: "28.63107, 77.27704",
        Zone: "Delhi",
        Area: "Laxmi Nagar",
        "Nodal Point": "Laxmi Nagar Metro Station",
      },
    },
  ];

  const handleModalClose = () => {
    console.log("modal closed");
    onClose();
  };

  const handleReject = () => {
    if (remarks.trim() === "") {
      setRemarksError(true);
    } else {
      console.log("Rejected with remarks:", remarks);
      setRemarksError(false);
      handleModalClose();
    }
  };

  const handleGeocodeModalOpen = () => {
    console.log("Verify btn clicked & address modal closed");
    console.log("Verify geocode modal open");
    setOpenGeocodeModal(true);
    console.log("lat>>>", lat, "lng>>>", lng);
  };
  const handleGeocodeModalClose = () => {
    console.log("Verify geocode modal close");
    setOpenGeocodeModal(false);
  };

  const { oldAddress } = requestData[0];
  const { newAddress } = requestData[0];

  let oldAddressSring = Object.entries(oldAddress)
    .filter(([key]) => key !== "Geocode")
    .map(([key, value]) => `${value}`)
    .join(", ");

  let newAddressSring = Object.entries(newAddress)
    .filter(([key]) => key !== "Geocode")
    .map(([key, value]) => `${value}`)
    .join(", ");

  useEffect(() => {
    const employeeGeocode = requestData[0].newAddress.Geocode;
    const geocodeSeparate = employeeGeocode.split(",");
    setLat(parseFloat(geocodeSeparate[0]));
    setLng(parseFloat(geocodeSeparate[1]));
  }, []);

  return (
    <div
      style={{
        backgroundColor: "#FFF",
        borderRadius: 10,
        fontFamily: "DM Sans",
        padding: "30px 40px",
        // backgroundColor: "yellow",
      }}
    >
      <h3 style={{ marginBottom: "10px" }}>Address Change Request</h3>

      <div style={{ marginBottom: "20px" }}>
        <p
          style={{
            fontSize: "15px",
            marginBottom: "2px",
            fontWeight: 600,
            color: "#000",
          }}
        >
          Old Address
        </p>

        <div style={{ display: "flex" }}>
          <p
            style={{
              fontSize: "14px",
              color: "#838383",
              lineHeight: "20px",
            }}
          >
            {oldAddressSring}
          </p>
        </div>

        <div style={{}}>
          <p
            style={{
              fontSize: "15px",
              marginTop: "10px",
              marginBottom: "2px",
              fontWeight: 600,
              color: "#000",
            }}
          >
            Geocode
          </p>
          <p
            style={{
              fontSize: "14px",
              color: "#838383",
            }}
          >
            {oldAddress.Geocode}
          </p>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <p
          style={{
            fontSize: "15px",
            marginBottom: "2px",
            fontWeight: 600,
            color: "#000",
          }}
        >
          New Address
        </p>

        <div style={{ display: "flex" }}>
          <p
            style={{
              fontSize: "14px",
              color: "#838383",
              lineHeight: "20px",
            }}
          >
            {newAddressSring}
          </p>
        </div>

        <div style={{ }}>
          <p
            style={{
              fontSize: "15px",
              marginTop: "10px",
              marginBottom: "2px",
              fontWeight: 600,
              color: "#000",
            }}
          >
            Geocode
          </p>
          <p
            style={{
              fontSize: "14px",
              color: "#838383",
            }}
          >
            {newAddress.Geocode}
          </p>
        </div>
      </div>

      <Box
        component="form"
        style={{
          maxWidth: "100%",
          marginTop: "15px",
          marginBottom: "20px",
          // backgroundColor: "pink"
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-basic"
          label="Write your remarks"
          variant="outlined"
          fullWidth
          multiline
          rows={3}
          size="small"
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          error={remarksError}
          helperText={
            remarksError ? "Remarks are mandatory for rejection." : ""
          }
          inputProps={{
            style: {
              fontFamily: "DM Sans",
              fontSize: 15,
            },
          }}
        />
      </Box>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          // backgroundColor: "pink",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "500px",
          }}
        >
          <button
            type="button"
            style={{
              backgroundColor: "#f6ce47",
              color: "black",
              border: "none",
              borderRadius: "6px",
              fontSize: "15px",
              padding: "13px 30px",
              cursor: "pointer",
            }}
            onClick={handleGeocodeModalOpen}
          >
            Verify Geocode
          </button>
          <Modal
            open={openGeocodeModal}
            onClose={handleGeocodeModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <VerifyGeocodeModal
                onClose={() => handleGeocodeModalClose()}
                geocodeLat={lat}
                geocodeLng={lng}
              />
            </Box>
          </Modal>
          <button
            type="button"
            style={{
              backgroundColor: "#f6ce47",
              color: "black",
              border: "none",
              borderRadius: "6px",
              fontSize: "15px",
              padding: "13px 40px",
              cursor: "pointer",
            }}
            onClick={handleModalClose}
          >
            Accept
          </button>
          <button
            type="button"
            style={{
              backgroundColor: "#f6ce47",
              color: "black",
              border: "none",
              borderRadius: "6px",
              fontSize: "15px",
              padding: "13px 40px",
              cursor: "pointer",
            }}
            onClick={handleReject}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressChangeRequestModal;
