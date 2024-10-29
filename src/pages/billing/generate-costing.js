import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Autocomplete,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { DATE_FORMAT } from "@/constants/app.constants.";
import { useDispatch } from "react-redux";
import billing from "@/layouts/billing";
import BillingService from "@/services/billing.service";
import { getFormattedLabel } from "@/utils/utils";
import ComplianceService from "@/services/compliance.service";
import GenerateCostingTable from "@/components/billing/generateCostingTable";

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 150,
      width: 250,
    },
  },
};

const MainComponent = () => {
  const [searchValues, setSearchValues] = useState({
    vendorId: "",
    // contractType: "",
    month: "",
    tripFromDateStr: "",
    tripToDateStr: "",
  });
  const [list, setList] = useState([]);
  const [vendorName, setVendorName] = useState("");
  const [billingData, setBillingData] = useState(null);
  const [cost, setCost] = useState(0);

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchVendor, setSearchVendor] = useState([]);
  const [openSearchVendor, setOpenSearchVendor] = useState(false);
  const [contractList, setContractList] = useState([]);
  const [vendorId, setVendorId] = useState("");

  const monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    let newSearchValues = { ...searchValues };
    if (name === "tripFromDateStr" || name === "tripToDateStr")
      newSearchValues[name] = value.format("YYYY-MM-DD");
    else newSearchValues[name] = value;
    setSearchValues(newSearchValues);
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
  };

  const fetchVendorContracts = async () => {
    try {
      console.log("vendorId: ", searchValues.vendorId);
      let id = parseInt(searchValues.vendorId);
      //   let id = parseInt(vendorId);
      console.log("id: ", id);
      const response = await ComplianceService.getVendorCompanyContractsById(
        id
      );
      console.log("vendor contracts response>>>", response);
      setContractList(response.data);
    } catch (e) {
      console.error("Error fetching contracts:", e);
    }
  };

  const resetFilter = () => {
    let allSearchValue = {
      vendorId: "",
      // contractType: "",
      month: "",
      tripFromDateStr: "",
      tripToDateStr: "",
    };
    setSearchValues(allSearchValue);
    setSearchVendor([]);
    setContractList([]);
  };

  const fetchSummary = async () => {
    try {
      let allSearchValues = { ...searchValues };
      // let reqBody = {};
      //   Object.keys(allSearchValues).forEach((objKey) => {
      //     if (
      //       allSearchValues[objKey] === null ||
      //       allSearchValues[objKey] === ""
      //     ) {
      //       delete allSearchValues[objKey];
      //     }
      //   });
      // reqBody = {
      //   vendorId: parseInt(allSearchValues.vendorId),
      //   contractType: allSearchValues.contractType,
      //   tripFromDateStr: allSearchValues.tripFromDateStr,
      //   tripToDateStr: allSearchValues.tripToDateStr,
      // };
      setLoading(true);
      if (allSearchValues.contractType === "PACKAGE_BASED") {
        const response = await BillingService.CalculatePackageBill(
          allSearchValues.contractType,
          parseInt(allSearchValues.vendorId),
          allSearchValues.tripFromDateStr,
          allSearchValues.tripToDateStr
        );
        console.log("response>>>", response);
        const data = response.data;
        setBillingData(response.data);
        setCost(data[0].amountForContractTypePackageBased);
      } else {
        const response = await BillingService.CalculateBill(
          allSearchValues.contractType,
          parseInt(allSearchValues.vendorId),
          allSearchValues.tripFromDateStr,
          allSearchValues.tripToDateStr
        );
        const data = response.data;
        setBillingData(data);
        data &&
          data.map((val) => {
            if (val.contractTypeKMBased === "TRIP_SLAB_BASED") {
              setCost(() => val.amountForContractTypeSlabBased);
            } else if (val.contractTypeKMBased === "KM_BASED") {
              setCost(() => val.amountForContractTypeKMBased);
            } else if (val.contractTypeKMBased === "FLAT_TRIP_BASED") {
              console.log(val);
              setCost(val.amountForContractTypeFlatTripBased);
            } else if (val.contractTypeKMBased === "ZONE_BASED") {
              setCost(() => val.amountForContractTypeZoneBased);
            }
          });
      }

      // setList(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  //   useEffect(() => {
  //   }, []);

  useEffect(() => {
    if (searchValues.vendorId) {
      fetchVendorContracts();
    }
  }, [searchValues.vendorId]);

  useEffect(() => {
    if (!selectedRow) {
      console.log("Row unselected");
      // setSelectedRow(null);
    }
  }, [selectedRow]);

  useEffect(() => {
    console.log("searchValues changed: ", searchValues);
  }, [searchValues]);

  useEffect(() => {
    console.log("list>>>", list);
  }, [list]);

  return (
    <div>
      <div>
        <div
          className="filterContainer"
          style={{
            flexWrap: "wrap",
            alignItems: "center",
            backgroundColor: "#f9f9f9",
            borderRadius: "10px",
            margin: "30px 0",
            padding: "0 13px",
          }}
        >
          <div className="form-control-input">
            <FormControl fullWidth>
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
                onChange={(e, val) => {
                  setSearchValues((prev) => ({
                    ...prev,
                    vendorId: val ? val.vendorId : "",
                  }));
                  setVendorName(val.vendorName);
                }}
                getOptionKey={(vendor) => vendor.vendorId}
                getOptionLabel={(vendor) => vendor.vendorName}
                freeSolo
                name="vendorId"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Vendor Name"
                    onChange={searchForVendor}
                  />
                )}
                style={{ backgroundColor: "#ffffff" }}
              />
            </FormControl>
          </div>

          {/* <div className="form-control-input">
            <FormControl fullWidth>
              <InputLabel id="contract-label">Contract Type</InputLabel>
              <Select
                labelId="contract-label"
                id="contractType"
                value={searchValues.contractType}
                name="contractType"
                label="Contract Type"
                onChange={handleFilterChange}
                MenuProps={MenuProps}
                style={{ backgroundColor: "#ffffff" }}
              >
                {!!contractList?.length &&
                  contractList.map((contract, idx) => (
                    <MenuItem key={idx} value={contract.contractType}>
                      {contract.id}, {getFormattedLabel(contract.contractType)},{" "}
                      {contract.contractId}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div> */}

          <div className="form-control-input">
            <FormControl fullWidth>
              <InputLabel id="month-label">Month</InputLabel>
              <Select
                labelId="month-label"
                id="month"
                value={searchValues.month}
                name="month"
                label="Month"
                onChange={handleFilterChange}
                MenuProps={MenuProps}
                style={{ backgroundColor: "#ffffff" }}
              >
                {monthList.map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div
            className="form-control-input"
            style={{ backgroundColor: "white" }}
          >
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                name="tripFromDateStr"
                format={DATE_FORMAT}
                value={
                  searchValues.tripFromDateStr
                    ? moment(searchValues.tripFromDateStr)
                    : null
                }
                onChange={(e) =>
                  handleFilterChange({
                    target: { name: "tripFromDateStr", value: e },
                  })
                }
                label="Start Date"
              />
            </LocalizationProvider>
          </div>

          <div
            className="form-control-input"
            style={{ backgroundColor: "white" }}
          >
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                name="tripToDateStr"
                format={DATE_FORMAT}
                value={
                  searchValues.tripToDateStr
                    ? moment(searchValues.tripToDateStr)
                    : null
                }
                onChange={(e) =>
                  handleFilterChange({
                    target: { name: "tripToDateStr", value: e },
                  })
                }
                label="End Date"
                minDate={
                  searchValues.tripFromDateStr
                    ? moment(searchValues.tripFromDateStr)
                    : null
                }
              />
            </LocalizationProvider>
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
            padding: "25px",
            // backgroundColor: "green",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "white",
              marginBottom: "10px",
              padding: "20px 20px",
              borderRadius: "20px 20px 0 0",
            }}
          >
            <h3>Billing Cycle</h3>
          </div>
          {/* {billingData && (
            <div
              style={{
                backgroundColor: "white",
                borderRadius: "6px",
                padding: "25px",
                // backgroundColor: "green",
              }}
            >
              <div>
                <p style={{ paddingBottom: 5 }}>
                  <span style={{ fontWeight: "bold" }}>Vendor Name</span> :{" "}
                  {vendorName}
                </p>
                <p style={{ paddingBottom: 5 }}>
                  <span style={{ fontWeight: "bold" }}>Contract Name</span> :{" "}
                  {searchValues.contractType}
                </p>
                <p style={{ paddingBottom: 5 }}>
                  <span style={{ fontWeight: "bold" }}>Start Date</span> :{" "}
                  {moment(searchValues.tripFromDateStr).format("DD-MM-YYYY")}
                </p>
                <p style={{ paddingBottom: 5 }}>
                  <span style={{ fontWeight: "bold" }}>End Date</span> :{" "}
                  {moment(searchValues.tripToDateStr).format("DD-MM-YYYY")}
                </p>
                <p style={{ paddingBottom: 5 }}>
                  <span style={{ fontWeight: "bold" }}>
                    Total Cost Generated
                  </span>{" "}
                  : Rs {cost}
                </p>
              </div>
            </div>
          )} */}
          <GenerateCostingTable isLoading={loading} list={list} />
        </div>
      </div>
    </div>
  );
};

export default billing(MainComponent);
