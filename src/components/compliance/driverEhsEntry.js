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

const DriverEhsEntry = () => {
  const headers = [
    {
      key: "ehsName",
      display: "EHS Name",
    },
    {
      key: "ehsMandate",
      display: "EHS Mandate",
    },
    {
      key: "ehsFrequency",
      display: "Frequency",
    },
    {
      key: "dueDate",
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
  const [searchedDriver, setSearchedDriver] = useState([]);
  const [driverId, setDriverId] = useState("");
  const [openSearchDriver, setOpenSearchDriver] = useState(false);
  const [driverData, setDriverData] = useState([]);
  const [ehsList, setEhsList] = useState([]);
  const [ehsStatusList, setEhsStatusList] = useState([]);
  const [pagination, setPagination] = useState({
    pageNo: 0,
    pageSize: 100,
  });
  const [firstEhs, setFirstEhs] = useState(true);

  const onChangeDriverHandler = (newValue, name, key) => {
    console.log("on change handler", newValue);
    setDriverId(newValue?.driverId);
  };
  const searchDriverEhs = async (id) => {
    try {
      const response = await ComplianceService.getSelectedDriverEHS(id);
      const {data} = response || {};
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  const searchForDriver = async (e) => {
    try {
      if (e.target.value) {
        console.log("searchForDriver", e.target.value);
        const response = await ComplianceService.searchDriver(e.target.value);
        console.log(response);
        const { data } = response || {};
        setSearchedDriver(data);
      } else {
        setSearchedDriver([]);
      }
    } catch (e) {
      console.error(e);
    }
  };
  const searchDriverById = async () => {
    try {
      if (driverId && driverId != "") {
        const response = await ComplianceService.getDriverById(driverId);
        console.log(response.data);
        if (response.data) {
          let list = [response.data.driver];
          console.log(list.length);
          setDriverData(list);
          getAllEhs(response.data.driver.officeId);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  const getAllEhs = async (officeId) => {
    try {
      const searchValue = { officeId: officeId, ehsAppliedOnDriver: true };
      let params = new URLSearchParams(pagination);
      const response = await ComplianceService.getAllEHS(params, searchValue);
      const { data } = response || {};
      const content = data.data;
      console.log(content);
      setEhsList(content);
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
              id="search-driver"
              options={searchedDriver}
              autoComplete
              open={openSearchDriver}
              onOpen={() => {
                setOpenSearchDriver(true);
              }}
              onClose={() => {
                setOpenSearchDriver(false);
              }}
              onChange={(e, val) =>
                onChangeDriverHandler(val, "driver", "driverId")
              }
              getOptionKey={(driver) => driver.driverId}
              getOptionLabel={(driver) => driver.driverName}
              freeSolo
              name="driver"
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Driver"
                  onChange={searchForDriver}
                />
              )}
            />
          </FormControl>
        </div>
        <div className="form-control-input" style={{ minWidth: "70px" }}>
          <button
            type="button"
            onClick={searchDriverById}
            className="btn btn-primary filterApplyBtn"
          >
            Search
          </button>
        </div>
      </div>
      {driverData.length > 0 &&
        driverData.map((driver, index) => {
          return (
            <div className="driverDataDiv " key={index}>
              <div className="driverInfo gridContainer commonTable">
                <div style={{ display: "flex" }}>
                  <div style={{ margin: "0 30px" }}>
                    <p style={{ fontWeight: "bold" }}>
                      DriverId:{" "}
                      <span style={{ fontWeight: "normal", marginLeft: 10 }}>
                        {driver.id}
                      </span>
                    </p>
                  </div>
                  <div style={{ margin: "0 30px" }}>
                    <p style={{ fontWeight: "bold" }}>
                      Driver Name:{" "}
                      <span style={{ fontWeight: "normal", marginLeft: 10 }}>
                        {driver.name}
                      </span>
                    </p>
                  </div>
                  <div style={{ margin: "0 30px" }}>
                    <p style={{ fontWeight: "bold" }}>
                      Vendor:{" "}
                      <span style={{ fontWeight: "normal", marginLeft: 10 }}>
                        {driver.vendorName}
                      </span>
                    </p>
                  </div>
                  <div style={{ margin: "0 30px" }}>
                    <p style={{ fontWeight: "bold" }}>
                      Phone:{" "}
                      <span style={{ fontWeight: "normal", marginLeft: 10 }}>
                        {driver.mobile}
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
                    {ehsList.length > 0 &&
                      ehsList.map((item, i) => {
                        return <EhsEntryComponent listing={item} key={i} />;
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
export default DriverEhsEntry;
