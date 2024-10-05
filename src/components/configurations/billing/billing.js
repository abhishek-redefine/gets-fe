import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toggleToast } from "@/redux/company.slice";
import LoaderComponent from "@/components/loader";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { styled } from "@mui/material/styles";
import Switch from "@mui/material/Switch";
import OfficeService from "@/services/office.service";

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

const BillingConfigurations = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    "sign.in.out": { slider: false, value: "" },
    "gps.loss": { slider: false, value: "" },
    "improper.duty.hrs": {
      slider: false,
      value: {
        "Max. Time Limit Of Trip (minutes)": "",
        "Min. Time Limit Of Trip (minutes)": "",
      },
    },
    "escort.trip.time.hrs": {
      "start time": "",
      "end time": "",
    },
    "escort.round.trip": { slider: false },
    "first.employee.no.show": { slider: false, value: "" },
    "employee.duplication": { slider: false, value: "" },
    "percentage.to.approve": { slider: false, value: "" },
  });

  const [errors, setErrors] = useState({
    "sign.in.out": "",
    "gps.loss": "",
    "improper.duty.hrs": "",
    "escort.trip.time.hrs": "",
    // "escort.round.trip": "",
    "first.employee.no.show": "",
    "employee.duplication": "",
    "percentage.to.approve": "",
  });

  const fieldText = [
    {
      name: "sign.in.out",
      label: "Sign in/ Sign out",
      textfield: "Geo fence value (meter)",
    },
    {
      name: "gps.loss",
      label: "GPS Loss",
      textfield: "Percentage",
    },
    {
      name: "improper.duty.hrs",
      label: "Improper Duty Hours",
      textfield: {
        Max: "Max. Time Limit Of Trip (min.)",
        Min: "Min. Time Limit Of Trip (min.)",
      },
    },
    {
      name: "escort.trip.time.hrs",
      label: "Escort Trip Time Hours",
    },
    {
      name: "escort.round.trip",
      label: "Escort Round Trip",
    },
    {
      name: "first.employee.no.show",
      label: "First Employee No Show",
      textfield: "Geo fence value (meter)",
    },
    {
      name: "employee.duplication",
      label: "Employee Duplication",
      textfield: "Minimum minutes",
    },
    {
      name: "percentage.to.approve",
      label: "Percentage to approve Kms",
      textfield: "Percentage",
    },
  ];

  const KmOptions = ["Planned Km", "Reference Km"];

  const handleValueChange = (key, value) => {
    setValues((prev) => ({
      ...prev,
      [key]: { ...prev[key], value: value },
    }));
  };

  const handleSwitchChange = (name) => (event) => {
    setValues({
      ...values,
      [name]: { ...values[name], slider: event.target.checked },
    });
  };

  //   const handleTimeChange = (key, timeKey, newValue) => {
  //     setValues((prevValues) => ({
  //       ...prevValues,
  //       [key]: {
  //         ...prevValues[key],
  //         [timeKey]: newValue ? newValue.format("HH:mm") : "",
  //       },
  //     }));
  //   };

  const handleTimeChange = (key, timeKey, newValue) => {
    setValues((prevValues) => ({
      ...prevValues,
      [key]: {
        ...prevValues[key],
        [timeKey]: newValue ? newValue.format("HH:mm") : "",
      },
    }));
  };

  const fetchPreferenceValues = async (e) => {
    let id = "";
    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      for (const field of fieldText) {
        const response = await OfficeService.getPreferenceById(id);
        if (response && response.data) {
          console.log(
            `Fetched preference for ${field.name}:`,
            response.data.value
          );
          handleValueChange(field.name, response.data.value);
        }
        id++;
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const CreatePreference = async () => {
    try {
      //   let idCount = "";
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      for (const field of fieldText) {
        const payload = {
          id: idCount,
          name: field.name,
          type: "trip",
          value: values[field.name].value,
        };
        const response = await OfficeService.createPreference(payload);
        console.log(`Configuration response for ${field.name}`, response.data);

        if (response.status === 201) {
          dispatch(
            toggleToast({
              message: `Preferences saved successfully.`,
              type: "success",
            })
          );
        }
        if (response.status === 500) {
          dispatch(
            toggleToast({
              message: `Failed to save preferences, Please try again later.`,
              type: "error",
            })
          );
        }

        //   idCount++;
      }
    } catch (err) {
      console.log("Error setting preferences", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    let allValues = {
      "sign.in.out": "",
      "gps.loss": "",
      "improper.duty.hrs": "",
      "escort.trip.time.hrs": "",
      "escort.round.trip": "",
      "first.employee.no.show": "",
      "employee.duplication": "",
      "percentage.to.approve": "",
    };
    setValues(allValues);
  };

  const handleSave = () => {
    let hasErrors = false;
    const newErrors = { ...errors };

    fieldText.forEach(({ name, label }) => {
      if (!values[name] || values[name].value === "") {
        newErrors[name] = `${label} is required`;
        hasErrors = true;
      } else {
        newErrors[name] = "";
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      // CreatePreference();
      console.log("Saved Values: ", values);
    } else {
      console.log("Validation errors occurred:", newErrors);
    }
  };

  useEffect(() => {
    // fetchPreferenceValues();
  }, []);

  useEffect(() => {
    console.log("values>>>", values["sign.in.out"].value);
  }, [values]);

  return (
    <div
      style={{
        marginTop: 20,
        backgroundColor: "white",
        padding: "20px 30px",
        borderRadius: 5,
      }}
    >
      {fieldText.map(({ name, label, textfield }) => (
        <div
          key={name}
          style={{
            display: "flex",
            // justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <p style={{ flex: 0.3 }}>{label}</p>
          <Box
            style={{
              minWidth: 100,
              width: 250,
              margin: "20px 0 10px",
              flex: 0.6,
              //   backgroundColor: "pink"
            }}
          >
            {name === "escort.trip.time.hrs" ? (
              <Box
                style={{
                  display: "flex",
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                <FormControl>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimeField
                      label="Start Time"
                      format="HH:mm"
                      size="small"
                      //   value={dayjs()
                      //     .hour(Number(values[name]["start time"].slice(0, 2)))
                      //     .minute(Number(values[name]["start time"].slice(3, 5)))}
                      //   onChange={(e) => {
                      //     var ShiftTime = e.$d
                      //       .toLocaleTimeString("it-IT")
                      //       .slice(0, -3);
                      //     handleTimeChange(name, ShiftTime);
                      //   }}
                      value={dayjs()
                        .hour(Number(values[name]["start time"].slice(0, 2)))
                        .minute(Number(values[name]["start time"].slice(3, 5)))}
                      onChange={(newValue) => {
                        handleTimeChange(name, "start time", newValue);
                      }}
                      sx={{ flex: 0.5 }}
                    />
                  </LocalizationProvider>
                </FormControl>

                <FormControl>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimeField
                      label="End Time"
                      format="HH:mm"
                      size="small"
                      value={dayjs()
                        .hour(Number(values[name]["end time"].slice(0, 2)))
                        .minute(Number(values[name]["end time"].slice(3, 5)))}
                      onChange={(newValue) => {
                        handleTimeChange(name, "end time", newValue);
                      }}
                      sx={{ flex: 0.5, marginLeft: 20 }}
                    />
                  </LocalizationProvider>
                </FormControl>
              </Box>
            ) : (
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  marginLeft: 20,
                }}
              >
                <div style={{ flex: 0.5 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "center" }}
                  >
                    <Typography>No</Typography>
                    <AntSwitch
                      checked={values[name].slider}
                      onChange={handleSwitchChange(name)}
                      inputProps={{ "aria-label": `${name} switch` }}
                    />
                    <Typography>Yes</Typography>
                  </Stack>
                </div>
                {name === "improper.duty.hrs" ? (
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flex: 1.5,
                    }}
                  >
                    <TextField
                      key={name}
                      id="outlined-basic"
                      label={textfield.Max}
                      variant="outlined"
                      size="small"
                      value={values[name].value}
                      onChange={(e) => handleValueChange(name, e.target.value)}
                      type="number"
                      inputProps={{ min: "0", step: "1" }}
                      error={!!errors[name]}
                      helperText={errors[name]}
                      disabled={!values[name].slider}
                      style={{ marginLeft: 20, flex: 0.5 }}
                    />
                    <TextField
                      key={name}
                      id="outlined-basic"
                      label={textfield.Min}
                      variant="outlined"
                      size="small"
                      value={values[name].value}
                      onChange={(e) => handleValueChange(name, e.target.value)}
                      type="number"
                      inputProps={{ min: "0", step: "1" }}
                      error={!!errors[name]}
                      helperText={errors[name]}
                      disabled={!values[name].slider}
                      style={{ marginLeft: 20, flex: 0.5 }}
                    />
                  </Box>
                ) : (
                  <>
                    {(name === "gps.loss" ||
                      name === "percentage.to.approve") && (
                      <FormControl style={{ fontFamily: "DM Sans" }}>
                        <InputLabel
                          id={`${name}-label`}
                          style={{ fontSize: 15, top: "-7px" }}
                        >
                          Select an option
                        </InputLabel>
                        <Select
                          key={name}
                          style={{ flex: 0.5, width: "200px" }}
                          label="Select an option"
                          labelId="onTimeStatus-label"
                          id="onTimeStatus"
                          name="onTimeStatus"
                          size="small"
                          // value={billingInformation2[key]}
                          // onChange={(e) =>
                          //   handleBillingInfo2Change(
                          //     key,
                          //     e.target.value
                          //   )
                          // }
                          disabled={!values[name].slider}
                        >
                          {KmOptions.map((item) => (
                            <MenuItem
                              key={item}
                              value={item}
                              style={{
                                fontSize: "14px",
                              }}
                            >
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                    {name !== "escort.round.trip" && (
                      <TextField
                        key={name}
                        id="outlined-basic"
                        label={textfield}
                        variant="outlined"
                        size="small"
                        value={values[name].value}
                        onChange={(e) =>
                          handleValueChange(name, e.target.value)
                        }
                        type="number"
                        inputProps={{ min: "0", step: "1" }}
                        error={!!errors[name]}
                        helperText={errors[name]}
                        disabled={!values[name].slider}
                        style={{ flex: 0.5, marginLeft: 20 }}
                      />
                    )}
                  </>
                )}
              </div>
            )}
          </Box>
        </div>
      ))}

      <div className="addBtnContainer" style={{ marginTop: 25 }}>
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

export default BillingConfigurations;
