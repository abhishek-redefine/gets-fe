import { Autocomplete, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import OfficeService from "@/services/office.service";

const AddEmployeeModal = (props) => {
  const {onClose } = props;

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [isSearchUser, setIsSearchUser] = useState(false);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const onChangeHandler = (val) => {
    console.log("val>>>", val);
    if (val?.empId) {
      setSelectedUsers([val.data]);
    //   console.log("selcted users: ", [val.data]);
      setSelectedEmployeeId(val.empId);
    //   console.log("Saved Employee ID: ", val.empId);
    } else {
      setSelectedUsers([]);
    }
  };

  const onSubmitHandler = () => {
    console.log("Submit button clicked");
    onClose();
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

  useEffect(() => {
    console.log("selcted users: ", selectedUsers);
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
      <h3 style={{marginBottom: "50px"}}>Add Employee</h3>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          padding: "0 5px",
        }}
      >
        <p
          style={{
            fontFamily: "DM Sans",
            fontSize: "15px",
            fontWeight: "600",
            width: "50%",
            marginRight: "10px",
          }}
        >
          Add Employee
        </p>
        <Autocomplete
          fullWidth
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
              label="Search by employee ID / name"
              onChange={searchForRM}
              size="small"
            />
          )}
        />
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
            marginTop: "20px",
            position: "absolute",
            bottom: "50px",
          }}
          onClick={onSubmitHandler}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
