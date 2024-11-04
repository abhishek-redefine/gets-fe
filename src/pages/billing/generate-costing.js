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
      width: 270,
      overflowX: 'auto',
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

  const [monthList, setMonthList] = useState([]);
  const [configListing, setConfigListing] = useState();
  const [paginationData, setPaginationData] = useState();
  const [pagination, setPagination] = useState({
    pageNo: 0,
    pageSize: 100,
  })

  const handleFilterChange = (e) => {
    const value = e.target.value;
    console.log(value);
    let fromDate = '';
    let toDate = '';
    configListing.map((val) => {
      if (value === val.month) {
        fromDate = val.fromDate;
        if (moment(val.toDate).isAfter(moment())) {
          toDate = moment().format('YYYY-MM-DD');
        } else {
          toDate = val.toDate;
        }
      }
    });
    setSearchValues((prev) => ({
      ...prev,
      month: value,
      tripFromDateStr: fromDate,
      tripToDateStr: toDate
    }));
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

  const fetchAllConfig = async () => {
    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      let params = new URLSearchParams(pagination);
      const response = await BillingService.getAllConfig(params);
      const resData = response.data.paginatedResponse.content;
      const todayDate = moment();
      let newList = [];
      resData.map((val) => {
        if (moment(val.fromDate).isSameOrBefore(todayDate)) {
          newList.push(val);
        }
      })
      setConfigListing(newList);

      const data = response.data.paginatedResponse;
      let localPaginationData = { ...data };
      delete localPaginationData?.data;
      setPaginationData(localPaginationData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    // console.log(vendorId !== "")
    if (searchValues.month !== "") {
      try {
        let allSearchValues = { ...searchValues };
        setLoading(true);
        const response = await BillingService.CalculateBillForAll(
          allSearchValues.month,
          allSearchValues.tripFromDateStr,
          allSearchValues.tripToDateStr
        );
        const data = response.data;
        console.log(data);
        let billList = [];
        data.map((val) => {
          let totalDuration = 0;
          let totalCost = 0;
          let totalKm = 0;
          val.billingDTOS.map((val) => {
            if (val.contractTypeKMBased === "PACKAGE_BASED") {
              totalCost += val.amountForContractTypePackageBased;
              totalDuration += val.hourForContractTypePackageBased;
              totalKm += val.distanceForContractTypePackageBased;
            }
            else if (val.contractTypeKMBased === "TRIP_SLAB_BASED") {
              totalCost += val.amountForContractTypeSlabBased;
              totalDuration += val.hourForContractTypeSlabBased;
              totalKm += val.distanceForContractTypeSlabBased;
            }
            else if (val.contractTypeKMBased === "KM_BASED") {
              totalCost += val.amountForContractTypeKMBased;
              totalDuration += val.hourForContractTypeKMBased;
              totalKm += val.distanceForContractTypeKMBased;
            }
            else if (val.contractTypeKMBased === "FLAT_TRIP_BASED") {
              totalCost += val.amountForContractTypeFlatTripBased;
              totalDuration += val.hourForContractTypeFlatTripBased;
              totalKm += val.distanceForContractTypeFlatTripBased;
            }
            else {
              totalCost += val.amountForContractTypeZoneBased;
              totalDuration += val.distanceForContractTypeZoneBased;
              totalKm += val.hourForContractTypeZoneBased;
            }
          })
          let newList =
          {
            vendorName: val.vendorName,
            tripCount: val.tripCount,
            totalKm: totalKm,
            totalCost: totalCost,
            totalTripDuration: totalDuration,
            fromDate: moment(val.startDate).format('DD-MM-YYYY'),
            toDate: moment(val.endDate).format('DD-MM-YYYY')
          }
          billList.push(newList);
        })
        setList(billList);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  };

  //   useEffect(() => {
  //   }, []);

  // useEffect(() => {
  //   if (searchValues.vendorId) {
  //     fetchVendorContracts();
  //   }
  // }, [searchValues.vendorId]);

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
    fetchAllConfig();
  }, [])

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

          {/* <div className="form-control-input">
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
                  setVendorName(val?.vendorName || "");
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
          </div> */}

          <div className="form-control-input" style={{
            display: 'inline-block',
            margin: '20px',
            minWidth: '300px'
          }}>
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
                {configListing &&
                  configListing.length > 0 &&
                  configListing.map((month) => {
                    console.log(month)
                    return (<MenuItem key={month.month} value={month.month}>
                      {month.month}
                    </MenuItem>)
                  })}
              </Select>
            </FormControl>
          </div>

          {/* <div
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
          </div> */}

          <div className="form-control-input" style={{ minWidth: "170px" }}>
            <button
              type="submit"
              onClick={() => fetchSummary()}
              className="btn btn-primary"
              style={{ padding: '18px' }}
            >
              Generate Bill
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
