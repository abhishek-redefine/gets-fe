import React, { useEffect, useState } from "react";
import Grid from "../grid";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Autocomplete,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import OfficeService from "@/services/office.service";
import { getFormattedLabel } from "@/utils/utils";
import RoutingService from "@/services/route.service";
import { toggleToast } from "@/redux/company.slice";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import MasterDataService from "@/services/masterdata.service";
import {
  validationSchemaBus,
  validationSchemaShuttle,
} from "./busShuttleRoute/validationSchema.js";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs from "dayjs";
import BookingService from "@/services/booking.service";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  height: 600,
  borderRadius: 5,
};

const BusShuttleRoute = () => {
  const headers = [
    {
      key: "officeId",
      display: "Office ID",
    },
    {
      key: "areaId",
      display: "Area Id",
    },
    {
      key: "areaName",
      display: "Area Name",
    },
    {
      key: "distance",
      display: "Distance",
    },
    {
      key: "hamburgerMenu",
      html: (
        <>
          <span className="material-symbols-outlined">more_vert</span>
        </>
      ),
      navigation: true,
      menuItems: [
        {
          display: "Enable",
          key: "activate",
        },
        {
          display: "Disable",
          key: "deactivate",
        },
      ],
    },
  ];
  const [offices, setOffice] = useState([]);
  const [routeTypes, setRouteTypes] = useState(["Bus Route", "Shuttle Route"]);
  const [routeType, setRouteType] = useState("Bus Route");
  const [routeFlag, setRouteFlag] = useState("");
  const [busRoutes, setBusRoutes] = useState([]);
  const [shuttleRoutes, setShuttleRoutes] = useState([]);
  const [shiftTypes, setShiftTypes] = useState([]);
  const [searchValues, setSearchValues] = useState({
    officeId: "",
    date: "",
    shiftType: "",
  });
  const [initialValues, setInitialValues] = useState({
    busRouteOfficeId: "",
    busRouteName: "",
    busRouteShiftType: "",
    busRouteShiftTime: "",
    busRouteStartingPoint: "",
    busRouteEndPoint: "",
    busRouteMiddlePointCount: 0,
    busRouteSeatCount: 0,
    busRouteReportingTime: "00:00",
    busRouteMiddlePoint: "",
    busRouteEnable: true,
    shuttleRouteOfficeId: "",
    shuttleRouteName: "",
    shuttleRouteShiftType: "",
    shuttleRouteShiftTime: "",
    shuttleRouteStartingPoint: "",
    shuttleRouteEndPoint: "",
    shuttleRouteReportingTime: "",
    shuttleRouteSeatCount: 0,
    shuttleRouteEnable: true,
  });
  const [busReportingTime, setBusReportingTime] = useState("00:00");
  const [loginShiftTime, setLoginShiftTime] = useState([]);
  const [logoutShiftTime, setLogoutShiftTime] = useState([]);
  const [shiftTime, setShiftTime] = useState([]);
  const [nodalPoint, setNodalPoint] = useState([]);
  const [busStartingPoint, setBusStartingPoint] = useState("");
  const [busEndPoint, setBusEndPoint] = useState("");
  const [shiftTypeFlag, setShiftTypeFlag] = useState(true);
  const [shiftType, setShiftType] = useState();
  const [step, setStep] = useState(0);
  const [routeName, setRouteName] = useState("");
  const [searchedNodalPoints, setSearchedNodalPoints] = useState([]);
  const [openSearchNodalPoint, setOpenSearchNodalPoint] = useState(false);
  const [startingReportingTime, setStartingReportingTime] = useState("00:00");
  const [middlePoints, setMiddlePoints] = useState([]);

  const addClickHandler = () => {
    setMiddlePoints([...middlePoints, "Hello"]);
  };

  const searchForMiddlePoint = async () => {
    console.log(hello);
  };

  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: () => {
    //   if (routeFlag === "Bus") {
    //     return validationSchemaBus;
    //   } else if (routeFlag === "Shuttle") {
    //     return validationSchemaShuttle;
    //   }
    // },
    onSubmit: async (values) => {
      if (routeFlag === "Bus") {
        console.log(values);
        setRouteName(values.busRouteName);
        setStep(1);
      } else {
        console.log(values);
      }
    },
  });

  const { errors, touched, values, handleChange, handleSubmit, handleReset } =
    formik;

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    let newSearchValues = { ...searchValues };
    newSearchValues[name] = value;
    setSearchValues(newSearchValues);
  };

  const [openModal, setOpenModal] = useState(false);
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => {
    setInitialValues({
      ...initialValues,
      ["busRouteOfficeId"]: "",
      ["shuttleRouteOfficeId"]: "",
    });
    setShiftType("");
    setBusEndPoint("");
    setBusStartingPoint("");
    handleReset();
    setStep(0);
    setMiddlePoints([]);
    setBusReportingTime("00:00");
    setOpenModal(false);
  };

  const busRouteHandler = () => {
    setRouteFlag("Bus");
    handleModalOpen();
  };

  const shuttleRouteHandler = () => {
    setRouteFlag("Shuttle");
    handleModalOpen();
  };

  const fetchAllOffices = async () => {
    try {
      const response = await OfficeService.getAllOffices();
      const { data } = response || {};
      const { clientOfficeDTO } = data || {};
      setOffice(clientOfficeDTO);
    } catch (e) {}
  };

  const fetchMasterData = async () => {
    try {
      const shiftResponse = await MasterDataService.getMasterData("ShiftType");
      const { data } = shiftResponse || {};
      setShiftTypes(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllBusRoute = async () => {
    try {
      const response = await RoutingService.getAllBusRoute();
      const { data } = response || {};
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllShuttleRoute = async () => {
    try {
      const response = await RoutingService.getAllShuttleRoute();
      const { data } = response || {};
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  const changeOfficeHandler = (event) => {
    const { target } = event;
    const { name, value } = target;
    console.log(name, value);
    setInitialValues({ ...initialValues, [name]: value });
    getShiftTimeInOut(value);
    fetchAllNodalPoints(value);
    handleChange(event);
  };

  const getShiftTimeInOut = async (officeId) => {
    try {
      const pagination = {
        page: 0,
        size: 100,
      };
      const params = new URLSearchParams(pagination);
      const loginSearchBean = {
        officeId: officeId,
        shiftTypes: "LOGIN",
        transportType: "BUS",
      };
      const logoutSearchBean = {
        officeId: officeId,
        shiftTypes: "LOGOUT",
        transportType: "BUS",
      };
      const responseShiftIn = await BookingService.getLoginLogoutTimeByBean(
        params.toString(),
        loginSearchBean
      );
      const responseShiftOut = await BookingService.getLoginLogoutTimeByBean(
        params.toString(),
        logoutSearchBean
      );
      console.log(responseShiftIn.data.data);
      setLoginShiftTime(responseShiftIn.data.data);
      console.log(responseShiftOut.data.data);
      setLogoutShiftTime(responseShiftOut.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getShiftTime = (event) => {
    const { target } = event;
    const { name, value } = target;
    console.log(name, value);
    if (value === "LOGIN") {
      setShiftTime(loginShiftTime);
      setBusEndPoint(initialValues.busRouteOfficeId);
      setBusStartingPoint("");
    } else {
      setShiftTime(logoutShiftTime);
      setBusEndPoint("");
      setBusStartingPoint(initialValues.busRouteOfficeId);
    }
    setShiftType(value);
    //getShiftTime();
    handleChange(event);
  };

  const fetchAllNodalPoints = async (officeId) => {
    try {
      const pagination = {
        page: 0,
        size: 100,
      };
      const params = new URLSearchParams(pagination);
      const searchValues = {
        officeId: officeId,
      };
      const response = await RoutingService.getAllNodalPoints(
        params.toString(),
        searchValues
      );
      console.log(response.data.data);
      var modifiedList = [];
      const list = response.data.data;
      list.map((val) => modifiedList.push(val.name));
      setNodalPoint(modifiedList);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMasterData();
    fetchAllOffices();
    fetchAllBusRoute();
    fetchAllShuttleRoute();
  }, []);

  return (
    <div className="internalSettingContainer">
      <div className="gridContainer">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="filterContainer">
            <div style={{ minWidth: "180px" }} className="form-control-input">
              <FormControl fullWidth>
                <InputLabel id="primary-office-label">Office Id</InputLabel>
                <Select
                  style={{ width: "180px" }}
                  labelId="primary-office-label"
                  id="officeId"
                  value={searchValues.officeId}
                  name="officeId"
                  label="Office ID"
                  onChange={handleFilterChange}
                >
                  {!!offices?.length &&
                    offices.map((office, idx) => (
                      <MenuItem key={idx} value={office.officeId}>
                        {getFormattedLabel(office.officeId)}, {office.address}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
            <div className="form-control-input">
              <InputLabel htmlFor="End-date">Date</InputLabel>
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  name="bookingDate"
                  format={"DD-MM-YYYY"}
                  value={
                    searchValues.bookingDate
                      ? moment(searchValues.bookingDate)
                      : null
                  }
                  onChange={(e) => console.log(e)}
                />
              </LocalizationProvider>
            </div>
            <div style={{ minWidth: "180px" }} className="form-control-input">
              <FormControl fullWidth>
                <InputLabel id="route-type-label">Route Type</InputLabel>
                <Select
                  style={{ width: "180px" }}
                  labelId="route-type-label"
                  id="routeType"
                  value={routeType}
                  name="routeType"
                  label="Route Type"
                  onChange={(e) => setRouteType(e.target.value)}
                >
                  {!!routeTypes?.length &&
                    routeTypes.map((route, idx) => (
                      <MenuItem key={idx} value={route}>
                        {route}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
            <div style={{ minWidth: "180px" }} className="form-control-input">
              <FormControl fullWidth>
                <InputLabel id="shift-type-label">Shift Type</InputLabel>
                <Select
                  style={{ width: "180px" }}
                  labelId="shift-type-label"
                  id="shiftType"
                  value={searchValues.shiftType}
                  name="shiftType"
                  label="Shift Type"
                  onChange={handleFilterChange}
                >
                  {!!shiftTypes?.length &&
                    shiftTypes.map((shift, idx) => (
                      <MenuItem key={idx} value={shift.value}>
                        {shift.displayName}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
            <div className="form-control-input" style={{ minWidth: "70px" }}>
              <button
                type="submit"
                onClick={() => console.log("clicked")}
                className="btn btn-primary filterApplyBtn"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "end" }}>
          <div className="form-control-input">
            <button onClick={busRouteHandler} className="btn btn-primary">
              Add Bus Route
            </button>
          </div>
          <div className="form-control-input">
            <button onClick={shuttleRouteHandler} className="btn btn-primary">
              Add Shuttle Route
            </button>
          </div>
        </div>
        <Grid headers={headers} />
        <Modal
          open={openModal}
          onClose={handleModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            {routeFlag === "Bus" ? (
              <>
                {step === 0 && (
                  <div style={{ padding: "20px" }}>
                    <div style={{ margin: "20px" }}>
                      <h4>Add Bus Route</h4>
                    </div>
                    <div style={{ display: "flex" }}>
                      <div style={{ padding: "10px 20px", width: "50%" }}>
                        <FormControl fullWidth>
                          <InputLabel id="primary-office-label">
                            Office Id
                          </InputLabel>
                          <Select
                            required
                            labelId="primary-office-label"
                            id="officeId"
                            value={values.busRouteOfficeId}
                            error={
                              touched.busRouteOfficeId &&
                              Boolean(errors.busRouteOfficeId)
                            }
                            name="busRouteOfficeId"
                            label="Office ID"
                            onChange={(e) => changeOfficeHandler(e)}
                          >
                            {!!offices?.length &&
                              offices.map((office, idx) => (
                                <MenuItem key={idx} value={office.officeId}>
                                  {getFormattedLabel(office.officeId)},{" "}
                                  {office.address}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </div>
                      <div style={{ padding: "10px 20px", width: "50%" }}>
                        <FormControl fullWidth>
                          <TextField
                            error={
                              touched.busRouteName &&
                              Boolean(errors.busRouteName)
                            }
                            onChange={handleChange}
                            required
                            id="busRouteName"
                            name="busRouteName"
                            label="Bus Route Name"
                            variant="outlined"
                            value={values.busRouteName}
                          />
                        </FormControl>
                      </div>
                    </div>
                    <div style={{ display: "flex" }}>
                      <div style={{ padding: "10px 20px", width: "50%" }}>
                        <FormControl fullWidth>
                          <InputLabel id="shift-type-label">
                            Shift Type
                          </InputLabel>
                          <Select
                            disabled={initialValues.busRouteOfficeId === ""}
                            required
                            labelId="shift-type-label"
                            id="busRouteShiftType"
                            value={values.busRouteShiftType}
                            error={
                              touched.busRouteShiftType &&
                              Boolean(errors.busRouteShiftType)
                            }
                            name="busRouteShiftType"
                            label="Shift Type"
                            onChange={(e) => {
                              getShiftTime(e);
                              setShiftTypeFlag(false);
                            }}
                          >
                            {!!shiftTypes?.length &&
                              shiftTypes.map((shift, idx) => (
                                <MenuItem key={idx} value={shift.value}>
                                  {shift.displayName}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </div>
                      <div style={{ padding: "10px 20px", width: "50%" }}>
                        <FormControl fullWidth>
                          <InputLabel id="busRouteShiftTime-label">
                            Shift Time
                          </InputLabel>
                          <Select
                            required
                            labelId="busRouteShiftTime-label"
                            id="busRouteShiftTime"
                            value={values.busRouteShiftTime}
                            error={
                              touched.busRouteShiftTime &&
                              Boolean(errors.busRouteShiftTime)
                            }
                            name="busRouteShiftTime"
                            label="Shift Time"
                            onChange={handleChange}
                          >
                            {!!shiftTime?.length &&
                              shiftTime.map((shift, idx) => (
                                <MenuItem key={idx} value={shift.shiftTime}>
                                  {shift.shiftTime}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      </div>
                    </div>
                    <div style={{ display: "flex" }}>
                      <div style={{ padding: "10px 20px", width: "50%" }}>
                        {shiftType === "LOGOUT" ? (
                          <FormControl fullWidth>
                            <TextField
                              error={
                                touched.busRouteStartingPoint &&
                                Boolean(errors.busRouteStartingPoint)
                              }
                              disabled={true}
                              onChange={handleChange}
                              required
                              id="busRouteStartingPointText"
                              name="busRouteStartingPointText"
                              label="Starting Point"
                              variant="outlined"
                              value={initialValues.busRouteOfficeId}
                            />
                          </FormControl>
                        ) : (
                          <FormControl fullWidth>
                            <InputLabel id="busRouteStartingPoint-label">
                              Starting Point
                            </InputLabel>
                            <Select
                              disabled={shiftTypeFlag || shiftType != "LOGIN"}
                              labelId="busRouteStartingPoint-label"
                              id="busRouteStartingPoint"
                              value={busStartingPoint}
                              error={
                                touched.busRouteStartingPoint &&
                                Boolean(errors.busRouteStartingPoint)
                              }
                              name="busRouteStartingPoint"
                              label="busRouteStartingPoint"
                              onChange={(e) =>
                                setBusStartingPoint(e.target.value)
                              }
                            >
                              {!!nodalPoint?.length &&
                                nodalPoint.map((point, idx) => (
                                  <MenuItem key={idx} value={point}>
                                    {point}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        )}
                      </div>
                      <div style={{ padding: "10px 20px", width: "50%" }}>
                        {shiftType === "LOGIN" ? (
                          <FormControl fullWidth>
                            <TextField
                              error={
                                touched.busRouteEndPoint &&
                                Boolean(errors.busRouteEndPoint)
                              }
                              disabled={shiftTypeFlag || shiftType != "LOGOUT"}
                              onChange={handleChange}
                              required
                              id="busRouteEndPoint"
                              name="busRouteEndPoint"
                              label="End Point"
                              variant="outlined"
                              value={initialValues.busRouteOfficeId}
                            />
                          </FormControl>
                        ) : (
                          <FormControl fullWidth>
                            <InputLabel id="busRouteEndPoint-label">
                              End Point
                            </InputLabel>
                            <Select
                              disabled={shiftTypeFlag || shiftType != "LOGOUT"}
                              labelId="busRouteEndPoint-label"
                              id="busRouteEndPoint"
                              value={busEndPoint}
                              error={
                                touched.busRouteEndPoint &&
                                Boolean(errors.busRouteEndPoint)
                              }
                              name="busRouteEndPoint"
                              label="busRouteEndPoint"
                              onChange={(e) => setBusEndPoint(e.target.value)}
                            >
                              {!!nodalPoint?.length &&
                                nodalPoint.map((point, idx) => (
                                  <MenuItem key={idx} value={point}>
                                    {point}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        )}
                      </div>
                    </div>
                    <div style={{ display: "flex" }}>
                      <div style={{ padding: "10px 20px", width: "50%" }}>
                        <FormControl fullWidth>
                          <TextField
                            error={
                              touched.busRouteMiddlePointCount &&
                              Boolean(errors.busRouteMiddlePointCount)
                            }
                            type="number"
                            onChange={handleChange}
                            required
                            id="busRouteMiddlePointCount"
                            name="busRouteMiddlePointCount"
                            label="Middle Point Count"
                            variant="outlined"
                            value={values.busRouteMiddlePointCount}
                          />
                        </FormControl>
                      </div>
                      <div style={{ padding: "10px 20px", width: "50%" }}>
                        <FormControl fullWidth>
                          <TextField
                            error={
                              touched.busRouteSeatCount &&
                              Boolean(errors.busRouteSeatCount)
                            }
                            type="number"
                            onChange={handleChange}
                            required
                            id="busRouteSeatCount"
                            name="busRouteSeatCount"
                            label="Total no. of Seats"
                            variant="outlined"
                            value={values.busRouteSeatCount}
                          />
                        </FormControl>
                      </div>
                    </div>
                    <div style={{ display: "flex" }}>
                      <div style={{ padding: "10px 20px", width: "50%" }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimeField
                            fullWidth
                            label="Reporting Time"
                            value={dayjs()
                              .hour(
                                Number(
                                  initialValues.busRouteReportingTime.slice(
                                    0,
                                    2
                                  )
                                )
                              )
                              .minute(
                                Number(
                                  initialValues.busRouteReportingTime.slice(
                                    3,
                                    5
                                  )
                                )
                              )}
                            format="HH:mm"
                            onChange={(e) => {
                              var ReportingTime = e.$d
                                .toLocaleTimeString("it-IT")
                                .slice(0, -3);
                              setInitialValues({
                                ...initialValues,
                                busRouteReportingTime: ReportingTime,
                              });
                              setBusReportingTime(ReportingTime);
                            }}
                          />
                        </LocalizationProvider>
                      </div>
                    </div>
                    <div
                      className="form-control-input"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <div className="form-control-input" style={{ margin: 0 }}>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={handleSubmit}
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                {step === 1 && (
                  <div style={{ padding: "20px" }}>
                    <div style={{ margin: "20px" }}>
                      <h4>Add Middle Point in Bus Route</h4>
                    </div>
                    <div className="d-flex">
                      <div
                        style={{
                          margin: "0 20px",
                          padding: "5px 20px",
                          backgroundColor: "#F6CE47",
                        }}
                      >
                        <h4>Route Name - {routeName}</h4>
                      </div>
                    </div>
                    <div className="d-flex">
                      <div style={{ padding: "10px 20px", width: "50%" }}>
                        <FormControl variant="outlined" fullWidth>
                          <Autocomplete
                            disablePortal
                            id="search-middle-point"
                            options={searchedNodalPoints}
                            autoComplete
                            open={openSearchNodalPoint}
                            onOpen={() => {
                              setOpenSearchNodalPoint(true);
                            }}
                            onClose={() => {
                              setOpenSearchNodalPoint(false);
                            }}
                            onChange={(e, val) =>
                              onChangeHandler(val, "team", "teamId")
                            }
                            getOptionKey={(mp) => mp.nodalPointId}
                            getOptionLabel={(mp) => mp.nodalPointName}
                            freeSolo
                            name="middlePoint"
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Search Middle Point"
                                onChange={searchForMiddlePoint}
                              />
                            )}
                          />
                        </FormControl>
                      </div>
                      <div style={{ padding: "10px 20px", width: "30%" }}>
                        <button
                          className="btn btn-primary"
                          onClick={addClickHandler}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    <div
                      className="d-flex"
                      style={{
                        margin: "0 20px",
                        padding: "10px 20px",
                        backgroundColor: "#E4E4E4",
                        borderRadius: "5px",
                        width: "80%",
                      }}
                    >
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <h5>Starting Point</h5>
                      </div>
                      <div style={{ margin: "0 30px" }}>
                        <h5>{busStartingPoint}</h5>
                      </div>
                      <div style={{ width: "25%" }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimeField
                            id="startingReportingTime"
                            format="HH:mm"
                            value={dayjs()
                              .hour(Number(startingReportingTime.slice(0, 2)))
                              .minute(
                                Number(startingReportingTime.slice(3, 5))
                              )}
                            InputProps={{
                              style: {
                                padding: 0,
                              },
                            }}
                            inputProps={{
                              style: {
                                padding: "0 10px",
                                backgroundColor: "#FFF",
                                borderRadius: "4px",
                                //fontSize: "12px",
                              },
                              //placeholder: "Reporting Time",
                            }}
                            onChange={(e) => {
                              var StartingReportingTime = e.$d
                                .toLocaleTimeString("it-IT")
                                .slice(0, -3);
                              console.log(StartingReportingTime);
                              setStartingReportingTime(StartingReportingTime);
                            }}
                          ></TimeField>
                        </LocalizationProvider>
                      </div>
                    </div>
                    <div className="d-flex" style={{ margin: "10px 20px" }}>
                      <div
                        style={{
                          border: "1px solid #DEDFDF",
                          width: "90%",
                          borderRadius: "5px",
                          padding: "10px 20px",
                          height: "200px",
                          overflowY: "scroll",
                        }}
                      >
                        <div className="d-flex">
                          <div>
                            <h5>Middle Point</h5>
                          </div>
                          <div style={{ margin: "0 100px" }}>
                            <h5>Reporting Time</h5>
                          </div>
                        </div>
                        {middlePoints.length > 0 &&
                          middlePoints.map((item, index) => (
                            <div
                              className="d-flex"
                              key={index}
                              style={{ margin: "5px 0" }}
                            >
                              <div
                                className="d-flex"
                                style={{ alignItems: "center", width: "150px" }}
                              >
                                <p style={{ fontSize: "0.83em" }}>
                                  {`${index + 1}. ${item}`}
                                </p>
                              </div>
                              <div style={{ margin: "0 30px", width: "25%" }}>
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <TimeField
                                    id="startingReportingTime"
                                    format="HH:mm"
                                    value={dayjs()
                                      .hour(
                                        Number(
                                          startingReportingTime.slice(0, 2)
                                        )
                                      )
                                      .minute(
                                        Number(
                                          startingReportingTime.slice(3, 5)
                                        )
                                      )}
                                    InputProps={{
                                      style: {
                                        padding: 0,
                                      },
                                    }}
                                    inputProps={{
                                      style: {
                                        padding: "0 10px",
                                        backgroundColor: "#FFF",
                                        borderRadius: "4px",
                                        //fontSize: "12px",
                                      },
                                      //placeholder: "Reporting Time",
                                    }}
                                    onChange={(e) => {
                                      var StartingReportingTime = e.$d
                                        .toLocaleTimeString("it-IT")
                                        .slice(0, -3);
                                      console.log(StartingReportingTime);
                                      setStartingReportingTime(
                                        StartingReportingTime
                                      );
                                    }}
                                  ></TimeField>
                                </LocalizationProvider>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div
                      className="d-flex"
                      style={{
                        margin: "0 20px",
                        padding: "10px 20px",
                        backgroundColor: "#E4E4E4",
                        borderRadius: "5px",
                        width: "80%",
                      }}
                    >
                      <div>
                        <h5>Destination</h5>
                      </div>
                      <div style={{ margin: "0 30px" }}>
                        <h5>{busEndPoint}</h5>
                      </div>
                      <div>
                        <h5>{busReportingTime}</h5>
                      </div>
                    </div>
                    <div
                      className="form-control-input"
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <div className="form-control-input" style={{ margin: 0 }}>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          onClick={handleSubmit}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <p>Shuttle Route</p>
              </>
            )}
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default BusShuttleRoute;
