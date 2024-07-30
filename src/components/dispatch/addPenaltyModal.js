import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";


const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 150,
      width: 250,
    },
  },
};


const AddPenaltyModal = (props) => {
  const { data } = props;
  const [select, setSelect] = useState("No Action");
  const [searchValues, setSearchValues] = useState({
    penaltyType: "",
  });
  const [penaltyAmount, setPenaltyAmount] = useState("")
 
  const handleFilterChange = (e) => {
    setSearchValues({ ...searchValues, [e.target.name]: e.target.value });
  };

  const PenaltyType = [
    "Rash Drivinng",
    "Over Speeding",
    "Miss Behavior By Driver",
    "Driver Under Influence Of Alcohol",
    "Miscellaneous",
  ];

  const handleFormatChange = (e) => {
    setSelect(e.target.value);
  };

  useEffect(() => {
    console.log("data: ", data);
  }, [data]);

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#FFF",
        borderRadius: 10,
        fontFamily: "DM Sans",
      }}
    >
      <div>
        <h3>Operation Penalty</h3>
        <div style={{ display: "flex", marginTop: "25px" }}>
          {/* Display Trip ID */}
          <div
            style={{
              border: "2px solid #e7e7e7",
              borderRadius: 4,
              marginRight: 25,
              minWidth: "150px",
            }}
          >
            <div
              style={{ borderBottom: "2px solid #e7e7e7", padding: "5px 10px" }}
            >
              <p>Trip ID</p>
            </div>
            <div style={{ padding: "5px 10px" }}>
              <p>TRIP-{data?.id}</p>
            </div>
          </div>
          {/* Display Office ID */}
          <div
            style={{
              border: "2px solid #e7e7e7",
              borderRadius: 4,
              marginRight: 25,
              minWidth: "150px",
            }}
          >
            <div
              style={{ borderBottom: "2px solid #e7e7e7", padding: "5px 10px" }}
            >
              <p>Office ID</p>
            </div>
            <div style={{ padding: "5px 10px" }}>
              <p>{data?.officeId}</p>
            </div>
          </div>
        </div>

        {/* Penalty Type Dropdown */}
        <div style={{ display: "flex", marginTop: 20 }}>
          <FormControl
            style={{
              width: "290px",
              margin: "20px 30px 0px 5px",
              padding: "4px 0",
              fontFamily: "DM Sans",
            }}
          >
            <InputLabel id="penalty-label" style={{ fontSize: "14px" }}>
              Penalty type
            </InputLabel>
            <Select
              style={{
                backgroundColor: "white",
                height: "40px",
                fontSize: "15px",
              }}
              labelId="penalty-type-label"
              id="penaltyType"
              name="penaltyType"
              value={searchValues.penaltyType}
              label="Penalty type"
              onChange={handleFilterChange}
              MenuProps={MenuProps}
            >
              {PenaltyType.map((item) => (
                <MenuItem key={item} value={item} style={{ fontSize: "15px" }}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box
            component="form"
            style={{
              width: 290,
              height: 20,
              maxWidth: "100%",
              margin: "24px 19px 0px 0px",
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-basic"
              label="Penalty Amount"
              variant="outlined"
              size="small"
              fullWidth
              inputProps={{ style: { fontFamily: "DM Sans", fontSize: 15 } }}
              InputLabelProps={{ style: { fontSize: 14 } }}
            />
          </Box>
        </div>

        {/* Penalty Action Required */}
        <div style={{ margin: "40px 0" }}>
          <h4 style={{ marginLeft: "5px" }}>Penalty Action Required</h4>
          <div style={{ marginTop: "15px" }}>
            <input
              type="radio"
              id="noAction"
              name="selectFormat"
              value="No Action"
              style={{ margin: "0 10px" }}
              checked={select === "No Action"}
              onChange={handleFormatChange}
            />
            <label htmlFor="noAction" style={{ marginRight: "15px" }}>
              No Action
            </label>
            <input
              type="radio"
              id="suspend"
              name="selectFormat"
              value="Suspend"
              style={{ margin: "0 10px" }}
              checked={select === "Suspend"}
              onChange={handleFormatChange}
            />
            <label htmlFor="suspend" style={{ marginRight: "15px" }}>
              Suspend
            </label>
            <input
              type="radio"
              id="terminate"
              name="selectFormat"
              value="Terminate"
              style={{ margin: "0 10px" }}
              checked={select === "Terminate"}
              onChange={handleFormatChange}
            />
            <label htmlFor="terminate" style={{ marginRight: "15px" }}>
              Terminate
            </label>
            <input
              type="radio"
              id="terminateAndBlacklist"
              name="selectFormat"
              value="Terminate and Blacklist"
              style={{ margin: "0 10px",}}
              checked={select === "Terminate and Blacklist"}
              onChange={handleFormatChange}
            />
            <label htmlFor="terminateAndBlacklist">
              Terminate and Blacklist
            </label>
          </div>
        </div>

        {/* Add Button */}
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
              marginTop: "70px",
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPenaltyModal;
