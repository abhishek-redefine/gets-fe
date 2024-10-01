import { Autocomplete, Box, Grid, Modal, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import VerifyGeocodeModal from "./verifyGeocodeModal";
import TripService from "@/services/trip.service";
import { useDispatch } from "react-redux";
import { toggleToast } from "@/redux/company.slice";
import LoaderComponent from "@/components/loader";

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
  const dispatch = useDispatch();
  const { onClose, addressRequestDetails, updatedStatus } = props;
  const [remarks, setRemarks] = useState("");
  const [remarksError, setRemarksError] = useState(false);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [openGeocodeModal, setOpenGeocodeModal] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchUserDetails = async (e) => {
    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      const response = await TripService.getEmployeeById(
        addressRequestDetails.empId
      );
      console.log("User Details>>>", response.data);
      setUserDetails(response.data);
      if (response.status === 500) {
        dispatch(
          toggleToast({
            message: "Failed! Try again later.",
            type: "error",
          })
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const requestData = [
    {
      oldAddress: {
        Address: userDetails.address,
        Landmark: userDetails.landMark,
        Geocode: userDetails.geoCode,
        Zone: userDetails.zoneName,
        Area: userDetails.areaName,
        "Nodal Point": userDetails.nodal,
      },
      newAddress: {
        Address: addressRequestDetails.address,
        Landmark: addressRequestDetails.landMark,
        Geocode: addressRequestDetails.geoCode,
        Zone: addressRequestDetails.zoneName,
        Area: addressRequestDetails.areaName,
        "Nodal Point": addressRequestDetails.nodal,
      },
    },
  ];

  const handleModalClose = () => {
    console.log("modal closed");
    onClose();
    updatedStatus("APPROVE");
  };

  const handleReject = () => {
    if (remarks.trim() === "") {
      setRemarksError(true);
    } else {
      console.log("Rejected with remarks: ", remarks);
      setRemarksError(false);
      updatedStatus("REJECT");
      onClose();
    }
  };

  const handleGeocodeModalOpen = () => {
    console.log("Verify btn clicked & address modal closed");
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

  useEffect(() => {
    fetchUserDetails();
  }, [addressRequestDetails]);

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
        " "
      )}
    </div>
  );
};

export default AddressChangeRequestModal;
