import { DATE_FORMAT, MASTER_DATA_TYPES } from '@/constants/app.constants.';
import { setMasterData } from '@/redux/master.slice';
import MasterDataService from '@/services/masterdata.service';
import OfficeService from '@/services/office.service';
import RoleService from '@/services/role.service';
import { getFormattedLabel } from '@/utils/utils';
import { Autocomplete, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Radio, RadioGroup, Select, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from "formik";
import { validationSchema } from './employee/validationSchema';
import { toggleToast } from '@/redux/company.slice';
import moment from 'moment';

const AddEmployee = ({
    roleType,
    onUserSuccess,
    editEmployeeData
}) => {

    const [openSearchTeam, setOpenSearchTeam] = useState(false);
    const [openSearchRM, setOpenSearchRM] = useState(false);
    const [initialValues, setInitialValues] = useState({
        empId: "",
        name: "",
        gender: "",
        email: "",
        mob: "",
        altMob: "",
        primaryOfficeId: "",
        role: "",
        transportEligibilities: "",
        address: "",
        geoCode: "",
        isAddHocBooking: null,
        mobAppAccess: null,
        notificationTypes: [],
        profileStatus: null,
        team: "",
        reportingManager: "",
        costCenter: "",
        startDate: "",
        endDate: "",
        businessUnit: "",
        weekOff: [],
        specialStatus: ""
    });

    useState(() => {
        if (editEmployeeData?.id) {
            let newEditInfo = Object.assign(initialValues, editEmployeeData);
            setInitialValues(newEditInfo);
        }
    }, [editEmployeeData]);

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            let allValues = {...values};
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
                if (initialValues?.id) {
                    await OfficeService.updateEmployee({employee: {...initialValues, ...allValues}});
                    dispatch(toggleToast({ message: 'Employee updated successfully!', type: 'success' }));
                } else {
                    await OfficeService.createEmployee({employee: allValues});
                    dispatch(toggleToast({ message: 'Employee added successfully!', type: 'success' }));
                }
                onUserSuccess(true);
            } catch (e) {
                console.error(e);
                dispatch(toggleToast({ message: e?.response?.data?.message || 'Error adding employee, please try again later!', type: 'error' }));
            }
        }
    });

    const { errors, touched, values, handleChange, handleSubmit, handleReset } = formik;

    const { Gender: gender, TransportType: transportType, WeekDay: weekdays } = useSelector((state) => state.master);
    const dispatch = useDispatch();
    const [roles, setRoles] = useState([]);
    const [offices, setOffice] = useState([]);
    const [searchedReportingManager, setSearchedReportingManager] = useState([]);
    const [searchedTeam, setSearchedTeam] = useState([]);

    const fetchMasterData = async (type) => {
        try {
            const response = await MasterDataService.getMasterData(type);
            const { data } = response || {};
            if (data?.length) {
                dispatch(setMasterData({data, type}));
            }
        } catch (e) {

        }
    };

    const getAllRolesByType = async () => {
        try {
            const response = await RoleService.getRolesByType(roleType);
            const { data } = response || {};
            setRoles(data);
        } catch (e) {

        }
    };

    const fetchAllOffices = async () => {
        try {
            const response = await OfficeService.getAllOffices();
            const { data } = response || {};
            const { clientOfficeDTO } = data || {};
            setOffice(clientOfficeDTO);
        } catch (e) {

        }
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

    const onChangeHandler = (newValue, name, key) => {
        formik.setFieldValue(name, newValue?.[key] || "");
    };
  
    const handleDateChange = (date, name) => {
        const selectedDate = moment(date).format(DATE_FORMAT);
        if (selectedDate !== "Invalid date") {
            formik.setFieldValue(name, selectedDate);
        }
    };

    return (
        <div>
            <h4 className='pageSubHeading'>{editEmployeeData?.id ? 'Edit' : 'Add'} Employee</h4>
            <div className='addUpdateFormContainer'>
                <div>
                    <div className='form-control-input'>
                        <TextField 
                        error={touched.empId && Boolean(errors.empId)}
                        helperText={touched.empId && errors.empId} onChange={handleChange}
                        required id="empId" name="empId" value={values.empId} label="Employee ID" variant="outlined" />
                    </div>
                    <div className='form-control-input'>
                            <TextField error={touched.name && Boolean(errors.name)} onChange={handleChange}
                            helperText={touched.name && errors.name} required id="name" name="name"
                            label="Name" variant="outlined"  value={values.name} />
                    </div>
                    <div className='form-control-input'>
                        {!!gender?.length && <FormControl required fullWidth>
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
                                    <MenuItem key={idx} value={g.value}>{getFormattedLabel(g.value)}</MenuItem>
                                ))}
                            </Select>
                            {touched.gender && errors.gender && <FormHelperText className='errorHelperText'>{errors.gender}</FormHelperText>}
                        </FormControl>}
                    </div>
                    <div className='form-control-input'>
                        <TextField 
                        value={values.email}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email} onChange={handleChange}
                        required id="email" name="email" label="Email" variant="outlined" />
                    </div>
                </div>
                <div>
                    <div className='form-control-input'>
                        <TextField
                        value={values.mob}
                        error={touched.mob && Boolean(errors.mob)}
                        helperText={touched.mob && errors.mob}
                        name="mob" onChange={handleChange}
                        required id="mob" label="Mobile No" variant="outlined" />
                    </div>
                    <div className='form-control-input'>
                        <TextField
                        value={values.altMob} onChange={handleChange}
                        error={touched.altMob && Boolean(errors.altMob)}
                        helperText={touched.altMob && errors.altMob}
                        name="altMob" id="altMob" label="Alternate Mobile No" variant="outlined" />
                    </div>
                    <div className='form-control-input'>
                        <FormControl required fullWidth>
                            <InputLabel id="primary-office-label">Primary Office</InputLabel>
                            <Select
                                labelId="primary-office-label"
                                id="primaryOfficeId"
                                value={values.primaryOfficeId}
                                error={touched.primaryOfficeId && Boolean(errors.primaryOfficeId)}
                                name="primaryOfficeId"
                                label="Primary Office"
                                onChange={handleChange}
                            >
                                {!!offices?.length && offices.map((office, idx) => (
                                    <MenuItem key={idx} value={office.officeId}>{getFormattedLabel(office.officeId)}, {office.address}</MenuItem>
                                ))}
                            </Select>
                            {touched.primaryOfficeId && errors.primaryOfficeId && <FormHelperText className='errorHelperText'>{errors.primaryOfficeId}</FormHelperText>}
                        </FormControl>
                    </div>
                    <div className='form-control-input'>
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
                                {!!roles?.length && roles.map((role, idx) => (
                                  <MenuItem key={idx} value={role.roleName}>{role.displayName}</MenuItem>
                                ))}
                            </Select>
                            {touched.role && errors.role && <FormHelperText className='errorHelperText'>{errors.role}</FormHelperText>}
                        </FormControl>
                    </div>
                </div>
                <div>
                    <div className='form-control-input'>
                        <FormControl required>
                            <FormLabel id="transport-eligibility">Transport Eligibility</FormLabel>
                            <RadioGroup
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
                            </RadioGroup>
                            {touched.transportEligibilities && errors.transportEligibilities && <FormHelperText className='errorHelperText'>{errors.transportEligibilities}</FormHelperText>}
                        </FormControl>
                    </div>
                </div>
                <div>
                    <div className='form-control-input'>
                        <TextField
                        value={values.address} onChange={handleChange}
                        error={touched.address && Boolean(errors.address)}
                        helperText={touched.address && errors.address}
                        name="address" required id="address" label="Address" variant="outlined" />
                    </div>
                    <div className='form-control-input'>
                        <TextField
                        value={values.geoCode} onChange={handleChange}
                        error={touched.geoCode && Boolean(errors.geoCode)}
                        helperText={touched.geoCode && errors.geoCode}
                        name="geoCode" id="geoCode" label="Geocode" variant="outlined" />
                    </div>
                </div>
                <div>
                    <div className='form-control-input'>
                        <FormControl>
                            <FormLabel id="adhoc-booking-req">Adhoc Booking Request</FormLabel>
                            <RadioGroup
                                style={{flexDirection: "row"}}
                                aria-labelledby="adhoc-booking-req"
                                value={values.isAddHocBooking}
                                error={touched.isAddHocBooking && Boolean(errors.isAddHocBooking)}                                
                                name="isAddHocBooking"
                                onChange={handleChange}
                            >
                                <FormControlLabel value={true} control={<Radio />} label={"Yes"} />
                                <FormControlLabel value={false} control={<Radio />} label={"No"} />
                            </RadioGroup>
                        </FormControl>
                    </div>
                </div>
                <div>
                    <div className='form-control-input'>
                        <FormControl>
                            <FormLabel id="mobile-app-access">Mobile App Access</FormLabel>
                            <RadioGroup
                                style={{flexDirection: "row"}}
                                aria-labelledby="mobile-app-access"
                                value={values.mobAppAccess}
                                error={touched.mobAppAccess && Boolean(errors.mobAppAccess)}                                
                                name="mobAppAccess"
                                onChange={handleChange}
                            >
                                <FormControlLabel value={true} control={<Radio />} label={"Yes"} />
                                <FormControlLabel value={false} control={<Radio />} label={"No"} />
                            </RadioGroup>
                        </FormControl>
                    </div>
                </div>
                <div>
                    <div className='form-control-input'>
                        <FormControl required>
                            <FormLabel id="notification-type">Notification Type</FormLabel>
                            <FormGroup
                            onChange={handleArrChange}
                            value={values.notificationTypes}
                            error={touched.notificationTypes && Boolean(errors.notificationTypes)}                            
                            style={{flexDirection: "row"}}>
                                <FormControlLabel name="notificationTypes" value="EMAIL" control={<Checkbox />} label="Email" />
                                <FormControlLabel name="notificationTypes" value="SMS" control={<Checkbox />} label="SMS" />
                            </FormGroup>
                            {touched.notificationTypes && errors.notificationTypes && <FormHelperText className='errorHelperText'>{errors.notificationTypes}</FormHelperText>}
                        </FormControl>
                    </div>
                </div>
                <div>
                    <div className='form-control-input'>
                        <FormControl required>
                            <FormLabel id="profile-status">Profile Status</FormLabel>
                            <RadioGroup
                                style={{flexDirection: "row"}}
                                aria-labelledby="profile-status"
                                value={values.profileStatus}
                                error={touched.profileStatus && Boolean(errors.profileStatus)}
                                name="profileStatus"
                                onChange={handleChange}
                            >
                                <FormControlLabel value={1} onChange={handleChange} control={<Radio />} label={"Yes"} />
                                <FormControlLabel value={0} onChange={handleChange} control={<Radio />} label={"No"} />
                            </RadioGroup>
                            {touched.profileStatus && errors.profileStatus && <FormHelperText className='errorHelperText'>{errors.profileStatus}</FormHelperText>}
                        </FormControl>
                    </div>
                </div>
                <div>
                    <div className='form-control-input'>
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
                                renderInput={(params) => <TextField {...params} label="Search Team"  onChange={searchForTeam} />}
                            />                        
                        </FormControl>
                    </div>
                    <div className='form-control-input'>
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
                                onChange={(e, val) => onChangeHandler(val, "reportingManager", "empId")}
                                getOptionKey={(rm) => rm.empId}
                                getOptionLabel={(rm) => `${rm.data}, ${rm.empId}`}
                                freeSolo
                                name="reportingManager"
                                renderInput={(params) => <TextField {...params} label="Search Reporting Manager"  onChange={searchForRM} />}
                            />
                        </FormControl>
                    </div>
                    <div className='form-control-input'>
                        <TextField
                        value={values.costCenter} onChange={handleChange}
                        error={touched.costCenter && Boolean(errors.costCenter)}
                        helperText={touched.costCenter && errors.costCenter}
                        name="costCenter" id="cost-center" label="Cost Center" variant="outlined" />
                    </div>
                </div>
                <div>
                    <div className='form-control-input'>
                        <InputLabel htmlFor="start-date">Start Date</InputLabel>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker name="startDate" format={DATE_FORMAT} value={values.startDate ? moment(values.startDate) : null} onChange={(e) => handleDateChange(e, "startDate")} />
                        </LocalizationProvider>
                    </div>
                    <div className='form-control-input'>
                        <InputLabel htmlFor="End-date">End Date</InputLabel>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker name="endDate" format={DATE_FORMAT} value={values.endDate ? moment(values.endDate) : null} onChange={(e) => handleDateChange(e, "endDate")} />
                        </LocalizationProvider>
                    </div>
                    <div className='form-control-input'>
                        <TextField
                        value={values.businessUnit} onChange={handleChange}
                        error={touched.businessUnit && Boolean(errors.businessUnit)}
                        helperText={touched.businessUnit && errors.businessUnit}
                        name="businessUnit" id="business-unit" label="Business Unit" variant="outlined" />
                    </div>
                </div>
                <div>
                    <div className='form-control-input'>
                        <FormControl required>
                            <FormLabel id="weekly-off">Weekly Off</FormLabel>
                            <FormGroup
                            value={values.weekOff}
                            error={touched.weekOff && Boolean(errors.weekOff)}
                            onChange={handleArrChange}
                            style={{flexDirection: "row"}}>
                                {!!weekdays?.length && weekdays.map((currentDay, idx) => (
                                    <FormControlLabel checked={values.weekOff.includes(currentDay.value)} key={idx} name="weekOff" value={currentDay.value} control={<Checkbox />} label={currentDay.displayName} />
                                ))}
                            </FormGroup>
                            {touched.weekOff && errors.weekOff && <FormHelperText className='errorHelperText'>{errors.weekOff}</FormHelperText>}
                        </FormControl>
                    </div>
                </div>
                <div>
                    <div className='form-control-input'>
                        <FormControl>
                            <FormLabel id="special-status">Special Status</FormLabel>
                            <RadioGroup
                                style={{flexDirection: "row"}}
                                aria-labelledby="special-status"
                                value={values.specialStatus}
                                error={touched.specialStatus && Boolean(errors.specialStatus)}                                
                                name="specialStatus"
                                onChange={handleChange}
                            >
                                <FormControlLabel value={"DIFFERENTLY_ABLED"} control={<Radio />} label={"Differently Abled"} />
                                <FormControlLabel value={"VIP"} control={<Radio />} label={"VIP"} />
                                <FormControlLabel value={"PREGNANT_WOMAN"} control={<Radio />} label={"Pregnant Woman"} />
                            </RadioGroup>
                        </FormControl>
                    </div>
                </div>
                <div className='addBtnContainer'>
                    <div>
                        <button onClick={handleReset} className='btn btn-secondary'>Reset</button>
                    </div>
                    <div>
                        <button onClick={onUserSuccess} className='btn btn-secondary'>Back</button>
                        <button onClick={handleSubmit} className='btn btn-primary'>{editEmployeeData?.id ? 'Update' : 'Create'} Employee</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AddEmployee;