import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Grid,
  Autocomplete,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { getFormattedLabel } from "@/utils/utils";
import { DATE_FORMAT, MASTER_DATA_TYPES } from "@/constants/app.constants.";
import OfficeService from "@/services/office.service";
import { useDispatch, useSelector } from "react-redux";
import { setMasterData } from "@/redux/master.slice";
import MasterDataService from "@/services/masterdata.service";
import UsersTable from "@/components/helpdesk/usersTable";
import BookingService from "@/services/booking.service";
import LoaderComponent from "../loader";
import { toggleToast } from "@/redux/company.slice";

const SearchModuleUsers = () => {
  const [office, setOffice] = useState([]);
  const [searchValues, setSearchValues] = useState({
    officeId: "",
    bookingDate: moment().format("YYYY-MM-DD"),
    shiftType: "",
    empId: "",
    isAdmin: false,
  });
  const [list, setList] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState();
  const [isSearchUser, setIsSearchUser] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState([]);

  const { ShiftType: shiftTypes } = useSelector((state) => state.master);
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({
    page: 0,
    size: 100,
  });

  const [userDetails, setUserDetails] = useState({});
  const [scheduleDate, setScheduleDate] = useState({
    date: moment().format("YYYY-MM-DD"),
  });
  const [scheduleSummaryData, setScheduleSummaryData] = useState([]);

  const [userData, setUserData] = useState({
    Name: "",
    "Phone No.": "",
    "Transport Address": "",
    "Reporting Manager": "",
    "Manager No.": "",
    "Team Name": "",
  });

  const [scheduleSummaryDetails, setScheduleSummaryDetails] = useState({
    "Login Shift": "",
    "Logout Shift": "",
    Adhoc: "",
  });

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    let newSearchValues = { ...searchValues };
    if (name === "bookingDate")
      newSearchValues[name] = value.format("YYYY-MM-DD");
    else newSearchValues[name] = value;
    setSearchValues(newSearchValues);
  };

  const handleScheduleDateChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    console.log("object", value.format("YYYY-MM-DD"));
    setScheduleDate((prev) => ({
      ...prev,
      [name]: value ? value.format("YYYY-MM-DD") : "",
    }));
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

  const resetFilter = () => {
    let allSearchValue = {
      officeId: office[0].officeId,
      bookingDate: moment().format("YYYY-MM-DD"),
      shiftType: "",
      empId: "",
    };
    setSearchValues(allSearchValue);
  };

  const fetchSummary = async () => {
    let hasError = false;
    if (!searchValues.empId) {
      setError((prevError) => ({
        ...prevError,
        empId: "Employee email is mandatory.",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, empId: "" }));
    }
    if (hasError) {
      console.log("Search user first");
    } else {
      try {
        setLoading(true);
        // await new Promise((resolve) => setTimeout(resolve, 5000));
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
        const response = await BookingService.getAllBookings(
          params,
          allSearchValues
        );
        console.log("fetch summary response data>>>", response.data.data);

        setList(response.data.data);
        fetchUserDetails();
        if (response.status === 500) {
          dispatch(
            toggleToast({
              message: `Failed!, Please try again later.`,
              type: "error",
            })
          );
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const searchForRM = async (e) => {
    try {
      const response = await OfficeService.searchRM(e.target.value);
      console.log("Response data>>>", response);
      const { data } = response || {};
      setSearchedUsers(data);
    } catch (e) {
      console.error(e);
    }
  };

  const onChangeHandler = (val) => {
    console.log(val);
    if (val?.empId) {
      setSelectedUsers([val.data]);
      const email = val.data;
      if (email) {
        setSearchValues((prevValues) => ({
          ...prevValues,
          empId: email,
        }));
      } else {
        console.error("Email is undefined");
      }
      setSelectedUserEmail(val.empId);
    } else {
      setSelectedUsers([]);
      setSearchValues((prevValues) => ({
        ...prevValues,
        empId: "",
      }));
      setSelectedUserEmail(null);
    }
  };

  const fetchUserDetails = async (e) => {
    try {
      const response = await OfficeService.getEmployeeDetails(
        selectedUserEmail
      );
      console.log("User Details>>>", response.data);
      setUserDetails(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchScheduleSummary = async () => {
    if (!searchValues.empId) {
      console.log("Search user first");
    } else {
      if (userDetails) {
        try {
          let params = new URLSearchParams(pagination);
          let allSearchValues = { ...searchValues };
          allSearchValues.shiftType = "";
          allSearchValues.bookingDate = scheduleDate.date;
          Object.keys(allSearchValues).forEach((objKey) => {
            if (
              allSearchValues[objKey] === null ||
              allSearchValues[objKey] === ""
            ) {
              delete allSearchValues[objKey];
            }
          });
          const response = await BookingService.getAllBookings(
            params,
            allSearchValues
          );
          setScheduleSummaryData(response.data.data);
          console.log("scheduleSummaryData>>>", scheduleSummaryData);
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  useEffect(() => {
    if (!shiftTypes?.length) {
      fetchMasterData(MASTER_DATA_TYPES.SHIFT_TYPE);
    }
    fetchAllOffices();
  }, []);

  useEffect(() => {
    if (selectedUserEmail) {
      console.log("Fetching user details for email:", selectedUserEmail);
    }
  }, [selectedUserEmail]);

  useEffect(() => {
    // console.log("inside useeffect User Details>>>", userDetails);
    if (userDetails) {
      setUserData((prev) => ({
        ...prev,
        Name: userDetails.name || "-",
        "Phone No.": userDetails.mob || "-",
        "Transport Address": userDetails.address || "-",
        "Reporting Manager": userDetails?.rm?.name || "-",
        "Manager No.": userDetails?.rm?.mob || "-",
        "Team Name": userDetails.teamName || "-",
      }));
    }
  }, [userDetails]);

  useEffect(() => {
    if (scheduleSummaryData) {
      console.log("ScheduleSummaryData>>>", scheduleSummaryData);
      setScheduleSummaryDetails((prev) => ({
        ...prev,
        "Login Shift":
          scheduleSummaryData.length > 0
            ? scheduleSummaryData[0]?.loginShift ||
              scheduleSummaryData[0]?.logoutShift
            : "-",
        "Logout Shift":
          scheduleSummaryData.length > 0
            ? scheduleSummaryData[1]?.loginShift ||
              scheduleSummaryData[1]?.logoutShift
            : "-",
        Adhoc:
          scheduleSummaryData.length > 0
            ? scheduleSummaryData[0]?.adhoc || "-"
            : "-",
      }));
    }
  }, [scheduleSummaryData]);

  useEffect(() => {
    if (userDetails) {
      console.log("Date>>>", scheduleDate.date);
      fetchScheduleSummary();
    }
  }, [userDetails, scheduleDate.date]);

  return (
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
              name="bookingDate"
              format={DATE_FORMAT}
              value={
                searchValues.bookingDate
                  ? moment(searchValues.bookingDate)
                  : null
              }
              onChange={(e) =>
                handleFilterChange({
                  target: { name: "bookingDate", value: e },
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
        <div className="form-control-input">
          {error.empId && (
            <div
              style={{
                color: "#d32f2f",
                margin: "0 0 5px 8px",
                fontSize: "12px",
              }}
            >
              {error.empId}
            </div>
          )}
          <Autocomplete
            disablePortal
            id="search-user"
            options={searchedUsers}
            autoComplete
            open={isSearchUser}
            onOpen={() => {
              setIsSearchUser(true);
            }}
            onClose={() => {
              setIsSearchUser(false);
            }}
            onChange={(e, val) => onChangeHandler(val)}
            getOptionKey={(rm) => rm.empId}
            getOptionLabel={(rm) => `${rm.data} ${rm.empId}`}
            freeSolo
            name="reportingManager"
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search User"
                onChange={searchForRM}
                sx={{ backgroundColor: "white" }}
                error={!!error.empId}
                // helperText={error.empId}
              />
            )}
          />
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
            padding: "25px 25px 25px",
            // backgroundColor: "pink",
          }}
        >
          <Grid
            container
            alignItems="stretch"
            rowSpacing={4}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={7}>
              <Box
                style={{
                  backgroundColor: "#ffffff",
                  padding: "25px 25px 0",
                  borderRadius: "10px",
                  height: "100%",
                  marginBottom: "25px",
                }}
              >
                <div
                  style={{
                    fontWeight: "600",
                    fontSize: "18px",
                    marginBottom: "20px",
                  }}
                >
                  User Summary
                </div>
                <Box
                  style={{
                    fontSize: "15px",
                  }}
                >
                  <Grid container xs={12}>
                    {Object.entries(userData).map(([key, value], index) => (
                      <Grid
                        key={index}
                        item
                        xs={4}
                        style={{ marginBottom: "25px" }}
                      >
                        <p
                          style={{
                            fontWeight: "bold",
                          }}
                        >
                          {key}
                        </p>
                        <p
                          style={{
                            margin: "5px 0 0 0",
                          }}
                        >
                          {value}
                        </p>
                      </Grid>
                    ))}
                    {/* <button
                      type="viewProfile"
                      className="btn btn-primary"
                      style={{
                        width: "140px",
                        padding: "10px 20px",
                        marginBottom: "20px",
                        marginLeft: "0",
                      }}
                    >
                      View Profile
                    </button> */}
                  </Grid>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Box
                style={{
                  backgroundColor: "#ffffff",
                  padding: "25px 25px 0",
                  borderRadius: "10px",
                  height: "100%",
                  marginBottom: "25px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <p
                    style={{
                      fontWeight: "600",
                      fontSize: "18px",
                      marginBottom: "20px",
                      width: "35%",
                    }}
                  >
                    Schedule Summary
                  </p>
                  <div
                    className="form-control-input"
                    style={{
                      backgroundColor: "white",
                      margin: "0 0 30px",
                      width: "60%",
                    }}
                  >
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        name="date"
                        format={DATE_FORMAT}
                        value={
                          scheduleDate.date ? moment(scheduleDate.date) : null
                        }
                        onChange={(e) =>
                          handleScheduleDateChange({
                            target: { name: "date", value: e },
                          })
                        }
                      />
                    </LocalizationProvider>
                  </div>
                </Box>

                <Box
                  style={{
                    fontSize: "15px",
                  }}
                >
                  <Grid container xs={12} alignItems="stretch" style={{}}>
                    {Object.entries(scheduleSummaryDetails).map(
                      ([key, value], index) => (
                        <Grid
                          key={index}
                          item
                          xs={6}
                          style={{ marginBottom: "25px" }}
                        >
                          <p
                            style={{
                              fontWeight: "bold",
                            }}
                          >
                            {key}
                          </p>
                          <p
                            style={{
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
        <UsersTable list={list} isLoading={loading}/>
      </div>
      {/* {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            // backgroundColor: "#000000",
            zIndex: 1,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            opacity: 1,
            color: "#000000",
            // height: "100vh",
            // width: "100vw",
          }}
        >
          <LoaderComponent />
        </div>
      ) : (
        " "
      )} */}
    </div>
  );
};

export default SearchModuleUsers;
