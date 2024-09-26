import { Box, TextField } from "@mui/material";
import React, { useState } from "react";

const TransportDetails = () => {
  const [values, setValues] = useState({
    "Transport Contact Number (With Country Code)": "",
    "Emergency Contact Number (With Country Code)": "",
    "Feedback Email ID": "",
  });

  const handleValueChange = (key, value) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    let allValues = {
      "Transport Contact Number (With Country Code)": "",
      "Emergency Contact Number (With Country Code)": "",
      "Feedback Email ID": "",
    };
    setValues(allValues);
  };

  const handleSave = () => {
    console.log("Saved values: ", values);
  };

  return (
    <div
      style={{
        marginTop: 20,
        backgroundColor: "white",
        padding: "20px 30px",
        borderRadius: 5,
      }}
    >
      {Object.entries(values).map(([key]) => (
        <div
          key={key}
          style={{
            // marginTop: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p key={key} style={{ flex: 1, margin: "20px 0" }}>
            {key}
          </p>
          <Box style={{ flex: 0.5, margin: 20, minWidth: 100, width: 250 }}>
            {key === "Feedback Email ID" ? (
              <TextField
                key={key}
                label="enter email id"
                variant="outlined"
                fullWidth
                size="small"
                value={values[key]}
                onChange={(e) => handleValueChange(key, e.target.value)}
              />
            ) : (
              <TextField
                key={key}
                label="enter multiple numbers comma separated"
                variant="outlined"
                fullWidth
                size="small"
                value={values[key]}
                onChange={(e) => handleValueChange(key, e.target.value)}
              />
            )}
          </Box>
        </div>
      ))}
      <div className="addBtnContainer" style={{ marginTop: 150 }}>
        <div>
          <button className="btn btn-secondary" onClick={handleReset}>
            Reset
          </button>
        </div>
        <div style={{ display: "flex" }}>
          <button className="btn btn-secondary">Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransportDetails;
