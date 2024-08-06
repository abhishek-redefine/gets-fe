import { DATE_FORMAT, MASTER_DATA_TYPES } from "@/constants/app.constants.";
import { setMasterData } from "@/redux/master.slice";
import MasterDataService from "@/services/masterdata.service";
import OfficeService from "@/services/office.service";
import RoleService from "@/services/role.service";
import { getFormattedLabel } from "@/utils/utils";
import {
  Autocomplete,
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { validationSchema } from "./employee/validationSchema";
import { toggleToast } from "@/redux/company.slice";
import moment from "moment";
import RoutingService from "@/services/route.service";
import GeocodeModal from "./geocodeModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  height: 550,
  borderRadius: 5,
};

const AddEmployee = ({ roleType, onUserSuccess, editEmployeeData }) => {
  const [openSearchTeam, setOpenSearchTeam] = useState(false);
  const [openSearchRM, setOpenSearchRM] = useState(false);
  const [openSearchZone, setOpenSearchZone] = useState(false);
  const [openSearchArea, setOpenSearchArea] = useState(false);
  const [openSearchNodalPoint, setOpenSearchNodalPoint] = useState(false);
  const [smsCheckbox, setSmsCheckbox] = useState(false);
  const [emailCheckbox, setEmailCheckbox] = useState(false);
  const [initialValues, setInitialValues] = useState({
    empId: "",
    name: "",
    gender: "",
    email: "",
    mob: "",
    altMob: "",
    primaryOfficeId: "",
    role: "",
    transportEligibilities: [],
    address: "",
    geoCode: "",
    landmark: "",
    nodal: "",
    areaName: "",
    zoneName: "",
    isAddHocBooking: null,
    mobAppAccess: null,
    notificationModes: [],
    profileStatus: null,
    team: "",
    reportingManager: "",
    costCenter: "",
    startDate: "",
    endDate: "",
    businessUnit: "",
    weekOff: [],
    specialStatus: "",
    pickupTime: null,
  });
  const [defaultRM, setDefaultRM] = useState({});

  useState(() => {
    if (editEmployeeData?.id) {
      console.log(editEmployeeData);
      if (typeof editEmployeeData.transportEligibilities === "string") {
        const transportString =
          editEmployeeData.transportEligibilities.split(",");
        editEmployeeData.transportEligibilities = transportString;
      }
      editEmployeeData.notificationModes.map((val, index) => {
        if (val === "SMS") {
          setSmsCheckbox(true);
        } else if (val === "EMAIL") {
          setEmailCheckbox(true);
        }
      });
      let newEditInfo = Object.assign(initialValues, editEmployeeData);
      setInitialValues(newEditInfo);
    }
  }, [editEmployeeData]);

  const handleResetField = () => {
    setEmailCheckbox(false);
    setSmsCheckbox(false);
    handleReset();
    formik.setFieldValue("notificationModes", []);
    formik.setFieldValue("transportEligibilities", []);
    formik.setFieldValue("weekOff", []);
    console.log(initialValues);
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      let allValues = { ...values };
      allValues.isManager = allValues.reportingManager ? false : true;
      if (allValues.isAddHocBooking) {
        allValues.isAddHocBooking = allValues.isAddHocBooking === "true";
      }
      if (allValues.mobAppAccess) {
        allValues.mobAppAccess = allValues.mobAppAccess === "true";
      }
      if (allValues.profileStatus) {
        allValues.profileStatus = allValues.profileStatus === "1" ? 1 : 0;
      }
      Object.keys(allValues).forEach((objKey) => {
        if (allValues[objKey] === null || allValues[objKey] === "") {
          delete allValues[objKey];
        }
      });
      try {
        var transportString = "";
        allValues.transportEligibilities.map((item) => {
          transportString += item + ",";
        });
        const payload = {
          empId: allValues.empId,
          name: allValues.name,
          gender: allValues.gender,
          email: allValues.email,
          mob: allValues.mob,
          altMob: allValues.altMob,
          primaryOfficeId: allValues.primaryOfficeId,
          role: allValues.role,
          transportEligibilities: transportString.slice(0, -1),
          address: allValues.address,
          geoCode: allValues.geoCode,
          isAddHocBooking: allValues.isAddHocBooking,
          mobAppAccess: allValues.mobAppAccess,
          notificationModes: allValues.notificationModes,
          profileStatus: allValues.profileStatus,
          team: allValues.team,
          reportingManager: allValues.reportingManager,
          costCenter: allValues.costCenter,
          startDate: allValues.startDate,
          endDate: allValues.endDate,
          businessUnit: allValues.businessUnit,
          weekOff: allValues.weekOff,
          specialStatus: allValues.specialStatus,
          enabled: true,
          isManager: allValues.reportingManager ? false : true,
          landmark: allValues.landmark,
          zoneName: allValues.zoneName,
          areaName: allValues.areaName,
          nodal: allValues.nodal,
          pickupTime: null,
        };
        //formik.setFieldValue('transportEligibilities',transportString.slice(0,-1));
        console.log(transportString.slice(0, -1));
        if (initialValues?.id) {
          await OfficeService.updateEmployee({
            employee: { ...initialValues, ...payload },
          });
          dispatch(
            toggleToast({
              message: "Employee updated successfully!",
              type: "success",
            })
          );
        } else {
          console.log(allValues.transportEligibilities);
          await OfficeService.createEmployee({ employee: payload });
          dispatch(
            toggleToast({
              message: "Employee added successfully!",
              type: "success",
            })
          );
        }
        onUserSuccess(true);
      } catch (e) {
        console.error(e);
        dispatch(
          toggleToast({
            message:
              e?.response?.data?.message ||
              "Error adding employee, please try again later!",
            type: "error",
          })
        );
      }
    },
  });

  const { errors, touched, values, handleChange, handleSubmit, handleReset } =
    formik;

  const {
    Gender: gender,
    TransportType: transportType,
    WeekDay: weekdays,
  } = useSelector((state) => state.master);
  const dispatch = useDispatch();
  const [roles, setRoles] = useState([]);
  const [offices, setOffice] = useState([]);
  const [searchedReportingManager, setSearchedReportingManager] = useState([]);
  const [searchedTeam, setSearchedTeam] = useState([]);
  const [searchedZone, setSearchedZone] = useState([]);
  const [searchedArea, setSearchedArea] = useState([]);
  const [searchedNodalPoints, setSearchedNodalPoints] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => {
    console.log("in close")
    setOpenModal(false);
  }
  const [coordinates, setCoordinates] = useState({ geoCode: "" });



  const fetchMasterData = async (type) => {
    try {
      const response = await MasterDataService.getMasterData(type);
      const { data } = response || {};
      if (data?.length) {
        dispatch(setMasterData({ data, type }));
      }
    } catch (e) {}
  };

  const getAllRolesByType = async () => {
    try {
      const response = await RoleService.getRolesByType(roleType);
      const { data } = response || {};
      setRoles(data);
    } catch (e) {}
  };

  const fetchAllOffices = async () => {
    try {
      const response = await OfficeService.getAllOffices();
      const { data } = response || {};
      const { clientOfficeDTO } = data || {};
      setOffice(clientOfficeDTO);
    } catch (e) {}
  };

  useEffect(() => {
    if (!gender?.length) {
      fetchMasterData(MASTER_DATA_TYPES.GENDER);
    }
    if (!transportType?.length) {
      fetchMasterData(MASTER_DATA_TYPES.TRANSPORT_TYPE);
    }
    if (!weekdays?.length) {
      fetchMasterData(MASTER_DATA_TYPES.WEEKDAY);
    }
    getAllRolesByType();
    fetchAllOffices();
  }, []);

  const handleArrChange = (e) => {
    const { target } = e || {};
    const { value, name } = target || {};
    let currentFormikValues = values[name];
    const valIdx = currentFormikValues.indexOf(value);
    if (valIdx > -1) {
      currentFormikValues.splice(valIdx, 1);
    } else {
      currentFormikValues.push(value);
    }
    console.log(currentFormikValues);
    formik.setFieldValue(name, currentFormikValues);
  };

  const searchForTeam = async (e) => {
    try {
      if (e.target.value) {
        const response = await OfficeService.searchTeam(e.target.value);
        const { data } = response || {};
        setSearchedTeam(data);
      } else {
        setSearchedTeam([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const searchForRM = async (e) => {
    try {
      if (e.target.value) {
        const response = await OfficeService.searchRM(e.target.value);
        const { data } = response || {};
        setSearchedReportingManager(data);
      } else {
        setSearchedReportingManager([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const searchForZone = async (e) => {
    try {
      if (e.target.value) {
        const response = await RoutingService.autoSuggestZone(e.target.value);
        const { data } = response || {};
        setSearchedZone(data);
      } else {
        setSearchedZone([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const searchForArea = async (e) => {
    try {
      if (e.target.value) {
        const response = await RoutingService.autoSuggestArea(
          e.target.value,
          values.zoneName
        );
        const { data } = response || {};
        setSearchedArea(data);
      } else {
        setSearchedArea([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const searchForMiddlePoint = async (event) => {
    const { target } = event;
    const { value } = target;
    try {
      const response = await RoutingService.autoSuggestNodalPoints(
        value,
        values.areaName
      );
      console.log(response);
      const { data } = response || {};
      setSearchedNodalPoints(data);
    } catch (err) {
      console.log(err);
    }
  };

  const onChangeHandler = (newValue, name, key) => {
    formik.setFieldValue(name, newValue?.[key] || "");
  };

  const handleDateChange = (date, name) => {
    const selectedDate = moment(date).format(DATE_FORMAT);
    if (selectedDate !== "Invalid date") {
      formik.setFieldValue(name, selectedDate);
    }
  };

  const handleGeocode = (geocode) => {
    console.log("Here in parent geocode: " + geocode);
    setCoordinates((prevValues) => ({
      ...prevValues,
      geoCode: geocode,
    }));
  };

  return (
    <div>
      <h4 className="pageSubHeading">
        {editEmployeeData?.id ? "Edit" : "Add"} Employee
      </h4>
      <div className="addUpdateFormContainer">
        <div>
          <div className="form-control-input">
            <TextField
              error={touched.empId && Boolean(errors.empId)}
              helperText={touched.empId && errors.empId}
              onChange={handleChange}
              required
              id="empId"
              name="empId"
              value={values.empId}
              label="Employee ID"
              variant="outlined"
            />
          </div>
          <div className="form-control-input">
            <TextField
              error={touched.name && Boolean(errors.name)}
              onChange={handleChange}
              helperText={touched.name && errors.name}
              required
              id="name"
              name="name"
              label="Name"
              variant="outlined"
              value={values.name}
            />
          </div>
          <div className="form-control-input">
            {!!gender?.length && (
              <FormControl required fullWidth>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender"
                  name="gender"
                  value={values.gender}
                  error={touched.gender && Boolean(errors.gender)}
                  label="Gender"
                  onChange={handleChange}
                >
                  {gender.map((g, idx) => (
                    <MenuItem key={idx} value={g.value}>
                      {getFormattedLabel(g.value)}
                    </MenuItem>
                  ))}
                </Select>
                {touched.gender && errors.gender && (
                  <FormHelperText className="errorHelperText">
                    {errors.gender}
                  </FormHelperText>
                )}
              </FormControl>
            )}
          </div>
          <div className="form-control-input">
            <TextField
              value={values.email}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              onChange={handleChange}
              required
              id="email"
              name="email"
              label="Email"
              variant="outlined"
            />
          </div>
        </div>
        <div>
          <div className="form-control-input">
            <TextField
              value={values.mob}
              error={touched.mob && Boolean(errors.mob)}
              helperText={touched.mob && errors.mob}
              name="mob"
              onChange={handleChange}
              required
              id="mob"
              label="Mobile No"
              variant="outlined"
            />
          </div>
          <div className="form-control-input">
            <TextField
              value={values.altMob}
              onChange={handleChange}
              error={touched.altMob && Boolean(errors.altMob)}
              helperText={touched.altMob && errors.altMob}
              name="altMob"
              id="altMob"
              label="Alternate Mobile No"
              variant="outlined"
            />
          </div>
          <div className="form-control-input">
            <FormControl required fullWidth>
              <InputLabel id="primary-office-label">Primary Office</InputLabel>
              <Select
                labelId="primary-office-label"
                id="primaryOfficeId"
                value={values.primaryOfficeId}
                error={
                  touched.primaryOfficeId && Boolean(errors.primaryOfficeId)
                }
                name="primaryOfficeId"
                label="Primary Office"
                onChange={handleChange}
              >
                {!!offices?.length &&
                  offices.map((office, idx) => (
                    <MenuItem key={idx} value={office.officeId}>
                      {getFormattedLabel(office.officeId)}, {office.address}
                    </MenuItem>
                  ))}
              </Select>
              {touched.primaryOfficeId && errors.primaryOfficeId && (
                <FormHelperText className="errorHelperText">
                  {errors.primaryOfficeId}
                </FormHelperText>
              )}
            </FormControl>
          </div>
          <div className="form-control-input">
            <FormControl required fullWidth>
              <InputLabel id="employee-role">Employee Role</InputLabel>
              <Select
                labelId="employee-role"
                id="role"
                value={values.role}
                error={touched.role && Boolean(errors.role)}
                name="role"
                label="Employee Role"
                onChange={handleChange}
              >
                {!!roles?.length &&
                  roles.map((role, idx) => (
                    <MenuItem key={idx} value={role.roleName}>
                      {role.displayName}
                    </MenuItem>
                  ))}
              </Select>
              {touched.role && errors.role && (
                <FormHelperText className="errorHelperText">
                  {errors.role}
                </FormHelperText>
              )}
            </FormControl>
          </div>
        </div>
        <div>
          <div className="form-control-input">
            <FormControl required>
              <FormLabel id="transport-eligibility">
                Transport Eligibility
              </FormLabel>
              {/* <RadioGroup
                                style={{flexDirection: "row"}}
                                aria-labelledby="transport-eligibility"
                                onChange={handleChange}
                                value={values.transportEligibilities}
                                error={touched.transportEligibilities && Boolean(errors.transportEligibilities)}
                                name="transportEligibilities"
                            >
                                {!!transportType?.length && transportType.map((transport, idx) => (
                                    <FormControlLabel value={transport.value} onChange={handleChange} key={idx} control={<Radio />} label={transport.displayName} />
                                ))}
                            </RadioGroup> */}
              <FormGroup
                value={values.transportEligibilities}
                error={
                  touched.transportEligibilities &&
                  Boolean(errors.transportEligibilities)
                }
                onChange={handleArrChange}
                style={{ flexDirection: "row" }}
              >
                {!!transportType?.length &&
                  transportType.map((transport, idx) => (
                    <FormControlLabel
                      checked={values.transportEligibilities.includes(
                        transport.value
                      )}
                      key={idx}
                      name="transportEligibilities"
                      value={transport.value}
                      control={<Checkbox />}
                      label={transport.displayName}
                    />
                  ))}
              </FormGroup>
              {touched.transportEligibilities &&
                errors.transportEligibilities && (
                  <FormHelperText className="errorHelperText">
                    {errors.transportEligibilities}
                  </FormHelperText>
                )}
            </FormControl>
          </div>
        </div>
        <div>
          <div className="form-control-input">
            <TextField
              value={values.address}
              onChange={handleChange}
              error={touched.address && Boolean(errors.address)}
              helperText={touched.address && errors.address}
              name="address"
              required
              id="address"
              label="Address"
              variant="outlined"
            />
          </div>
          <div className="form-control-input">
            <TextField
              value={values.landmark}
              onChange={handleChange}
              error={touched.landmark && Boolean(errors.landmark)}
              helperText={touched.landmark && errors.landmark}
              name="landmark"
              id="landmark"
              label="Landmark"
              variant="outlined"
            />
          </div>
          <div className="form-control-input">
            <TextField
              value={coordinates.geoCode}
              onClick={handleModalOpen}
              onChange={(e) => setCoordinates({ geoCode: e.target.value })}
              error={touched.geoCode && Boolean(errors.geoCode)}
              helperText={touched.geoCode && errors.geoCode}
              name="geoCode"
              id="geoCode"
              label="Geocode"
              variant="outlined"
            />
            <Modal
              open={openModal}
              onClose={handleModalClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <GeocodeModal  geocode={handleGeocode} onClose={handleModalClose} />
              </Box>
            </Modal>
          </div>
          
        </div>
        <div>
          <div className="form-control-input">
            <FormControl variant="outlined">
              <Autocomplete
                disablePortal
                id="search-zone"
                options={searchedZone}
                autoComplete
                open={openSearchZone}
                onOpen={() => {
                  setOpenSearchZone(true);
                }}
                onClose={() => {
                  setOpenSearchZone(false);
                }}
                onChange={(e, val) =>
                  onChangeHandler(val, "zoneName", "zoneName")
                }
                getOptionKey={(zone) => zone.zoneId}
                getOptionLabel={(zone) => zone.zoneName}
                freeSolo
                name="zoneName"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Zone*"
                    onChange={searchForZone}
                  />
                )}
              />
            </FormControl>
          </div>
          <div className="form-control-input">
            <FormControl variant="outlined">
              <Autocomplete
                disablePortal
                id="search-area"
                options={searchedArea}
                autoComplete
                open={openSearchArea}
                onOpen={() => {
                  setOpenSearchArea(true);
                }}
                onClose={() => {
                  setOpenSearchArea(false);
                }}
                onChange={(e, val) =>
                  onChangeHandler(val, "areaName", "areaName")
                }
                getOptionKey={(area) => area.areaId}
                getOptionLabel={(area) => area.areaName}
                freeSolo
                name="areaName"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Area*"
                    onChange={searchForArea}
                  />
                )}
              />
            </FormControl>
          </div>
          <div className="form-control-input">
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
                  onChangeHandler(val, "nodal", "nodalName")
                }
                getOptionKey={(mp) => mp.nodalId}
                getOptionLabel={(mp) => mp.nodalName}
                freeSolo
                name="nodal"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Nodal Point*"
                    onChange={searchForMiddlePoint}
                  />
                )}
              />
            </FormControl>
          </div>
        </div>
        <div>
          <div className="form-control-input">
            <FormControl>
              <FormLabel id="adhoc-booking-req">
                Adhoc Booking Request
              </FormLabel>
              <RadioGroup
                style={{ flexDirection: "row" }}
                aria-labelledby="adhoc-booking-req"
                value={values.isAddHocBooking}
                error={
                  touched.isAddHocBooking && Boolean(errors.isAddHocBooking)
                }
                name="isAddHocBooking"
                onChange={handleChange}
              >
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label={"Yes"}
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label={"No"}
                />
              </RadioGroup>
            </FormControl>
          </div>
        </div>
        <div>
          <div className="form-control-input">
            <FormControl>
              <FormLabel id="mobile-app-access">Mobile App Access</FormLabel>
              <RadioGroup
                style={{ flexDirection: "row" }}
                aria-labelledby="mobile-app-access"
                value={values.mobAppAccess}
                error={touched.mobAppAccess && Boolean(errors.mobAppAccess)}
                name="mobAppAccess"
                onChange={handleChange}
              >
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label={"Yes"}
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label={"No"}
                />
              </RadioGroup>
            </FormControl>
          </div>
        </div>
        <div>
          <div className="form-control-input">
            <FormControl required>
              <FormLabel id="notification-type">Notification Type</FormLabel>
              <FormGroup
                onChange={handleArrChange}
                value={values.notificationModes}
                error={
                  touched.notificationModes && Boolean(errors.notificationModes)
                }
                style={{ flexDirection: "row" }}
              >
                <FormControlLabel
                  name="notificationModes"
                  value="EMAIL"
                  control={
                    <Checkbox
                      checked={emailCheckbox}
                      onChange={() => setEmailCheckbox(!emailCheckbox)}
                    />
                  }
                  label="Email"
                />
                <FormControlLabel
                  name="notificationModes"
                  value="SMS"
                  control={
                    <Checkbox
                      checked={smsCheckbox}
                      onChange={() => setSmsCheckbox(!smsCheckbox)}
                    />
                  }
                  label="SMS"
                />
              </FormGroup>
              {touched.notificationModes && errors.notificationModes && (
                <FormHelperText className="errorHelperText">
                  {errors.notificationModes}
                </FormHelperText>
              )}
            </FormControl>
          </div>
        </div>
        <div>
          <div className="form-control-input">
            <FormControl required>
              <FormLabel id="profile-status">Profile Status</FormLabel>
              <RadioGroup
                style={{ flexDirection: "row" }}
                aria-labelledby="profile-status"
                value={values.profileStatus}
                error={touched.profileStatus && Boolean(errors.profileStatus)}
                name="profileStatus"
                onChange={handleChange}
              >
                <FormControlLabel
                  value={1}
                  onChange={handleChange}
                  control={<Radio />}
                  label={"Yes"}
                />
                <FormControlLabel
                  value={0}
                  onChange={handleChange}
                  control={<Radio />}
                  label={"No"}
                />
              </RadioGroup>
              {touched.profileStatus && errors.profileStatus && (
                <FormHelperText className="errorHelperText">
                  {errors.profileStatus}
                </FormHelperText>
              )}
            </FormControl>
          </div>
        </div>
        <div>
          <div className="form-control-input">
            <FormControl variant="outlined">
              <Autocomplete
                disablePortal
                id="search-team"
                options={searchedTeam}
                autoComplete
                open={openSearchTeam}
                onOpen={() => {
                  setOpenSearchTeam(true);
                }}
                onClose={() => {
                  setOpenSearchTeam(false);
                }}
                onChange={(e, val) => onChangeHandler(val, "team", "teamId")}
                getOptionKey={(team) => team.teamId}
                getOptionLabel={(team) => team.teamName}
                freeSolo
                name="team"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Team"
                    onChange={searchForTeam}
                  />
                )}
              />
            </FormControl>
          </div>
          <div className="form-control-input">
            <FormControl variant="outlined">
              <Autocomplete
                disablePortal
                id="search-reporting-manager"
                options={searchedReportingManager}
                autoComplete
                open={openSearchRM}
                onOpen={() => {
                  setOpenSearchRM(true);
                }}
                onClose={() => {
                  setOpenSearchRM(false);
                }}
                defaultValue={{ empId: "", data: "" }}
                onChange={(e, val) =>
                  onChangeHandler(val, "reportingManager", "empId")
                }
                getOptionKey={(rm) => rm.empId}
                getOptionLabel={(rm) => `${rm.data}, ${rm.empId}`}
                freeSolo
                name="reportingManager"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Search Reporting Manager"
                    onChange={searchForRM}
                  />
                )}
              />
            </FormControl>
          </div>
          <div className="form-control-input">
            <TextField
              value={values.costCenter}
              onChange={handleChange}
              error={touched.costCenter && Boolean(errors.costCenter)}
              helperText={touched.costCenter && errors.costCenter}
              name="costCenter"
              id="cost-center"
              label="Cost Center"
              variant="outlined"
            />
          </div>
        </div>
        <div>
          <div className="form-control-input">
            <InputLabel htmlFor="start-date">Start Date</InputLabel>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                name="startDate"
                format={DATE_FORMAT}
                value={values.startDate ? moment(values.startDate) : null}
                onChange={(e) => handleDateChange(e, "startDate")}
              />
            </LocalizationProvider>
          </div>
          <div className="form-control-input">
            <InputLabel htmlFor="End-date">End Date</InputLabel>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                name="endDate"
                format={DATE_FORMAT}
                value={values.endDate ? moment(values.endDate) : null}
                onChange={(e) => handleDateChange(e, "endDate")}
              />
            </LocalizationProvider>
          </div>
          <div className="form-control-input">
            <TextField
              value={values.businessUnit}
              onChange={handleChange}
              error={touched.businessUnit && Boolean(errors.businessUnit)}
              helperText={touched.businessUnit && errors.businessUnit}
              name="businessUnit"
              id="business-unit"
              label="Business Unit"
              variant="outlined"
            />
          </div>
        </div>
        <div>
          <div className="form-control-input">
            <FormControl required>
              <FormLabel id="weekly-off">Weekly Off</FormLabel>
              <FormGroup
                value={values.weekOff}
                error={touched.weekOff && Boolean(errors.weekOff)}
                onChange={handleArrChange}
                style={{ flexDirection: "row" }}
              >
                {!!weekdays?.length &&
                  weekdays.map((currentDay, idx) => (
                    <FormControlLabel
                      checked={values.weekOff.includes(currentDay.value)}
                      key={idx}
                      name="weekOff"
                      value={currentDay.value}
                      control={<Checkbox />}
                      label={currentDay.displayName}
                    />
                  ))}
              </FormGroup>
              {touched.weekOff && errors.weekOff && (
                <FormHelperText className="errorHelperText">
                  {errors.weekOff}
                </FormHelperText>
              )}
            </FormControl>
          </div>
        </div>
        <div>
          <div className="form-control-input">
            <FormControl>
              <FormLabel id="special-status">Special Status</FormLabel>
              <RadioGroup
                style={{ flexDirection: "row" }}
                aria-labelledby="special-status"
                value={values.specialStatus}
                error={touched.specialStatus && Boolean(errors.specialStatus)}
                name="specialStatus"
                onChange={handleChange}
              >
                <FormControlLabel
                  value={"NO"}
                  control={<Radio />}
                  label={"None"}
                />
                <FormControlLabel
                  value={"DIFFERENTLY_ABLED"}
                  control={<Radio />}
                  label={"Differently Abled"}
                />
                <FormControlLabel
                  value={"VIP"}
                  control={<Radio />}
                  label={"VIP"}
                />
                <FormControlLabel
                  value={"PREGNANT_WOMAN"}
                  control={<Radio />}
                  label={"Pregnant Woman"}
                />
              </RadioGroup>
            </FormControl>
          </div>
        </div>
        <div className="addBtnContainer">
          <div>
            <button onClick={handleResetField} className="btn btn-secondary">
              Reset
            </button>
          </div>
          <div>
            <button onClick={onUserSuccess} className="btn btn-secondary">
              Back
            </button>
            <button onClick={handleSubmit} className="btn btn-primary">
              {editEmployeeData?.id ? "Update" : "Create"} Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
