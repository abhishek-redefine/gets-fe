import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toggleToast } from "@/redux/company.slice";
import OfficeService from "@/services/office.service";
import LoaderComponent from "@/components/loader";

const DriverCompliance = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({
    "driver.license": "",
    "driver.medical.cert": "",
    "driver.police.verification": "",
    "driver.bgb": "",
    "driver.dd.training": "",
    "Driver Compliance Notification Type": [],
    // mobileNumbers: "",
    // emailIds: "",
    // notificationFrequency: "",
  });

  const [errors, setErrors] = useState({
    "driver.license": "",
    "driver.medical.cert": "",
    "driver.police.verification": "",
    "driver.bgb": "",
    "driver.dd.training": "",
  });

  const fieldText = [
    { name: "driver.license", label: "License" },
    { name: "driver.medical.cert", label: "Medical Fitness" },
    { name: "driver.police.verification", label: "Police Verification" },
    {
      name: "driver.bgb",
      label: "BGB",
    },
    {
      name: "driver.dd.training",
      label: "DD Training",
    },
    {
      name: "Driver Compliance Notification Type",
      label: "Driver Compliance Notification Type",
    },
  ];

  const handleValueChange = (key, value) => {
    setValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNotificationChange = (notification) => {
    setValues((prevValues) => {
      const currentNotifications =
        prevValues["Driver Compliance Notification Type"];
      const updatedNotifications = currentNotifications.includes(notification)
        ? currentNotifications.filter((item) => item !== notification)
        : [...currentNotifications, notification];
      return {
        ...prevValues,
        "Driver Compliance Notification Type": updatedNotifications,
      };
    });
  };

  const fetchPreferenceValues = async (e) => {
    let id = 9;
    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      for (const field of fieldText) {
        if (field.name !== "Driver Compliance Notification Type") {
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
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const CreatePreference = async () => {
    try {
      let idCount = 9;
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      for (const field of fieldText) {
        if (field.name !== "Driver Compliance Notification Type") {
          const payload = {
            id: idCount,
            name: field.name,
            type: "driver",
            value: values[field.name],
          };
          const response = await OfficeService.createPreference(payload);
          console.log(
            `Configuration response for ${field.name}`,
            response.data
          );

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

          idCount++;
        }
      }
    } catch (err) {
      console.log("Error setting preferences", err);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    let allValues = {
      "driver.license": "",
      "driver.medical.cert": "",
      "driver.police.verification": "",
      "driver.bgb": "",
      "driver.dd.training": "",
      "Driver Compliance Notification Type": [],
      // mobileNumbers: "",
      // emailIds: "",
      // notificationFrequency: "",
    };
    setValues(allValues);
  };

  const handleSave = () => {
    let hasErrors = false;
    const newErrors = { ...errors };

    fieldText.forEach(({ name, label }) => {
      if (!values[name]) {
        newErrors[name] = `${label} is required`;
        hasErrors = true;
      } else {
        newErrors[name] = "";
      }
    });

    setErrors(newErrors);

    if (!hasErrors) {
      CreatePreference();
      console.log("Saved Values: ", values);
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
      <Box style={{ display: "flex", minWidth: 200 }}>
        <div style={{ flex: 0.08 }}></div>
        <p style={{ flex: 0.5, textAlign: "right" }}>
          Notifications Start From (Days Before Expiry)
        </p>
      </Box>
      {fieldText.map(({ name, label }) => (
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
              flex: 0.5,
            }}
          >
            {name === "Driver Compliance Notification Type" ? (
              <div className="form-control-input">
                <FormControl required>
                  <FormGroup style={{ flexDirection: "row", marginLeft: 30 }}>
                    <FormControlLabel
                      value="EMAIL"
                      control={
                        <Checkbox
                          checked={values[
                            "Driver Compliance Notification Type"
                          ].includes("EMAIL")}
                          onChange={() => handleNotificationChange("EMAIL")}
                        />
                      }
                      label="Email"
                    />
                    <FormControlLabel
                      value="SMS"
                      control={
                        <Checkbox
                          checked={values[
                            "Driver Compliance Notification Type"
                          ].includes("SMS")}
                          onChange={() => handleNotificationChange("SMS")}
                        />
                      }
                      label="SMS"
                    />
                  </FormGroup>
                </FormControl>
              </div>
            ) : (
              <TextField
                id="outlined-basic"
                label="enter number"
                variant="outlined"
                // fullWidth
                size="small"
                value={values[name]}
                onChange={(e) => handleValueChange(name, e.target.value)}
                type="number"
                inputProps={{ min: "0", step: "1" }}
                error={!!errors[name]}
                helperText={errors[name]}
              />
            )}
          </Box>
        </div>
      ))}
      {/* <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p>Mobile Numbers For Driver Compliance</p>
        <div className="form-control-input" style={{ width: "60%" }}>
          <TextField
            id="outlined-basic"
            label="multiple mobile numbers comma separated"
            variant="outlined"
            fullWidth
            size="small"
            value={values.mobileNumbers}
            onChange={(e) => handleInputChange("mobileNumbers", e.target.value)}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p>Email IDs For Driver Compliance</p>
        <div className="form-control-input" style={{ width: "60%" }}>
          <TextField
            id="outlined-basic"
            label="multiple email Ids comma separated"
            variant="outlined"
            fullWidth
            size="small"
            value={values.emailIds}
            onChange={(e) => handleInputChange("emailIds", e.target.value)}
          />
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p>Notification Repeat Frequency(Days)</p>
        <div className="form-control-input" style={{ width: "60%" }}>
          <TextField
            id="outlined-basic"
            label="enter number"
            variant="outlined"
            fullWidth
            size="small"
            value={values.notificationFrequency}
            onChange={(e) =>
              handleInputChange("notificationFrequency", e.target.value)
            }
            type="number"
            inputProps={{ min: "0", step: "1" }}
          />
        </div>
      </div> */}
      <div className="addBtnContainer" style={{ marginTop: 10 }}>
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

export default DriverCompliance;
