import { Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";

const AntSwitch = styled(Switch)(() => ({
  width: 30,
  height: 18,
  padding: 0,
  display: "flex",
  "&:active": {
    "& .MuiSwitch-thumb": {
      width: 15,
    },
    "& .MuiSwitch-switchBase.Mui-checked": {
      transform: "translateX(9px)",
    },
  },
  "& .MuiSwitch-switchBase": {
    padding: "2.5px",
    "&.Mui-checked": {
      transform: "translateX(12px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: "#66C76C",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "0 2px 4px 0 rgb(0 35 11 / 20%)",
    width: 12.5,
    height: 12.5,
    borderRadius: 8,
  },
  "& .MuiSwitch-track": {
    borderRadius: 18 / 2,
    opacity: 1,
    backgroundColor: "rgba(0,0,0,.25)",
    boxSizing: "border-box",
  },
}));

const TripGeoFence = () => {
  const [values, setValues] = useState({
    autoTripStart: { option: false, text: "" },
    autoTripClose: { option: false, text: "" },
  });

  const fieldText = [
    { name: "autoTripStart", label: "Auto Trip Start (Meters)" },
    { name: "autoTripClose", label: "Auto Trip Close (Meters)" },
  ];

  const handleSwitchChange = (name) => (event) => {
    setValues({
      ...values,
      [name]: { ...values[name], option: event.target.checked },
    });
  };

  const handleTextChange = (name) => (event) => {
    setValues({
      ...values,
      [name]: { ...values[name], text: event.target.value },
    });
  };

  const handleReset = () => {
    let allValues = {
      autoTripStart: { option: false, text: "" },
      autoTripClose: { option: false, text: "" },
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
      {fieldText.map((item) => (
        <div
          key={item.name}
          style={{
            // marginTop: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p>{item.label}</p>
          <div>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Typography>No</Typography>
              <AntSwitch
                checked={values[item.name].option}
                onChange={handleSwitchChange(item.name)}
                inputProps={{ "aria-label": `${item.label} switch` }}
              />
              <Typography>Yes</Typography>
            </Stack>
          </div>
          <div className="" style={{ margin: 20, minWidth: 100, width: 300 }}>
            <TextField
              id={`outlined-basic-${item.name}`}
              label="Enter number"
              variant="outlined"
              fullWidth
              size="small"
              value={values[item.name].text}
              onChange={handleTextChange(item.name)}
              type="number"
              inputProps={{ min: "0", step: "1" }}
            />
          </div>
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

export default TripGeoFence;
