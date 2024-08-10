import {
  Autocomplete,
  Box,
  Grid,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import OfficeService from "@/services/office.service";

const TransferTripModal = (props) => {
  const { data, onClose } = props;
  const [pagination, setPagination] = useState({
    pageNo: 0,
    pageSize: 100,
  });

  const [selectedUsers, setSelectedUsers] = useState([]);
  //   const [selectedOtherUserDetails, setSelectedOtherUserDetails] = useState();
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [isSearchUser, setIsSearchUser] = useState(false);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const TransferDutyInfo = {
    "Vehicle ID": "VC-0878-QW",
    "Vehicle Registration": "RG-9382-QWE",
  };

  const getOtherUserDetails = async (id) => {
    try {
      const response = await OfficeService.getEmployeeDetails(id);
      const { data } = response;
      console.log(data.areaName);
      // setSelectedOtherUserDetails(data);
      setAreaName(data?.areaName);
    } catch (e) {
      console.error(e);
    }
  };

  const onChangeHandler = (val) => {
    console.log(val);
    if (val?.empId) {
      setSelectedUsers([val.data]);
      // getOtherUserDetails(val.empId);
      setSelectedEmployeeId(val.empId); 
      console.log("Saved Employee ID:", selectedEmployeeId);
    } else {
      setSelectedUsers([]);
      //   setSelectedOtherUserDetails(null);
    }
  };

  const onSubmitHandler = () => {
    onClose();
  }

  const searchForRM = async (e) => {
    try {
      const response = await OfficeService.searchRM(e.target.value);
      const { data } = response || {};
      setSearchedUsers(data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#FFF",
        borderRadius: 10,
        fontFamily: "DM Sans",
        padding: "30px 40px",
      }}
    >
      <h3>Transfer Duty</h3>
      <div style={{ marginTop: "25px" }}>
        <Box
          sx={{
            width: "100%",
            padding: "0 5px 20px",
          }}
        >
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={6}>
              {Object.entries(TransferDutyInfo).map(([key]) => (
                <p
                  key={key}
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    marginBottom: "25px",
                  }}
                >
                  {key}
                </p>
              ))}
            </Grid>
            <Grid item xs={6}>
              {Object.keys(TransferDutyInfo).map((value) => (
                <p
                  style={{
                    fontSize: "15px",
                    marginBottom: "25px",
                  }}
                >
                  {TransferDutyInfo[value]}
                </p>
              ))}
            </Grid>
          </Grid>
        </Box>
      </div>
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
          Trip transfer to vehicle
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

export default TransferTripModal;
