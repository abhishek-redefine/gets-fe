import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Box,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import VehiclesNDriversTable from "./vehicles&DriversTable";
import { useDispatch, useSelector } from "react-redux";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import OfficeService from "@/services/office.service";
import MasterDataService from "@/services/masterdata.service";
import { getFormattedLabel } from "@/utils/utils";
import { DATE_FORMAT, MASTER_DATA_TYPES } from "@/constants/app.constants.";
import { setMasterData } from "@/redux/master.slice";
import DispatchService from "@/services/dispatch.service";
import ComplianceService from "@/services/compliance.service";
import TripService from "@/services/trip.service";
import TrackCab from "./TrackCab";

const SearchModuleVehiclesAndDrivers = ({ tripIdClicked }) => {
  const [list, setList] = useState([]);
  const [vehicleId, setVehicleId] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [driverId, setDriverId] = useState("");
  const [office, setOffice] = useState([]);
  const { ShiftType: shiftTypes } = useSelector((state) => state.master);
  const dispatch = useDispatch();
  const [searchValues, setSearchValues] = useState({
    officeId: "",
    tripDateStr: "",
    shiftType: "",
    driverId: driverId,
    vehicleNumber: vehicleNumber,
  });
  const [pagination, setPagination] = useState({
    page: 0,
    size: 100,
  });
  const [selectedFilter, setSelectedFilter] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [searchedVehicle, setSearchedvehicle] = useState([]);
  const [openSearchVehicle, setOpenSearchVehicle] = useState(false);
  const [openSearchDriver, setOpenSearchDriver] = useState(false);
  const [searchedDriver, setSearchedDriver] = useState([]);
  const [error, setError] = useState(false);
  const [vehicleDetails, setVehicleDetails] = useState({});
  const [trackCabFlag, setTrackCabFlag] = useState(false);

  const vehicleDriverDetails = {
    "Registration Number": vehicleDetails.vehicleNumber,
    "Vehicle Id": vehicleDetails.vehicleId,
    "Vendor Name": vehicleDetails.vendorName,
    "Driver Name": vehicleDetails.driverName,
    "Driver Number": vehicleDetails.mobile,
    // "Manager Number": "",
    // "Team Name": "",
  };

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    let newSearchValues = { ...searchValues };
    if (name === "tripDateStr")
      newSearchValues[name] = value.format("YYYY-MM-DD");
    else newSearchValues[name] = value;
    setSearchValues(newSearchValues);
  };

  const fetchAllOffices = async () => {
    try {
      const response = await OfficeService.getAllOffices();
      const { data } = response || {};
      const { clientOfficeDTO } = data || {};
      console.log(clientOfficeDTO);
      setOffice(clientOfficeDTO);
    } catch (e) {}
  };

  const fetchMasterData = async (type) => {
    try {
      const response = await MasterDataService.getMasterData(type);
      const { data } = response || {};
      if (data?.length) {
        console.log(data);
        dispatch(setMasterData({ data, type }));
      }
    } catch (e) {}
  };

  const searchForVehicle = async (e) => {
    try {
      if (e.target.value) {
        console.log("searchForVehicle", e.target.value);
        const response = await ComplianceService.searchVehicle(e.target.value);
        console.log(response);
        const { data } = response || {};
        setSearchedvehicle(data);
        console.log("Searched vehicle>>", searchedVehicle);
      } else {
        setSearchedvehicle([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onChangeVehicleHandler = (newValue) => {
    console.log("on vehicle change handler", newValue);
    setVehicleNumber(newValue?.vehicleRegistrationNumber);
    setVehicleId(newValue?.vehicleId);
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

  const onChangeDriverHandler = (newValue, name, key) => {
    console.log("on change handler", newValue);
    setDriverId(newValue?.driverId);
  };

  const fetchSummary = async () => {
    let hasError = false;

    if (selectedFilter === "") {
      setError((prevError) => ({
        ...prevError,
        selectFilter: "Please choose a filter option to proceed.",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, selectFilter: "" }));
    }
    if (hasError) return;

    try {
      let params = new URLSearchParams(pagination);
      console.log("Search values>>>", searchValues);
      let allSearchValues = { ...searchValues };

      Object.keys(allSearchValues).forEach((objKey) => {
        if (
          allSearchValues[objKey] === null ||
          allSearchValues[objKey] === ""
        ) {
          delete allSearchValues[objKey];
        }
      });
      const response = await DispatchService.getTripSearchByBean(
        params,
        allSearchValues
      );
      console.log("response data>>>", response.data.data);
      setList(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const resetFilter = () => {
    setSelectedFilter("");
    setFilterValue("");
    let allSearchValue = {
      officeId: "",
      tripDateStr: "",
      shiftType: "",
      driverId: "",
      vehicleNumber: "",
    };
    setSearchValues(allSearchValue);
  };

  const fetchVehicleByVehicleId = async () => {
    if (selectedFilter === "Vehicle Number") {
      try {
        const response = await TripService.getVehicleDriverMappingByVehicleId(
          vehicleId
        );
        console.log(
          "Vehicle details>>>",
          response.data.vehicleDriverMappingDTO[0]
        );
        setVehicleDetails(response.data.vehicleDriverMappingDTO[0]);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const fetchVehicleByDriverId = async () => {
    if (selectedFilter === "Driver ID") {
      try {
        const response = await TripService.getVehicleDriverMappingByDriverId(
          driverId
        );
        console.log(
          "Vehicle details>>>",
          response.data.vehicleDriverMappingDTO[0]
        );
        setVehicleDetails(response.data.vehicleDriverMappingDTO[0]);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleTrackCabClick = () => {
    console.log("Track cab clicked");
    setTrackCabFlag(true);
  };

  const handleTrackCabScreenClose = () => {
    setTrackCabFlag(false);
  };

  const handleTripClick = (tripId) => {
    // console.log("Search module vehicle and drivers Trip Id>>>>", tripId);
    tripIdClicked(tripId);
  };

  useEffect(() => {
    if (!shiftTypes?.length) {
      fetchMasterData(MASTER_DATA_TYPES.SHIFT_TYPE);
    }
    fetchAllOffices();
  }, []);

  useEffect(() => {
    if (selectedFilter === "Vehicle Number") {
      fetchVehicleByVehicleId();
    } else if (selectedFilter === "Driver ID") {
      fetchVehicleByDriverId();
    }
  }, [list]);

  return (
    <div>
      {trackCabFlag ? (
        <TrackCab onClose={handleTrackCabScreenClose} />
      ) : (
        <div>
          <div
            className="filterContainer"
            style={{
              flexWrap: "wrap",
              backgroundColor: "#f9f9f9",
              borderRadius: "10px",
              margin: "30px 0",
              padding: "0 13px",
            }}
          >
            {office.length > 0 && (
              <div style={{ minWidth: "180px" }} className="form-control-input">
                <FormControl fullWidth>
                  <InputLabel id="primary-office-label">Office ID</InputLabel>
                  <Select
                    style={{ width: "180px", backgroundColor: "white" }}
                    labelId="primary-office-label"
                    id="officeId"
                    value={searchValues.officeId}
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

            <div
              className="form-control-input"
              style={{ backgroundColor: "white" }}
            >
              <InputLabel style={{ backgroundColor: "#f9f9f9" }} htmlFor="date">
                Date
              </InputLabel>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  name="tripDateStr"
                  format={DATE_FORMAT}
                  value={
                    searchValues.tripDateStr
                      ? moment(searchValues.tripDateStr)
                      : null
                  }
                  onChange={(e) =>
                    handleFilterChange({
                      target: { name: "tripDateStr", value: e },
                    })
                  }
                />
              </LocalizationProvider>
            </div>

            <div style={{ minWidth: "160px" }} className="form-control-input">
              <FormControl fullWidth>
                <InputLabel id="shiftType-label">Shift Type</InputLabel>
                <Select
                  style={{ width: "160px", backgroundColor: "white" }}
                  labelId="shiftType-label"
                  id="shiftType"
                  name="shiftType"
                  value={searchValues.shiftType}
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

            <div>
              {error.selectFilter && (
                <FormHelperText
                  style={{
                    color: "#d32f2f",
                    margin: "0 0 0 29px",
                    fontSize: "12px",
                  }}
                >
                  {error.selectFilter}
                </FormHelperText>
              )}
              <div
                className="form-control-input"
                style={{ minWidth: 350, display: "flex", marginTop: 0 }}
              >
                <div
                  style={{
                    marginRight: 0,
                    borderRadius: "4px 0 4px 4px",
                    borderColor: "red",
                    width: "160px",
                  }}
                >
                  <FormControl
                    sx={{
                      backgroundColor: "#ffffff",
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "4px 0 0 4px",
                        "& fieldset": {
                          borderRight: "1px solid white",
                        },
                      },
                    }}
                  >
                    <InputLabel id="filter-select-label">Search By</InputLabel>
                    <Select
                      labelId="filter-select-label"
                      value={selectedFilter}
                      onChange={(e) => {
                        setSelectedFilter(e.target.value);
                        setFilterValue("");
                      }}
                      sx={{
                        width: "160px",
                        // backgroundColor: "pink",
                      }}
                    >
                      <MenuItem value="Vehicle Number">Vehicle Number</MenuItem>
                      <MenuItem value="Driver ID">Driver ID</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div
                  style={{
                    width: "230px",
                  }}
                >
                  {selectedFilter === "" && (
                    <div
                      style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "0 4px 4px 0",
                        borderWidth: 1,
                        borderColor: "#c4c4c4",
                        borderStyle: "solid",
                        height: 56,
                      }}
                    ></div>
                  )}
                  {selectedFilter === "Vehicle Number" && (
                    <FormControl
                      variant="outlined"
                      sx={{
                        backgroundColor: "#ffffff",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "0 4px 4px 0",
                        },
                      }}
                    >
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
                          onChangeVehicleHandler(
                            val,
                            "vehicle",
                            "vehicleNumber"
                          )
                        }
                        getOptionKey={(vehicle) => vehicle.vehicleNumber}
                        getOptionLabel={(vehicle) =>
                          vehicle.vehicleRegistrationNumber
                        }
                        freeSolo
                        name="vehicle"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Search Vehicle"
                            onChange={searchForVehicle}
                            value={searchValues.vehicleNumber}
                          />
                        )}
                      />
                    </FormControl>
                  )}
                  {selectedFilter === "Driver ID" && (
                    <FormControl
                      variant="outlined"
                      sx={{
                        backgroundColor: "#ffffff",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "0 4px 4px 0",
                        },
                      }}
                    >
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
                  )}
                </div>
              </div>
            </div>

            <div className="form-control-input" style={{ minWidth: "70px" }}>
              <button
                type="submit"
                onClick={() => fetchSummary()}
                className="btn btn-primary filterApplyBtn"
              >
                Apply
              </button>
            </div>
            <div className="form-control-input" style={{ minWidth: "70px" }}>
              <button
                type="submit"
                onClick={resetFilter}
                className="btn btn-primary filterApplyBtn"
              >
                Reset
              </button>
            </div>
          </div>
          <div
            style={{
              backgroundColor: "#f9f9f9",
              borderRadius: "6px",
              paddingBottom: "25px",
              // backgroundColor: "green",
            }}
          >
            <Box
              sx={{
                fontFamily: "DM Sans",
                padding: "25px 25px 0",
                //   backgroundColor: "pink",
              }}
            >
              <Grid
                style={{
                  backgroundColor: "white",
                  padding: "20px 0 0 30px",
                  borderRadius: "5px",
                }}
              >
                <Grid container xs={12} alignItems="stretch" style={{}}>
                  {Object.entries(vehicleDriverDetails).map(
                    ([key, value], index) => (
                      <Grid
                        key={index}
                        item
                        xs={3}
                        style={{ marginBottom: "25px" }}
                      >
                        <p
                          style={{
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        >
                          {key}
                        </p>
                        <p
                          style={{
                            fontSize: "14px",
                            margin: "5px 0 0 0",
                          }}
                        >
                          {value}
                        </p>
                      </Grid>
                    )
                  )}
                  <button
                    type="viewProfile"
                    className="btn btn-primary"
                    style={{
                      width: "140px",
                      padding: "10px 20px",
                      marginBottom: "25px",
                      marginLeft: "0",
                    }}
                    onClick={handleTrackCabClick}
                  >
                    Track Cab
                  </button>
                </Grid>
              </Grid>
            </Box>
            <div
              style={{
                backgroundColor: "white",
                margin: "25px 20px 3px",
                padding: "20px 20px",
                borderRadius: "20px 20px 0 0",
              }}
            >
              <h3>Booking Summary</h3>
            </div>
            <VehiclesNDriversTable
              list={list}
              vehicleTripIdClicked={handleTripClick}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchModuleVehiclesAndDrivers;
