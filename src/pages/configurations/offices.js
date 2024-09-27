import React, { useEffect, useState } from "react";
import Configurations from "@/layouts/configurations";
import OfficeService from "@/services/office.service";
import { getFormattedLabel } from "@/utils/utils";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
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

const Offices = () => {
  const [values, setValues] = useState({
    escortOption: "",
    panicAlert: false,
  });
  const [officeList, setOfficeList] = useState([]);
  const [officeId, setOfficeId] = useState("");

  const EscortTripOptions = [
    "First pickup and last drop",
    "Any female employee",
    "All female employees",
    "None",
  ];

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

  const handleValueChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleSwitchChange = (e) => {
    setValues((prevValues) => ({
      ...prevValues,
      panicAlert: e.target.checked,
    }));
  };

  const resetFilter = () => {
    setOfficeId("");
  };

  const handleResetButton = () => {
    let allValues = {
      escortOption: "",
      panicAlert: false,
    };
    setValues(allValues);
  };

  useEffect(() => {
    fetchAllOffice();
  }, []);

  useEffect(() => {
    console.log("Values>>>", values);
  }, [values]);

  return (
    <div className="mainSettingsContainer">
      <h2>Offices</h2>

      <div style={{ display: "flex" }}>
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
      </div>

      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "20px 30px",
          borderRadius: 5,
        }}
      >
        <div
          style={{
            marginTop: 20,
            display: "flex",
            alignItems: "center",
          }}
        >
          <p style={{ flex: 0.3 }}>Escort Guard Route Criteria</p>
          <div>
            <FormControl
              fullWidth
              style={{
                width: 220,
                margin: 20,
                backgroundColor: "#ffffff",
                flex: 0.5,
              }}
            >
              <InputLabel id="escort-options-label">Escort Trip</InputLabel>
              <Select
                label="select an option"
                labelId="escort-options-label"
                id="escort-trip-options"
                name="escortOption"
                value={values.escortOption}
                onChange={handleValueChange}
              >
                {EscortTripOptions.map((item, index) => (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div style={{ marginTop: 30, display: "flex", alignItems: "center" }}>
          <p style={{ flex: 0.3 }}>Panic Alert</p>
          <div>
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center", flex: 0.5 }}
            >
              <Typography>No</Typography>
              <AntSwitch
                name="panicAlert"
                checked={values.panicAlert}
                onChange={handleSwitchChange}
                inputProps={{ "aria-label": "panic alert switch" }}
              />
              <Typography>Yes</Typography>
            </Stack>
          </div>
        </div>

        <div className="addBtnContainer" style={{ marginTop: 250 }}>
          <div>
            <button className="btn btn-secondary" onClick={handleResetButton}>
              Reset
            </button>
          </div>
          <div style={{ display: "flex" }}>
            <button className="btn btn-secondary">Cancel</button>
            <button className="btn btn-primary">Save</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configurations(Offices);
