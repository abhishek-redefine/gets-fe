import { Box, Modal } from "@mui/material";
import Grid from "@mui/material/Grid";
import React, { useEffect, useState } from "react";
import EmployeeTripTable from "./employeeTripTable";
import TripService from "@/services/trip.service";
import ComplianceService from "@/services/compliance.service";
import DispatchService from "@/services/dispatch.service";
import ViewMapModal from "./viewMapModal";
import { useDispatch } from "react-redux";
import { toggleToast } from "@/redux/company.slice";
import LoaderComponent from "@/components/loader";

const style = {
  topModals: {
    position: "absolute",
    top: "47%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 650,
    bgcolor: "background.paper",
    height: "auto",
    borderRadius: 5,
  },
};

const TripDetails = ({ onClose, tripId }) => {
  const dispatch = useDispatch();
  const [tripDetails, setTripDetails] = useState({});
  const [vehicleDetails, setvehicleDetails] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [openViewMapModal, setOpenViewMapModal] = useState(false);
  const handleViewMapModalOpen = () => {
    console.log("View map modal open");
    setOpenViewMapModal(true);
  };
  const handleViewMapModalClose = () => {
    console.log("View map modal close");
    setOpenViewMapModal(false);
  };

  // console.log("tripDetails.shiftType>>>>>>>>" + tripDetails.shiftType);

  // console.log("pointHeaderLabel>>>>" + pointHeaderLabel);
  const EscortTrip = tripDetails.isEscortRequired === true ? "YES" : "NO";

  const handleScreenClose = () => {
    console.log("Search module trip detail screen cross icon clicked");
    onClose();
  };

  const fetchTripDetails = async () => {
    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      const response = await TripService.getTripByTripId(tripId);
      console.log("Clicked trip data>>>", response.data);
      setTripDetails(response.data);
      if (response.status === 500) {
        dispatch(
          toggleToast({
            message: `Failed! Please try again later.`,
            type: "error",
          })
        );
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicle = async () => {
    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      const response = await ComplianceService.getSingleVehicle(
        tripDetails.vehicleId
      );
      console.log("Vehicle details", response.data.vehicleDTO);
      setvehicleDetails(response.data.vehicleDTO);
      if (response.status === 500) {
        dispatch(
          toggleToast({
            message: `Failed! Please try again later.`,
            type: "error",
          })
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTripMembers = async () => {
    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      const response = await DispatchService.tripMembers(tripId);
      console.log("Trip members", response.data);
      // setvehicleDetails(response.data.vehicleDTO);
      setData(response.data);
      if (response.status === 500) {
        dispatch(
          toggleToast({
            message: `Failed! Please try again later.`,
            type: "error",
          })
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const TripInformation = {
    "Trip Id": tripDetails.id,
    "Office Id": tripDetails.officeId,
    Date: tripDetails.date,
    "Shift Type": tripDetails.shiftType,
    "Shift Time": tripDetails.shiftTime,
    "Trip Type": "",
    "Escort Trip": EscortTrip,
    "Trip Status": tripDetails.tripState,
    "Planned Employees": data.length,
    "Travelled Employees": data.length,
  };

  const VehicleInformation = {
    "Vehicle Id": tripDetails.vehicleId,
    "Registration Id": vehicleDetails.vehicleRegistrationNumber,
    "Vehicle Type": vehicleDetails.vehicleType,
    "Vehicle Model": vehicleDetails.vehicleModel,
    "Driver Name": vehicleDetails.driverName,
    "Driver Phone No.": vehicleDetails.driverMobile,
    "Vendor Name": vehicleDetails.vendorName,
    "Sticker No": vehicleDetails.stickerNumber,
  };

  useEffect(() => {
    if (tripDetails.vehicleNumber) {
      fetchVehicle();
    }
  }, [tripDetails.vehicleNumber]);

  useEffect(() => {
    // console.log("selected row trip id: ", tripId);
    fetchTripDetails();
    fetchAllTripMembers();
  }, [tripId]);

  // useEffect(() => {
  //   console.log("Table pointHeaderLabel>>>>>", );
  //   // setPoint(pointHeaderLabel);
  // }, [tripDetails.shiftType]);

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
          <Grid item xs={6}>
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
          <Grid item xs={6}>
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
                      {Object.entries(VehicleInformation).map(
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
                    {/* <Grid item xs={6}>
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
                    </Grid> */}
                  </Grid>
                </Box>
              </div>
            </div>
          </Grid>
          <Grid item xs={12}>
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
                    // width: "40%",
                  }}
                >
                  Travelled Employee Information
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    // width: "60%",
                  }}
                >
                  <button
                    className="btn btn-primary"
                    style={{
                      width: "120px",
                      padding: "10px",
                      marginLeft: "20px",
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
                  {/* <button
                    className="btn btn-primary"
                    style={{
                      width: "150px",
                      padding: "10px",
                      marginLeft: "20px",
                    }}
                  >
                    Trip History
                  </button> */}
                </div>
              </div>
              <div className="">
                <div>
                  <EmployeeTripTable
                    tripMembersList={data}
                    pointHeaderLabel={tripDetails.shiftType}
                    isLoading={loading}
                  />
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </Box>
      {/* {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            // backgroundColor: "#000000",
            zIndex: 1,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            opacity: 1,
            color: "#000000",
            // height: "100vh",
            // width: "100vw",
          }}
        >
          <LoaderComponent />
        </div>
      ) : (
        " "
      )} */}
    </div>
  );
};

export default TripDetails;
