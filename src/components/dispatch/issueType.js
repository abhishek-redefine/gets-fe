import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useState } from "react";
import TravelledEmployeeTable from "./issueTypeTable";

const IssueType = () => {
  const [issueType, setIssueType] = useState([]);
  const [searchValues, setSearchValues] = useState({
    issueType: "",
  });

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    let newSearchValues = { ...searchValues };
    newSearchValues[name] = value;
    setSearchValues(newSearchValues);
  };

  const IssueType = [
    "All",
    "Vehicle Not Assigned",
    "Trip Not Started",
    "Trip Not Ended",
  ];

  const TripInformation = {
    "Trip Id": "TR-001",
    "Office Id": "98776556",
    Date: "10 July 2024",
    "Shift Type": "Logout",
    "Shift Time": "25 Sept 2024",
    "Trip Type": "Planned",
    "Escort Trip": "Yes",
    "Trip Status": "Completed",
    "Planned Employees": "5",
    "Travelled Employees": "2",
  };

  const VehicleInformation = {
    "Vehicle Id": "AT-878989",
    "Registration Id": "RJ-8997-7899087",
    "Vehicle Type": "",
    "Vehicle Model": "",
    "Driver Name": "",
    "Driver Phone No.": "",
    "Sticker No": "",
  };

  const BillingInformation1 = {
    "Planned Vendor Name": "Ganga Tourism",
    "Actual vendor Name": "Ganga Tourism",
    "Planned Vehicle Type": "Cab",
    "Vehicle Fuel Type": "Petrol",
    "Billing Zone": "Noida",
    "First Pickup/Last Drop Location": "Noida Sector 59",
    "Planned Km.": "99",
    "Actual Km.": "97",
    "Reference Km.": "101",
    "Final Km.": "97",
  };

  const BillingInformation2 = {
    "Contract ID": "CID0001",
    "Contract Type": "T&M",
    "Trip Start Time": "09:00 AM",
    "Trip End Time": "11:00 AM",
    "Trip Duration": "2 Hours",
    "On Time Status": "Yes",
    "Delay Reason": "NA",
    "Trip Remarks": "Good",
  };

  return (
    <div
      style={{ backgroundColor: "#f9f9f9", padding: "20px", marginTop: "20px" }}
    >
      <Box
        sx={{
          fontFamily: "DM Sans",
        }}
      >
        <Grid
          container
          alignItems="stretch"
          rowSpacing={4}
          columnSpacing={{ xs: 1, sm: 2, md: 3 }}
        >
          <Grid item xs={3.5}>
            <div
              class=""
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                height: "100%",
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  padding: "20px 23px 20px",
                  borderBottomStyle: "solid",
                  borderWidth: "0.1rem",
                  borderColor: "#eeecec",
                  marginBottom: "25px",
                }}
              >
                Trip Information
              </div>
              <div class="">
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
                      {Object.entries(TripInformation).map(([key]) => (
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
                      {Object.keys(TripInformation).map((value) => (
                        <p
                          style={{
                            fontSize: "15px",
                            marginBottom: "25px",
                          }}
                        >
                          {TripInformation[value]}
                        </p>
                      ))}
                    </Grid>
                  </Grid>
                </Box>
              </div>
            </div>
          </Grid>
          <Grid item xs={8.5}>
            <div
              className=""
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
              }}
            >
              <div
                className=""
                style={{
                  fontFamily: "DM Sans",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  borderBottomStyle: "solid",
                  borderWidth: "0.1rem",
                  borderColor: "#eeecec",
                  marginBottom: "25px",
                }}
              >
                <div
                  className=""
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    padding: "20px 23px 20px",
                  }}
                >
                  Travelled Employee Information
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "18px",
                  }}
                >
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "120px",
                      padding: "10px",
                      margin: "0 10px",
                    }}
                  >
                    Recalculate
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "150px",
                      padding: "10px",
                      margin: "0 10px",
                    }}
                  >
                    + Add Employee
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "120px",
                      padding: "10px",
                      margin: "0 10px",
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
              <div className="">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: " 0 17px 25px",
                  }}
                >
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "120px",
                      padding: "10px",
                      margin: "0 10px",
                    }}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "130px",
                      padding: "10px",
                      margin: "0 10px",
                    }}
                  >
                    No-Show
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "160px",
                      padding: "10px",
                      margin: "0 10px",
                    }}
                  >
                    Undo No-Show
                  </button>
                </div>
                <div>
                  <TravelledEmployeeTable />
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={3.5}>
            <div
              class=""
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                minHeight: "85vh",
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  padding: "20px 23px 20px",
                  borderBottomStyle: "solid",
                  borderWidth: "0.1rem",
                  borderColor: "#eeecec",
                  marginBottom: "25px",
                }}
              >
                Vehicle Information
              </div>
              <div class="">
                {/* <div style={{ display: "flex", alignItems: "center",}}>
                  <div style={{marginRight: "30px"}}>
                    {Object.entries(VehicleInformation).map(([key]) => (
                      <p
                        key={key}
                        style={{
                          fontSize: "15px",
                          fontWeight: "600",
                          marginBottom: "25px",
                          padding: "0 25px",
                        }}
                      >
                        {key}
                      </p>
                    ))}
                  </div>
                  <div>
                    {Object.keys(VehicleInformation).map((key) => (
                      <div>
                        {VehicleInformation[key] === "" ? (
                          <input
                            placeholder="Enter value"
                            style={{
                              fontSize: "15px",
                              marginBottom: "25px",
                              padding: "2px 8px",
                              fontFamily: "DM Sans",
                              border: "0.05rem solid #b2b2b2de",
                              borderRadius: "4px",
                            }}
                          />
                        ) : (
                          <p
                            style={{
                              fontSize: "15px",
                              fontFamily: "DM Sans",
                              marginBottom: "25px",
                            }}
                          >
                            {VehicleInformation[key]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div> */}
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
                      {Object.entries(VehicleInformation).map(([key]) => (
                        <p
                          key={key}
                          style={{
                            fontSize: "15px",
                            fontWeight: "600",
                            marginBottom: "30px",
                          }}
                        >
                          {key}
                        </p>
                      ))}
                    </Grid>
                    <Grid item xs={6}>
                      {Object.keys(VehicleInformation).map((key) => (
                        <Grid item xs={12} key={key}>
                          {VehicleInformation[key] === "" ? (
                            <input
                              placeholder="Enter value"
                              style={{
                                fontSize: "15px",
                                marginBottom: "24px",
                                padding: "2px 8px",
                                fontFamily: "DM Sans",
                                border: "0.05rem solid #b2b2b2de",
                                borderRadius: "4px",
                                width: "90%",
                              }}
                            /> 
                          ) : (
                            <p
                              style={{
                                fontSize: "15px",
                                marginBottom: "30px",
                              }}
                            >
                              {VehicleInformation[key]}
                            </p>
                          )}
                        </Grid>
                      ))}
                    </Grid>
                    <FormControl
                      fullWidth
                      style={{
                        margin: "0 19px 20px 25px",
                        padding: "4px 0",
                        fontFamily: "DM Sans",
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
                        width: 500,
                        height: 20,
                        maxWidth: "100%",
                        margin: "0 19px 20px 25px",
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <TextField
                        id="outlined-basic"
                        label="Write your remarks"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={3}
                        size="small"
                        inputProps={{
                          style: {
                            fontFamily: "DM Sans",
                            fontSize: 15,
                          },
                        }}
                      />
                    </Box>
                  </Grid>
                </Box>
              </div>
            </div>
          </Grid>
          <Grid item xs={8.5}>
            <div
              class=""
              style={{
                backgroundColor: "white",
                borderRadius: "20px",
                height: "100%",
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  padding: "20px 23px 20px",
                  borderBottomStyle: "solid",
                  borderWidth: "0.1rem",
                  borderColor: "#eeecec",
                  marginBottom: "25px",
                }}
              >
                Billing Information
              </div>
              <div class="">
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
                    <Grid item xs={3.5}>
                      {Object.entries(BillingInformation1).map(([key]) => (
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
                    <Grid item xs={3.5}>
                      {Object.keys(BillingInformation1).map((value) => (
                        <p
                          style={{
                            fontSize: "15px",
                            marginBottom: "25px",
                          }}
                        >
                          {BillingInformation1[value]}
                        </p>
                      ))}
                    </Grid>
                    <Grid
                      item
                      xs={2.5}
                      sx={{
                        borderLeftStyle: "solid",
                        borderWidth: "0.1rem",
                        borderColor: "#eeecec",
                      }}
                    >
                      {Object.entries(BillingInformation2).map(([key]) => (
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
                    <Grid item xs={2.5}>
                      {Object.keys(BillingInformation2).map((value) => (
                        <p
                          style={{
                            fontSize: "15px",
                            marginBottom: "25px",
                          }}
                        >
                          {BillingInformation2[value]}
                        </p>
                      ))}
                    </Grid>
                  </Grid>
                </Box>
              </div>
            </div>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default IssueType;
