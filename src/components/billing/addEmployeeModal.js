import {
  Autocomplete,
  TextField,
  Paper,
  FormControl,
  InputLabel,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import OfficeService from "@/services/office.service";
import { useDispatch } from "react-redux";
import { toggleToast } from "@/redux/company.slice";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";

const ScrollablePaper = (props) => (
  <Paper
    {...props}
    style={{
      maxHeight: 110,
      overflow: "auto",
    }}
  />
);

const AddEmployeeModal = (props) => {
  const { onClose, onAddEmployeeData } = props;

  const dispatch = useDispatch();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [isSearchUser, setIsSearchUser] = useState(false);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [values, setValues] = useState({
    employeeId: selectedEmployeeId,
    signInTime: "",
    signOutTime: "",
    tripStatus: "",
  });
  const [error, setError] = useState(false);

  const onChangeHandler = (val) => {
    console.log("val>>>", val);
    if (val?.empId) {
      const alreadySelected = selectedUsers.some((user) => user === val.empId);

      if (alreadySelected) {
        setSelectedEmployeeId(null);
        dispatch(
          toggleToast({
            message: "Employee already added!",
            type: "error",
          })
        );
      } else {
        setSelectedEmployeeId(val.empId);
        console.log("Saved Employee ID: ", val.empId);
        setSelectedUsers([...selectedUsers, val.empId]);
        console.log("selecetd employee", selectedUsers);
      }
    } else {
      setSelectedEmployeeId(null);
    }
  };

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    let newValues = { ...values };

    newValues[name] = value;
    setValues(newValues);
  };

  const searchForRM = async (e) => {
    try {
      const response = await OfficeService.searchRM(e.target.value);
      const { data } = response || {};
      setSearchedUsers(data);
      console.log("serched users", searchedUsers);
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmitHandler = () => {
    // console.log("Create trip button clicked");
    let hasError = false;

    if (!selectedEmployeeId) {
      setError((prevError) => ({
        ...prevError,
        employeeId: "Employee Id is mandatory.",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, employeeId: "" }));
    }

    if (!values.signInTime) {
      setError((prevError) => ({
        ...prevError,
        signInTime: "Sign in time is mandatory.",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, signInTime: "" }));
    }

    if (!values.signOutTime) {
      setError((prevError) => ({
        ...prevError,
        signOutTime: "Sign out time is mandatory.",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, signOutTime: "" }));
    }

    //sign in time is before sign out time
    if (values.signInTime && values.signOutTime) {
      const signInDate = dayjs(`2024-01-01 ${values.signInTime}`);
      const signOutDate = dayjs(`2024-01-01 ${values.signOutTime}`);

      if (signInDate.isAfter(signOutDate)) {
        setError((prevError) => ({
          ...prevError,
          signOutTime: "Sign out time must be after sign in time.",
        }));
        hasError = true;
      } else {
        setError((prevError) => ({ ...prevError, signOutTime: "" }));
      }
    }

    if (!values.tripStatus) {
      setError((prevError) => ({
        ...prevError,
        tripStatus: "Trip status is mandatory.",
      }));
      hasError = true;
    } else {
      setError((prevError) => ({ ...prevError, tripStatus: "" }));
    }

    if (hasError) {
      console.log("Error: All mandatory fields must be filled");
      return;
    }

    const employeeData = {
      ...values,
      employeeId: selectedEmployeeId,
    };
    console.log("Added employee details>>", employeeData);
    onAddEmployeeData(employeeData);
    setSelectedUsers([...selectedUsers, selectedEmployeeId]);
    setError({});
    onClose();
    dispatch(
      toggleToast({
        message: "Employee added successfully!",
        type: "success",
      })
    );
  };

  useEffect(() => {
    console.log("selected users: ", selectedUsers);
  }, [selectedUsers]);

  useEffect(() => {
    console.log("Saved Employee ID: ", selectedEmployeeId);
  }, [selectedEmployeeId]);

  return (
    <div
      style={{
        backgroundColor: "#FFF",
        borderRadius: 10,
        fontFamily: "DM Sans",
        padding: "30px 40px",
      }}
    >
      <h3 style={{ marginBottom: "40px" }}>Add Employee</h3>
      <div style={{ minWidth: "180px" }} className="form-control-input">
        <Autocomplete
          fullWidth
          disablePortal
          id="search-user"
          options={searchedUsers}
          autoComplete
          open={isSearchUser}
          sx={{ width: "240px" }}
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
          PaperComponent={ScrollablePaper}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search by employee ID *"
              onChange={searchForRM}
              error={!!error.employeeId}
              helperText={error.employeeId}
            />
          )}
        />
      </div>
      <div style={{ minWidth: "180px" }} className="form-control-input">
        <FormControl required>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimeField
              label="Sign In Time *"
              format="HH:mm"
              value={dayjs()
                .hour(Number(values.signInTime.slice(0, 2)))
                .minute(Number(values.signInTime.slice(3, 5)))}
              onChange={(e) => {
                var ShiftTime = e.$d.toLocaleTimeString("it-IT").slice(0, -3);
                handleFilterChange({
                  target: { name: "signInTime", value: ShiftTime },
                });
              }}
              style={{ width: "240px" }}
              inputProps={{
                style: {
                  fontFamily: "DM Sans",
                },
              }}
              error={!!error.signInTime}
              helperText={error.signInTime}
            />
          </LocalizationProvider>
        </FormControl>
      </div>
      <div style={{ minWidth: "180px" }} className="form-control-input">
        <FormControl required>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimeField
              label="Sign Out Time *"
              format="HH:mm"
              value={dayjs()
                .hour(Number(values.signOutTime.slice(0, 2)))
                .minute(Number(values.signOutTime.slice(3, 5)))}
              onChange={(e) => {
                var ShiftTime = e.$d.toLocaleTimeString("it-IT").slice(0, -3);
                handleFilterChange({
                  target: { name: "signOutTime", value: ShiftTime },
                });
              }}
              style={{ width: "240px" }}
              inputProps={{
                style: {
                  fontFamily: "DM Sans",
                },
              }}
              error={!!error.signOutTime}
              helperText={error.signOutTime}
            />
          </LocalizationProvider>
        </FormControl>
      </div>
      <div style={{ minWidth: "180px" }} className="form-control-input">
        <FormControl variant="outlined">
          {/* <InputLabel id="status-label">Trip Status *</InputLabel> */}
          <TextField
            style={{ width: "240px" }}
            id="outlined-basic"
            name="tripStatus"
            label="Trip Status *"
            value={values.tripStatus}
            variant="outlined"
            fullWidth
            onChange={handleFilterChange}
            error={!!error.tripStatus}
            helperText={error.tripStatus}
          />
        </FormControl>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          type="button"
          style={{
            backgroundColor: "#f6ce47",
            color: "black",
            border: "none",
            borderRadius: "6px",
            fontSize: "15px",
            padding: "13px 35px",
            cursor: "pointer",
            marginTop: "50px",
          }}
          onClick={onSubmitHandler}
        >
          Add Employee
        </button>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
