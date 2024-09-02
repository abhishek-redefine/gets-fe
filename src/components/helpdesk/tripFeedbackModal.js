import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const TripFeedbackModal = (props) => {
  const { onClose, currentStatus } = props;
  const [remarks, setRemarks] = useState("");
  // const [remarksError, setRemarksError] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState(currentStatus);

  const handleModalClose = () => {
    console.log("modal closed");
    onClose();
  };

  const handleSubmit = () => {
    console.log("Remarks:", remarks);
    handleModalClose();
  };

  const status = ["In Progress", "Pending", "Close"];

  const handleFilterChange = (event) => {
    setUpdatedStatus(event.target.value);
  };

  useEffect(() => {
    console.log("Status changed:", updatedStatus);
  }, [updatedStatus]);

  return (
    <div
      style={{
        backgroundColor: "#FFF",
        borderRadius: 10,
        fontFamily: "DM Sans",
        padding: "30px 40px",
      }}
    >
      <h3 style={{ marginBottom: "20px" }}>Trip Feedback</h3>

      <div style={{ marginBottom: "20px" }}>
        <FormControl fullWidth>
          <InputLabel id="update-status-label">Update Status</InputLabel>
          <Select
            style={{ backgroundColor: "white" }}
            labelId="update-state-label"
            id="updatedStatus"
            name="updatedStatus"
            value={updatedStatus}
            label="Update status"
            onChange={handleFilterChange}
          >
            {status.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

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
        <InputLabel id="remarks-label" style={{fontSize: "15px", color: "#000", marginBottom: "10px"}}>Remarks (optional)</InputLabel>
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
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default TripFeedbackModal;
