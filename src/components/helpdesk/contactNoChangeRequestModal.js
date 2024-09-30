import TripService from "@/services/trip.service";
import { Box, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toggleToast } from "@/redux/company.slice";
import LoaderComponent from "@/components/loader";

const ContactNumberChangeRequestModal = (props) => {
  const dispatch = useDispatch();
  const { onClose, phoneRequestDetails, updatedStatus } = props;
  const [remarks, setRemarks] = useState("");
  const [remarksError, setRemarksError] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchUserDetails = async (e) => {
    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      const response = await TripService.getEmployeeById(
        phoneRequestDetails.empId
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

  const handleModalClose = () => {
    console.log("modal closed");
    onClose();
    updatedStatus("APPROVE");
  };

  const handleReject = () => {
    if (remarks.trim() === "") {
      setRemarksError(true);
    } else {
      console.log("Rejected with remarks:", remarks);
      setRemarksError(false);
      updatedStatus("REJECT");
      onClose();
    }
  };

  const requestData = [
    { oldContactNo: userDetails.mob, newContactNo: phoneRequestDetails.mob },
  ];

  useEffect(() => {
    fetchUserDetails();
  }, [phoneRequestDetails]);

  return (
    <div
      style={{
        backgroundColor: "#FFF",
        borderRadius: 10,
        fontFamily: "DM Sans",
        padding: "30px 40px",
      }}
    >
      <h3 style={{ marginBottom: "10px" }}>Contact Number Change Request</h3>
      {requestData.map((item, index) => (
        <div
          key={index}
          style={{
            fontFamily: "DM Sans",
            display: "flex",
            padding: "10px 0px",
            margin: "0 15px 15px 0",
          }}
        >
          <div style={{ marginRight: "50px" }}>
            <p
              style={{
                fontSize: "15px",
                marginBottom: "2px",
                fontWeight: 600,
                color: "#000",
              }}
            >
              Old Contact Number
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "#838383",
              }}
            >
              {item.oldContactNo}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: "15px",
                marginBottom: "2px",
                fontWeight: 600,
                color: "#000",
              }}
            >
              New Contact Number
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "#838383",
              }}
            >
              {item.newContactNo}
            </p>
          </div>
        </div>
      ))}

      <Box
        component="form"
        style={{
          maxWidth: "100%",
          marginTop: "15px",
          marginBottom: "20px",
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
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "350px",
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

export default ContactNumberChangeRequestModal;
