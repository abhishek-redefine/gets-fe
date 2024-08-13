import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { getFormattedLabel } from "@/utils/utils";
import { DATE_FORMAT, MASTER_DATA_TYPES } from "@/constants/app.constants.";
import OfficeService from "@/services/office.service";
import { useDispatch, useSelector } from "react-redux";
import helpdesk from "@/layouts/helpdesk";
import { setMasterData } from "@/redux/master.slice";
import MasterDataService from "@/services/masterdata.service";
import DispatchService from "@/services/dispatch.service";
import UsersTable from "@/components/helpdesk/usersTable";
import TripsTable from "@/components/helpdesk/tripsTable";
import VehiclesNDriversTable from "@/components/helpdesk/vehicles&DriversTable";
import TripDetails from "@/components/helpdesk/tripDetails";
import LoaderComponent from "@/components/common/loading";

const MainComponent = () => {
  const [office, setOffice] = useState([]);
  const [searchValues, setSearchValues] = useState({
    officeId: "",
    shiftType: "",
    date: moment().format("YYYY-MM-DD"),
    tripStatus: "",
  });
  const [selectFormat, setSelectFormat] = useState("Users");
  const [list, setList] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState(false);
  const handleTripInfoScreenClose = () => {
    console.log("Screen closed");
    setSelectedTripId(false);
  };

  const { ShiftType: shiftTypes } = useSelector((state) => state.master);
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({
    page: 0,
    size: 100,
  });

  const [loading, setLoading] = useState(false);

  const [userData, setUserData] = useState({
    Name: "Vikram Singh",
    "Phone No.": "8506897224",
    "Transport Address": "Sector 62, Noida",
    "Reporting Manager": "Rahul Yadav",
    "Manager No.": "9334214198",
    "Team Name": "Super 30",
    "Project Code": "CB-007",
  });

  const [shiftTimeData, setShifTimetData] = useState({
    "Login Shift": "11:11",
    "Logout Shift": "16:40",
    Adhoc: "14:10",
  });

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
      setLoading(true);
      const response = await OfficeService.getAllOffices();
      const { data } = response || {};
      const { clientOfficeDTO } = data || {};
      console.log(clientOfficeDTO);
      setSearchValues(
        { ...searchValues },
        (searchValues["officeId"] = clientOfficeDTO[0]?.officeId)
      );
      setOffice(clientOfficeDTO);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const fetchMasterData = async (type) => {
    try {
      setLoading(true);
      const response = await MasterDataService.getMasterData(type);
      const { data } = response || {};
      if (data?.length) {
        console.log(data);
        dispatch(setMasterData({ data, type }));
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const resetFilter = () => {
    let allSearchValue = {
      officeId: office[0].officeId,
      date: moment().format("YYYY-MM-DD"),
      shiftType: "",
    };
    setSearchValues(allSearchValue);
  };

  const fetchSummary = async () => {
    try {
      setLoading(true);
      console.log("loader is working!", loading);
      /*---------------- temporarily -----------------*/
      // await new Promise((resolve) => setTimeout(resolve, 10000));
      /*---------------------------------------------*/
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
      const response = await DispatchService.getTripSearchByBean(
        params,
        allSearchValues
      );
      console.log("response data", response.data.data);
      const data = [
        {
          id: 1,
          tripState: "Ongoing",
          shiftTime: "10:00",
          shiftType: "LOGIN",
          vehicleNumber: "DL 2C 2353",
          signIn: "09:30",
          signOut: "16:00",
        },
      ];
      //   setList(response.data.data);
      setList(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTripClick = () => {
    setSelectedTripId(true);
  };

  useEffect(() => {
    if (!shiftTypes?.length) {
      fetchMasterData(MASTER_DATA_TYPES.SHIFT_TYPE);
    }
    fetchAllOffices();
  }, []);

  const handleFormatChange = (e) => {
    setSelectFormat(e.target.value);
  };

  return (
    <div>
      {selectedTripId ? (
        <TripDetails onClose={handleTripInfoScreenClose} />
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
            style={{
              display: "flex",
              margin: "40px 0",
              backgroundColor: "#f9f9f9",
              borderRadius: "10px",
              margin: "30px 0",
              padding: "20px 13px",
            }}
          >
            <input
              type="radio"
              id="users"
              name="selectFormat"
              value="Users"
              className="radio-item"
              style={{ margin: "0 10px 0 25px" }}
              checked={selectFormat === "Users"}
              onChange={handleFormatChange}
            />
            <label for="users" style={{ marginRight: "15px" }}>
              Users
            </label>
            <input
              type="radio"
              id="trips"
              name="selectFormat"
              value="Trips"
              className="radio-item"
              style={{ margin: "0 10px 0 25px" }}
              checked={selectFormat === "Trips"}
              onChange={handleFormatChange}
            />
            <label for="trips" style={{ marginRight: "15px" }}>
              Trips
            </label>
            <input
              type="radio"
              id="vehicles&Drives"
              name="selectFormat"
              value="Vehicle & Drivers"
              className="radio-item"
              style={{ margin: "0 10px 0 25px" }}
              checked={selectFormat === "Vehicle & Drivers"}
              onChange={handleFormatChange}
            />
            <label for="vehicles&Drives" style={{ marginRight: "15px" }}>
              Vehicle & Drivers
            </label>
          </div>
          {selectFormat === "Users" && (
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
                  // backgroundColor: "pink",
                  paddingRight: "48px",
                }}
              >
                <Grid
                  container
                  alignItems="stretch"
                  rowSpacing={3}
                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  style={{
                    margin: "0 0",
                    // backgroundColor: "yellow"
                  }}
                >
                  <Grid item xs={8}>
                    <p
                      style={{
                        fontFamily: "DM Sans",
                        fontWeight: "bold",
                        fontSize: "16px",
                        backgroundColor: "#FFFFFF",
                        padding: "20px 20px",
                        borderRadius: "5px",
                      }}
                    >
                      User Summary
                    </p>
                  </Grid>
                  <Grid item xs={4}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontFamily: "DM Sans",
                        backgroundColor: "#FFFFFF",
                        padding: "20px 20px",
                        borderRadius: "5px",
                      }}
                    >
                      <p
                        style={{
                          fontWeight: "bold",
                          fontSize: "16px",
                        }}
                      >
                        Schedule Summary
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                        }}
                      >
                        21-07-2024
                      </p>
                    </div>
                  </Grid>
                  <Grid item xs={8}>
                    <Box
                      style={{
                        fontFamily: "DM Sans",
                        backgroundColor: "#FFFFFF",
                        padding: "25px 25px 10px",
                        borderRadius: "5px",
                      }}
                    >
                      <Grid container xs={12} alignItems="stretch" style={{}}>
                        {Object.entries(userData).map(([key, value], index) => (
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
                        ))}
                        <button
                          type="viewProfile"
                          className="btn btn-primary"
                          style={{
                            width: "140px",
                            padding: "10px 20px",
                            marginBottom: "25px",
                            marginLeft: "0",
                          }}
                        >
                          View Profile
                        </button>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box
                      style={{
                        fontFamily: "DM Sans",
                        backgroundColor: "#FFFFFF",
                        padding: "25px 25px 10px",
                        borderRadius: "5px",
                      }}
                    >
                      <Grid container xs={12} alignItems="stretch" style={{}}>
                        {Object.entries(shiftTimeData).map(
                          ([key, value], index) => (
                            <Grid
                              key={index}
                              item
                              xs={6}
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
                      </Grid>
                    </Box>
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
              <UsersTable list={list} usersTripIdClicked={handleTripClick} />
            </div>
          )}
          {selectFormat === "Trips" && (
            <div
              style={{
                backgroundColor: "#f9f9f9",
                borderRadius: "6px",
                padding: "15px 0 20px",
                // backgroundColor: "green",
              }}
            >
              <div
                style={{
                  backgroundColor: "white",
                  margin: "10px 20px 3px",
                  padding: "20px 20px",
                  borderRadius: "20px 20px 0 0",
                }}
              >
                <h3>Booking Summary</h3>
              </div>
              <TripsTable list={list} tripsTripIdClicked={handleTripClick} />
            </div>
          )}
          {selectFormat === "Vehicle & Drivers" && (
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
                    {Object.entries(userData).map(([key, value], index) => (
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
                    ))}
                    <button
                      type="viewProfile"
                      className="btn btn-primary"
                      style={{
                        width: "140px",
                        padding: "10px 20px",
                        marginBottom: "25px",
                        marginLeft: "0",
                      }}
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
          )}
          {loading ? (
            <div
              style={{
                position: "absolute",
                // backgroundColor: "pink",
                zIndex: "1",
                top: "55%",
                left: "50%",
              }}
            >
              <LoaderComponent />
            </div>
          ) : (
            " "
          )}
        </div>
      )}
    </div>
  );
};

export default helpdesk(MainComponent);
