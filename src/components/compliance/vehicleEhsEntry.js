import {
  Button,
  FormControl,
  Autocomplete,
  TextField,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ComplianceService from "@/services/compliance.service";
import MasterDataService from "@/services/masterdata.service";
import { useDispatch } from "react-redux";
import EhsEntryComponent from "./ehsEntryComponent";

const VehicleEhsEntry = () => {
  const headers = [
    {
      key: "ehsTitle",
      display: "EHS Name",
    },
    {
      key: "ehsMandatoryStatus",
      display: "EHS Mandate",
    },
    {
      key: "ehsFrequency",
      display: "Frequency",
    },
    {
      key: "ehsDueDate",
      display: "Checked Due Date",
    },
    {
      key: "ehsStatus",
      display: "EHS Status",
    },
    {
      key: "remark",
      display: "Admin Remark",
    },
    {
      key: "uploadFile",
      display: "Upload File",
    },
  ];
  const [vehicleId, setVehicleId] = useState();
  const [vehicleData, setVehicleData] = useState([]);
  const [openSearchVehicle, setOpenSearchVehicle] = useState(false);
  const [searchedVehicle, setSearchedvehicle] = useState([]);
  const [ehsList, setEhsList] = useState([]);
  const [ehsStatusList, setEhsStatusList] = useState([]);
  const [pagination, setPagination] = useState({
    pageNo: 0,
    pageSize: 100,
  });

  const onChangeVehicleHandler = (newValue, name, key) => {
    console.log("on change handler", newValue);
    setVehicleId(newValue?.vehicleId);
  };
  const searchForVehicle = async (e) => {
    try {
      if (e.target.value) {
        console.log("searchForVehicle", e.target.value);
        const response = await ComplianceService.searchVehicle(e.target.value);
        console.log(response);
        const { data } = response || {};
        setSearchedvehicle(data);
      } else {
        setSearchedvehicle([]);
      }
    } catch (e) {
      console.error(e);
    }
  };
  const searchVehicleById = async () => {
    try {
      if (vehicleId && vehicleId != "") {
        const response = await ComplianceService.getVehicleById(vehicleId);
        console.log(response.data);
        let list = [response.data.vehicleDTO];
        setVehicleData(list);
        getAllEhsByVehicleId(vehicleId);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getAllEhsByVehicleId = async (vehicleId) => {
    try {
      const response = await ComplianceService.getAllEhsByVehicleId(vehicleId);
      const { data } = response || {};
      console.log(data.vehicleEhsDTO);
      setEhsList(data.vehicleEhsDTO);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMasterData = async (type) => {
    try {
      const response = await MasterDataService.getMasterData(type);
      const { data } = response || {};
      if (data?.length) {
        console.log(data);
        setEhsStatusList(data);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchMasterData("EhsStatus");
  }, []);

  return (
    <div className="internalSettingContainer">
      <div style={{ display: "flex" }}>
        <div className="form-control-input">
          <FormControl variant="outlined">
            <Autocomplete
              disablePortal
              id="search-vehicle"
              options={searchedVehicle}
              autoComplete
              open={openSearchVehicle}
              onOpen={() => {
                setOpenSearchVehicle(true);
              }}
              onClose={() => {
                setOpenSearchVehicle(false);
              }}
              onChange={(e, val) =>
                onChangeVehicleHandler(val, "vehicle", "vehicleId")
              }
              getOptionKey={(vehicle) => vehicle.vehicleId}
              getOptionLabel={(vehicle) => vehicle.vehicleRegistrationNumber}
              freeSolo
              name="vehicle"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Vehicle"
                  onChange={searchForVehicle}
                />
              )}
            />
          </FormControl>
        </div>
        <div className="form-control-input" style={{ minWidth: "70px" }}>
          <button
            type="button"
            onClick={searchVehicleById}
            className="btn btn-primary filterApplyBtn"
          >
            Search
          </button>
        </div>
      </div>
      {vehicleData.length > 0 &&
        vehicleData.map((vehicle, index) => {
          return (
            <div className="vehicleDataDiv " key={index}>
              <div className="driverInfo gridContainer commonTable">
                <div style={{ display: "flex" }}>
                  <div style={{ margin: "0 30px" }}>
                    <p style={{ fontWeight: "bold" }}>
                      Vehicle Id:{" "}
                      <span style={{ fontWeight: "normal", marginLeft: 10 }}>
                        {vehicle.vehicleId}
                      </span>
                    </p>
                  </div>
                  <div style={{ margin: "0 30px" }}>
                    <p style={{ fontWeight: "bold" }}>
                      Vehicle Number:{" "}
                      <span style={{ fontWeight: "normal", marginLeft: 10 }}>
                        {vehicle.vehicleRegistrationNumber}
                      </span>
                    </p>
                  </div>
                  <div style={{ margin: "0 30px" }}>
                    <p style={{ fontWeight: "bold" }}>
                      Vendor:{" "}
                      <span style={{ fontWeight: "normal", marginLeft: 10 }}>
                        {vehicle.vendorName}
                      </span>
                    </p>
                  </div>
                  <div style={{ margin: "0 30px" }}>
                    <p style={{ fontWeight: "bold" }}>
                      Vehicle Model:{" "}
                      <span style={{ fontWeight: "normal", marginLeft: 10 }}>
                        {vehicle.vehicleModel}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="gridContainer" style={{ marginTop: 20 }}>
                <table className="commonTable">
                  <thead>
                    <tr>
                      {headers.map((header, idx) => {
                        let tdHeader;
                        tdHeader = (
                          <td key={`${idx}tdfirst`}>{header.display}</td>
                        );
                        return tdHeader;
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {ehsList &&
                      ehsList.length > 0 &&
                      ehsList.map((item, i) => {
                        return (
                          <EhsEntryComponent
                            listing={item}
                            key={i}
                            ehsStatusList={ehsStatusList}
                          />
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
    </div>
  );
};
export default VehicleEhsEntry;
