import React, { useState, useEffect } from "react";
import StickyHeadTable from "../../components/table/B2BTable";
import { logoutB2B, loginB2B } from "./data";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { getFormattedLabel } from "@/utils/utils";
import {
  DATE_FORMAT,
  DEFAULT_PAGE_SIZE,
  MASTER_DATA_TYPES,
  SHIFT_TYPE,
} from "@/constants/app.constants.";
import OfficeService from "@/services/office.service";
import { useDispatch, useSelector } from "react-redux";
import dispatch from "@/layouts/dispatch";
import { setMasterData } from "@/redux/master.slice";

const MainComponent = () => {
  const [selectedLogoutTrips, setSelectedLogoutTrips] = useState([]);
  const [selectedLoginTrips, setSelectedLoginTrips] = useState([]);
  const [pairedTrips, setPairedTrips] = useState([]);
  const [pairedTripIds, setPairedTripIds] = useState([]);
  const [office, setOffice] = useState([]);
  // const [shiftTypes, setShiftTypes] = useState([]);
  const [searchValuesForLogin, setSearchValuesForLogin] = useState({
    officeId: "",
    shiftType: "",
    date: moment().format("YYYY-MM-DD"),
    transportType: "",
  });
  const { ShiftType: shiftTypes } = useSelector((state) => state.master);
  const dispatch = useDispatch();

  const resetFilter = () => {
    let allSearchValue = {
      officeId: office[0].officeId,
      date: moment().format("YYYY-MM-DD"),
      shiftType: "",
    };
    setSearchValuesForLogin(allSearchValue);
  };
  const fetchMasterData = async (type) => {
    try {
      const response = await MasterDataService.getMasterData(type);
      const { data } = response || {};
      if (data?.length) {
        dispatch(setMasterData({ data, type }));
      }
    } catch (e) {}
  };

  const fetchSummary = async () => {
    try {
      console.log("search values>>>>>", searchValues);
      let allSearchValues = { ...searchValues };
      Object.keys(allSearchValues).forEach((objKey) => {
        if (
          allSearchValues[objKey] === null ||
          allSearchValues[objKey] === ""
        ) {
          delete allSearchValues[objKey];
        }
      });
      const response = await DispatchService.getAllSummary(allSearchValues);
      console.log(response);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    let newSearchValues = { ...searchValuesForLogin };
    if (name === "date") newSearchValues[name] = value.format("YYYY-MM-DD");
    else newSearchValues[name] = value;
    setSearchValuesForLogin(newSearchValues);
  };

  const handlePairTrips = () => {
    if (selectedLogoutTrips.length === 1 && selectedLoginTrips.length === 1) {
      const newPairedTrip = `${selectedLogoutTrips[0]}-${selectedLoginTrips[0]}`;
      setPairedTrips([
        ...pairedTrips,
        selectedLogoutTrips[0],
        selectedLoginTrips[0],
      ]);
      setPairedTripIds([...pairedTripIds, newPairedTrip]);
      setSelectedLogoutTrips([]);
      setSelectedLoginTrips([]);
    }
  };

  const handleUnpairTrips = () => {
    setPairedTrips([]);
    setPairedTripIds([]);
    setSelectedLogoutTrips([]);
    setSelectedLoginTrips([]);
  };
  const fetchAllOffices = async () => {
    try {
      const response = await OfficeService.getAllOffices();
      const { data } = response || {};
      const { clientOfficeDTO } = data || {};
      console.log(clientOfficeDTO);
      setSearchValuesForLogin(
        { ...searchValuesForLogin },
        (searchValuesForLogin["officeId"] = clientOfficeDTO[0]?.officeId)
      );
      setOffice(clientOfficeDTO);
    } catch (e) {}
  };

  useEffect(() => {
    if (!shiftTypes?.length) {
      fetchMasterData(MASTER_DATA_TYPES.SHIFT_TYPE);
    }
    fetchAllOffices();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div
          className="gridContainer"
          style={{
            margin: "20px 0",
            padding: "0",
            backgroundColor: "#f9f9f9",
            borderRadius: "20px 0 0 20px",
          }}
        >
          <div
            className="filterContainer"
            style={{
              display: "flex",
              alignItems: "center",
              margin: "0 15px",
              padding: "0 0 0 40px",
            }}
          >
            <h4 style={{ fontSize: "14px" }}>Logout B2B Trips</h4>
            {office.length > 0 && (
              <div style={{ minWidth: "0px" }} className="form-control-input">
                <FormControl style={{ padding: "4px 0" }}>
                  <InputLabel
                    id="logout-primary-office-label"
                    style={{ fontSize: "14px" }}
                  >
                    Office ID
                  </InputLabel>
                  <Select
                    style={{ width: "160px", height: "40px", fontSize: "14px" }}
                    labelId="logout-primary-office-label"
                    id="logoutOfficeId"
                    value={searchValuesForLogin.officeId}
                    name="officeId"
                    label="Office ID"
                    onChange={handleFilterChange}
                  >
                    {!!office?.length &&
                      office.map((office, idx) => (
                        <MenuItem key={idx} value={office.officeId}>
                          {getFormattedLabel(office.officeId)}, {office.address}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
            )}

            <div style={{ margin: "0 8px 18px" }}>
              <InputLabel htmlFor="logout-date" style={{ fontSize: "14px" }}>
                Date
              </InputLabel>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  name="date"
                  format={DATE_FORMAT}
                  value={
                    searchValuesForLogin.date
                      ? moment(searchValuesForLogin.date)
                      : null
                  }
                  onChange={(e) =>
                    handleFilterChange({ target: { name: "date", value: e } })
                  }
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        width: "140px",
                        "& .MuiInputBase-input": { fontSize: "14px" },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </div>

            <FormControl style={{ margin: "0 8px", padding: "4px 0" }}>
              <InputLabel
                id="logout-shiftType-label"
                style={{ fontSize: "14px" }}
              >
                Shift Type
              </InputLabel>
              <Select
                style={{ width: "120px", height: "40px" }}
                labelId="logout-shiftType-label"
                id="logoutShiftType"
                name="shiftType"
                value={searchValuesForLogin.shiftType}
                label="Shift Type"
                onChange={handleFilterChange}
              >
                {shiftTypes.map((sT, idx) => (
                  <MenuItem key={idx} value={sT.value}>
                    {getFormattedLabel(sT.value)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        <div
          className="gridContainer"
          style={{ margin: "20px 0", padding: "0", backgroundColor: "#f9f9f9" }}
        >
          <div
            className="filterContainer"
            style={{
              display: "flex",
              alignItems: "center",
              margin: "0 20px",
            }}
          >
            <h4 style={{ fontSize: "14px" }}>Login B2B Trips</h4>
            {office.length > 0 && (
              <div style={{ minWidth: "0px" }} className="form-control-input">
                <FormControl style={{ padding: "4px 0" }}>
                  <InputLabel
                    id="login-primary-office-label"
                    style={{ fontSize: "14px" }}
                  >
                    Office ID
                  </InputLabel>
                  <Select
                    style={{ width: "150px", height: "40px", fontSize: "14px" }}
                    labelId="login-primary-office-label"
                    id="loginOfficeId"
                    value={searchValuesForLogin.officeId}
                    name="officeId"
                    label="Office ID"
                    onChange={handleFilterChange}
                  >
                    {!!office?.length &&
                      office.map((office, idx) => (
                        <MenuItem key={idx} value={office.officeId}>
                          {getFormattedLabel(office.officeId)}, {office.address}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
            )}

            <div style={{ margin: "0 8px 18px" }}>
              <InputLabel htmlFor="logout-date" style={{ fontSize: "14px" }}>
                Date
              </InputLabel>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  name="date"
                  format={DATE_FORMAT}
                  value={
                    searchValuesForLogin.date
                      ? moment(searchValuesForLogin.date)
                      : null
                  }
                  onChange={(e) =>
                    handleFilterChange({ target: { name: "date", value: e } })
                  }
                  slotProps={{
                    textField: {
                      size: "small",
                      sx: {
                        width: "140px",
                        "& .MuiInputBase-input": { fontSize: "14px" },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </div>

            <FormControl style={{ margin: "0 8px", padding: "4px 0" }}>
              <InputLabel
                id="login-shiftType-label"
                style={{ fontSize: "14px" }}
              >
                Shift Type
              </InputLabel>
              <Select
                style={{ width: "120px", height: "40px" }}
                labelId="login-shiftType-label"
                id="loginShiftType"
                name="shiftType"
                value={searchValuesForLogin.shiftType}
                label="Shift Type"
                onChange={handleFilterChange}
              >
                {shiftTypes.map((sT, idx) => (
                  <MenuItem key={idx} value={sT.value}>
                    {getFormattedLabel(sT.value)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            padding: "24px 0",
            margin: "20px 0",
            backgroundColor: "#f9f9f9",
            borderRadius: "0 20px 20px 0",
          }}
        >
          <button
            type="submit"
            onClick={() => fetchSummary()}
            className="btn btn-primary filterApplyBtn"
            style={{
              width: "80px",
              height: "40px",
              fontSize: "14px",
              fontWeight: "bold",
              padding: "0",
              margin: "0 8px",
            }}
          >
            Apply
          </button>
          <button
            type="submit"
            onClick={resetFilter}
            className="btn btn-primary filterApplyBtn"
            style={{
              width: "80px",
              height: "40px",
              fontSize: "14px",
              fontWeight: "bold",
              padding: "0",
              margin: "0 20px 0 8px",
            }}
          >
            Reset
          </button>
        </div>
      </div>

      <div
        style={{
          padding: "40px",
          backgroundColor: "#f9f9f9",
          fontFamily: "DM Sans, sans-serif",
        }}
      >
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <div>
            <button
              onClick={handlePairTrips}
              style={{
                backgroundColor: "#f9f9f9",
                color: "black",
                border: "2px solid #f6ce47",
                borderRadius: "6px",
                padding: "6px 10px",
                marginLeft: '11px',
                marginRight: "20px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Pair Trip IDs
            </button>
            <button
              onClick={handleUnpairTrips}
              style={{
                backgroundColor: "#f9f9f9",
                color: "black",
                border: "2px solid #f6ce47",
                borderRadius: "6px",
                fontWeight: "bold",
                padding: "6px 10px",
                cursor: "pointer",
                marginLeft: "30px",
              }}
            >
              Unpair Trip IDs
            </button>
          </div>

          <div>
            <button
              style={{
                backgroundColor: "#f6ce47",
                color: "black",
                border: "2px solid #f6ce47",
                borderRadius: "6px",
                fontWeight: "bold",
                padding: "6px 10px",
                cursor: "pointer",
              }}
            >
              Generate B2B IDs
            </button>
          </div>
        </div>
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: 1, minWidth: "600px" }}>
            <div
              style={{
                backgroundColor: "white",
                border: "1px solid white",
                borderRadius: "10px 10px 0 0",
                margin: "0 10px",
                width: "100%",
              }}
            >
              <h4
                style={{
                  fontSize: "15px",
                  fontFamily: "DM Sans, sans-serif",
                  margin: "12px 30px",
                }}
              >
                Logout B2B Trips
              </h4>
            </div>
            <StickyHeadTable
              rows={logoutB2B}
              selectedTrips={selectedLogoutTrips}
              setSelectedTrips={setSelectedLogoutTrips}
              pairedTrips={pairedTrips}
            />
          </div>
          <div style={{ flex: 1, minWidth: "600px" }}>
            <div
              style={{
                backgroundColor: "white",
                border: "1px solid white",
                borderRadius: "10px 10px 0 0",
                margin: "0 10px",
                width: "100%",
              }}
            >
              <h4
                style={{
                  fontSize: "15px",
                  fontFamily: "DM Sans, sans-serif",
                  margin: "12px 30px",
                }}
              >
                Login B2B Trips
              </h4>
            </div>
            <StickyHeadTable
              rows={loginB2B}
              selectedTrips={selectedLoginTrips}
              setSelectedTrips={setSelectedLoginTrips}
              pairedTrips={pairedTrips}
            />
          </div>
        </div>
        <div>
          <p
            style={{
              fontSize: "15px",
              fontWeight: "bold",
              backgroundColor: "white",
              padding: "15px",
              margin: "8px",
              width: "100%",
              border: "1px solid white",
              borderradius: "8px",
            }}
          >
            Paired Trip IDs:{" "}
            <span style={{ fontWeight: "normal" }}>
              {pairedTripIds.join(", ")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default dispatch(MainComponent);
