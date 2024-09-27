import {
  Autocomplete,
  TextField,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { getFormattedLabel } from "@/utils/utils";
import { setMasterData } from "@/redux/master.slice";
import { DATE_FORMAT, MASTER_DATA_TYPES } from "@/constants/app.constants.";
import OfficeService from "@/services/office.service";
import { useSelector } from "react-redux";
import ComplianceService from "@/services/compliance.service";
import ShiftService from "@/services/shift.service";
import { useDispatch } from "react-redux";
import { toggleToast } from '@/redux/company.slice';

// const ScrollablePaper = (props) => (
//   <Paper
//     {...props}
//     style={{
//       maxHeight: 110,
//       overflow: "auto",
//     }}
//   />
// );

const ManualGenerateTripModal = (props) => {
  const { onClose, createdTripScreenOpen, searchValuesdata } = props;

  const dispatch = useDispatch();
  const [office, setOffice] = useState([]);
  const { ShiftType: shiftTypes } = useSelector((state) => state.master);
  const [searchValues, setSearchValues] = useState({
    officeId: "",
    shiftType: "LOGIN",
    date: moment().format("YYYY-MM-DD"),
    shiftTime: "",
    vehicleNumber: "",
    vendorName: "",
    tripType: "Manual",
    escortTrip: "",
  });
  const [vehicleId, setVehicleId] = useState("");
  const [searchedVehicle, setSearchedvehicle] = useState([]);
  const [openSearchVehicle, setOpenSearchVehicle] = useState(false);
  const [error, setError] = useState(false);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 100,
  });

  const [viewShiftTimeData, setViewShiftTimeData] = useState([]);
  const [vendorName, setVendorName] = useState("");

  const escortTripOptions = ["Yes", "No"];

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    let newSearchValues = { ...searchValues };
    if (name === "date") newSearchValues[name] = value.format("YYYY-MM-DD");
    else newSearchValues[name] = value;
    setSearchValues(newSearchValues);
  };

  const fetchAllOffices = async () => {
    try {
      const response = await OfficeService.getAllOffices();
      const { data } = response || {};
      const { clientOfficeDTO } = data || {};
      console.log(clientOfficeDTO);
      setSearchValues(
        { ...searchValues },
        (searchValues["officeId"] = clientOfficeDTO[0]?.officeId)
      );
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

  const fetchAllShift = async () => {
    // console.log("Hey");
    try {
      const params = new URLSearchParams(pagination);
      let allSearchValues = {
        officeId: searchValues.officeId,
        shiftType: searchValues.shiftType,
      };
      const response = await ShiftService.getAllShiftSearchByBean(
        params.toString(),
        allSearchValues
      );
      console.log("response>>>", response.data);
      const { data } = response || {};
      let tempShiftTime = [];
      if (response.data.data.length > 0) {
        response.data.data.map((data) => {
          tempShiftTime.push({
            id: data.id,
            shiftTime: data.shiftTime,
          });
        });
      }
      setViewShiftTimeData(tempShiftTime);
      console.log("shift time", viewShiftTimeData);
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
    setVehicleId(newValue?.vehicleId);
    searchValues["vehicleNumber"] = newValue?.vehicleId;
  };

  const fetchVendor = async () => {
    if (vehicleId !== "") {
      console.log("Saifali");
      try {
        const response = await ComplianceService.getSingleVehicle(vehicleId);
        console.log("response", response.data.vehicleDTO.vendorName);
        console.log("Selected vehicle data", response.data);

        setVendorName(response?.data?.vehicleDTO?.vendorName);
        searchValues["vendorName"] = response?.data?.vehicleDTO?.vendorName;
      } catch (e) {
        console.error(e);
      }
    }
  };

  const onSubmitHandler = () => {
    // console.log("Create trip button clicked");
    let hasError = false;

    if (!searchValues.shiftTime) {
      setError((prevError) => ({
        ...prevError,
        shiftTime: "Shift Time is mandatory.",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, shiftTime: "" }));
    }

    if (!vehicleId) {
      setError((prevError) => ({
        ...prevError,
        vehicleNumber: "Vehicle Number is mandatory.",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, vehicleNumber: "" }));
    }

    if (!vendorName) {
      setError((prevError) => ({
        ...prevError,
        vendorName: "Vendor Name is mandatory.",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, vendorName: "" }));
    }

    if (!searchValues.escortTrip) {
      setError((prevError) => ({
        ...prevError,
        escortTrip: "Escort Trip is mandatory.",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, escortTrip: "" }));
    }

    if (hasError) {
      console.log("Error: All mandatory fields must be filled");
      return;
    }

    console.log("Submit trip details>>", searchValues);
    searchValuesdata(searchValues);
    setError({});
    console.log("Form submission successful");
    onClose();
    createdTripScreenOpen();
    dispatch(
      toggleToast({
        message: "Trip created successfully!",
        type: "success",
      })
    );
  };

  useEffect(() => {
    if (!shiftTypes?.length) {
      fetchMasterData(MASTER_DATA_TYPES.SHIFT_TYPE);
    }
    fetchAllOffices();
  }, []);

  useEffect(() => {
    fetchAllShift();
  }, [searchValues.officeId, searchValues.shiftType]);

  useEffect(() => {
    fetchVendor();
  }, [vehicleId]);

  return (
    <div
      style={{
        backgroundColor: "#FFF",
        borderRadius: 10,
        fontFamily: "DM Sans",
        padding: "30px 40px",
      }}
    >
      <h3 style={{}}>Create Trip</h3>
      <div style={{}}>
        {office.length > 0 && (
          <div
            style={{ margin: "0 30px 0 0px", minWidth: "180px" }}
            className="form-control-input"
          >
            <FormControl fullWidth>
              <InputLabel id="primary-office-label">Office ID *</InputLabel>
              <Select
                style={{ width: "250px", backgroundColor: "white" }}
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
          <InputLabel style={{ backgroundColor: "#ffffff" }} htmlFor="date">
            Date *
          </InputLabel>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              name="date"
              format={DATE_FORMAT}
              value={searchValues.date ? moment(searchValues.date) : null}
              onChange={(e) =>
                handleFilterChange({
                  target: { name: "date", value: e },
                })
              }
              sx={{ width: "250px" }}
            />
          </LocalizationProvider>
        </div>

        <div
          style={{ margin: "0 30px 0 0px", minWidth: "180px" }}
          className="form-control-input"
        >
          <FormControl fullWidth>
            <InputLabel id="shiftType-label">Shift Type *</InputLabel>
            <Select
              style={{ width: "250px", backgroundColor: "white" }}
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

        <div
          style={{ margin: "0 20px 0 20px", minWidth: "180px" }}
          className="form-control-input"
        >
          <FormControl fullWidth>
            <InputLabel id="shiftTime-label">Shift Time *</InputLabel>
            <Select
              style={{ width: "250px", backgroundColor: "white" }}
              labelId="shiftType-label"
              id="shiftTime"
              name="shiftTime"
              value={searchValues.shiftTime}
              label="Shift Time"
              onChange={handleFilterChange}
              error={!!error.shiftTime}
            >
              {viewShiftTimeData.map((sT, idx) => (
                <MenuItem key={idx} value={sT.id}>
                  {sT.shiftTime}
                </MenuItem>
              ))}
            </Select>
            {error.shiftTime && (
              <p
                style={{
                  color: "#d32f2f",
                  marginTop: "5px",
                  marginLeft: "14px",
                  fontSize: "12px",
                }}
              >
                {error.shiftTime}
              </p>
            )}
          </FormControl>
        </div>

        <div
          style={{ margin: "0 30px 0 0px", minWidth: "180px" }}
          className="form-control-input"
        >
          <FormControl variant="outlined">
            <Autocomplete
              disablePortal
              id="search-vehicle"
              sx={{ width: "250px" }}
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
                  label="Search Vehicle *"
                  onChange={searchForVehicle}
                  value={searchValues.vehicleNumber}
                  error={!!error.vehicleNumber}
                  helperText={error.vehicleNumber}
                />
              )}
            />
          </FormControl>
        </div>

        <div
          style={{ margin: "20px 20px 0 20px", minWidth: "180px" }}
          className="form-control-input"
        >
          <FormControl variant="outlined">
            <TextField
              style={{ width: "250px" }}
              id="outlined-basic"
              label="Vendor Name *"
              value={vendorName}
              variant="outlined"
              fullWidth
              onChange={setVendorName}
              error={!!error.vendorName}
              helperText={error.vendorName}
            />
          </FormControl>
        </div>

        <div
          style={{ margin: "15px 30px 0 0", minWidth: "180px" }}
          className="form-control-input"
        >
          <InputLabel id="trip-type-label">Trip Type</InputLabel>
          <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            disabled={true}
            value={searchValues.tripType}
            onChange={searchValues.tripType}
            style={{ width: "250px" }}
          />
        </div>

        <div
          style={{ margin: "20px 20px 0 20px", minWidth: "180px" }}
          className="form-control-input"
        >
          <FormControl fullWidth>
            <InputLabel id="escort-trip-label">Escort Trip *</InputLabel>
            <Select
              style={{ width: "250px", backgroundColor: "white" }}
              labelId="escort-trip-label"
              id="escortTrip"
              name="escortTrip"
              value={searchValues.escortTrip}
              label="Escort Trip *"
              onChange={handleFilterChange}
            >
              {escortTripOptions.map((item) => (
                <MenuItem
                  value={item}
                  style={{
                    fontSize: "15px",
                  }}
                >
                  {item}
                </MenuItem>
              ))}
            </Select>
            {error.escortTrip && (
              <p
                style={{
                  color: "#d32f2f",
                  marginTop: "5px",
                  marginLeft: "14px",
                  fontSize: "12px",
                }}
              >
                {error.escortTrip}
              </p>
            )}
          </FormControl>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          type="button"
          style={{
            backgroundColor: "#f6ce47",
            color: "black",
            width: "160px",
            border: "none",
            borderRadius: "6px",
            fontSize: "15px",
            padding: "15px 35px",
            cursor: "pointer",
            marginTop: "30px",
            marginBottom: "5px",
          }}
          onClick={onSubmitHandler}
        >
          Create Trip
        </button>
      </div>
    </div>
  );
};

export default ManualGenerateTripModal;
