import { Box, TextField } from "@mui/material";
import React, { useState } from "react";

const ContactNumberChangeRequestModal = (props) => {
  const { onClose } = props;
  const [remarks, setRemarks] = useState("");
  const [remarksError, setRemarksError] = useState(false);

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

  const requestData = [
    { oldContactNo: "9900112543", newContactNo: "8796543478" },
  ];

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
    </div>
  );
};

export default ContactNumberChangeRequestModal;