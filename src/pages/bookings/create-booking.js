import bookings from '@/layouts/bookings';
import React, { useEffect, useState } from 'react';
import styles from '@/styles/Booking.module.css';
import { Autocomplete, Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Switch, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { validationSchema } from '@/components/booking/validationSchema';
import moment from 'moment';
import { useFormik } from 'formik';
import { DATE_FORMAT, DEFAULT_PAGE_SIZE, MASTER_DATA_TYPES, TRANSPORT_TYPES } from '@/constants/app.constants.';
import OfficeService from '@/services/office.service';
import { getFormattedLabel } from '@/utils/utils';
import MasterDataService from '@/services/masterdata.service';
import { useDispatch, useSelector } from 'react-redux';
import { setMasterData } from '@/redux/master.slice';
import BookingService from '@/services/booking.service';
import Grid from '@/components/grid';
import { toggleToast } from '@/redux/company.slice';

const CreateBooking = () => {

    const dispatch = useDispatch();
    const [bookingFor, setBookingFor] = useState(1);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedOtherUserDetails, setSelectedOtherUserDetails] = useState();
    const [isSearchUser, setIsSearchUser] = useState(false);
    const [currentBookingFlow, setCurrentBookingFlow] = useState(1);
    const [offices, setOffices] = useState([]);
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [loginTimes, setLoginTimes] = useState([]);
    const [isViewMore, setIsViewMore] = useState(false);
    const [logoutTimes, setLogoutTimes] = useState([]);
    const [teamListing, setTeamListing] = useState([]);
    const [selectedTeamDetail, setSelectedTeamDetail] = useState({});
    const [teamFlow, setTeamFlow] = useState(1);
    const [teamPaginationData, setTeamPaginationData] = useState();
    const [teamPagination, setTeamPagination] = useState({
        pageNo: 0,
        pageSize: DEFAULT_PAGE_SIZE,
    });
    const [teamUserListing, setTeamUserListing] = useState([]);
    const [nodalPoints, setNodalPoints] = useState([]);
    const [isSubmit, setIsSubmit] = useState(false);
    const { TransportType: transportType } = useSelector((state) => state.master);
    const [initialValues, setInitialValues] = useState({
        bookingFromDate: "",
        bookingToDate: "",
        officeId: "",
        loginShift: "",
        logoutShift: "",
        nextDayLogOut: false,
        isCustomiseSchedule: false,
        customiseScheduleDTOList: [],
        transportType: TRANSPORT_TYPES.CAB,
        pickUpPoint: "",
        dropPoint: ""
    });

    const [customizedScheduledBean, setCustomizedScheduledBean] = useState([]);

    const teamHeaders = [
        {
            key: "radioBox",
            html: <Radio />,
            radio: true
        },
        {
            key: "name",
            display: "Team Name"
        },
        {
            key: "teamStrength",
            display: "Team Strength"
        },
        {
            key: "managerIds",
            display: "Team Manager"
    }];

    const teamUserHeaders = [
        {
            key: "radioBox",
            html: <Checkbox />,
            checkbox: true
        },
        {
            key: "name",
            display: "Name"
        },
        {
            key: "empId",
            display: "Employee Id"
        },
        {
            key: "gender",
            display: "Gender"
    }];

    useEffect(() => {
        fetchAllOffices();
        if (!transportType?.length) {
            fetchMasterData(MASTER_DATA_TYPES.TRANSPORT_TYPE);
        }
    }, []);

    const fetchAllTeams = async () => {
        try {
            const params = new URLSearchParams(teamPagination);
            const response = await OfficeService.getAllTeams(params.toString());
            const { data } = response || {};
            const { paginatedResponse } = data || {};        
            setTeamListing(paginatedResponse?.content);
            let localPaginationData = {...paginatedResponse};
            delete localPaginationData?.content;
            setTeamPaginationData(localPaginationData);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchNodalPoints = async () => {
        try {
            const response = await BookingService.getNodalLocations(values.officeId);
            const { data } = response || {};
            const { locationDTOS } = data || {};
            setNodalPoints(locationDTOS);
        } catch (e) {
            console.error(e);
        }
    };

    const fetchAllOffices = async () => {
        try {
            const response = await OfficeService.getAllOffices();
            const { data } = response || {};
            const { clientOfficeDTO } = data || {};
            setOffices(clientOfficeDTO);
        } catch (e) {

        }
    };

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

    const handleBookingForChange = (event) => {
        const val = Number(event.target.value);
        setBookingFor(val);
        setCurrentBookingFlow(val);
        clearData();
        if (val === 3 && !teamListing?.length) {
            fetchAllTeams();
        }
    };

    const clearData = () => {
        setSelectedUsers([]);
        setSearchedUsers([]);
        setSelectedOtherUserDetails(null);
        setTeamListing([]);
        setSelectedTeamDetail({});
        setTeamFlow(1);
        setIsViewMore(false);
    };

    let reValidationSchema = validationSchema;
    const validationSchemaCopy = {...validationSchema};
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: reValidationSchema,
        onSubmit: async (values) => {
            setIsSubmit(true);
            let allValues = {...values};
            if (allValues.bookingFromDate) {
                allValues.bookingFromDate = moment(allValues.bookingFromDate).format("YYYY-MM-DD");
            }
            if (allValues.bookingToDate) {
                allValues.bookingToDate = moment(allValues.bookingToDate).format("YYYY-MM-DD");
            }
            if (bookingFor !== 1) {
                allValues.bookingEmployeeIds = selectedUsers;
                allValues.bookingFor = "";
                if (bookingFor === 3) {
                    allValues.teamId = selectedTeamDetail.id;
                }
            } else {
                allValues.bookingFor = "self";
                const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
                if (userDetails?.name) {
                    allValues.bookingEmployeeIds = [userDetails.name];
                }
            }
            try {
                await BookingService.createBooking({booking: allValues});
                dispatch(toggleToast({ message: 'Booking created successfully!', type: 'success' }));
                clearData();
                formik.handleReset();
            } catch (e) {
                console.error(e);
                dispatch(toggleToast({ message: e?.response?.data?.message || 'Error creating booking, please try again later!', type: 'error' }));
            }
        }
    });


    const fetchInOutTimes = async (isIn = false) => {
        try {
            const response = await BookingService.getLoginLogoutTimes(values.officeId, isIn, values.transportType);
            const { data } = response || {};
            if (isIn) {
                setLoginTimes(data);
            } else {
                setLogoutTimes(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleDateChange = (date, name) => {
        formik.setFieldValue(name, date);
    };

    const { values, errors, touched, handleChange, handleSubmit } = formik;

    const isSelectedDate = () => {
        if (values?.bookingFromDate && values?.bookingToDate) {
            const startD = moment(values.bookingFromDate, DATE_FORMAT);
            const endD = moment(values.bookingToDate, DATE_FORMAT);
            const diff = endD.diff(startD, 'days');
            if (diff > 0) {
                return false;
            }
        }
        return true;
    };

    const handleChangeMultiple = (e, idx) => {
        const currentCustomizedSch = [...customizedScheduledBean];
        const { target } = e;
        const { value, name } = target || {};
        if (currentCustomizedSch[idx]) {
            currentCustomizedSch[idx][name] = value;
        } else {
            currentCustomizedSch[idx] = {};
            currentCustomizedSch[idx][name] = value;
        }
        console.log("currentCustomizedSch", currentCustomizedSch);
        setCustomizedScheduledBean(currentCustomizedSch);
    };

    console.log("errr", errors);

    const renderSingleDay = (date, isMultiple = false, currentIdx) => {
        return (
            <div className={styles.perDateContainer}>
                {date &&
                    <>
                        <span className={styles.dayAndDate}>{date.format('dddd')}</span>
                        <span className={styles.dayAndDate}>{date.format(DATE_FORMAT)}</span>
                    </>
                }
                <div className='form-control-input'>
                    <FormControl required fullWidth>
                        <InputLabel id="primary-office-label">Office ID</InputLabel>
                        <Select
                            labelId="primary-office-label"
                            id="officeId"
                            value={isMultiple ? customizedScheduledBean[currentIdx]?.officeId : values.officeId}
                            error={isMultiple ? !customizedScheduledBean[currentIdx]?.officeId && isSubmit : touched.officeId && Boolean(errors.officeId)}
                            name="officeId"
                            label="Primary Office"
                            onChange={(e) => handleChange(e)}
                        >
                            {!!offices?.length && offices.map((office, idx) => (
                                <MenuItem key={idx} value={office.officeId}>{getFormattedLabel(office.officeId)}, {office.address}</MenuItem>
                            ))}
                        </Select>
                        {((!isMultiple && touched.officeId && errors.officeId) || (isMultiple && !customizedScheduledBean[currentIdx]?.officeId && isSubmit)) && <FormHelperText className='errorHelperText'>{errors.officeId}</FormHelperText>}
                    </FormControl>
                </div>
                <div className='form-control-input'>
                    <FormControl required fullWidth>
                        <InputLabel id="login-label">Login Time</InputLabel>
                        <Select
                            labelId="login-label"
                            id="loginShift"
                            value={values.loginShift}
                            error={touched.loginShift && Boolean(errors.loginShift)}
                            name="loginShift"
                            label="Login Time"
                            onChange={handleChange}
                        >
                            {!!loginTimes?.length && loginTimes.map((time, idx) => (
                                <MenuItem key={idx} value={time}>{time}</MenuItem>
                            ))}
                        </Select>
                        {touched.loginShift && errors.loginShift && <FormHelperText className='errorHelperText'>{errors.loginShift}</FormHelperText>}
                    </FormControl>
                </div>
                <div className='form-control-input'>
                    <FormControl required fullWidth>
                        <InputLabel id="logout-label">Logout Time</InputLabel>
                        <Select
                            labelId="logout-label"
                            id="logoutShift"
                            value={values.logoutShift}
                            error={touched.logoutShift && Boolean(errors.logoutShift)}
                            name="logoutShift"
                            label="Logout Time"
                            onChange={handleChange}
                        >
                            {!!logoutTimes?.length && logoutTimes.map((time, idx) => (
                                <MenuItem key={idx} value={time}>{time}</MenuItem>
                            ))}
                        </Select>
                        {touched.logoutShift && errors.logoutShift && <FormHelperText className='errorHelperText'>{errors.logoutShift}</FormHelperText>}
                    </FormControl>
                </div>
                <div className='form-control-input'>
                    <FormControl required>
                            <FormGroup
                            onChange={handleChange}
                            value={values.nextDayLogOut}
                            error={touched.nextDayLogOut && Boolean(errors.nextDayLogOut)}
                            style={{flexDirection: "row"}}>
                                <FormControlLabel name="nextDayLogOut" value={true} control={<Checkbox />} label="Next Day Logout" />
                            </FormGroup>
                            {touched.nextDayLogOut && errors.nextDayLogOut && <FormHelperText className='errorHelperText'>{errors.nextDayLogOut}</FormHelperText>}
                    </FormControl>
                </div>
            </div>
        );
    };

    const renderDateRange = () => {
        const startDate = formik.values.bookingFromDate ? moment(formik.values.bookingFromDate, DATE_FORMAT) : "";
        const endDate = formik.values.bookingToDate ? moment(formik.values.bookingToDate, DATE_FORMAT) : "";
        if (startDate && endDate && values.isCustomiseSchedule) {
            if (startDate.isSameOrAfter(endDate, 'day')) {
                return renderSingleDay(null, false);
            }
            const dateRange = [];
            let currentDate = startDate.clone();
            let count = 0;        
            while (currentDate.isSameOrBefore(endDate, 'day')) {
                dateRange.push(renderSingleDay(currentDate, false, count));
                currentDate.add(1, 'day');
                count++;
            }
            return dateRange;
        } else {
            return renderSingleDay(null, false);
        }
    };

    useEffect(() => {
        if (values.officeId && values.transportType) {
            fetchInOutTimes(true);  
            fetchInOutTimes();
        }
    }, [values.officeId, values.transportType]);

    useEffect(() => {
        if (values.transportType !== TRANSPORT_TYPES.CAB && !nodalPoints?.length && values.officeId) {
            fetchNodalPoints();
        }
    }, [values.transportType, values.officeId]);

    const searchForRM = async (e) => {
        try {
            const response = await OfficeService.searchRM(e.target.value);
            const { data } = response || {};
            setSearchedUsers(data);
        } catch (e) {
            console.error(e);
        }
    };

    const getOtherUserDetails = async (id) => {
        try {
            const response = await OfficeService.getEmployeeDetails(id);
            const { data } = response;
            setSelectedOtherUserDetails(data);
        } catch (e) {
            console.error(e);
        }
    };

    const onChangeHandler = (val) => {
        if (val?.empId) {
            setSelectedUsers([val.empId]);
            getOtherUserDetails(val.empId);
        } else {
            setSelectedUsers([]);
            setSelectedOtherUserDetails(null);
        }
    };

    const handleUserNext = () => {
        setCurrentBookingFlow(1);
    };

    const handleTeamPageChange = (page) => {
        let updatedPagination = {...teamPagination};
        updatedPagination.pageNo = page;
        setTeamPagination(updatedPagination);
    };

    const onTeamRadioClick = (sTeam) => {
        setSelectedTeamDetail(sTeam);
    };

    const handleTeamNext = () => {
        if (teamFlow === 1) {
            fetchEmployeesByTeamId();
            setTeamFlow(2);
        } else {
            setCurrentBookingFlow(1);
        }
    };

    const onTeamCheckboxClick = (teamUsers) => {
        var idArray = teamUsers.map(item => item.empId);
        setSelectedUsers(idArray);
    };

    const fetchEmployeesByTeamId = async () => {
        try {
            const tUserPagination = {
                pageNo: 0,
                pageSize: 200,
                teamId: selectedTeamDetail.id
            };
            const params = new URLSearchParams(tUserPagination);
            const response = await BookingService.getEmployeesByTeamId(params.toString());
            const { data } = response || {};
            const { paginatedResponse } = data || {};        
            setTeamUserListing(paginatedResponse?.content);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div>
            <div className={styles.bookingForContainer}>
                <div className='form-control-input'>
                    <FormControl>
                        <RadioGroup
                            style={{flexDirection: "row"}}
                            value={bookingFor}
                            name="bookingFor"
                            onChange={handleBookingForChange}
                        >
                            <FormControlLabel value={1} control={<Radio />} label={"Self"} />
                            <FormControlLabel value={2} control={<Radio />} label={"Other User"} />
                            <FormControlLabel value={3} control={<Radio />} label={"Team"} />
                        </RadioGroup>
                    </FormControl>
                </div>
            </div>
            {currentBookingFlow === 1 && <div className={styles.mainBookingContainer}>
                <div className={styles.dateRangeContainer}>
                    <div className={`form-control-input ${styles.formControlInput}`}>
                        <InputLabel>Select Date Range</InputLabel>
                        <div className={styles.dateRangeInnerContainer}>
                            <LocalizationProvider dateAdapter={AdapterMoment}>
                                <DatePicker name="bookingFromDate" format={DATE_FORMAT} value={values.bookingFromDate ? moment(values.bookingFromDate) : null} onChange={(e) => handleDateChange(e, "bookingFromDate")} />
                                <DatePicker name="bookingToDate" format={DATE_FORMAT} value={values.bookingToDate ? moment(values.bookingToDate) : null} onChange={(e) => handleDateChange(e, "bookingToDate")} />
                            </LocalizationProvider>
                        </div>
                    </div>
                </div>
                <div className={styles.mainBookingDataContainer}>
                    <div>
                        <div className='form-control-input'>
                            <FormControl required>
                                <FormLabel id="transport-type">Select Transport Type</FormLabel>
                                <RadioGroup
                                    style={{flexDirection: "row"}}
                                    aria-labelledby="transport-type"
                                    onChange={handleChange}
                                    value={values.transportType}
                                    error={touched.transportType && Boolean(errors.transportType)}
                                    name="transportType"
                                >
                                    {!!transportType?.length && transportType.map((transport, idx) => (
                                        <FormControlLabel value={transport.value} onChange={handleChange} key={idx} control={<Radio />} label={transport.displayName} />
                                    ))}
                                </RadioGroup>
                                {touched.transportType && errors.transportType && <FormHelperText className='errorHelperText'>{errors.transportType}</FormHelperText>}
                            </FormControl>
                        </div>
                        <div className='form-control-input'>
                            <FormGroup value={values.isCustomiseSchedule} onChange={handleChange}>
                                <InputLabel>Customize Schedule</InputLabel>
                                <FormControlLabel disabled={isSelectedDate()} name="isCustomiseSchedule" control={<Switch />} label={values.isCustomiseSchedule ? "On" : "Off"} />
                            </FormGroup>
                        </div>
                    </div>
                    <div>
                        {renderDateRange()}
                    </div>
                    {values.transportType !== TRANSPORT_TYPES.CAB && 
                    <div className={styles.pickAndDropContainer}>
                        <div className='form-control-input'>
                            <FormControl required>
                                <InputLabel id="pickUpPoint-label">Pickup Point</InputLabel>
                                <Select
                                    labelId="pickUpPoint-label"
                                    id="pickUpPoint"
                                    value={values.pickUpPoint}
                                    error={touched.pickUpPoint && Boolean(errors.pickUpPoint)}
                                    name="pickUpPoint"
                                    label="Pickup Point"
                                    onChange={handleChange}
                                >
                                    {!!nodalPoints?.length && nodalPoints.map((point, idx) => (
                                        <MenuItem key={idx} value={point.id}>{point.locationName}</MenuItem>
                                    ))}
                                </Select>
                                {touched.pickUpPoint && errors.pickUpPoint && <FormHelperText className='errorHelperText'>{errors.pickUpPoint}</FormHelperText>}
                            </FormControl>
                        </div>
                        <div className='form-control-input'>
                            <FormControl required>
                                <InputLabel id="dropPoint-label">Drop Point</InputLabel>
                                <Select
                                    labelId="dropPoint-label"
                                    id="dropPoint"
                                    value={values.dropPoint}
                                    error={touched.dropPoint && Boolean(errors.dropPoint)}
                                    name="dropPoint"
                                    label="Drop Point"
                                    onChange={handleChange}
                                >
                                    {!!nodalPoints?.length && nodalPoints.map((point, idx) => (
                                        <MenuItem key={idx} value={point.id}>{point.locationName}</MenuItem>
                                    ))}
                                </Select>
                                {touched.dropPoint && errors.dropPoint && <FormHelperText className='errorHelperText'>{errors.dropPoint}</FormHelperText>}
                            </FormControl>
                        </div>
                    </div>}
                    <div className='addBtnContainer' style={{paddingBottom: "20px", flexDirection: "row-reverse"}}>
                        <div>
                            {/* <button onClick={onUserSuccess} className='btn btn-secondary'>Back</button> */}
                            <button onClick={handleSubmit} className='btn btn-primary'>Create Booking</button>
                        </div>
                    </div>
                </div>
            </div>}
            {currentBookingFlow === 2 && <div>
                <div className={styles.mainBookingContainer}>
                    <div>
                        <div className='form-control-input'>
                            <Autocomplete
                                disablePortal
                                id="search-user"
                                options={searchedUsers}
                                autoComplete
                                open={isSearchUser}
                                onOpen={() => {
                                    setIsSearchUser(true);
                                }}
                                onClose={() => {
                                    setIsSearchUser(false);
                                }}
                                onChange={(e, val) => onChangeHandler(val)}
                                getOptionKey={(rm) => rm.empId}
                                getOptionLabel={(rm) => `${rm.data} ${rm.empId}`}
                                freeSolo
                                name="reportingManager"
                                renderInput={(params) => <TextField {...params} label="Search User"  onChange={searchForRM} />}
                            />
                        </div>
                    </div>
                    {!!(selectedUsers?.length && selectedOtherUserDetails) && <div className={styles.mainBookingDataContainerUser}>
                        <div className={styles.userDetailsContainer}>
                            <span>Name</span>
                            <p>{selectedOtherUserDetails.name}</p>
                        </div>
                        <div className={styles.userDetailsContainer}>
                            <span>Phone No.</span>
                            <p>{selectedOtherUserDetails.mob}</p>
                        </div>
                        <div className={styles.userDetailsContainer}>
                            <span>Gender</span>
                            <p style={{textTransform: "capitalize"}}>{selectedOtherUserDetails.gender.toLowerCase()}</p>
                        </div>
                        <div className={styles.userDetailsContainer}>
                            <span>Employee ID</span>
                            <p>{selectedOtherUserDetails.empId}</p>
                        </div>
                        <div className={styles.userDetailsContainer}>
                            <span>Email</span>
                            <p>{selectedOtherUserDetails.email}</p>
                        </div>
                        <div className={styles.userDetailsContainer}>
                            <span>Address</span>
                            <p>{selectedOtherUserDetails.address}</p>
                        </div>
                        {isViewMore && <>
                            <div className={styles.userDetailsContainer}>
                                <span>Primary Office</span>
                                <p>{selectedOtherUserDetails.primaryOfficeId}</p>
                            </div>
                            <div className={styles.userDetailsContainer}>
                                <span>Transport Type</span>
                                <p>{selectedOtherUserDetails.transportEligibilities}</p>
                            </div>
                            <div className={styles.userDetailsContainer}>
                                <span>Alternate Mobile No</span>
                                <p>{selectedOtherUserDetails.altMob}</p>
                            </div>
                        </>}
                        <div className={styles.userDetailsContainer}>
                            <button onClick={() => setIsViewMore((previous) => !previous)} style={{width: "150px", margin: "0"}} className='btn btn-primary'>{isViewMore ? 'View Less' : 'View More'}</button>
                        </div>
                    </div>}
                    <div className='addBtnContainer' style={{paddingBottom: "20px", flexDirection: "row-reverse"}}>
                        <div>
                            <button disabled={!!(!selectedUsers?.length)} onClick={handleUserNext} className='btn btn-primary'>Next</button>
                        </div>
                    </div>
                </div>    
            </div>}
            {currentBookingFlow === 3 && <div>
                <div className={styles.mainBookingContainer}>
                    <div style={{padding: "15px"}}>
                        <h3>Team Details</h3>
                    </div>
                    <div className={styles.mainBookingDataContainer}>
                        {teamFlow === 1 && <Grid onRadioClick={onTeamRadioClick} handlePageChange={handleTeamPageChange} headers={teamHeaders} listing={teamListing} pagination={teamPaginationData} />}
                        {teamFlow === 2 && <Grid onCheckboxClick={onTeamCheckboxClick} headers={teamUserHeaders} listing={teamUserListing} />}
                    </div>
                    <div className='addBtnContainer' style={{borderTop: "0", paddingBottom: "20px", flexDirection: "row-reverse"}}>
                        <div>
                            <button onClick={handleTeamNext} className='btn btn-primary'>Next</button>
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default bookings(CreateBooking);