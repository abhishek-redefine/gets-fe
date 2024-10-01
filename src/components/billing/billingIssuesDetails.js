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
import React, { useEffect, useState } from "react";
import BillingIssuesDetailsTable from "./billingIssuesDetailsTable";
import ViewMapModal from "./viewMapModal";
import TripHistoryModal from "./tripHistoryModal";
import AddEmployeeModal from "./addEmployeeModal";
import { issueTypeData } from "@/sampleData/travelledEmployeesInfoData";
import ComplianceService from "@/services/compliance.service";
import BillingService from "@/services/billing.service";
import moment from "moment";
import GoogleService from "@/services/google.service";

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

const BillingIssuesDetails = ({ onClose, tripId, tripdetails, officeId, date, IssueType }) => {
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [statusHistory, setStatusHistory] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);
  const [noShowCount, setNoShowCount] = useState(0);
  const [travelledEmployeeCount, setTravelledEmployeeCount] = useState(null);
  const [tripDuration, setTripDuration] = useState(null);

  const pointHeaderLabel =
    tripdetails[0].shiftType === "LOGIN" ? "Pickup Point" : "Drop Point";

  const [searchValues, setSearchValues] = useState({
    issueType: tripdetails[0].issueName,
  });

  // const IssueType = [
  //   "Vehicle Not Assigned",
  //   "Trip Not Started",
  //   "Trip Not Ended",
  //   "None",
  // ];

  const [TripInformation, setTripInformation] = useState({
    "Trip Id": "",
    "Office Id": "",
    "Date": "",
    "Shift Type": "",
    "Shift Time": "",
    "Trip Type": "",
    "Escort Trip": "",
    "Trip Status": "",
    "Planned Employees": "",
    "Travelled Employees": "",
  });

  const [vehicleInformation, setVehicleInformation] = useState({
    "Vehicle ID": "",
    "Registration ID": "",
    "Vehicle Type": "",
    "Vehicle Model": "",
    "Driver Name": "",
    "Driver Phone No.": "",
    "Sticker No.": "",
  });

  const [billingInformation1, setBillingInformation1] = useState({
    "Planned Vendor Name": "",
    "Actual Vendor Name": "",
    "Planned Vehicle Type": "",
    "Vehicle Fuel Type": "",
    // "Billing Zone": "",
    // "Location": "",
    "Planned Km.": "",
    "Actual Km.": "",
    "Reference Km.": "",
    "Final Km.": "",
  });

  const billingInformation1Fields = ["Billing Zone", "Final Km."];

  const [billingInformation2, setBillingInformation2] = useState({
    // "Contract ID": "",
    // "Contract Type": "",
    "Trip Start Time": tripdetails[0].tripStartTime,
    "Trip End Time": tripdetails[0].tripEndTime,
    "Trip Duration": "",
    "On Time Status": "",
    // "Delay Reason": "",
    "Trip Remarks": "",
  });

  const OnTimeStatus = ["Yes", "No"];

  const [openViewMapModal, setOpenViewMapModal] = useState(false);
  const handleViewMapModalOpen = () => {
    console.log("View map modal open");
    setOpenViewMapModal(true);
  };
  const handleViewMapModalClose = () => {
    console.log("View map modal close");
    setOpenViewMapModal(false);
  };

  const [historyData, setHistoryData] = useState([]);
  const [openTripHistoryModal, setOpenTripHistoryModal] = useState(false);
  const handleTripHistoryModalOpen = async () => {
    try {
      const response = await BillingService.getTripHistory(tripId);
      const data = response.data;
      console.log(data);
      setHistoryData(data);
    } catch (err) {
      console.log(err);
    }
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
    getTripMembers(tripdetails[0].tripId);
  };

  const convertTimeToDate = (timeString) => {
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":");

    if (modifier === "PM" && hours !== "12") {
      hours = parseInt(hours, 10) + 12;
    }
    if (modifier === "AM" && hours === "12") {
      hours = "00";
    }

    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date;
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) {
      return `${minutes} minutes`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes === 0
        ? `${hours} hour${hours > 1 ? "s" : ""}`
        : `${hours} hour${hours > 1 ? "s" : ""} ${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""
        }`;
    }
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

  const handleAddEmployee = (employeeData) => {
    console.log("Adding employee Data>>", employeeData);
    console.log(tripdetails);
    const employeeExists = data.some(
      (row) => row.empId === employeeData.employeeId
    );
    if (employeeExists) {
      console.log("Employee already exists");
    } else {
      setData((prevData) => [
        ...prevData,
        {
          empId: employeeData.employeeId,
          empName: "Saifali",
          gender: "Female",
          point: "V3S Mall",
          landmark: "V3S Mall",
          vehicleReportTime: "11:00 AM",
          signIn: employeeData.signInTime,
          signOut: employeeData.signOutTime,
          status: employeeData.tripStatus,
          phoneNo: "9879865645",
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

  const deleteTripMemeber = async (tripId, id) => {
    try {
      const response = await BillingService.deleteMember(tripId, id);
      const data = response.data;
      if (response.status === 200) {
        console.log(data);
        getTripMembers(tripId);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleDelete = () => {
    console.log("delete button clicked");
    let updatedData = data;
    if (selectedRow) {
      console.log("data: ", data);
      console.log("selectedRow: ", selectedRow);
      deleteTripMemeber(selectedRow.tripId, selectedRow.id);
      // updatedData = data.filter((row) => row.empId !== selectedRow.empId);
    }
    setData(updatedData);
    console.log("updatedData: ", updatedData);
    setSelectedRow(null);
    console.log("Selected row deleted");
  };

  const markNoShow = async (tripId, id, flag) => {
    try {
      const response = await BillingService.markNoShow(tripId, id, flag);
      console.log(response.data);
      if (response.status === 200) {
        getTripMembers(tripId);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const handleNoShow = () => {
    if (selectedRow) {
      console.log("No show >>> selected row Status: ", selectedRow.noShow);
      markNoShow(tripdetails[0].tripId, selectedRow.id, true);
    }
  };

  const handleUndoNoShow = () => {
    if (selectedRow) {
      console.log("No show >>> selected row Status: ", selectedRow.noShow);
      markNoShow(tripdetails[0].tripId, selectedRow.id, false);
      // const previousStatus = statusHistory.find(
      //   (item) => item.empId === selectedRow.empId
      // );

      // if (previousStatus) {
      //   console.log("Previous status: ", previousStatus);
      //   let updatedData = data;
      //   data.filter((row, index) => {
      //     if (row.empId === selectedRow.empId) {
      //       console.log("row empId", row.empId);
      //       updatedData[index].noShow = previousStatus.noShow;
      //     }
      //   });
      //   console.log("Updated Data>>>", updatedData);
      //   setData(() => [...updatedData]);

      //   setStatusHistory((prevHistory) =>
      //     prevHistory.filter((item) => item.empId !== selectedRow.empId)
      //   );
      //   console.log("Status history after undo no show: ", statusHistory);
      // }
    }
    console.log(
      "Undo no show >>> selected row status after undo no show: ",
      selectedRow.noShow
    );
  };

  const handleSaveTableData = () => {
    setData(data);
    // console.log("updatedDataAfterDeletion: ", data);
    const savedData = {
      tableData: data,
      tripInformation: TripInformation,
      vehicleInformation: vehicleInformation,
      billingInformation1: billingInformation1,
      billingInformation2: billingInformation2,
      issueType: searchValues,
      remarks: remarks,
    };

    console.log("Saved Data: ", savedData);
  };

  const fetchVehicle = async () => {
    try {
      const response = await ComplianceService.getSingleVehicle(
        tripdetails[0].vehicleId
      );
      console.log("vehicle response: ", response.data.vehicleDTO);

      const { data } = response || {};
      let fetchedVehicleData = [];
      fetchedVehicleData.push(response.data.vehicleDTO);
      setVehicleData(fetchedVehicleData);
      console.log("Vehicle Data: ", vehicleData);
    } catch (e) {
      console.error(e);
    }
  };

  const handleBillingInfo1Change = (key, value) => {
    setBillingInformation1((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleBillingInfo2Change = (key, value) => {
    setBillingInformation2((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    console.log("selcted row: ", selectedRow);
  }, [selectedRow]);

  useEffect(() => {
    console.log("Saifali>>>>>>>>>>>>> ", data);
    if (data.length > 0) {
      const count = data.filter((row) => row.noShow === true).length;
      setNoShowCount(count);
      console.log("No show count", count);

      let empCount = data.length - count;
      setTripInformation((prev) => ({
        ...prev,
        ["Travelled Employees"]: data.length,
        ["Planned Employees"]: empCount
      }));
    }
  }, [data]);

  // useEffect(() => {
  //   const newKey =
  //     tripdetails[0].shiftType === "LOGIN"
  //       ? "First Pickup Location"
  //       : "Last Drop Location";

  //   setBillingInformation1((prev) => {
  //     const { Location: oldValue, ...rest } = prev;
  //     console.log("newKey: ", newKey);
  //     return {
  //       ...rest,
  //       [newKey]: oldValue,
  //     };
  //   });
  //   if (data.length > 0 && newKey === "First Pickup Location") {
  //     setBillingInformation1((prev) => ({
  //       ...prev,
  //       "First Pickup Location": data[0]?.point,
  //     }));
  //   }
  //   if (data.length > 0 && newKey === "Last Drop Location") {
  //     setBillingInformation1((prev) => ({
  //       ...prev,
  //       "Last Drop Location": data[data.length - 1]?.point,
  //     }));
  //   }
  // }, [tripdetails[0].shiftType, data]);

  useEffect(() => {
    fetchVehicle();
  }, [tripdetails[0].vehicleId]);

  useEffect(() => {
    if (vehicleData.length > 0) {
      setVehicleInformation((prev) => ({
        ...prev,
        "Vehicle ID": vehicleData[0]?.vehicleId,
        "Registration ID": vehicleData[0].vehicleRegistrationNumber,
        "Vehicle Type": vehicleData[0]?.vehicleType,
        "Vehicle Model": vehicleData[0]?.vehicleModel,
        "Sticker No.": vehicleData[0]?.stickerNumber,
        "Driver Name": vehicleData[0]?.driverName,
        "Driver Phone No.": vehicleData[0]?.driverMobile,
      }));
      setBillingInformation1((prev) => ({
        ...prev,
        "Planned Vendor Name": vehicleData[0]?.vendorName,
        "Actual Vendor Name": vehicleData[0]?.vendorName,
        "Planned Vehicle Type": vehicleData[0]?.vehicleType,
        "Vehicle Fuel Type": vehicleData[0]?.fuelType,
      }));
    }
  }, [vehicleData]);

  useEffect(() => {
    if (data.length > 0) {
      if (tripdetails[0].shiftType === "LOGIN") {

        const timeA = moment(tripdetails[0].tripStartTime, 'HH:mm');
        const timeB = moment(tripdetails[0].tripEndTime, 'HH:mm');

        let diffInMinutes = timeB.diff(timeA, 'minutes');
        let diffInHours = timeB.diff(timeA, 'hours');

        console.log(`Difference in minutes: ${diffInMinutes} minutes`);
        console.log(`Difference in hours: ${diffInHours} hours`, billingInformation2);

        setTripDuration(diffInMinutes);
        setBillingInformation2((prev) => ({
          ...prev,
          "Trip Duration": `${diffInMinutes} min`,
        }));

        // const newTripStartTime = data[0]?.signIn;
        // const newTripEndTime = data[data.length - 1]?.signIn;

        // const newTripStartDate = convertTimeToDate(newTripStartTime);
        // const newTripEndDate = convertTimeToDate(newTripEndTime);
        // const tripDurationInMinutes =
        //   (newTripEndDate - newTripStartDate) / (1000 * 60);
        // const formattedTripDuration = formatDuration(tripDurationInMinutes);

        // setBillingInformation2((prev) => ({
        //   ...prev,
        //   "Trip Start Time": data[0]?.signIn,
        //   "Trip End Time": data[data.length - 1]?.signIn,
        //   "Trip Duration": formattedTripDuration,
        // }));
      } else {
        const timeA = moment(tripdetails[0].tripStartTime, 'HH:mm');
        const timeB = moment(tripdetails[0].tripEndTime, 'HH:mm');

        let diffInMinutes = timeB.diff(timeA, 'minutes');
        let diffInHours = timeB.diff(timeA, 'hours');

        console.log(`Difference in minutes: ${diffInMinutes} minutes`);
        console.log(`Difference in hours: ${diffInHours} hours`, billingInformation2);

        setTripDuration(diffInMinutes);
        setBillingInformation2((prev) => ({
          ...prev,
          "Trip Duration": `${diffInMinutes} min`,
        }));
        // const newTripStartTime = data[0]?.signOut;
        // const newTripEndTime = data[data.length - 1]?.signOut;

        // const newTripStartDate = convertTimeToDate(newTripStartTime);
        // const newTripEndDate = convertTimeToDate(newTripEndTime);
        // const tripDurationInMinutes =
        //   (newTripEndDate - newTripStartDate) / (1000 * 60);
        // const formattedTripDuration = formatDuration(tripDurationInMinutes);

        // setBillingInformation2((prev) => ({
        //   ...prev,
        //   "Trip Start Time": data[0]?.signOut,
        //   "Trip End Time": data[data.length - 1]?.signOut,
        //   "Trip Duration": formattedTripDuration,
        // }));
      }
    }
  }, [data]);

  const getTripMembers = async (tripId) => {
    try {
      const response = await BillingService.billingTripMember(tripId);
      console.log(response.data);
      setData(response.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (tripdetails) {
      getTripMembers(tripdetails[0].tripId);
      let empCount = data.length - noShowCount;
      setTripInformation({
        "Trip Id": `TRIP-${tripdetails[0].tripId}`,
        "Office Id": officeId,
        "Date": moment(date).format("DD-MM-YYYY"),
        "Shift Type": tripdetails[0].shiftType,
        "Shift Time": tripdetails[0].shiftTime,
        "Trip Type": tripdetails[0].tripType,
        "Escort Trip": tripdetails[0].escortTrip ? "Yes" : "No",
        "Trip Status": tripdetails[0].tripState,
        "Travelled Employees": data.length,
        "Planned Employees": empCount,
      })
    }
    console.log("Trip Details>>>>>>", tripdetails)
  }, [tripdetails])

  const CalculateGoogleDistance = async () => {
    try {
      let distance = 0;
      const length = data.length;
      const coordA = data[0].empSignInGeo;
      const coordB = data[length - 1].empSignOutGeo;
      const response = await GoogleService.calculateDistance(coordA, coordB);
      const distancePromises = data.map(async (val, index) => {
        if (index === 0) {
          if (length === 1 && !val.noShow) {
            const pointA = val.empSignInGeo;
            const pointB = val.empSignOutGeo;
            const totalDistanceRes = await GoogleService.calculateDistance(pointA, pointB);
            const item = totalDistanceRes.distance.split(" ");
            const totalDistance = parseFloat(item[0]);
            distance += totalDistance;
            console.log(index, ">>>>>>", distance);
          } else if (!val.noShow) {
            const pointA = val.empSignInGeo;
            const pointB = data[index + 1].empSignInGeo;
            const totalDistanceRes = await GoogleService.calculateDistance(pointA, pointB);
            const item = totalDistanceRes.distance.split(" ");
            const totalDistance = parseFloat(item[0]);
            distance += totalDistance;
            console.log(index, ">>>>>>", distance);
          }
        } else {
          if (index === length - 1 && !val.noShow) {
            const pointA = val.empSignInGeo;
            const pointB = val.empSignOutGeo;
            const totalDistanceRes = await GoogleService.calculateDistance(pointA, pointB);
            const item = totalDistanceRes.distance.split(" ");
            const totalDistance = parseFloat(item[0]);
            distance += totalDistance;
            console.log(index, ">>>>>>", distance);
          } else if (!val.noShow) {
            const pointA = val.empSignInGeo;
            const pointB = data[index + 1].empSignInGeo;
            const totalDistanceRes = await GoogleService.calculateDistance(pointA, pointB);
            const item = totalDistanceRes.distance.split(" ");
            const totalDistance = parseFloat(item[0]);
            distance += totalDistance;
            console.log(index, ">>>>>>", distance);
          }
        }
      })

      await Promise.all(distancePromises);
      console.log("Trip Distance >>>>>>>>", distance);

      setBillingInformation1((prev) => ({
        ...prev,
        ["Planned Km."]: response.distance,
        ["Reference Km."]: response.distance,
        ["Actual Km."]: `${parseFloat(distance).toFixed(2)} km`
      }));
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (data.length > 0) {
      CalculateGoogleDistance();
    }
  }, [data]);

  const updateTrip = async () => {
    try {
      const payload = {
        "finalDistance": parseFloat(billingInformation1["Final Km."]),
        "onTime": billingInformation2["On Time Status"] === "Yes" ? true : false,
        "onTimeRemarks": billingInformation2["Trip Remarks"],
        "tripId": tripdetails[0].tripId
      }
      console.log("Hello", payload);
      const response = await BillingService.updateTrip(payload);
      console.log(response.data);
    } catch (err) {
      console.log(err);
    }
  }


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
                              style={{
                                fontSize: "15px",
                                fontWeight: "600",
                                margin: 0,
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
                    width: "25%",
                  }}
                >
                  Travelled Employees Information
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "75%",
                  }}
                >
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "170px",
                      padding: "10px",
                      marginLeft: "20px",
                    }}
                    onClick={CalculateGoogleDistance}
                  >
                    Distance Recalculate
                  </button>
                  {/* <button
                    className="btn btn-primary"
                    style={{
                      width: "100px",
                      padding: "10px",
                      marginLeft: "20px",
                    }}
                    onClick={handleViewMapModalOpen}
                  >
                    View Map
                  </button> */}
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
                      marginLeft: "20px",
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
                        historyData={historyData}
                      />
                    </Box>
                  </Modal>
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "140px",
                      padding: "10px",
                      marginLeft: "20px",
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
                        onAddEmployeeData={handleAddEmployee}
                        tripDetails={tripdetails[0]}
                        officeId={officeId}
                      />
                    </Box>
                  </Modal>
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "90px",
                      padding: "10px",
                      marginLeft: "20px",
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
                    margin: " 0 25px 25px",
                  }}
                >
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "120px",
                      padding: "10px",
                      margin: "0 20px 0 0",
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
                      margin: "0 20px 0 0",
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
                      margin: "0 20px 0 0",
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
                    pointHeaderLabel={pointHeaderLabel}
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
                      {Object.entries(vehicleInformation).map(([key]) => {
                        return (
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
                                  {vehicleInformation[key]}
                                </p>
                              </Grid>
                            </div>
                          </Box>)
                      })}
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
                            value={item.value}
                            style={{
                              fontSize: "15px",
                            }}
                          >
                            {item.displayName}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {/* <Box
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
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                        inputProps={{
                          style: {
                            fontFamily: "DM Sans",
                            fontSize: 15,
                          },
                        }}
                      />
                    </Box> */}
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
                className="d-flex"
                style={{
                  justifyContent: 'space-between',
                  fontSize: "20px",
                  fontWeight: "600",
                  padding: "20px 25px 20px",
                  borderBottomStyle: "solid",
                  borderWidth: "0.1rem",
                  borderColor: "#eeecec",
                  marginBottom: "25px",
                }}
              >
                <div>
                  Billing Information
                </div>

                <div>
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "170px",
                      padding: "10px",
                      marginLeft: "20px",
                    }}
                    onClick={() => updateTrip()}
                  >
                    Submit
                  </button>
                </div>
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
                      {Object.entries(billingInformation1).map(([key]) => (
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
                              {billingInformation1Fields.includes(key) ? (
                                <TextField
                                  key={key}
                                  placeholder="Enter value"
                                  size="small"
                                  value={billingInformation1[key]}
                                  onChange={(e) =>
                                    handleBillingInfo1Change(
                                      key,
                                      e.target.value
                                    )
                                  }
                                  style={{
                                    width: "90%",
                                  }}
                                  inputProps={{
                                    style: {
                                      fontFamily: "DM Sans",
                                      fontSize: 15,
                                    },
                                  }}
                                />
                              ) : (
                                <p
                                  style={{
                                    fontSize: "15px",
                                  }}
                                >
                                  {billingInformation1[key]}
                                </p>
                              )}
                            </Grid>
                          </div>
                        </Box>
                      ))}
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
                      {Object.entries(billingInformation2).map(([key]) => (
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
                              {key === "Delay Reason" ||
                                key === "Trip Remarks" ? (
                                <TextField
                                  placeholder="Enter value"
                                  size="small"
                                  value={billingInformation2[key]}
                                  onChange={(e) =>
                                    handleBillingInfo2Change(
                                      key,
                                      e.target.value
                                    )
                                  }
                                  style={{
                                    width: "90%",
                                  }}
                                  inputProps={{
                                    style: {
                                      fontFamily: "DM Sans",
                                      fontSize: 15,
                                    },
                                  }}
                                />
                              ) : key === "On Time Status" ? (
                                <FormControl
                                  fullWidth
                                  style={{ fontFamily: "DM Sans" }}
                                >
                                  <InputLabel
                                    id="onTimeStatus-label"
                                    style={{ fontSize: 15, top: "-7px" }}
                                  >
                                    Select value
                                  </InputLabel>
                                  <Select
                                    sx={{
                                      width: "90%",
                                    }}
                                    label="On Time Status"
                                    labelId="onTimeStatus-label"
                                    id="onTimeStatus"
                                    name="onTimeStatus"
                                    size="small"
                                    value={billingInformation2[key]}
                                    onChange={(e) =>
                                      handleBillingInfo2Change(
                                        key,
                                        e.target.value
                                      )
                                    }
                                  >
                                    {OnTimeStatus.map((item) => (
                                      <MenuItem
                                        key={item}
                                        value={item}
                                        style={{
                                          fontSize: "14px",
                                        }}
                                      >
                                        {item}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              ) : (
                                <p
                                  style={{
                                    fontSize: "15px",
                                  }}
                                >
                                  {billingInformation2[key]}
                                </p>
                              )}
                            </Grid>
                          </div>
                        </Box>
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
