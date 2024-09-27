import React, { useEffect, useState } from "react";
import Configurations from "@/layouts/configurations";
import OfficeService from "@/services/office.service";
import { getFormattedLabel } from "@/utils/utils";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { toggleToast } from "@/redux/company.slice";

const Employee = () => {
  const dispatch = useDispatch();

  const [values, setValues] = useState({
    "emp.change.request": "",
  });

  const [errors, setErrors] = useState({
    "emp.change.request": "",
  });
  const [officeList, setOfficeList] = useState([]);
  const [officeId, setOfficeId] = useState("");

  const fetchAllOffice = async () => {
    try {
      const response = await OfficeService.getAllOffices();
      const { data } = response || {};
      const { clientOfficeDTO } = data || {};
      console.log(clientOfficeDTO, "Client office Dto");
      setOfficeList(clientOfficeDTO);
    } catch (err) {
      console.log(err);
    }
  };

  const resetFilter = () => {
    setOfficeId("");
  };

  const handleValueChange = (name, value) => {
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleResetButton = () => {
    let allValues = {
      "emp.change.request": "",
    };
    setValues(allValues);
  };

  const fetchPreferenceValues = async (e) => {
    try {
      const response = await OfficeService.getPreferenceById(1);
      if (response && response.data) {
        console.log(
          `Fetched preference for employee's address change request: `,
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
        id: 1,
        name: "emp.change.request",
        type: "employee",
        value: values["emp.change.request"],
      };
      const response = await OfficeService.createPreference(payload);
      console.log(
        `Configuration response for employee's address change request`,
        response.data
      );

      if (response.status === 201) {
        dispatch(
          toggleToast({
            message: `Address change request limit saved successfully.`,
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

    if (!values["emp.change.request"]) {
      newErrors["emp.change.request"] = "Address Change request is required";
      hasErrors = true;
    } else {
      newErrors["emp.change.request"] = "";
    }

    setErrors(newErrors);

    if (!hasErrors) {
      CreatePreference();
      console.log(
        "Raise address change request in a month: ",
        values["emp.change.request"]
      );
    } else {
      console.log("Validation errors occurred:", newErrors);
    }
  };

  useEffect(() => {
    fetchAllOffice();
    fetchPreferenceValues();
  }, []);

  return (
    <div className="mainSettingsContainer">
      <h2>Employee</h2>

      {/* <div style={{ display: "flex" }}>
        <div
          style={{ minWidth: "180px", marginLeft: 0 }}
          className="form-control-input"
        >
          <FormControl fullWidth>
            <InputLabel id="primary-office-label">Primary Office</InputLabel>
            <Select
              style={{ width: "180px", backgroundColor: "#ffffff" }}
              labelId="primary-office-label"
              id="officeId"
              value={officeId}
              name="officeId"
              label="Office ID"
              onChange={(e) => setOfficeId(e.target.value)}
            >
              {!!officeList?.length &&
                officeList.map((office, idx) => (
                  <MenuItem key={idx} value={office.officeId}>
                    {getFormattedLabel(office.officeId)}, {office.address}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
        <div className="form-control-input" style={{ minWidth: "70px" }}>
          <button type="button" className="btn btn-primary filterApplyBtn">
            Apply
          </button>
        </div>
        <div className="form-control-input" style={{ minWidth: "70px" }}>
          <button
            type="button"
            onClick={resetFilter}
            className="btn btn-primary filterApplyBtn"
          >
            Reset
          </button>
        </div>
      </div> */}

      <div
        style={{
          marginTop: 20,
          backgroundColor: "#FFFFFF",
          padding: "20px 30px",
          borderRadius: 5,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p style={{ flex: 0.3 }}>Address Change Request Limit (per month)</p>
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
              value={values["emp.change.request"]}
              onChange={(e) =>
                handleValueChange("emp.change.request", e.target.value)
              }
              type="number"
              inputProps={{ min: "0", step: "1" }}
              error={!!errors["emp.change.request"]}
              helperText={errors["emp.change.request"]}
            />
          </Box>
        </div>

        <div className="addBtnContainer" style={{ marginTop: 250 }}>
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
    </div>
  );
};

export default Configurations(Employee);
