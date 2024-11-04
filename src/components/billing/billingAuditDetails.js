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
import BillingAuditDetailsTable from "./billingAuditDetailsTable";
import ViewMapModal from "./viewMapModal";
import TripHistoryModal from "./tripHistoryModal";
import ConfirmationModal from "./confirmationModal";
import TripService from "@/services/trip.service";
import BillingService from "@/services/billing.service";
import moment from "moment";
import BillingIssuesDetailsTable from "./billingIssuesDetailsTable";
import ComplianceService from "@/services/compliance.service";
import GoogleService from "@/services/google.service";

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

const BillingAuditDetails = ({ onClose, tripDetails }) => {
  const [data, setData] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [statusHistory, setStatusHistory] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);
  const [noShowCount, setNoShowCount] = useState(0);
  const [travelledEmployeeCount, setTravelledEmployeeCount] = useState(null);
  const [tripDuration, setTripDuration] = useState(null);

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

  const [historyData, setHistoryData] = useState([]);
  const [openTripHistoryModal, setOpenTripHistoryModal] = useState(false);
  const handleTripHistoryModalOpen = async () => {
    try {
      const response = await BillingService.getTripHistory(tripDetails.tripId);
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
    "DISTANCE_ISSUE",
    "ATTENDANCE_ISSUE",
    "TRIP_NOT_ENDED"
  ];

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

  const [BillingInformation1, setBillingInformation1] = useState({
    "Planned Vendor Name": "",
    "Actual Vendor Name": "",
    "Planned Vehicle Type": "",
    "Vehicle Fuel Type": "",
    // "Billing Zone": "",
    // "Location": "",
    "Planned Km.": "",
    "Actual Km.": "",
    "Reference Km.": "",
    "Empty Km." : "",
    "Final Km.": "",
  });

  const getTripByTripId = async() =>{
    try{
      const response = await BillingService.getTripByTripId(tripId);
      console.log(response.data);
      setBillingInformation1((prev)=>({
        ...prev,
        ["Planned Km."] : response.data?.actualDistance || 0,
        ["Actual Km."] : response.data?.actualDistance || 0,
        ["Empty Km."] : response.data?.emptyKm || 0,
        ["Reference Km."] : response.data?.routeWiseDistance || 0,
        ["Final Km."] : response.data?.finalDistance || 0
      }))
    }catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    getTripByTripId();
  },[]);

  const billingInformation1Fields = ["Billing Zone", "Final Km."];

  const [BillingInformation2, setBillingInformation2] = useState({
    // "Contract ID": "",
    // "Contract Type": "",
    "Trip Start Time": tripDetails?.tripStartTime,
    "Trip End Time": tripDetails?.tripEndTime,
    "Trip Duration": "",
    "On Time Status": "",
    // "Delay Reason": "",
    "Trip Remarks": "",
  });

  const OnTimeStatus = ["Yes", "No"];

  const fetchTripDetails = async() =>{
    try{
      const response = await BillingService.getTripByTripId(tripDetails.tripId);
      console.log(response.data);
      const data = response.data;
      setTripInformation({
        "Trip Id": `TRIP-${data.id}`,
        "Office Id": data.officeId,
        Date: data.date,
        "Shift Type": data.shiftType,
        "Shift Time": data.shiftTime,
        "Trip Type": data.tripType,
        "Escort Trip": data.isEscortRequired ? "Yes" : "No",
        "Trip Status": data.tripState === "END" ? "Completed" : "Not Completed",
      })
      setBillingInformation2((prev)=>({
        ...prev,
        ["On Time Status"] : data.onTime ? "Yes" : "No",
        ["Trip Remarks"] : data.onTimeRemark
      }))
      setBillingInformation1((prev)=>({
        ...prev,
        ["Final Km."] : data.finalDistance
        // []
      }))
    }catch(err){
      console.log(err);
    }
  }

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

  useEffect(()=>{
    fetchTripDetails();
  },[])

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
    if (tripDetails) {
      getTripMembers(tripDetails.tripId);
      let empCount = data.length - noShowCount;
      setTripInformation((prev) => ({
        ...prev,
        "Travelled Employees": data.length,
        "Planned Employees": empCount,
      }))
    }
    console.log("Trip Details>>>>>>", tripDetails)
  }, [tripDetails])

  useEffect(() => {
    if (data.length > 0) {
      if (tripDetails.shiftType === "LOGIN") {

        const timeA = moment(tripDetails.tripStartTime, 'HH:mm');
        const timeB = moment(tripDetails.tripEndTime, 'HH:mm');

        let diffInMinutes = timeB.diff(timeA, 'minutes');
        let diffInHours = timeB.diff(timeA, 'hours');

        console.log(`Difference in minutes: ${diffInMinutes} minutes`);
        console.log(`Difference in hours: ${diffInHours} hours`, BillingInformation2);

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
        const timeA = moment(tripDetails.tripStartTime, 'HH:mm');
        const timeB = moment(tripDetails.tripEndTime, 'HH:mm');

        let diffInMinutes = timeB.diff(timeA, 'minutes');
        let diffInHours = timeB.diff(timeA, 'hours');

        console.log(`Difference in minutes: ${diffInMinutes} minutes`);
        console.log(`Difference in hours: ${diffInHours} hours`, BillingInformation2);

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

  useEffect(() => {
    if (data.length > 0) {
      CalculateGoogleDistance();
    }
  }, [data]);

  const pointHeaderLabel =
    tripDetails.shiftType === "LOGIN" ? "Pickup Point" : "Drop Point";

  const handleRowsSelected = (selectedRowId) => {
    setSelectedRow(selectedRowId);
    console.log("slected row id: ", selectedRowId.empId);
  };

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

  const fetchVehicle = async () => {
    try {
      const response = await ComplianceService.getSingleVehicle(
        tripDetails.vehicleId
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

  useEffect(() => {
    fetchVehicle();
  }, [tripDetails.vehicleId]);

  const [tripIssueId, setTripIssueId] = useState(null);
  const getIssueIdUsingTripId = async () =>{
    try{
      const response = await BillingService.getIssueIdUsingTripId(tripDetails.tripId);
      console.log(response.data[0].issueName);
      setTripIssueId(response.data[0].id);
      setSearchValues({issueType : response.data[0].issueName})
    }catch(err){
      console.log(err);
    }
  }

  useEffect(()=>{
    getIssueIdUsingTripId()
  },[]);

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
                  {/* <button
                    className="btn btn-primary"
                    style={{
                      width: "110px",
                      padding: "10px",
                      margin: "0 0 0 30px",
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
                        historyData={historyData}
                      />
                    </Box>
                  </Modal>
                </div>
              </div>
              <div className="">
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
                      {Object.entries(vehicleInformation).map(([key]) => (
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
                      <InputLabel id="issue-type-label">
                        Issue Type *
                      </InputLabel>
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
                        disabled
                      >
                        {IssueType.map((item) => (
                          <MenuItem
                            key={item}
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
                        disabled
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
                    tripId={tripDetails.tripId}
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
