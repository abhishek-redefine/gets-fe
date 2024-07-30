import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ComplianceService from "@/services/compliance.service";

const IssueTypeModal = (props) => {
  const { data } = props;
  const [issueData, setIssueData] = useState({
    "Vehicle Id": "",
    "Registration Id": "",
    "Vehicle Type": "",
    "Vehicle Model": "",
    "Driver Name": "",
    "Driver Phone No.": "",
    "Sticker No": "",
  });
  const [pagination, setPagination] = useState({
    pageNo: 0,
    pageSize: 100,
  });

  const [searchValues, setSearchValues] = useState({
    issueType: "",
    vehicleId: "",
    vehicleRegistrationNumber: data?.vehicleNumber,
    vehicleType: "",
    stickerNumber: "",
  });

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    let newSearchValues = { ...searchValues };
    newSearchValues[name] = value;
    setSearchValues(newSearchValues);
  };

  const IssueType = [
    "Vehicle Not Assigned",
    "Trip Not Started",
    "Trip Not Ended",
  ];

  const fetchVehicleData = async () => {
    try {
      let params = new URLSearchParams(pagination);
      let vehicleData = { ...searchValues };
      Object.keys(vehicleData).forEach((objKey) => {
        if (vehicleData[objKey] === null || vehicleData[objKey] === "") {
          delete vehicleData[objKey];
        }
      });
      console.log(vehicleData);
      const response = await ComplianceService.getAllVehicles(
        params,
        vehicleData
      );

      console.log("response: ", response.data.data);
      var vehicleDetails = response.data.data[0];
      let newObject = {
        "Vehicle Id": vehicleDetails.vehicleId,
        "Registration Id": vehicleDetails.vehicleRegistrationNumber,
        "Vehicle Type": vehicleDetails.vehicleType,
        "Vehicle Model": vehicleDetails.vehicleModel,
        "Driver Name": data.driverName,
        "Driver Phone No.": "",
        "Sticker No": vehicleDetails.stickerNumber,
      };
      setIssueData(newObject);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log("data: ", data);
  }, [data]);

  useEffect(() => {
    fetchVehicleData();
  }, []);

  return (
    <div
      class=""
      style={{
        backgroundColor: "#FFF",
        borderRadius: 10,
        fontFamily: "DM Sans",
        padding: "30px",
      }}
    >
      <h3>Vehicle Information</h3>
      <div style={{ marginTop: "25px" }}>
        <Box
          sx={{
            width: "100%",
            padding: "0 15px 20px",
          }}
        >
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={6}>
              {Object.entries(issueData).map(([key, value], index) => (
                <p
                  key={index}
                  style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    marginBottom: "20px",
                  }}
                >
                  {key}
                </p>
              ))}
            </Grid>
            <Grid item xs={6}>
              {Object.entries(issueData).map(([key, value], index) => {
                console.log(key, value);
                return (
                  <Grid item xs={12}>
                    <p
                      key={index}
                      style={{
                        fontSize: "15px",
                        marginBottom: "20px",
                      }}
                    >
                      {value ? value : "N/A
                      "}
                    </p>
                  </Grid>
                );
              })}
            </Grid>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                // backgroundColor: "pink",
                marginTop: "15px",
              }}
            >
              <FormControl
                style={{
                  margin: "0 40px 0 25px",
                  padding: "4px 0",
                  fontFamily: "DM Sans",
                  width: "220px",
                }}
              >
                <InputLabel
                  id="reason-label"
                  style={{
                    fontSize: "14px",
                  }}
                >
                  Ops Issue type
                </InputLabel>
                <Select
                  style={{
                    backgroundColor: "white",
                    height: "40px",
                    fontSize: "15px",
                  }}
                  labelId="ops-issue-type-label"
                  id="opsIssueType"
                  name="issueType"
                  value={searchValues.issueType}
                  label="Ops Issue type"
                  onChange={handleFilterChange}
                >
                  {IssueType.map((item) => (
                    <MenuItem
                      value={item}
                      style={{
                        fontSize: "15px",
                      }}
                    >
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box
                component="form"
                style={{
                  width: 450,
                  height: 40,
                  maxWidth: "100%",
                  margin: "0 30px 0 0",
                  //   backgroundColor: "yellow",
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="outlined-basic"
                  label="Write your remarks"
                  variant="outlined"
                  size="small"
                  fullWidth
                  //   multiline
                  inputProps={{
                    style: {
                      fontFamily: "DM Sans",
                      fontSize: 15,
                    },
                  }}
                  InputLabelProps={{ style: { fontSize: 14 } }}
                />
              </Box>
            </div>
          </Grid>
        </Box>
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
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default IssueTypeModal;
