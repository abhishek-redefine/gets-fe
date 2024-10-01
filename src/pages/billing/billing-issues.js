import React, { useState, useEffect } from "react";
import { FormControl, InputLabel, Select, MenuItem, Autocomplete, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { getFormattedLabel } from "@/utils/utils";
import { DATE_FORMAT, MASTER_DATA_TYPES } from "@/constants/app.constants.";
import OfficeService from "@/services/office.service";
import { useDispatch, useSelector } from "react-redux";
import billing from "@/layouts/billing";
import { setMasterData } from "@/redux/master.slice";
import MasterDataService from "@/services/masterdata.service";
import BillingIssuesTable from "@/components/billing/billingIssuesTable";
import BillingIssuesDetails from "@/components/billing/billingIssuesDetails";
import ComplianceService from "@/services/compliance.service";
import BillingService from "@/services/billing.service";

const MainComponent = () => {
  const [office, setOffice] = useState([]);
  const [searchValues, setSearchValues] = useState({
    officeId: "",
    shiftType: "",
    tripDate: moment().format("YYYY-MM-DD"),
    issueName: "DISTANCE_ISSUE",
    vendorName : "",
    tripBillingState : "BILLING_ISSUE"
  });
  const [list, setList] = useState([]);
  const [searchVendor, setSearchVendor] = useState([]);
  const [openSearchVendor, setOpenSearchVendor] = useState(false);

  const [tripId, setTripId] = useState(null);
  const [tripList,setTripList] = useState([]);

  const { ShiftType: shiftTypes } = useSelector((state) => state.master);
  const { TripIssue : tripIssue} = useSelector((state) => state.master);
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({
    page: 0,
    size: 100,
  });

  const [selectedTripId, setSelectedTripId] = useState(false);
  const handleTripInfoScreenClose = () => {
    console.log("Screen closed");
    setSelectedTripId(false);
  };

  const searchForVendor = async (e) => {
    try {
      if (e.target.value) {
        const response = await ComplianceService.searchVendor(e.target.value);
        const { data } = response || {};
        setSearchVendor(data);
      } else {
        setSearchVendor([]);
      }
    } catch (e) {
      console.error(e);
    }
  }

  const onChangeHandler = (newValue, name) => {
    console.log("on change handler", newValue);
    let allSearchValues = {...searchValues};
    allSearchValues[name] = newValue;
    setSearchValues(allSearchValues);
  };

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    let newSearchValues = { ...searchValues };
    if (name === "tripDate") newSearchValues[name] = value.format("YYYY-MM-DD");
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
    } catch (e) { }
  };

  const fetchMasterData = async (type) => {
    try {
      const response = await MasterDataService.getMasterData(type);
      const { data } = response || {};
      if (data?.length) {
        console.log(data);
        dispatch(setMasterData({ data, type }));
      }
    } catch (e) { }
  };

  const resetFilter = () => {
    let allSearchValue = {
      officeId: office[0].officeId,
      shiftType: "",
      tripDate: moment().format("YYYY-MM-DD"),
      issueName: "DISTANCE_ISSUE",
      vendorName : ""
    };
    setSearchValues(allSearchValue);
  };

  const fetchSummary = async () => {
    try {
      let params = new URLSearchParams(pagination);
      let allSearchValues = { ...searchValues };
      Object.keys(allSearchValues).forEach((objKey) => {
        if (
          allSearchValues[objKey] === null ||
          allSearchValues[objKey] === ""
        ) {
          delete allSearchValues[objKey];
        }
      });
      const response = await BillingService.billingIssuesSearchByBean(params, allSearchValues);
      const data = response.data;
      console.log(data.content);
      setList(data.content);
    } catch (err) {
      console.log(err);
    }
  };

  const handleTripClick = (tripId,row) => {
    setSelectedTripId(true);
    setTripId(tripId || null);
    setTripList([row]);
  };

  useEffect(() => {
    if (!shiftTypes?.length) {
      fetchMasterData(MASTER_DATA_TYPES.SHIFT_TYPE);
    }
    fetchAllOffices();
    fetchMasterData(MASTER_DATA_TYPES.ISSUE_TYPE);
  }, []);

  useEffect(()=>{
    console.log("Issue Type:",tripIssue);
  },[tripIssue])

  return (
    <div>
      {selectedTripId ? (
        <BillingIssuesDetails
          onClose={handleTripInfoScreenClose}
          tripId={tripId}
          tripdetails={tripList}
          officeId={searchValues.officeId}
          date={searchValues.tripDate}
          IssueType={tripIssue}
        />
      ) : (
        <div>
          <div
            className="filterContainer"
            style={{
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
                  name="tripDate"
                  format={DATE_FORMAT}
                  value={searchValues.tripDate ? moment(searchValues.tripDate) : null}
                  onChange={(e) =>
                    handleFilterChange({
                      target: { name: "tripDate", value: e },
                    })
                  }
                />
              </LocalizationProvider>
            </div>

            <div
              style={{ minWidth: "160px", backgroundColor: "white" }}
              className="form-control-input"
            >
              <FormControl fullWidth>
                <InputLabel id="issueName-label">
                  Issue Category
                </InputLabel>
                <Select
                  style={{ width: "180px", backgroundColor: "white" }}
                  labelId="issueName-label"
                  id="issueName"
                  name="issueName"
                  value={searchValues.issueName}
                  label="Issue Category"
                  onChange={handleFilterChange}
                >
                  {tripIssue && tripIssue.length > 0 && 
                    tripIssue.map((item) => (
                      <MenuItem value={item.value}>{item.displayName}</MenuItem>
                  ))}
                </Select>
              </FormControl>
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

            <div
              style={{ minWidth: "160px", backgroundColor: "white" }}
              className="form-control-input"
            >
              <FormControl variant="outlined">
                <Autocomplete
                  disablePortal
                  id="search-vendor"
                  options={searchVendor}
                  autoComplete
                  open={openSearchVendor}
                  onOpen={() => {
                    setOpenSearchVendor(true);
                  }}
                  onClose={() => {
                    setOpenSearchVendor(false);
                  }}
                  onChange={(e, val) => onChangeHandler(val?.vendorName, "VendorName")}
                  getOptionKey={(vendor) => vendor.vendorId}
                  getOptionLabel={(vendor) => vendor.vendorName}
                  freeSolo
                  name="Vendor"
                  renderInput={(params) => <TextField {...params} label="Search Vendor Name" onChange={searchForVendor} />}
                />
              </FormControl>
            </div>
            {/* <div style={{ minWidth: "160px", backgroundColor: 'white', }} className="form-control-input">
              <FormControl fullWidth>
                <InputLabel id="shiftType-label">Shift Time</InputLabel>
                <Select
                  style={{ width: "160px" }}
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
            </div> */}
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
              padding: "25px",
              // backgroundColor: "green",
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                marginBottom: "10px",
                padding: "20px 20px",
                borderRadius: "20px 20px 0 0",
              }}
            >
              <h3>Details</h3>
            </div>
            <BillingIssuesTable
              list={list}
              vehicleIdClicked={(tripId,row)=>handleTripClick(tripId,row)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default billing(MainComponent);
