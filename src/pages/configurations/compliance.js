import React, { useEffect, useState } from "react";
import Configurations from "@/layouts/configurations";
import OfficeService from "@/services/office.service";
import { getFormattedLabel } from "@/utils/utils";
import VehicleCompliance from "@/components/configurations/compliance/vehicleCompliance";
import DriverCompliance from "@/components/configurations/compliance/driverCompliance";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const Compliance = () => {
  const [currentState, setCurrentState] = useState("Vehicle Compliance");
  const [officeList, setOfficeList] = useState([]);
  const [officeId, setOfficeId] = useState("");

  const changeState = (newState) => {
    setCurrentState(newState.displayName);
  };

  const ComplianceType = [
    {
      displayName: "Vehicle Compliance",
    },
    {
      displayName: "Driver Compliance",
    },
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

  const resetFilter = () => {
    setOfficeId("");
  };

  useEffect(() => {
    fetchAllOffice();
  }, []);

  return (
    <div className="mainSettingsContainer">
      <div className="currentStateContainer">
        {ComplianceType.map((routeType, idx) => (
          <button
            key={idx}
            onClick={() => changeState(routeType)}
            className={`btn btn-secondary ${
              currentState === routeType.displayName ? "btn-blk" : ""
            }`}
          >
            {routeType.displayName}
          </button>
        ))}
      </div>

      <div style={{ padding: "20px 0" }}>
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

        <div>
          {currentState === "Vehicle Compliance" && <VehicleCompliance />}
          {currentState === "Driver Compliance" && <DriverCompliance />}
        </div>
      </div>
    </div>
  );
};

export default Configurations(Compliance);
