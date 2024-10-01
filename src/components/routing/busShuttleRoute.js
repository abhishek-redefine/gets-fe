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
import LoaderComponent from "../loader";

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
      key: "name",
      display: "Bus Route Name",
    },
    {
      key: "startingPoint",
      display: "Starting Point",
    },
    {
      key: "endPoint",
      display: "End Point",
    },
    {
      key: "middlePointCount",
      display: "Middle Point Count",
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
  const headersShuttle = [
    {
      key: "officeId",
      display: "Office ID",
    },
    {
      key: "name",
      display: "Shuttle Route Name",
    },
    {
      key: "startingPoint",
      display: "Starting Point",
    },
    {
      key: "endPoint",
      display: "End Point",
    },
    // {
    //   key: "middlePointCount",
    //   display: "Middle Point Count",
    // },
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
  const [busSPError, setBusSPError] = useState(false);
  const [busEPError, setBusEPError] = useState(false);
  const [shuttleSPError, setShuttleSPError] = useState(false);
  const [shuttleEPError, setShuttleEPError] = useState(false);

  const [busReportingTime, setBusReportingTime] = useState("00:00");
  const [shuttleReportingTime, setShuttleReportingTime] = useState("00:00");
  const [loginShiftTime, setLoginShiftTime] = useState([]);
  const [logoutShiftTime, setLogoutShiftTime] = useState([]);
  const [shiftTime, setShiftTime] = useState([]);
  const [nodalPoint, setNodalPoint] = useState([]);
  const [busStartingPoint, setBusStartingPoint] = useState("");
  const [busEndPoint, setBusEndPoint] = useState("");
  const [shuttleStartingPoint, setShuttleStartingPoint] = useState("");
  const [shuttleEndPoint, setShuttleEndPoint] = useState("");
  const [shiftTypeFlag, setShiftTypeFlag] = useState(true);
  const [shiftType, setShiftType] = useState();
  const [step, setStep] = useState(0);
  const [routeName, setRouteName] = useState("");
  const [searchedNodalPoints, setSearchedNodalPoints] = useState([]);
  const [searchedNodalPointValue, setSearchedNodalPointValue] = useState("");
  const [openSearchNodalPoint, setOpenSearchNodalPoint] = useState(false);
  const [startingReportingTime, setStartingReportingTime] = useState("00:00");
  const [middlePoints, setMiddlePoints] = useState([]);
  const [middlePointCount, setMiddlePointCount] = useState(0);
  const [middlePointJson, setMiddlePointJson] = useState([]);
  const [busRouteId, setBusRouteId] = useState();
  const [busRoutingListing, setBusRoutingLisiting] = useState([]);
  const [shuttleRoutingListing, setShuttleRoutingListing] = useState([]);
  const [paginationDataBus, setPaginationDataBus] = useState();
  const [paginationDataShuttle, setPaginationDataShuttle] = useState()
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
  });
  const [busEPReportingTime, setBusEPReportingTime] = useState("00:00");
  const [loading, setLoading] = useState(false);

  const addClickHandler = () => {
    setMiddlePointCount(middlePointCount - 1);
    setMiddlePoints([...middlePoints, searchedNodalPointValue]);
    const json = {
      middlePoint: searchedNodalPointValue,
      reportingTime: "00:00",
    };
    setMiddlePointJson([...middlePointJson, json]);
    setSearchedNodalPointValue("");
  };

  const reportingTimeChangeHandler = (value, index) => {
    var previousValue = [...middlePointJson];
    previousValue[index].reportingTime = value;
    setMiddlePointJson(previousValue);
    console.log(previousValue, index);
  };

  const searchForMiddlePoint = async (event) => {
    const { target } = event;
    const { value } = target;
    try {
      setSearchedNodalPoints([
        {
          nodalId: "1",
          nodalName: "New",
        },
        {
          nodalId: "2",
          nodalName: "Noida",
        },
      ]);
      const response = await RoutingService.autoSuggestNodalPoints(value);
      console.log(response);
      const { data } = response || {};
      setSearchedNodalPoints(data);
    } catch (err) {
      console.log(err);
    }
  };

  //>>>>>>>>>>>>FORMIK
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: () => {
      if (routeFlag === "Bus") {
        return validationSchemaBus;
      } else if (routeFlag === "Shuttle") {
        return validationSchemaShuttle;
      }
    },
    onSubmit: async (values) => {
      if (routeFlag === "Bus") {
        if (busStartingPoint === "" || busEndPoint === "") {
          console.log(busStartingPoint, "endpoint>>>", busEndPoint);
          busStartingPoint === "" ? setBusSPError(true) : setBusSPError(true);
          busEndPoint === "" ? setBusEPError(true) : setBusEPError(false);
          return;
        }
        var busRouteDTO = {
          busRouteDTO: {
            name: values.busRouteName,
            officeId: values.busRouteOfficeId,
            shiftTime: values.busRouteShiftTime,
            shiftType: values.busRouteShiftType,
            startingPoint: busStartingPoint,
            endPoint: busEndPoint,
            reportingTime: busReportingTime,
            seatCount: values.busRouteSeatCount,
            enabled: true,
            middlePointCount: values.busRouteMiddlePointCount,
            middlePoint: "",
          },
        };
        try {
          if (step === 0) {
            console.log(values);
            console.log(busRouteDTO);
            setLoading(true);
            // await new Promise((resolve) => setTimeout(resolve, 5000));
            const response = await RoutingService.createBusRouting(busRouteDTO);
            if (response.status === 201) {
              console.log(response.data.busRouteDTO.id);
              setBusRouteId(response.data.busRouteDTO.id);
            }
            setRouteName(values.busRouteName);
            setMiddlePointCount(values.busRouteMiddlePointCount);
            const json = {
              middlePoint: busStartingPoint,
              reportingTime: busReportingTime,
            };
            shiftType === "LOGOUT" &&
              (json.reportingTime = values.busRouteShiftTime);
            setMiddlePointJson([...middlePointJson, json]);
            setStep(1);
          } else if (step === 1) {
            var middlePoint = [...middlePointJson];
            if (shiftType === "LOGIN") {
              middlePoint.push({
                middlePoint: busEndPoint,
                reportingTime: values.busRouteShiftTime,
              });
            } else {
              middlePoint.push({
                middlePoint: busEndPoint,
                reportingTime: busEPReportingTime,
              });
            }
            var stringMiddlePoint = middlePoint.map((obj) =>
              JSON.stringify(obj)
            );
            busRouteDTO.busRouteDTO.middlePoint = stringMiddlePoint.join(",");
            busRouteDTO.busRouteDTO.id = busRouteId;
            console.log(busRouteDTO);
            setLoading(true);
            // await new Promise((resolve) => setTimeout(resolve, 5000));
            const response = await RoutingService.updateBusRouting(busRouteDTO);
            console.log(response);
            setRouteType("Bus Route");
            handleModalClose();
          }
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      } else {
        if (shuttleStartingPoint === "" || shuttleEndPoint === "") {
          shuttleStartingPoint === ""
            ? setShuttleSPError(true)
            : setShuttleSPError(true);
          shuttleEndPoint === ""
            ? setShuttleEPError(true)
            : setShuttleEPError(false);
          return;
        }
        var shuttleRouteDTO = {
          shuttleRouteDTO: {
            name: values.shuttleRouteName,
            officeId: values.shuttleRouteOfficeId,
            shiftTime: values.shuttleRouteShiftTime,
            shiftType: values.shuttleRouteShiftType,
            startingPoint: shuttleStartingPoint,
            endPoint: shuttleEndPoint,
            startingTime: shuttleReportingTime,
            seatCount: values.shuttleRouteSeatCount,
            enabled: true,
          },
        };
        console.log(shuttleRouteDTO);
        try {
          setLoading(true);
          // await new Promise((resolve) => setTimeout(resolve, 5000));
          const response = await RoutingService.createShuttleRouting(
            shuttleRouteDTO
          );
          if (response.status === 201) {
            fetchAllShuttleRoute();
            setRouteType("Shuttle Route");
            handleModalClose();
          }
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
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
      ["busRouteReportingTime"]: "00:00",
      ["shuttleRouteReportingTime"]: "00:00",
    });
    setShiftType("");
    setBusEndPoint("");
    setBusStartingPoint("");
    setShuttleStartingPoint("");
    setShuttleEndPoint("");
    handleReset();
    setStep(0);
    setMiddlePoints([]);
    setBusReportingTime("00:00");
    setShuttleReportingTime("00:00");
    setBusEPError(false);
    setBusSPError(false);
    setShuttleEPError(false);
    setShuttleSPError(false);
    setMiddlePointJson([]);
    setBusEPReportingTime("00:00");
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
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      const response = await RoutingService.getAllBusRoute();
      const { data } = response || {};
      setBusRoutingLisiting(data.data);
      console.log(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const onMenuItemClick = (key, clickedItem) => {
    if (key === "deactivate") {
      console.log("disable");
      if (routeType === "Bus Route") {
        enableDisableBusRoute(clickedItem.id, false);
      } else {
        enableDisableShuttleRoute(clickedItem.id, false);
      }
    } else if (key === "activate") {
      if (routeType === "Bus Route") {
        enableDisableBusRoute(clickedItem.id, true);
      } else {
        enableDisableShuttleRoute(clickedItem.id, true);
      }
    }
  };
  const enableDisableShuttleRoute = async (id, flag) => {
    try {
      const response = await RoutingService.enableDisableShuttleRoute(id, flag);
      const { data } = response || {};
      console.log(data);
      fetchAllShuttleRoute();
    } catch (err) {
      console.log(err);
    }
  };
  const enableDisableBusRoute = async (id, flag) => {
    try {
      const response = await RoutingService.enableDisableBusRoute(id, flag);
      const { data } = response || {};
      console.log(data);
      fetchAllBusRoute();
    } catch (err) {
      console.log(err);
    }
  };
  const handlePageChange = (page) => {
    let updatedPagination = { ...pagination };
    updatedPagination.page = page;
    setPagination(updatedPagination);
  };

  const fetchAllShuttleRoute = async () => {
    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      const response = await RoutingService.getAllShuttleRoute();
      const { data } = response || {};
      console.log(data);
      console.log(data);
      setShuttleRoutingListing(data.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const changeOfficeHandler = (event) => {
    const { target } = event;
    const { name, value } = target;
    console.log(name, value);
    setInitialValues({ ...initialValues, [name]: value });
    if (routeFlag === "Bus") {
      getShiftTimeInOut(value, "BUS");
    } else {
      getShiftTimeInOut(value, "SHUTTLE");
    }
    fetchAllNodalPoints(value);
    handleChange(event);
  };

  const getShiftTimeInOut = async (officeId, transportType) => {
    try {
      const pagination = {
        page: 0,
        size: 100,
      };
      const params = new URLSearchParams(pagination);
      const loginSearchBean = {
        officeId: officeId,
        shiftType: "LOGIN",
        transportType: transportType,
      };
      const logoutSearchBean = {
        officeId: officeId,
        shiftType: "LOGOUT",
        transportType: transportType,
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
      if (routeFlag === "Shuttle") {
        setShuttleEndPoint(initialValues.shuttleRouteOfficeId);
        setShuttleStartingPoint("");
      } else {
        setBusEndPoint(initialValues.busRouteOfficeId);
        setBusStartingPoint("");
      }
    } else {
      setShiftTime(logoutShiftTime);
      if (routeFlag === "Shuttle") {
        setShuttleEndPoint("");
        setShuttleStartingPoint(initialValues.shuttleRouteOfficeId);
      } else {
        setBusEndPoint("");
        setBusStartingPoint(initialValues.busRouteOfficeId);
      }
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
        {routeType === "Bus Route" ? (
          <Grid
            headers={headers}
            listing={busRoutingListing}
            onMenuItemClick={onMenuItemClick}
            handlePageChange={handlePageChange}
            enableDisableRow={true}
            pagination={paginationDataBus}
            isLoading={loading}
          />
        ) : (
          <>
            <Grid
              headers={headersShuttle}
              listing={shuttleRoutingListing}
              onMenuItemClick={onMenuItemClick}
              handlePageChange={handlePageChange}
              enableDisableRow={true}
              pagination={paginationDataShuttle}
              isLoading={loading}
            />
          </>
        )}
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
                              disabled={true}
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
                              error={busSPError}
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
                              error={busEPError}
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
                              error={busEPError}
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
                            InputProps={{
                              inputProps: {
                                min: 0, // Optional: Set minimum value
                              },
                            }}
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
                            InputProps={{
                              inputProps: {
                                min: 0, // Optional: Set minimum value
                              },
                            }}
                          />
                        </FormControl>
                      </div>
                    </div>
                    <div style={{ display: "flex" }}>
                      <div style={{ padding: "10px 20px", width: "50%" }}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimeField
                            fullWidth
                            label="Starting Time"
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
                    <p style={{ padding: "5px 20px 0 20px" }}>
                      Midde Point Count - {middlePointCount}
                    </p>
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
                            onChange={(e, val) => {
                              console.log(val?.nodalName || "");
                              setSearchedNodalPointValue(val?.nodalName || "");
                            }}
                            getOptionKey={(mp) => mp.nodalId}
                            getOptionLabel={(mp) => mp.nodalName}
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
                          disabled={middlePointCount === 0 ? true : false}
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
                      <div
                        className="d-flex"
                        style={{ margin: "0 30px", alignItems: "center" }}
                      >
                        <h5>{busStartingPoint}</h5>
                      </div>
                      <div style={{ width: "25%" }}>
                        <h5>
                          {shiftType === "LOGIN"
                            ? busReportingTime
                            : values.busRouteShiftTime}
                        </h5>
                        {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <TimeField
                            disabled={shiftType === "LOGOUT" ? true : false}
                            id="startingReportingTime"
                            format="HH:mm"
                            value={dayjs()
                              .hour(
                                Number(
                                  middlePointJson[0].reportingTime.slice(0, 2)
                                )
                              )
                              .minute(
                                Number(
                                  middlePointJson[0].reportingTime.slice(3, 5)
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
                              reportingTimeChangeHandler(
                                StartingReportingTime,
                                0
                              );
                              //setStartingReportingTime(StartingReportingTime);
                            }}
                          ></TimeField>
                        </LocalizationProvider> */}
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
                                          middlePointJson[
                                            index + 1
                                          ].reportingTime.slice(0, 2)
                                        )
                                      )
                                      .minute(
                                        Number(
                                          middlePointJson[
                                            index + 1
                                          ].reportingTime.slice(3, 5)
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
                                      reportingTimeChangeHandler(
                                        StartingReportingTime,
                                        index + 1
                                      );
                                      // setStartingReportingTime(
                                      //   StartingReportingTime
                                      // );
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
                      <div className="d-flex" style={{ alignItems: "center" }}>
                        <h5>Destination</h5>
                      </div>
                      <div
                        className="d-flex"
                        style={{ margin: "0 30px", alignItems: "center" }}
                      >
                        <h5>{busEndPoint}</h5>
                      </div>
                      <div style={{ width: "25%" }}>
                        {shiftType === "LOGIN" ? (
                          <h5>{values.busRouteShiftTime}</h5>
                        ) : (
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <TimeField
                              disabled={shiftType === "LOGIN" ? true : false}
                              id="startingReportingTime"
                              format="HH:mm"
                              value={dayjs()
                                .hour(Number(busEPReportingTime.slice(0, 2)))
                                .minute(Number(busEPReportingTime.slice(3, 5)))}
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
                                setBusEPReportingTime(StartingReportingTime);
                              }}
                            ></TimeField>
                          </LocalizationProvider>
                        )}
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
                <div style={{ padding: "20px" }}>
                  <div style={{ margin: "20px" }}>
                    <h4>Add Shuttle Route</h4>
                  </div>
                  <div style={{ display: "flex" }}>
                    <div style={{ padding: "10px 20px", width: "50%" }}>
                      <FormControl fullWidth>
                        <InputLabel id="shuttle-primary-office-label">
                          Office Id
                        </InputLabel>
                        <Select
                          required
                          labelId="shuttle-primary-office-label"
                          id="shuttle-officeId"
                          value={values.shuttleRouteOfficeId}
                          error={
                            touched.shuttleRouteOfficeId &&
                            Boolean(errors.shuttleRouteOfficeId)
                          }
                          name="shuttleRouteOfficeId"
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
                            touched.shuttleRouteName &&
                            Boolean(errors.shuttleRouteName)
                          }
                          onChange={handleChange}
                          required
                          id="shuttleRouteName"
                          name="shuttleRouteName"
                          label="Shuttle Route Name"
                          variant="outlined"
                          value={values.shuttleRouteName}
                        />
                      </FormControl>
                    </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <div style={{ padding: "10px 20px", width: "50%" }}>
                      <FormControl fullWidth>
                        <InputLabel id="shuttle-shift-type-label">
                          Shift Type
                        </InputLabel>
                        <Select
                          disabled={initialValues.shuttleRouteOfficeId === ""}
                          required
                          labelId="shuttle-shift-type-label"
                          id="shuttleRouteShiftType"
                          value={values.shuttleRouteShiftType}
                          error={
                            touched.shuttleRouteShiftType &&
                            Boolean(errors.shuttleRouteShiftType)
                          }
                          name="shuttleRouteShiftType"
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
                        <InputLabel id="shuttleRouteShiftTime-label">
                          Shift Time
                        </InputLabel>
                        <Select
                          required
                          labelId="shuttleRouteShiftTime-label"
                          id="shuttleRouteShiftTime"
                          value={values.shuttleRouteShiftTime}
                          error={
                            touched.shuttleRouteShiftTime &&
                            Boolean(errors.shuttleRouteShiftTime)
                          }
                          name="shuttleRouteShiftTime"
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
                            error={shuttleSPError}
                            disabled={true}
                            onChange={handleChange}
                            required
                            id="shuttleRouteStartingPointText"
                            name="shuttleRouteStartingPointText"
                            label="Starting Point"
                            variant="outlined"
                            value={initialValues.shuttleRouteOfficeId}
                          />
                        </FormControl>
                      ) : (
                        <FormControl fullWidth>
                          <InputLabel id="shuttleRouteStartingPoint-label">
                            Starting Point
                          </InputLabel>
                          <Select
                            disabled={shiftTypeFlag || shiftType != "LOGIN"}
                            labelId="shuttleRouteStartingPoint-label"
                            id="shuttleRouteStartingPoint"
                            value={shuttleStartingPoint}
                            error={shuttleSPError}
                            name="shuttleRouteStartingPoint"
                            label="Shuttle Route Starting Point"
                            onChange={(e) =>
                              setShuttleStartingPoint(e.target.value)
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
                            error={shuttleEPError}
                            disabled={shiftTypeFlag || shiftType != "LOGOUT"}
                            onChange={handleChange}
                            required
                            id="shuttleRouteEndPointText"
                            name="shuttleRouteEndPointText"
                            label="End Point"
                            variant="outlined"
                            value={initialValues.shuttleRouteOfficeId}
                          />
                        </FormControl>
                      ) : (
                        <FormControl fullWidth>
                          <InputLabel id="shuttleRouteEndPoint-label">
                            End Point
                          </InputLabel>
                          <Select
                            disabled={shiftTypeFlag || shiftType != "LOGOUT"}
                            labelId="shuttleRouteEndPoint-label"
                            id="shuttleRouteEndPoint"
                            value={shuttleEndPoint}
                            error={shuttleEPError}
                            name="shuttleRouteEndPoint"
                            label="Shuttle Route End Point"
                            onChange={(e) => setShuttleEndPoint(e.target.value)}
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
                            touched.shuttleRouteSeatCount &&
                            Boolean(errors.shuttleRouteSeatCount)
                          }
                          onChange={handleChange}
                          required
                          id="shuttleRouteSeatCount"
                          name="shuttleRouteSeatCount"
                          label="Total no. of Seats"
                          variant="outlined"
                          value={values.shuttleRouteSeatCount}
                          type="number"
                          InputProps={{
                            inputProps: {
                              min: 0, // Optional: Set minimum value
                            },
                          }}
                        />
                      </FormControl>
                    </div>
                    <div style={{ padding: "10px 20px", width: "50%" }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimeField
                          fullWidth
                          label="Starting Time"
                          value={dayjs()
                            .hour(
                              Number(
                                initialValues.shuttleRouteReportingTime.slice(
                                  0,
                                  2
                                )
                              )
                            )
                            .minute(
                              Number(
                                initialValues.shuttleRouteReportingTime.slice(
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
                              shuttleRouteReportingTime: ReportingTime,
                            });
                            setShuttleReportingTime(ReportingTime);
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
                        Submit
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            {loading ? (
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
            )}
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default BusShuttleRoute;
