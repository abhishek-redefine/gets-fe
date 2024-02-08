import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import { DateRangePicker } from "@mui/lab";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SuccessCard from "./SuccessCard";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import { FaCar, FaShuttleVan, FaBus } from "react-icons/fa";
import AddHoliday from "../AdminSettings/AddHoliday";

// Dropdown component
const DropdownLayout = (props) => {
  const [schedule, setSchedule] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [officeId, setOfficeId] = useState("");
  const [loginTime, setLoginTime] = useState("");
  const [logoutTime, setLogoutTime] = useState("");
  const [nextDayLogout, setNextDayLogout] = useState(false);
  const [pickupPoint, setPickupPoint] = useState("");
  const [dropPoint, setDropPoint] = useState("");
  const [bookingCreated, setBookingCreated] = useState(false); // State to track booking creation

  const [userType, setUserType] = useState("self"); // State for user type
  const [transportType, setTransportType] = useState("car"); // State for transport type

  useEffect(() => {
    // Do something when userType changes
    console.log("User type changed:", userType);
  }, [userType]);

  useEffect(() => {
    // Do something when transportType changes
    console.log("Transport type changed:", transportType);
  }, [transportType]);

  const handleScheduleChange = () => {
    setSchedule(!schedule);
  };

  const handleDateRangeChange = (newValue) => {
    setDateRange(newValue);
  };

  const handleOfficeIdChange = (event) => {
    setOfficeId(event.target.value);
  };

  const handleLoginTimeChange = (event) => {
    setLoginTime(event.target.value);
  };

  const handleLogoutTimeChange = (event) => {
    setLogoutTime(event.target.value);
  };

  const handleNextDayLogoutChange = () => {
    setNextDayLogout(!nextDayLogout);
  };

  const handlePickupPointChange = (event) => {
    setPickupPoint(event.target.value);
  };

  const handleDropPointChange = (event) => {
    setDropPoint(event.target.value);
  };

  const handleCreateBooking = () => {
    console.log("create booking");
  
    setBookingCreated(true);
  };

  const handleUserTypeChange = (event) => {
    setUserType(event.target.value);
  };

  const handleTransportTypeChange = (event) => {
    setTransportType(event.target.value);
  };

  const handleBack = () => {};

  return (
    <Box style={{ margin: "12px", display: "flex", justifyContent: "center" }}>
      <Card sx={{ height: "425px ", width: "1250px" }}>
        <CardContent>
          {!bookingCreated ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    aria-label="userType"
                    name="userType"
                    value={userType}
                    onChange={handleUserTypeChange}
                  >
                    <FormControlLabel
                      value="self"
                      control={<Radio />}
                      label="Self"
                    />
                    <FormControlLabel
                      value="otherUser"
                      control={<Radio />}
                      label="Other User"
                    />
                    <FormControlLabel
                      value="team"
                      control={<Radio />}
                      label="Team"
                    />
                  </RadioGroup>
                </FormControl>
                <FormControl component="fieldset">
                  <RadioGroup
                    row
                    aria-label="transportType"
                    name="transportType"
                    value={transportType}
                    onChange={handleTransportTypeChange}
                  >
                    <FormControlLabel
                      value="car"
                      control={<Radio />}
                      label={
                        <>
                          <FaCar /> Car
                        </>
                      }
                    />
                    <FormControlLabel
                      value="shuttle"
                      control={<Radio />}
                      label={
                        <>
                          <FaShuttleVan /> Shuttle
                        </>
                      }
                    />
                    <FormControlLabel
                      value="bus"
                      control={<Radio />}
                      label={
                        <>
                          <FaBus /> Bus
                        </>
                      }
                    />
                  </RadioGroup>
                </FormControl>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px", // Added margin bottom for spacing
                }}
              >
                <h5>Select Date Range</h5>
                {userType === "self" && (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {" "}
                    {/* Added container */}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={schedule}
                          onChange={handleScheduleChange}
                        />
                      }
                      label="Customize Schedule"
                      sx={{ marginLeft: "20px" }} // Adjusted margin for spacing
                    />
                  </Box>
                )}
              </Box>

              <DateRangePicker
                startText="Start Date"
                endText="End Date"
                value={dateRange}
                onChange={handleDateRangeChange}
                renderInput={(startProps, endProps) => (
                  <>
                    <input {...startProps} />
                    <input {...endProps} />
                  </>
                )}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  marginTop: "20px",
                }}
              >
                <Box sx={{ marginRight: "20px" }}>
                  <InputLabel htmlFor="office-id">Office Id</InputLabel>
                  <Select
                    id="office-id"
                    value={officeId}
                    onChange={handleOfficeIdChange}
                    size="large"
                    sx={{ width: "200px" }}
                  >
                    <MenuItem value="office1">Office 1</MenuItem>
                    <MenuItem value="office2">Office 2</MenuItem>
                  </Select>
                </Box>
                <Box sx={{ marginRight: "20px" }}>
                  <InputLabel htmlFor="login-time">Login Time</InputLabel>
                  <Select
                    id="login-time"
                    value={loginTime}
                    onChange={handleLoginTimeChange}
                    size="large"
                    sx={{ width: "200px" }}
                  >
                    <MenuItem value="time1">Time 1</MenuItem>
                    <MenuItem value="time2">Time 2</MenuItem>
                  </Select>
                </Box>
                <Box sx={{ marginRight: "20px" }}>
                  <InputLabel htmlFor="logout-time">Logout Time</InputLabel>
                  <Select
                    id="logout-time"
                    value={logoutTime}
                    onChange={handleLogoutTimeChange}
                    size="large"
                    sx={{ width: "200px" }}
                  >
                    <MenuItem value="time1">Time 1</MenuItem>
                    <MenuItem value="time2">Time 2</MenuItem>
                  </Select>
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={nextDayLogout}
                      onChange={handleNextDayLogoutChange}
                    />
                  }
                  label="Next day logout"
                />
              </Box>
              {transportType !== "car" && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      marginTop: "20px",
                    }}
                  >
                   
                    <Box>
                    <Box sx={{ marginRight: "20px" }}>
                  <InputLabel htmlFor="pickup point">Pickp Point</InputLabel>
                  <Select
                    id="logout-time"
                    value={logoutTime}
                    onChange={handlePickupPointChange}
                    size="large"
                    sx={{ width: "200px" }}
                  >
                    <MenuItem value="time1">Time 1</MenuItem>
                    <MenuItem value="time2">Time 2</MenuItem>
                  </Select>
                </Box>
                    </Box>

                    <Box>
                    <Box sx={{ marginRight: "20px" }}>
                  <InputLabel htmlFor="pickup point">Drop Point</InputLabel>
                  <Select
                    id="logout-time"
                    value={logoutTime}
                    onChange={handlePickupPointChange}
                    size="large"
                    sx={{ width: "200px" }}
                  >
                    <MenuItem value="time1">Time 1</MenuItem>
                    <MenuItem value="time2">Time 2</MenuItem>
                  </Select>
                </Box>
                    </Box>
                  </Box>
                </>
              )}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  marginTop: "85px",
                }}
              >
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{
                    borderRadius: "20px",
                    marginRight: "10px",
                    marginBottom: "10px",
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCreateBooking}
                  sx={{
                    borderRadius: "20px",
                    marginRight: "10px",
                    marginBottom: "10px",
                  }}
                >
                  Create Booking
                </Button>
              </Box>
            </>
          ) : (
            <SuccessCard onActionClick={() => setBookingCreated(false)} />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default DropdownLayout;
