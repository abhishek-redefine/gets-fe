import { Label } from "@mui/icons-material";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import moment from "moment";
import DispatchService from "@/services/dispatch.service";
import { DATE_FORMAT } from "@/constants/app.constants.";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { getFormattedLabel } from "@/utils/utils";
import dayjs from "dayjs";
import ConfirmationModal from "./tripGenratedSuccesModal";
import LoaderComponent from "../common/loading";

const GenerateTripModal = (props) => {
  const { onClose, data, selectedDate, dummy, officeData, shiftTypes } = props;

  const [escortCriteria, setEscortCriteria] = useState([
    "First Pickup and Last Drop",
    "Any Female Employee",
    "All Female Employee",
    "All of the above",
  ]);
  const [tripStartsFrom, setTripStartsFrom] = useState(["Kundli", "Sonipat"]);
  const [transportType, setTransportType] = useState("CAB");
  const [messageShow, setMessageShow] = useState(false);
  const [passFlag, setPassFlag] = useState(false);
  const [routeOptions, setRouteOptions] = useState({
    escortCriteria: "First Pickup and Last Drop",
    tripStartFrom: "",
    flexMix: {
      "4s": -1,
      "6s": 1,
      "7s": 1,
      "12s": 1,
    },
    pickupTime:
      data?.shiftType === "LOGIN" ? "00:00" : data?.shiftTime || "00:00",
  });
  const [dummyRouteOptions, setDummyOption] = useState({
    date: selectedDate,
    officeId: data.officeId,
    shiftTime: data.shiftTime,
    shiftType: data.shiftType,
    noOfTrips: 1,
  });

  const handleFilterChange = (event) => {
    const { target } = event;
    const { name, value } = target;
    let prev = { ...routeOptions };
    if (name === "escort-criteria") prev.escortCriteria = value;
    if (name === "trip-start") prev.tripStartFrom = value;
    if (name === "fourSeater") prev.flexMix["4s"] = value;
    if (name === "sixSeater") prev.flexMix["6s"] = value;
    if (name === "sevenSeater") prev.flexMix["7s"] = value;
    if (name === "twelveSeater") prev.flexMix["12s"] = value;
    if (name === "pickupTime") prev.pickupTime = value;
    console.log(prev);
    setRouteOptions(prev);
  };

  const [loading, setLoading] = useState(false);

  const generateTrips = async () => {
    try {
      setLoading(true);
      const payload = {
        officeIds: [data.officeId],
        date: selectedDate,
        shiftTime: data.shiftTime,
        shiftType: data.shiftType,
        schemaVersion: "NORMAL",
        pickupTime: routeOptions.pickupTime,
        fleetMix: [
          {
            noOfVehicle: routeOptions.flexMix["4s"],
            noOfSeats: 4,
          },
          {
            noOfVehicle: routeOptions.flexMix["6s"],
            noOfSeats: 6,
          },
          {
            noOfVehicle: routeOptions.flexMix["7s"],
            noOfSeats: 7,
          },
          {
            noOfVehicle: routeOptions.flexMix["12s"],
            noOfSeats: 12,
          },
        ],
      };
      console.log(payload);
      const response = await DispatchService.generateTrips(payload);
      if (response.status === 201) {
        console.log("data>>>" + response.data.trips.length);
        if (response.data.trips.length > 0) {
          setMessageShow(true);
          setPassFlag(true);
          console.log("trips generated");
          //onClose();
        } else {
          setMessageShow(true);
          setPassFlag(false);
          console.log("trip did not generated");
          //onClose();
        }
      }
      setMessageShow(true);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const dummyTrips = async () => {
    try {
      setLoading(true);
      let payload = { dummyTripDTO: dummyRouteOptions };
      console.log(payload);
      const response = await DispatchService.generateDummyTrip(payload);
      console.log(response.data);
      if (response.status === 200) {
        setMessageShow(true);
        setPassFlag(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChangeDummyRoute = async (e) => {
    const { target } = e;
    const { value, name } = target;
    let dummyOption = { ...dummyRouteOptions };
    if (name === "date") dummyOption[name] = value.format("YYYY-MM-DD");
    else dummyOption[name] = value;
    setDummyOption(dummyOption);
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      {!messageShow ? (
        <div
          style={{ padding: "30px", backgroundColor: "#FFF", borderRadius: 10 }}
        >
          <div>
            <div>
              <h3>{dummy ? "Dummy Trips" : "Generate Trips"}</h3>
            </div>
            {!dummy && (
              <div className="d-flex" style={{ marginTop: 20 }}>
                <div
                  style={{
                    marginRight: "20px",
                    padding: "5px 30px",
                    border:
                      transportType === "CAB"
                        ? "2px solid #F6CE47"
                        : "2px solid #e7e7e7",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => setTransportType("CAB")}
                >
                  <p>Cab</p>
                </div>
                <div
                  style={{
                    marginRight: "20px",
                    padding: "5px 30px",
                    border:
                      transportType === "BUS"
                        ? "2px solid #F6CE47"
                        : "2px solid #e7e7e7",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => setTransportType("BUS")}
                >
                  <p>Bus</p>
                </div>
                <div
                  style={{
                    marginRight: "20px",
                    padding: "5px 30px",
                    border:
                      transportType === "SHUTTLE"
                        ? "2px solid #F6CE47"
                        : "2px solid #e7e7e7",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => setTransportType("SHUTTLE")}
                >
                  <p>Shuttle</p>
                </div>
              </div>
            )}
            <div className="d-flex" style={{ marginTop: 20 }}>
              <div
                style={{
                  border: "2px solid #e7e7e7",
                  borderRadius: 4,
                  marginRight: 15,
                  minWidth: "150px",
                }}
              >
                <div
                  style={{
                    borderBottom: "2px solid #e7e7e7",
                    padding: "5px 10px",
                  }}
                >
                  <p>Date</p>
                </div>
                {dummy ? (
                  <>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <DatePicker
                        name="date"
                        disabled={true}
                        format={DATE_FORMAT}
                        value={
                          dummyRouteOptions.date
                            ? moment(dummyRouteOptions.date)
                            : null
                        }
                        onChange={(e) =>
                          handleFilterChangeDummyRoute({
                            target: { name: "date", value: e },
                          })
                        }
                      />
                    </LocalizationProvider>
                  </>
                ) : (
                  <div style={{ padding: "5px 10px" }}>
                    <p>{moment(selectedDate).format("DD-MM-YYYYY")}</p>
                  </div>
                )}
              </div>
              <div
                style={{
                  border: "2px solid #e7e7e7",
                  borderRadius: 4,
                  marginRight: 15,
                  minWidth: "150px",
                }}
              >
                <div
                  style={{
                    borderBottom: "2px solid #e7e7e7",
                    padding: "5px 10px",
                  }}
                >
                  <p>Office ID</p>
                </div>
                {!dummy ? (
                  <div style={{ padding: "5px 10px" }}>
                    <p>{data?.officeId}</p>
                  </div>
                ) : (
                  <>
                    <FormControl fullWidth>
                      <Select
                        disabled={true}
                        id="officeId"
                        value={data?.officeId}
                        name="officeId"
                        onChange={handleFilterChangeDummyRoute}
                      >
                        {!!officeData?.length &&
                          officeData.map((office, idx) => (
                            <MenuItem key={idx} value={office.officeId}>
                              {getFormattedLabel(office.officeId)},{" "}
                              {office.address}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </>
                )}
              </div>
              <div
                style={{
                  border: "2px solid #e7e7e7",
                  borderRadius: 4,
                  marginRight: 15,
                  minWidth: "150px",
                }}
              >
                <div
                  style={{
                    borderBottom: "2px solid #e7e7e7",
                    padding: "5px 10px",
                  }}
                >
                  <p>Shift Time</p>
                </div>
                {!dummy ? (
                  <div style={{ padding: "5px 10px" }}>
                    <p>{data?.shiftTime}</p>
                  </div>
                ) : (
                  <>
                    <FormControl required>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimeField
                          disabled={true}
                          value={dayjs()
                            .hour(Number(data?.shiftTime.slice(0, 2)))
                            .minute(Number(data?.shiftTime.slice(3, 5)))}
                          format="HH:mm"
                          onChange={(e) => {
                            var ShiftTime = e.$d
                              .toLocaleTimeString("it-IT")
                              .slice(0, -3);

                            handleFilterChangeDummyRoute({
                              target: { name: "shiftTime", value: ShiftTime },
                            });
                          }}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </>
                )}
              </div>
              <div
                style={{
                  border: "2px solid #e7e7e7",
                  borderRadius: 4,
                  marginRight: 15,
                  minWidth: "150px",
                }}
              >
                <div
                  style={{
                    borderBottom: "2px solid #e7e7e7",
                    padding: "5px 10px",
                  }}
                >
                  <p>Shift Type</p>
                </div>
                {!dummy ? (
                  <div style={{ padding: "5px 10px" }}>
                    <p>{data.shiftType}</p>
                  </div>
                ) : (
                  <FormControl fullWidth>
                    <Select
                      disabled={true}
                      id="shiftType"
                      name="shiftType"
                      value={data?.shiftType}
                      onChange={handleFilterChangeDummyRoute}
                    >
                      {shiftTypes.map((sT, idx) => (
                        <MenuItem key={idx} value={sT.value}>
                          {getFormattedLabel(sT.value)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </div>
            </div>
            {/* route name */}
            {transportType === "BUS" && (
              <div className="d-flex" style={{ marginTop: 25 }}>
                <div
                  style={{
                    border: "2px solid #e7e7e7",
                    borderRadius: 4,
                    marginRight: 15,
                    minWidth: "250px",
                  }}
                >
                  <div
                    style={{
                      borderBottom: "2px solid #e7e7e7",
                      padding: "5px 10px",
                    }}
                  >
                    <p>Route Name</p>
                  </div>
                  <div style={{ padding: "5px 10px" }}>
                    <p>Sonipat to Kundli</p>
                  </div>
                </div>
              </div>
            )}
            <div className="d-flex">
              {/* escort dropdown */}
              {!dummy && (
                <div className="d-flex" style={{ marginTop: 25 }}>
                  <div style={{ marginRight: 15 }}>
                    <FormControl fullWidth>
                      <InputLabel id="escort-criteria-label">
                        Escort Criteria
                      </InputLabel>
                      <Select
                        style={{ width: "200px" }}
                        labelId="escort-criteria-label"
                        id="escort-criteria"
                        value={routeOptions.escortCriteria}
                        name="escort-criteria"
                        label="Escort Criteria"
                        onChange={handleFilterChange}
                      >
                        {escortCriteria.map((value, index) => (
                          <MenuItem key={index} value={value}>
                            {value}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div style={{ marginRight: 15 }}>
                    <FormControl required>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimeField
                          value={dayjs()
                            .hour(Number(routeOptions.pickupTime.slice(0, 2)))
                            .minute(
                              Number(routeOptions.pickupTime.slice(3, 5))
                            )}
                          format="HH:mm"
                          onChange={(e) => {
                            var ShiftTime = e.$d
                              .toLocaleTimeString("it-IT")
                              .slice(0, -3);

                            handleFilterChange({
                              target: { name: "pickupTime", value: ShiftTime },
                            });
                          }}
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </div>
                  {/* <div style={{ marginRight: 15 }}>
              <FormControl fullWidth>
                <InputLabel id="trip-start-label">Trip Start From</InputLabel>
                <Select
                  style={{ width: "200px" }}
                  labelId="trip-start-label"
                  id="trip-start"
                  value={routeOptions.tripStartFrom}
                  name="trip-start"
                  label="Trip Start From"
                  onChange={handleFilterChange}
                >
                  {tripStartsFrom.map((value, index) => (
                    <MenuItem key={index} value={value}>
                      {value}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div> */}
                </div>
              )}
              {/* pickup Time */}
            </div>
            {/* fleet mix */}
            {transportType === "CAB" && !dummy && (
              <div style={{ marginTop: 20 }}>
                <div style={{ marginBottom: 10 }}>
                  <p>Fleet mix</p>
                </div>
                <div
                  className="d-flex"
                  style={{ border: "2px solid #e7e7e7", width: "30%" }}
                >
                  <div
                    style={{ width: "50%", borderRight: "2px solid #e7e7e7" }}
                  >
                    <div
                      style={{
                        borderBottom: "2px solid #e7e7e7",
                        padding: "5px 0",
                      }}
                    >
                      <p style={{ textAlign: "center" }}>Vehicle Type</p>
                    </div>
                    <div>
                      <p style={{ textAlign: "center", margin: "11px 0" }}>
                        4s
                      </p>
                      <p style={{ textAlign: "center", marginBottom: 11 }}>
                        6s
                      </p>
                      <p style={{ textAlign: "center", marginBottom: 11 }}>
                        7s
                      </p>
                      <p style={{ textAlign: "center", marginBottom: 11 }}>
                        12s
                      </p>
                    </div>
                  </div>
                  <div style={{ width: "50%" }}>
                    <div
                      style={{
                        borderBottom: "2px solid #e7e7e7",
                        padding: "5px 0",
                      }}
                    >
                      <p style={{ textAlign: "center" }}>Available</p>
                    </div>
                    <div>
                      <div
                        id="4s"
                        className="d-flex"
                        style={{ justifyContent: "center", margin: "10px 0" }}
                      >
                        <input
                          type="number"
                          name="fourSeater"
                          className="seaterInput"
                          value={routeOptions.flexMix["4s"]}
                          onChange={handleFilterChange}
                        />
                      </div>
                      <div
                        id="6s"
                        className="d-flex"
                        style={{ justifyContent: "center", marginBottom: 10 }}
                      >
                        <input
                          type="number"
                          name="sixSeater"
                          className="seaterInput"
                          value={routeOptions.flexMix["6s"]}
                          onChange={handleFilterChange}
                        />
                      </div>
                      <div
                        id="7s"
                        className="d-flex"
                        style={{ justifyContent: "center", marginBottom: 10 }}
                      >
                        <input
                          type="number"
                          name="sevenSeater"
                          className="seaterInput"
                          value={routeOptions.flexMix["7s"]}
                          onChange={handleFilterChange}
                        />
                      </div>
                      <div
                        id="12s"
                        className="d-flex"
                        style={{ justifyContent: "center", marginBottom: 10 }}
                      >
                        <input
                          type="number"
                          name="twelveSeater"
                          className="seaterInput"
                          value={routeOptions.flexMix["12s"]}
                          onChange={handleFilterChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {dummy && (
              <div className="d-flex" style={{ marginTop: 20 }}>
                <div>
                  <TextField
                    required
                    id="noOfTrips"
                    name="noOfTrips"
                    label="Number of trips"
                    variant="outlined"
                    value={dummyRouteOptions.noOfTrips}
                    onChange={handleFilterChangeDummyRoute}
                  />
                </div>
              </div>
            )}

            <div
              className="d-flex"
              style={{
                marginTop: 25,
                width: "100%",
                justifyContent: "center",
              }}
            >
              <div className="form-control-input">
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={() => (dummy ? dummyTrips() : generateTrips())}
                >
                  {dummy ? "Generate Dummy Trips" : "Generate Trips"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ConfirmationModal pass={passFlag} onClose={onClose} />
      )}
      {loading ? (
        <div
          style={{
            position: "absolute",
            // backgroundColor: "pink",
            zIndex: "1",
            top: "55%",
            left: "50%",
          }}
        >
          <LoaderComponent />
        </div>
      ) : (
        " "
      )}
    </>
  );
};

export default GenerateTripModal;
