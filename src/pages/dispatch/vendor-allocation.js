import dispatch from "@/layouts/dispatch";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { getFormattedLabel } from "@/utils/utils";
import OfficeService from "@/services/office.service";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { DATE_FORMAT, MASTER_DATA_TYPES } from "@/constants/app.constants.";
import { useDispatch, useSelector } from "react-redux";
import MasterDataService from "@/services/masterdata.service";
import GridNew from "@/components/gridNew";
import DispatchService from "@/services/dispatch.service";
import { setMasterData } from "@/redux/master.slice";
import AllocateVendor from "@/components/dispatch/allocate-vendors";

const MainComponent = () => {
  const headers = [
    { field: "officeId", checkboxSelection: true },
    { field: "shiftType" },
    { field: "shiftTime" },
    { field: "bookingCount" },
    { field: "routingStatus" },
    { field: "dispatchStatus" },
    {
      field: "tripCount",
      cellRenderer: (params) => {
        const tripCount = params.value;

        const handleClick = () => {
          //clicked cell row data
          console.log(params.node.data);
        };

        return (
          <div
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              color: "blue",
            }}
            onClick={handleClick}
          >
            {tripCount}
          </div>
        );
      },
    },
    { field: "allocatedVendorCount" },
    { field: "allocatedCabCount" },
    { field: "fleetMix" },
    { field: "escortTrip" },
    { field: "allocatedEscortCount" },
    { field: "backToBackCount" },
    { field: "smsSent" },
    { field: "emailSent" },
  ];
  const [office, setOffice] = useState([]);
  const [searchValues, setSearchValues] = useState({
    officeId: "",
    shiftType: "",
    date: moment().format("YYYY-MM-DD"),
    transportType: "",
  });

  const { ShiftType: shiftTypes } = useSelector((state) => state.master);
  const dispatch = useDispatch();
  const [showAction, setShowAction] = useState(false);
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [allocateVendorShow, setAllocateVendorShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [shiftId, setShiftId] = useState(null);
  const [tripList, setTripList] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    let newSearchValues = { ...searchValues };
    if (name === "date") {
      newSearchValues[name] = value.format("YYYY-MM-DD");
      setSelectedDate(value.format("YYYY-MM-DD"));
    } else newSearchValues[name] = value;
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
        dispatch(setMasterData({ data, type }));
      }
    } catch (e) {}
  };

  const allocateVendorHanlder = async () => {
    try {
      setAllocateVendorShow(true);
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      const queryParams = {
        shiftId: shiftId,
        tripDate: selectedDate,
      };
      const params = new URLSearchParams(queryParams);
      const response = await DispatchService.getTripByShiftIdAndTripDate(
        params
      );
      console.log("allocate Vendor response>>>", response.data);
      setTripList(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSummary = async () => {
    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
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
    } finally {
      setLoading(false);
    }
  };

  const selectedRowHandler = (flag, row) => {
    setShowAction(flag);
    setSelectedRow(row);
    setShiftId(row.shiftId);
  };

  const resetFilter = () => {
    let allSearchValue = {
      officeId: office[0].officeId,
      date: moment().format("YYYY-MM-DD"),
      shiftType: "",
    };
    setSearchValues(allSearchValue);
  };

  useEffect(() => {
    if (!shiftTypes?.length) {
      fetchMasterData(MASTER_DATA_TYPES.SHIFT_TYPE);
    }
    fetchAllOffices();
  }, []);

  useEffect(() => {
    console.log("tripList", tripList);
  }, [tripList]);

  return (
    <div>
      {!allocateVendorShow ? (
        <div className="gridContainer">
          <div
            className="filterContainer"
            style={{ backgroundColor: "#f9f9f9", borderRadius: "10px" }}
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
                  name="date"
                  format={DATE_FORMAT}
                  value={searchValues.date ? moment(searchValues.date) : null}
                  onChange={(e) =>
                    handleFilterChange({
                      target: { name: "date", value: e },
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
            className="commonTable"
            style={{ backgroundColor: "#f9f9f9", marginTop: "20px" }}
          >
            <div
              className="d-flex"
              style={{
                margin: "15px 0",
                justifyContent: "space-between",
                backgroundColor: "white",
                padding: "15px 10px",
                borderRadius: "10px",
              }}
            >
              <div className="d-flex" style={{ alignItems: "center" }}>
                <h3 style={{ paddingLeft: 10 }}>Routing Details</h3>
              </div>
              {showAction && (
                <div
                  className="d-flex"
                  style={{
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{ minWidth: "60px" }}
                    className="form-control-input"
                  >
                    <h4>Actions</h4>
                  </div>
                  <div style={{ minWidth: "180px" }} className="mx-4">
                    <div className="dropdown">
                      {showAction && (
                        <button
                          onClick={() => allocateVendorHanlder()}
                          className="dropbtn"
                        >
                          Allocate Vendors
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={{ minWidth: "180px" }} className="mx-4">
                    <div className="dropdown">
                      <button className="dropbtn">
                        Pending Vendor Allocation
                      </button>
                    </div>
                  </div>
                  {/* <div style={{ minWidth: "180px" }} className="mx-4">
                    <div className="dropdown">
                      <button className="dropbtn">
                        Auto Allocate Vendors
                      </button>
                    </div>
                  </div> */}
                  {/* <div style={{ minWidth: "180px" }} className="mx-4">
                    <div className="dropdown">
                      <button className="dropbtn">Upload Options</button>
                    </div>
                  </div>
                  <div style={{ minWidth: "180px" }} className="mx-4">
                    <div className="dropdown">
                      <button className="dropbtn">Download Options</button>
                    </div>
                  </div> */}
                </div>
              )}
            </div>
            <GridNew
              data={data}
              headers={headers}
              setShowAction={(flag, row) => selectedRowHandler(flag, row)}
              isLoading={loading}
            />
          </div>
        </div>
      ) : (
        <div style={{ margin: "20px 0", boxShadow: "none" }}>
          <AllocateVendor
            tripList={tripList}
            isLoading={loading}
            allocationComplete={() => setAllocateVendorShow(false)}
          />
        </div>
      )}
    </div>
  );
};

export default dispatch(MainComponent);
