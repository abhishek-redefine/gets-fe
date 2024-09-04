import {
  Box,
  FormControl,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import BillingIssuesDetailsTable from "./billingIssuesDetailsTable";
import ViewMapModal from "./viewMapModal";
import TripHistoryModal from "./tripHistoryModal";
import AddEmployeeModal from "./addEmployeeModal";
import { issueTypeData } from "@/sampleData/travelledEmployeesInfoData";

const style = {
  position: "absolute",
  top: "55%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 650,
  bgcolor: "background.paper",
  height: "auto",
  borderRadius: 5,
};

const BillingIssuesDetails = ({ onClose }) => {
  const [data, setData] = useState(issueTypeData);
  const [selectedRow, setSelectedRow] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);

  const [searchValues, setSearchValues] = useState({
    issueType: "",
  });

  const [openViewMapModal, setOpenViewMapModal] = useState(false);
  const handleViewMapModalOpen = () => {
    console.log("View map modal open");
    setOpenViewMapModal(true);
  };
  const handleViewMapModalClose = () => {
    console.log("View map modal close");
    setOpenViewMapModal(false);
  };

  const [openTripHistoryModal, setOpenTripHistoryModal] = useState(false);
  const handleTripHistoryModalOpen = () => {
    console.log("Trip History modal open");
    setOpenTripHistoryModal(true);
  };
  const handleTripHistoryModalClose = () => {
    console.log("Trip History modal close");
    setOpenTripHistoryModal(false);
  };

  const [openAddEmployeeModal, setOpenAddEmployeeModal] = useState(false);
  const handleAddEmployeeModalOpen = () => {
    console.log("Add Employee modal open");
    setOpenAddEmployeeModal(true);
  };
  const handleAddEmployeeModalClose = () => {
    console.log("Add Employee modal close");
    setOpenAddEmployeeModal(false);
  };

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    let newSearchValues = { ...searchValues };
    newSearchValues[name] = value;
    setSearchValues(newSearchValues);
  };

  const handleScreenClose = () => {
    console.log("cross icon clicked");
    onClose();
  };

  const handleAddEmployee = (employeeId) => {
    console.log("Adding employee", employeeId);

    const employeeExists = data.some((row) => row.empId === employeeId);
    if (employeeExists) {
      console.log("Employee already exists");
    } else {
      setData((prevData) => [
        ...prevData,
        {
          empId: employeeId,
          empName: "Saifali",
          gender: "Female",
          "pickup/dropPoint": "V3S Mall",
          landmark: "V3S Mall",
          vehicleReportTime: "11:00 AM",
          signIn: "11:30 AM",
          signOut: "06:30 PM",
          status: "complete",
          phoneNo: "9879865645",
          action: "",
        },
      ]);
      console.log("Updated data>>>", data);
      handleAddEmployeeModalClose();
    }
  };

  const handleRowsSelected = (selectedRowId) => {
    setSelectedRow(selectedRowId);
    console.log("slected row id: ", selectedRowId.empId);
  };

  const handleDelete = () => {
    console.log("delete button clicked");
    let updatedData = data;
    if (selectedRow) {
      console.log("data: ", data);
      console.log("selectedRow: ", selectedRow);

      updatedData = data.filter((row) => row.empId !== selectedRow.empId);
    }
    setData(updatedData);
    console.log("updatedData: ", updatedData);
    setSelectedRow(null);
    console.log("Selected row deleted");
  };

  const handleNoShow = () => {
    if (selectedRow) {
      console.log("No show >>> selected row Status: ", selectedRow.status);
      setStatusHistory((prevHistory) => [
        ...prevHistory,
        { empId: selectedRow.empId, status: selectedRow.status },
      ]);
      console.log("Status history: ", statusHistory);
      let updatedData = data;
      data.filter((row, index) => {
        if (row.empId === selectedRow.empId) {
          console.log("row empId", row.empId);
          updatedData[index].status = "No show";
        }
      });
      console.log("Updated Data>>>", updatedData);
      setData([...updatedData]);
    }
  };

  const handleUndoNoShow = () => {
    if (selectedRow) {
      console.log("No show >>> selected row Status: ", selectedRow.status);
      const previousStatus = statusHistory.find(
        (item) => item.empId === selectedRow.empId
      );

      if (previousStatus) {
        console.log("Previous status: ", previousStatus);
        let updatedData = data;
        data.filter((row, index) => {
          if (row.empId === selectedRow.empId) {
            console.log("row empId", row.empId);
            updatedData[index].status = previousStatus.status;
          }
        });
        console.log("Updated Data>>>", updatedData);
        setData([...updatedData]);

        setStatusHistory((prevHistory) =>
          prevHistory.filter((item) => item.empId !== selectedRow.empId)
        );
        console.log("Status history after undo no show: ", statusHistory);
      }
    }
    console.log(
      "Undo no show >>> selected row status after undo no show: ",
      selectedRow.status
    );
  };

  const handleSaveTableData = () => {
    setData(data);
    console.log("updatedDataAfterDeletion: ", data);
  };

  const IssueType = [
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
    "Vehicle ID": "AT-878989",
    "Registration ID": "RJ-8997-7899087",
    "Vehicle Type": "",
    "Vehicle Model": "",
    "Driver Name": "",
    "Driver Phone No.": "",
    "Sticker No.": "",
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

  useEffect(() => {
    console.log("selcted row: ", selectedRow);
  }, [selectedRow]);

  useEffect(() => {
    console.log("Saifali>>>>>>>>>>>>> ", data);
  }, [data]);

  return (
    <div
      style={{ backgroundColor: "#f9f9f9", padding: "20px", marginTop: "20px" }}
    >
      <Box
        style={{
          display: "flex",
          justifyContent: "flex-end",
          // backgroundColor: "pink",
        }}
      >
        <img
          src="/images/cross.png"
          height={30}
          width={30}
          style={{
            cursor: "pointer",
            // backgroundColor: "green",
          }}
          onClick={handleScreenClose}
        />
      </Box>
      <Box
        sx={{
          fontFamily: "DM Sans",
          marginTop: "30px",
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
                height: "100%",
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
                  Travelled Employees Information
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
                      width: "170px",
                      padding: "10px",
                      margin: "0 10px",
                    }}
                  >
                    Distance Recalculate
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "100px",
                      padding: "10px",
                      margin: "0 10px",
                    }}
                    onClick={handleViewMapModalOpen}
                  >
                    View Map
                  </button>
                  <Modal
                    open={openViewMapModal}
                    onClose={handleViewMapModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <ViewMapModal onClose={() => handleViewMapModalClose()} />
                    </Box>
                  </Modal>
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "110px",
                      padding: "10px",
                      margin: "0 10px",
                    }}
                    onClick={handleTripHistoryModalOpen}
                  >
                    Trip History
                  </button>
                  <Modal
                    open={openTripHistoryModal}
                    onClose={handleTripHistoryModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <TripHistoryModal
                        onClose={() => handleTripHistoryModalClose()}
                      />
                    </Box>
                  </Modal>
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "140px",
                      padding: "10px",
                      margin: "0 10px",
                    }}
                    onClick={handleAddEmployeeModalOpen}
                  >
                    + Add Employee
                  </button>
                  <Modal
                    open={openAddEmployeeModal}
                    onClose={handleAddEmployeeModalClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <AddEmployeeModal
                        onClose={() => handleAddEmployeeModalClose()}
                        onAddEmployee={handleAddEmployee}
                      />
                    </Box>
                  </Modal>
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "70px",
                      padding: "10px",
                      margin: "0 10px",
                    }}
                    onClick={handleSaveTableData}
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
                    onClick={handleDelete}
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
                    onClick={handleNoShow}
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
                    onClick={handleUndoNoShow}
                  >
                    Undo No-Show
                  </button>
                </div>
                <div>
                  <BillingIssuesDetailsTable
                    issueTypeData={data}
                    setIssueTypeData={(newData) => setData(newData)}
                    // setIssueTypeData={(newData) => console.log("newData: ", newData)}
                    onRowsSelected={handleRowsSelected}
                  />
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
                      {/* <InputLabel
                        id="reason-label"
                        style={{
                          fontSize: "14px",
                        }}
                      >
                        Reason for vehicle not assigned
                      </InputLabel> */}
                      <Select
                        style={{
                          backgroundColor: "white",
                          height: "40px",
                          fontSize: "15px",
                        }}
                        labelId="issue-type-label"
                        id="issueType"
                        name="issueType"
                        value={searchValues.issueType}
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

export default BillingIssuesDetails;
