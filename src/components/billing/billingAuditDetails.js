import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useState } from "react";
import BillingAuditDetailsTable from "./billingAuditDetailsTable";
import ViewMapModal from "./viewMapModal";
import TripHistoryModal from "./tripHistoryModal";
import ConfirmationModal from "./confirmationModal";

const style = {
  topModals: {
    position: "absolute",
    top: "55%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 650,
    bgcolor: "background.paper",
    height: "auto",
    borderRadius: 5,
  },
  bottomModals: {
    position: "absolute",
    top: "48%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 650,
    bgcolor: "background.paper",
    height: "auto",
    borderRadius: 5,
  },
};

const BillingAuditDetails = ({ onClose }) => {
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

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    let newSearchValues = { ...searchValues };
    newSearchValues[name] = value;
    setSearchValues(newSearchValues);
  };

  const handleScreenClose = () => {
    console.log("cross icon clicked");
    if (onClose) {
      onClose();
    }
  };

  const [passFlag, setPassFlag] = useState(false);
  const [failFlag, setFailFlag] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const handleModalOpen = () => {
    console.log("Confirmation modal open");
    setOpenModal(true);
  };
  const handleModalClose = () => {
    console.log("Confirmation modal close");
    setOpenModal(false);
  };

  const handleApproveClick = () => {
    setPassFlag(true);
    if (passFlag && failFlag) {
      setFailFlag(true);
      handleModalOpen();
    } else {
      setFailFlag(false);
      handleModalOpen();
    }
  };

  const handleRejectClick = () => {
    setPassFlag(false);
    handleModalOpen();
  };

  const IssueType = [
    "Vehicle Not Assigned",
    "Trip Not Started",
    "Trip Not Ended",
    "None",
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
    "Vehicle Type": "Cab",
    "Vehicle Model": "Maruti Ertiga",
    "Driver Name": "Raj",
    "Driver Phone No.": "8790356356",
    "Sticker No.": "12",
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
                  padding: "20px 25px 20px",
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
                    padding: "0 25px 20px",
                  }}
                >
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid item xs={12}>
                      {Object.entries(TripInformation).map(([key, value]) => (
                        <Box
                          display="flex"
                          // justifyContent="space-between"
                          alignItems="center"
                          sx={{
                            width: "100%",
                            marginBottom: "15px",
                          }}
                          key={key}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                              width: "50%",
                              marginRight: 30,
                              marginBottom: "10px",
                            }}
                          >
                            <p
                              key={key}
                              style={{
                                fontSize: "15px",
                                fontWeight: "600",
                              }}
                            >
                              {key}
                            </p>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                              width: "45%",
                              marginBottom: "10px",
                              // backgroundColor: "pink",
                            }}
                          >
                            <p
                              style={{
                                fontSize: "15px",
                              }}
                            >
                              {value}
                            </p>
                          </div>
                        </Box>
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
                  margin: " 0 0 25px 0",
                  padding: "20px 25px",
                }}
              >
                <div
                  className=""
                  style={{
                    fontSize: "20px",
                    fontWeight: "600",
                    width: "60%",
                  }}
                >
                  Travelled Employees Information
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    width: "40%",
                  }}
                >
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "110px",
                      padding: "10px",
                      margin: "0 0 0 30px",
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
                    <Box sx={style.topModals}>
                      <ViewMapModal onClose={() => handleViewMapModalClose()} />
                    </Box>
                  </Modal>
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "110px",
                      padding: "10px",
                      margin: "0 0 0 30px",
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
                    <Box sx={style.topModals}>
                      <TripHistoryModal
                        onClose={() => handleTripHistoryModalClose()}
                      />
                    </Box>
                  </Modal>
                </div>
              </div>
              <div className="">
                <div>
                  <BillingAuditDetailsTable />
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
                paddingBottom: 60,
              }}
            >
              <div
                style={{
                  fontSize: "20px",
                  fontWeight: "600",
                  padding: "20px 25px 20px",
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
                    padding: "0 25px 20px",
                  }}
                >
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid item xs={12}>
                      {Object.entries(VehicleInformation).map(([key]) => (
                        <Box
                          display="flex"
                          // justifyContent="space-between"
                          alignItems="center"
                          sx={{
                            width: "100%",
                            marginBottom: "15px",
                          }}
                          key={key}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                              width: "50%",
                              marginRight: 30,
                              marginBottom: "10px",
                            }}
                          >
                            <p
                              key={key}
                              style={{
                                fontSize: "15px",
                                fontWeight: "600",
                              }}
                            >
                              {key}
                            </p>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-start",
                              width: "45%",
                              marginBottom: "10px",
                              // backgroundColor: "pink",
                            }}
                          >
                            <Grid item xs={12} key={key}>
                              <p
                                style={{
                                  fontSize: "15px",
                                }}
                              >
                                {VehicleInformation[key]}
                              </p>
                            </Grid>
                          </div>
                        </Box>
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
                      <InputLabel id="shiftType-label">Issue Type *</InputLabel>
                      <Select
                        sx={{
                          backgroundColor: "white",
                          fontSize: "15px",
                          padding: "0px",
                          ".MuiSelect-select": {
                            padding: "12px",
                          },
                        }}
                        label="Issue Type *"
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
                  padding: "20px 25px 20px",
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
                    padding: "0 25px 20px",
                  }}
                >
                  <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                  >
                    <Grid item xs={7}>
                      {Object.entries(BillingInformation1).map(
                        ([key, value]) => (
                          <Box
                            display="flex"
                            // justifyContent="space-between"
                            alignItems="center"
                            sx={{
                              width: "100%",
                              marginBottom: "15px",
                            }}
                            key={key}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                width: "50%",
                                marginRight: 30,
                                marginBottom: "10px",
                              }}
                            >
                              <p
                                key={key}
                                style={{
                                  fontSize: "15px",
                                  fontWeight: "600",
                                }}
                              >
                                {key}
                              </p>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                width: "45%",
                                marginBottom: "10px",
                                // backgroundColor: "pink",
                              }}
                            >
                              <p
                                style={{
                                  fontSize: "15px",
                                }}
                              >
                                {value}
                              </p>
                            </div>
                          </Box>
                        )
                      )}
                    </Grid>
                    <Grid
                      item
                      xs={5}
                      sx={{
                        borderLeftStyle: "solid",
                        borderWidth: "0.1rem",
                        borderColor: "#eeecec",
                      }}
                    >
                      {Object.entries(BillingInformation2).map(
                        ([key, value]) => (
                          <Box
                            display="flex"
                            // justifyContent="space-between"
                            alignItems="center"
                            sx={{
                              width: "100%",
                              marginBottom: "15px",
                            }}
                            key={key}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                width: "50%",
                                marginRight: 30,
                                marginBottom: "10px",
                              }}
                            >
                              <p
                                key={key}
                                style={{
                                  fontSize: "15px",
                                  fontWeight: "600",
                                }}
                              >
                                {key}
                              </p>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-start",
                                width: "45%",
                                marginBottom: "10px",
                                // backgroundColor: "pink",
                              }}
                            >
                              <p
                                style={{
                                  fontSize: "15px",
                                }}
                              >
                                {value}
                              </p>
                            </div>
                          </Box>
                        )
                      )}
                    </Grid>
                  </Grid>
                </Box>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                borderTopWidth: "2px",
                borderTopStyle: "solid",
                borderTopColor: "#ccc",
                margin: "20px 0 0",
                padding: "20px 10px",
                // backgroundColor: "pink"
              }}
            >
              <button
                className="btn btn-primary"
                style={{
                  width: "130px",
                  padding: "15px",
                  margin: "0 15px",
                }}
                onClick={handleApproveClick}
              >
                Approve
              </button>
              <button
                className="btn btn-primary"
                style={{
                  width: "130px",
                  padding: "15px",
                  margin: "0 10px",
                }}
                onClick={handleRejectClick}
              >
                Reject
              </button>
              <Modal
                open={openModal}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box sx={style.bottomModals}>
                  <ConfirmationModal
                    onClose={handleModalClose}
                    pass={passFlag}
                    fail={failFlag}
                  />
                </Box>
              </Modal>
            </div>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default BillingAuditDetails;
