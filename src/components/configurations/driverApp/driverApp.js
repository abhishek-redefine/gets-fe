import { Box, Stack, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toggleToast } from "@/redux/company.slice";
import OfficeService from "@/services/office.service";

const DriverApp = () => {
  const dispatch = useDispatch();

  const [values, setValues] = useState({
    "vehicle.max.speed": "",
  });

  const [errors, setErrors] = useState({
    "vehicle.max.speed": "",
  });

  const handleValueChange = (name, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleResetButton = () => {
    let allValues = {
      "vehicle.max.speed": "",
    };
    setValues(allValues);
  };

  const fetchPreferenceValues = async (e) => {
    try {
      const response = await OfficeService.getPreferenceById(14);
      if (response && response.data) {
        console.log(
          `Fetched preference for maximum speed limit (kmph): `,
          response.data.value
        );
        handleValueChange("vehicle.max.speed", response.data.value);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const CreatePreference = async () => {
    try {
      const payload = {
        id: 14,
        name: "vehicle.max.speed",
        type: "vehicle",
        value: values["vehicle.max.speed"],
      };
      const response = await OfficeService.createPreference(payload);
      console.log(
        `Configuration response for maximum speed limit (kmph): `,
        response.data
      );

      if (response.status === 201) {
        dispatch(
          toggleToast({
            message: `Vehicle maximum speed limit saved successfully.`,
            type: "success",
          })
        );
      }
      if (response.status === 500) {
        dispatch(
          toggleToast({
            message: `Failed! Please try again later.`,
            type: "error",
          })
        );
      }
    } catch (err) {
      console.log("Error setting preferences", err);
    }
  };

  const handleSave = () => {
    let hasErrors = false;
    const newErrors = { ...errors };

    if (!values["vehicle.max.speed"]) {
      newErrors["vehicle.max.speed"] = "Maximum speed limit is required";
      hasErrors = true;
    } else {
      newErrors["vehicle.max.speed"] = "";
    }

    setErrors(newErrors);

    if (!hasErrors) {
      CreatePreference();
      console.log(
        "Vehicle maximum speed limit (kmph): ",
        values["vehicle.max.speed"]
      );
    } else {
      console.log("Validation errors occurred:", newErrors);
    }
  };

  useEffect(() => {
    fetchPreferenceValues();
  }, []);

  return (
    <div
      style={{
        marginTop: 20,
        backgroundColor: "white",
        padding: "20px 30px",
        borderRadius: 5,
      }}
    >
      <div
        style={{
          // marginTop: 30,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p style={{ flex: 0.3 }}>Maximum Speed Limit (kmph)</p>
        <Box
          style={{
            minWidth: 100,
            width: 250,
            margin: "20px",
            flex: 0.5,
          }}
        >
          <TextField
            id="outlined-basic"
            label="enter number"
            variant="outlined"
            value={values["vehicle.max.speed"]}
            onChange={(e) =>
              handleValueChange("vehicle.max.speed", e.target.value)
            }
            type="number"
            inputProps={{ min: "0", step: "1" }}
            error={!!errors["vehicle.max.speed"]}
            helperText={errors["vehicle.max.speed"]}
          />
        </Box>
      </div>

      <div className="addBtnContainer" style={{ marginTop: 150 }}>
        <div>
          <button className="btn btn-secondary" onClick={handleResetButton}>
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

export default DriverApp;
