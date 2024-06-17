import bookings from '@/layouts/bookings';
import React, { useEffect, useRef, useState } from 'react';
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
import { useRouter } from 'next/router';

const CreateBooking = () => {

    const dispatch = useDispatch();
    const router = useRouter();
    const customiseSchRef = useRef();
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
    const [shiftType,setShiftType] = useState('');
    const [initialValues, setInitialValues] = useState({
        bookingFromDate: "",
        bookingToDate: "",
        officeId: "",
        bookingType: "",
        loginShift: "",
        logoutShift: "",
        nextDayLogOut: false,
        bookingOnWorkingDay: false,
        isCustomiseSchedule: false,
        customiseScheduleDTOList: [],
        transportType: TRANSPORT_TYPES.CAB,
        pickUpPoint: "",
        dropPoint: "",
        source : "Web",
        bookingFor: "self",
        shiftIds:[],
        areaName : "",
    });

    const [customizedScheduledBean, setCustomizedScheduledBean] = useState([]);
    const [multiLoginTimes, setMultiLoginTimes] = useState([]);
    const [multiLogoutTimes, setMultiLogoutTimes] = useState([]);
    const [editFlag,setEditFlag] = useState(false);
    const [customizedShiftIdBean,setCustomizedShiftBean] = useState([]);
    const [loginShiftId,setLoginShiftId] = useState();
    const [logoutShiftId,setLogoutShiftId] = useState();
    const [areaName, setAreaName] = useState("")

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

    useEffect(()=>{
        var editBookingData = JSON.parse(localStorage.getItem('editBooking'))
        console.log("edit booking",editBookingData);
        if(editBookingData?.id){
            setEditFlag(true);
            console.log(moment(editBookingData.bookingDate).format("YYYY-MMM-DD"));
            let newEditInfo = Object.assign(initialValues, editBookingData);
            if(newEditInfo.bookingType === 'LOGIN'){
                newEditInfo['loginShift'] = newEditInfo['shiftTime'];
                delete newEditInfo['shiftTime'];
                setShiftType('LOGIN')
            }
            else{
                newEditInfo['logoutShift'] = newEditInfo['shiftTime'];
                delete newEditInfo['shiftTime'];
                setShiftType('LOGOUT')
            }
            setInitialValues(newEditInfo);
        }
    },[]);

    const backHandler = () =>{
        localStorage.removeItem('editBooking');
        router.push('search-bookings');
    }

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
        setCustomizedScheduledBean([]);
        setMultiLoginTimes([]);
        setMultiLogoutTimes([]);
    };

    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: ()=>{ 
            let reValidationSchema = validationSchema;
            if(!editFlag && customiseSchRef.current.getAttribute("value") === "true") {
              console.log('customize');
              reValidationSchema = reValidationSchema.omit(["officeId", "logoutShift", "loginShift","pickUpPoint","dropPoint"]);
            }
            return reValidationSchema;
        },
        onSubmit: async (values) => {
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
                allValues.areaName = areaName;
                if (bookingFor === 3) {
                    allValues.teamId = selectedTeamDetail.id;
                }
            } 
            else 
            {
                allValues.bookingFor = "self";
                if(allValues.bookingType === "LOGIN"){
                    allValues.logoutShift= "";
                }
                else{
                    allValues.loginShift="";
                }
                if(editFlag){
                    allValues.bookingEmployeeIds = [allValues.employeeId];
                }
                else{
                    const userDetails = JSON.parse(localStorage.getItem("userDetails") || "{}");
                    if (userDetails?.name) {
                        allValues.bookingEmployeeIds = [userDetails.name];
                    }
                }
            }
            if (allValues.isCustomiseSchedule) {
                console.log(customizedScheduledBean);
                allValues.customiseScheduleDTOList = customizedScheduledBean;
                //TODO need to fix later
                allValues.officeId = customizedScheduledBean[0].officeId;
                allValues.pickUpPoint = customizedScheduledBean[0].pickUpPoint;
                allValues.dropPoint = customizedScheduledBean[0].dropPoint;
            }
            else{
                var shiftIdList = [];
                if(allValues.bookingType === 'LOGIN'){
                    shiftIdList.push(loginShiftId);
                }
                else if(allValues.bookingType === 'LOGOUT'){
                    shiftIdList.push(logoutShiftId);
                }
                else{
                    shiftIdList.push(loginShiftId);
                    shiftIdList.push(logoutShiftId);
                }
                allValues.shiftIds = shiftIdList;
            }
            if(allValues.teamId === ""){
                delete allValues.teamId
            }
            console.log(allValues);
            try {
                if(editFlag){
                    await BookingService.updateBooking([allValues]);
                }
                else{
                    await BookingService.createBooking({booking: allValues});
                }
                
                dispatch(toggleToast({ message: 'Booking created successfully!', type: 'success' }));
                formik.handleReset();
                clearData();
                backHandler();
            } catch (e) {
                console.error(e);
                dispatch(toggleToast({ message: e?.response?.data?.message || 'Error creating booking, please try again later!', type: 'error' }));
            }
        }
    });


    const fetchInOutTimes = async (isIn = false) => {
        try {
            const startDate = moment(formik.values.bookingFromDate).format(DATE_FORMAT);
            const endDate = moment(formik.values.bookingToDate).format(DATE_FORMAT);
            const response = await BookingService.getLoginLogoutTimeWithDate(values.officeId, isIn, values.transportType,startDate,endDate);
            const { data } = response || {};
            console.log(data);
            if (isIn) {
                setLoginTimes(data);
            } else {
                setLogoutTimes(data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchInOutTeamsTime = async(isIn = false) =>{
        try {
            const startDate = moment(formik.values.bookingFromDate).format(DATE_FORMAT);
            const endDate = moment(formik.values.bookingToDate).format(DATE_FORMAT);
            const response = await BookingService.getTeamLoginLogoutTimes(values.officeId, isIn, values.transportType,selectedTeamDetail.id,startDate,endDate);
            const { data } = response || {};
            console.log(data);
            if (isIn) {
                setLoginTimes(data);
            } else {
                setLogoutTimes(data);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const fetchMultiInOutTimes = async (isIn, idxToSet, officeId) => {
        try {
            const startDate = moment(formik.values.bookingFromDate).format(DATE_FORMAT);
            const endDate = moment(formik.values.bookingToDate).format(DATE_FORMAT);
            const response = await BookingService.getLoginLogoutTimeWithDate(officeId, isIn, values.transportType,startDate,endDate);
            const { data } = response || {};
            if (isIn) {
                console.log(data[0]);
                const allInIdxs = [...multiLoginTimes];
                allInIdxs[idxToSet] = data;
                setMultiLoginTimes(allInIdxs);
            } else {
                const allInIdxs = [...multiLogoutTimes];
                allInIdxs[idxToSet] = data;
                setMultiLogoutTimes(allInIdxs);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchMultiInOutTeamsTimes = async (isIn, idxToSet, officeId) =>{
        try {
            const startDate = moment(formik.values.bookingFromDate).format(DATE_FORMAT);
            const endDate = moment(formik.values.bookingToDate).format(DATE_FORMAT);
            const response = await BookingService.getTeamLoginLogoutTimes(officeId, isIn, values.transportType,selectedTeamDetail.id,startDate,endDate);
            const { data } = response || {};
            if (isIn) {
                const allInIdxs = [...multiLoginTimes];
                allInIdxs[idxToSet] = data;
                setMultiLoginTimes(allInIdxs);
            } else {
                const allInIdxs = [...multiLogoutTimes];
                allInIdxs[idxToSet] = data;
                setMultiLogoutTimes(allInIdxs);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const handleDateChange = (date, name) => {
        formik.setFieldValue(name, date);
    };

    const { values, errors, touched, handleChange, handleSubmit } = formik;

    const isSelectedDate = () => {
        //if (values?.bookingFromDate && values?.bookingToDate && values.transportType === TRANSPORT_TYPES.CAB) {
        if (values?.bookingFromDate && values?.bookingToDate ) {
            const startD = moment(values.bookingFromDate, DATE_FORMAT);
            const endD = moment(values.bookingToDate, DATE_FORMAT);
            const diff = endD.diff(startD, 'days');
            if (diff > 0) {
                return false;
            }
        }
        return true;
    };

    const handleChangeMultiple = (e, idx, currentDate) => {
        const currentCustomizedSch = [...customizedScheduledBean];
        let allCustomizedShiftData = [...customizedShiftIdBean];
        const { target } = e;
        const { value, name } = target || {};
        console.log(currentDate,">>>santosh");
        if (currentCustomizedSch[idx]) {
            if (name === "nextDayLogOutCustomize") {
                currentCustomizedSch[idx][name] = !(value === "true");
            } else {
                currentCustomizedSch[idx][name] = value;
            }
        } else {
            currentCustomizedSch[idx] = {};
            currentCustomizedSch[idx].scheduleDate = moment(currentDate).format("YYYY-MM-DD");
            if (name === "nextDayLogOutCustomize") {
                currentCustomizedSch[idx][name] = true;
            } else {
                currentCustomizedSch[idx][name] = value;
            }
        }
        if (name === "officeId") {
            if(bookingFor === 3){
                fetchMultiInOutTeamsTimes(true, idx, value);
                fetchMultiInOutTeamsTimes(false, idx, value);
            }
            else{
                fetchMultiInOutTimes(true, idx, value);
                fetchMultiInOutTimes(false, idx, value);
            }
            
            fetchMultiNodalPoints(value);
        }
        if(name === "loginShift"){
            const targetShift = multiLoginTimes[idx].find(item => {
                console.log("Shift Time:", item.shiftTime);
                return item.shiftTime === value;
            });
            if(allCustomizedShiftData[idx]){
                if(allCustomizedShiftData[idx].shiftType === "LOGIN"){
                    allCustomizedShiftData[idx].shiftId = targetShift.id;
                }
                else{
                    allCustomizedShiftData[idx].shiftId = targetShift.id;
                    allCustomizedShiftData[idx].shiftType = targetShift.shiftType;
                }
            }
            else{
                var obj = {
                    index : idx,
                    shiftId : targetShift.id,
                    shiftType: targetShift.shiftType
                }
                allCustomizedShiftData.push(obj);
            }
        }
        else if(name === "logoutShift"){
            const targetShift = multiLogoutTimes[idx].find(item => {
                console.log("Shift Time:", item.shiftTime);
                return item.shiftTime === value;
            });
            if(allCustomizedShiftData[idx]){
                if(allCustomizedShiftData[idx].shiftType === "LOGOUT"){
                    allCustomizedShiftData[idx].shiftId = targetShift.id;
                }
                else{
                    allCustomizedShiftData[idx].shiftId = targetShift.id;
                    allCustomizedShiftData[idx].shiftType = targetShift.shiftType;
                }
            }
            else{
                var obj = {
                    index : idx,
                    shiftId : targetShift.id,
                    shiftType: targetShift.shiftType
                }
                allCustomizedShiftData.push(obj);
            }
        }
        console.log(allCustomizedShiftData,"shift Ids for customized");
        console.log(currentCustomizedSch,"setting custom array");
        setCustomizedScheduledBean(currentCustomizedSch);
        setCustomizedShiftBean(allCustomizedShiftData);
    };

    const fetchMultiNodalPoints = async (officeId) => {
        try {
            const response = await BookingService.getNodalLocations(officeId);
            const { data } = response || {};
            const { locationDTOS } = data || {};
            setNodalPoints(locationDTOS);
        } catch (e) {
            console.error(e);
        }
    };

    const renderMultipleDay = (date, currentIdx) => {
        //console.log(date)
        const bookingDate =date.format(DATE_FORMAT);
        return (
            <>
            <div key={`multiDiv${currentIdx}`} className={styles.perDateContainer}>
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
                            value={customizedScheduledBean?.[currentIdx]?.officeId || ""}
                            error={isSubmit && !customizedScheduledBean?.[currentIdx]?.officeId}
                            name="officeId"
                            label="Primary Office"
                            onChange={(e) => handleChangeMultiple(e, currentIdx, bookingDate)}
                        >
                            {!!offices?.length && offices.map((office, idx) => (
                                <MenuItem key={idx} value={office.officeId}>{getFormattedLabel(office.officeId)}, {office.address}</MenuItem>
                            ))}
                        </Select>
                        {isSubmit && !customizedScheduledBean?.[currentIdx]?.officeId && <FormHelperText className='errorHelperText'>Select Office</FormHelperText>}
                    </FormControl>
                </div>

                <div className='form-control-input'>
                    <FormControl required fullWidth>
                        <InputLabel id='shift-type-label'>Booking Type</InputLabel>
                        <Select
                            labelId="booking-type-label"
                            id="bookingType"
                            value={customizedScheduledBean?.[currentIdx]?.bookingType || ""}
                            error={isSubmit && !customizedScheduledBean?.[currentIdx]?.bookingType}
                            //value={values.bookingType}
                            //error={touched.bookingType && Boolean(errors.bookingType)}
                            name="bookingType"
                            label="Booking Type"
                            onChange={(e) => handleChangeMultiple(e, currentIdx, bookingDate)}
                        >
                            <MenuItem  value={'LOGIN'}>Login</MenuItem>
                            <MenuItem value={'LOGOUT'}>Logout</MenuItem>
                            {/* {!editFlag && <MenuItem value={'Both'}>Both</MenuItem>} */}
                        </Select>
                        {/* {touched.bookingType && errors.bookingType && <FormHelperText className='errorHelperText'>{errors.bookingType}</FormHelperText>} */}
                    </FormControl>
                </div>
                {
                    customizedScheduledBean[currentIdx]?.bookingType === 'LOGIN' &&
                    <>
                        <div className='form-control-input'>
                            <FormControl required fullWidth>
                                <InputLabel id="login-label">Login Time</InputLabel>
                                <Select
                                    labelId="login-label"
                                    id="loginShift"
                                    value={customizedScheduledBean?.[currentIdx]?.loginShift || ""}
                                    error={isSubmit && !customizedScheduledBean?.[currentIdx]?.loginShift}
                                    name="loginShift"
                                    label="Login Time"
                                    onChange={(e) => handleChangeMultiple(e, currentIdx, bookingDate)}
                                >
                                    {!!multiLoginTimes[currentIdx]?.length && multiLoginTimes[currentIdx].map((time, idx) => (
                                        <MenuItem key={idx} value={time.shiftTime}>{time.shiftTime}</MenuItem>
                                    ))}
                                </Select>
                                {isSubmit && !customizedScheduledBean?.[currentIdx]?.loginShift && <FormHelperText className='errorHelperText'>Select Login Time</FormHelperText>}
                            </FormControl>
                        </div>
                    </>}
                { customizedScheduledBean[currentIdx]?.bookingType === 'LOGOUT' &&
                    (
                        <>
                            <div className='form-control-input'>
                                <FormControl required fullWidth>
                                    <InputLabel id="logout-label">Logout Time</InputLabel>
                                    <Select
                                        labelId="logout-label"
                                        id="logoutShift"
                                        value={customizedScheduledBean?.[currentIdx]?.logoutShift || ""}
                                        error={isSubmit && !customizedScheduledBean?.[currentIdx]?.logoutShift}
                                        name="logoutShift"
                                        label="Logout Time"
                                        onChange={(e) => handleChangeMultiple(e, currentIdx, bookingDate)}
                                    >
                                        {!!multiLogoutTimes[currentIdx]?.length && multiLogoutTimes[currentIdx].map((time, idx) => (
                                            <MenuItem key={idx} value={time.shiftTime}>{time.shiftTime}</MenuItem>
                                        ))}
                                    </Select>
                                    {isSubmit && !customizedScheduledBean?.[currentIdx]?.logoutShift && <FormHelperText className='errorHelperText'>Select Logout Time</FormHelperText>}
                                </FormControl>
                            </div>
                            <div className='form-control-input'>
                                <FormControl required>
                                        <FormGroup
                                        onChange={(e) => handleChangeMultiple(e, currentIdx, date)}
                                        value={customizedScheduledBean?.[currentIdx]?.nextDayLogOutCustomize || false}
                                        style={{flexDirection: "row"}}>
                                            <FormControlLabel name="nextDayLogOutCustomize" control={<Checkbox value={customizedScheduledBean?.[currentIdx]?.nextDayLogOutCustomize || false} checked={customizedScheduledBean?.[currentIdx]?.nextDayLogOutCustomize || false} />} label="Next Day Logout" />
                                        </FormGroup>
                                </FormControl>
                            </div>
                        </>
                        
                    )
                }
                {/* {
                    customizedScheduledBean[currentIdx]?.bookingType === 'Both' &&
                    <>
                        <div className='form-control-input'>
                            <FormControl required fullWidth>
                                <InputLabel id="login-label">Login Time</InputLabel>
                                <Select
                                    labelId="login-label"
                                    id="loginShift"
                                    value={customizedScheduledBean?.[currentIdx]?.loginShift || ""}
                                    error={isSubmit && !customizedScheduledBean?.[currentIdx]?.loginShift}
                                    name="loginShift"
                                    label="Login Time"
                                    onChange={(e) => handleChangeMultiple(e, currentIdx, bookingDate)}
                                >
                                    {!!multiLoginTimes[currentIdx]?.length && multiLoginTimes[currentIdx].map((time, idx) => (
                                        <MenuItem key={idx} value={time.id}>{time.shiftTime}</MenuItem>
                                    ))}
                                </Select>
                                {isSubmit && !customizedScheduledBean?.[currentIdx]?.loginShift && <FormHelperText className='errorHelperText'>Select Login Time</FormHelperText>}
                            </FormControl>
                        </div>
                        <div className='form-control-input'>
                            <FormControl required fullWidth>
                                <InputLabel id="logout-label">Logout Time</InputLabel>
                                <Select
                                    labelId="logout-label"
                                    id="logoutShift"
                                    value={customizedScheduledBean?.[currentIdx]?.logoutShift || ""}
                                    error={isSubmit && !customizedScheduledBean?.[currentIdx]?.logoutShift}
                                    name="logoutShift"
                                    label="Logout Time"
                                    onChange={(e) => handleChangeMultiple(e, currentIdx, bookingDate)}
                                >
                                    {!!multiLogoutTimes[currentIdx]?.length && multiLogoutTimes[currentIdx].map((time, idx) => (
                                        <MenuItem key={idx} value={time.id}>{time.shiftTime}</MenuItem>
                                    ))}
                                </Select>
                                {isSubmit && !customizedScheduledBean?.[currentIdx]?.logoutShift && <FormHelperText className='errorHelperText'>Select Logout Time</FormHelperText>}
                            </FormControl>
                        </div>
                    </>
                } */}
                {values.transportType !== TRANSPORT_TYPES.CAB && 
                    <>
                        <div className='form-control-input'>
                            <FormControl required>
                                <InputLabel id="pickUpPoint-label">Pickup Point</InputLabel>
                                <Select
                                    labelId="pickUpPoint-label"
                                    id="pickUpPoint"
                                    value={customizedScheduledBean?.[currentIdx]?.pickUpPoint || ""}
                                    error={isSubmit && !customizedScheduledBean?.[currentIdx]?.pickUpPoint}
                                    //value={values.pickUpPoint}
                                    //error={touched.pickUpPoint && Boolean(errors.pickUpPoint)}
                                    name="pickUpPoint"
                                    label="Pickup Point"
                                    onChange={(e) => handleChangeMultiple(e, currentIdx, bookingDate)}
                                >
                                    {!!nodalPoints?.length && nodalPoints.map((point, idx) => (
                                        <MenuItem key={idx} value={point.locationName}>{point.locationName}</MenuItem>
                                    ))}
                                </Select>
                                {isSubmit && !customizedScheduledBean?.[currentIdx]?.pickUpPoint && <FormHelperText className='errorHelperText'>Select Pickup Point</FormHelperText>}
                            </FormControl>
                        </div>
                        <div className='form-control-input'>
                            <FormControl required>
                                <InputLabel id="dropPoint-label">Drop Point</InputLabel>
                                <Select
                                    labelId="dropPoint-label"
                                    id="dropPoint"
                                    value={customizedScheduledBean?.[currentIdx]?.dropPoint || ""}
                                    error={isSubmit && !customizedScheduledBean?.[currentIdx]?.dropPoint}
                                    //value={values.dropPoint}
                                    //error={touched.dropPoint && Boolean(errors.dropPoint)}
                                    name="dropPoint"
                                    label="Drop Point"
                                    onChange={(e) => handleChangeMultiple(e, currentIdx, bookingDate)}
                                >
                                    {!!nodalPoints?.length && nodalPoints.map((point, idx) => (
                                        <MenuItem key={idx} value={point.locationName}>{point.locationName}</MenuItem>
                                    ))}
                                </Select>
                                {isSubmit && !customizedScheduledBean?.[currentIdx]?.dropPoint && <FormHelperText className='errorHelperText'>Select Drop point</FormHelperText>}
                            </FormControl>
                        </div>
                    </>
                }
            </div>
            
            </>
        );
    };

    const renderSingleDay = () => {
        return (
            <div className={styles.perDateContainer}>
                <div className='form-control-input'>
                    <FormControl required fullWidth>
                        <InputLabel id="primary-office-label">Office ID</InputLabel>
                        <Select
                            labelId="primary-office-label"
                            id="officeId"
                            value={values.officeId}
                            error={touched.officeId && Boolean(errors.officeId)}
                            name="officeId"
                            label="Primary Office"
                            onChange={handleChange}
                        >
                            {!!offices?.length && offices.map((office, idx) => (
                                <MenuItem key={idx} value={office.officeId}>{getFormattedLabel(office.officeId)}, {office.address}</MenuItem>
                            ))}
                        </Select>
                        {touched.officeId && errors.officeId && <FormHelperText className='errorHelperText'>{errors.officeId}</FormHelperText>}
                    </FormControl>
                </div>
                <div className='form-control-input'>
                    <FormControl required fullWidth>
                        <InputLabel id='shift-type-label'>Booking Type</InputLabel>
                        <Select
                            labelId="booking-type-label"
                            id="bookingType"
                            value={values.bookingType}
                            error={touched.bookingType && Boolean(errors.bookingType)}
                            name="bookingType"
                            label="Booking Type"
                            onChange={(e)=>{handleChange(e);setShiftType(e.target.value)}}
                        >
                            <MenuItem value={'LOGIN'}>Login</MenuItem>
                            <MenuItem value={'LOGOUT'}>Logout</MenuItem>
                            {!editFlag && <MenuItem value={'Both'}>Both</MenuItem>}
                        </Select>
                        {/* {touched.bookingType && errors.bookingType && <FormHelperText className='errorHelperText'>{errors.bookingType}</FormHelperText>} */}
                    </FormControl>
                </div>
                {
                    shiftType !== '' &&
                    <>
                        {
                            shiftType === 'LOGIN' ?
                            <div className='form-control-input'>
                                <FormControl required fullWidth>
                                    <InputLabel id="login-label">Login Time</InputLabel>
                                    <Select
                                        disabled={(values.bookingFromDate != "" && values.bookingToDate != "") ? false : true}
                                        labelId="login-label"
                                        id="loginShift"
                                        value={values.loginShift}
                                        error={touched.loginShift && Boolean(errors.loginShift)}
                                        name="loginShift"
                                        label="Login Time"
                                        onChange={(e)=>{handleShiftChange(e);handleChange(e)}}
                                    >
                                        {!!loginTimes?.length && loginTimes.map((time, idx) => (
                                            <MenuItem key={idx} value={time.shiftTime}>{time.shiftTime}</MenuItem>
                                        ))}
                                    </Select>
                                    {touched.loginShift && errors.loginShift && <FormHelperText className='errorHelperText'>{errors.loginShift}</FormHelperText>}
                                </FormControl>
                            </div>
                            :
                            (
                                shiftType === 'LOGOUT' ?
                                <>
                                    <div className='form-control-input'>
                                        <FormControl required fullWidth>
                                            <InputLabel id="logout-label">Logout Time</InputLabel>
                                            <Select
                                                disabled={(values.bookingFromDate != "" && values.bookingToDate != "") ? false : true}
                                                labelId="logout-label"
                                                id="logoutShift"
                                                value={values.logoutShift}
                                                error={touched.logoutShift && Boolean(errors.logoutShift)}
                                                name="logoutShift"
                                                label="Logout Time"
                                                onChange={(e)=>{handleShiftChange(e);handleChange(e)}}
                                            >
                                                {!!logoutTimes?.length && logoutTimes.map((time, idx) => (
                                                    <MenuItem key={idx} value={time.shiftTime}>{time.shiftTime}</MenuItem>
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
                                </>
                                :
                                (
                                    <>
                                        <div className='form-control-input'>
                                            <FormControl required fullWidth>
                                                <InputLabel id="login-label">Login Time</InputLabel>
                                                <Select
                                                    disabled={(values.bookingFromDate != "" && values.bookingToDate != "") ? false : true}
                                                    labelId="login-label"
                                                    id="loginShift"
                                                    value={values.loginShift}
                                                    error={touched.loginShift && Boolean(errors.loginShift)}
                                                    name="loginShift"
                                                    label="Login Time"
                                                    onChange={(e)=>{handleShiftChange(e);handleChange(e)}}
                                                >
                                                    {!!loginTimes?.length && loginTimes.map((time, idx) => (
                                                        <MenuItem key={idx} value={time.shiftTime}>{time.shiftTime}</MenuItem>
                                                    ))}
                                                </Select>
                                                {touched.loginShift && errors.loginShift && <FormHelperText className='errorHelperText'>{errors.loginShift}</FormHelperText>}
                                            </FormControl>
                                        </div>
                                        <div className='form-control-input'>
                                            <FormControl required fullWidth>
                                                <InputLabel id="logout-label">Logout Time</InputLabel>
                                                <Select
                                                    disabled={(values.bookingFromDate != "" && values.bookingToDate != "") ? false : true}
                                                    labelId="logout-label"
                                                    id="logoutShift"
                                                    value={values.logoutShift}
                                                    error={touched.logoutShift && Boolean(errors.logoutShift)}
                                                    name="logoutShift"
                                                    label="Logout Time"
                                                    onChange={(e)=>{handleShiftChange(e);handleChange(e)}}
                                                >
                                                    {!!logoutTimes?.length && logoutTimes.map((time, idx) => (
                                                        <MenuItem key={idx} value={time.shiftTime}>{time.shiftTime}</MenuItem>
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
                                    </>
                                )
                            )
                        }
                    </>
                }
            </div>
        );
    };

    const renderDateRange = () => {
        const startDate = formik.values.bookingFromDate ? moment(formik.values.bookingFromDate, DATE_FORMAT) : "";
        const endDate = formik.values.bookingToDate ? moment(formik.values.bookingToDate, DATE_FORMAT) : "";
        if (startDate && endDate && values.isCustomiseSchedule) {
            const dateRange = [];
            let currentDate = startDate.clone();
            let count = 0;
            while (currentDate.isSameOrBefore(endDate, 'day')) {
                dateRange.push(renderMultipleDay(currentDate, count));
                currentDate.add(1, 'day');
                count++;
            }
            return dateRange;
        } else {
            return renderSingleDay();
        }
    };

    const handleShiftChange = (e) =>{
        const { target } = e;
        const { value, name } = target || {};
        if(name === "loginShift"){
            const targetShift = loginTimes.find((item)=>{
                console.log(item);
                return item.shiftTime === value;
            })
            setLoginShiftId(targetShift?.id);
        }
        else if(name === "logoutShift"){
            const targetShift = logoutTimes.find((item)=>{
                console.log(item);
                return item.shiftTime === value;
            })
            setLogoutShiftId(targetShift?.id);
        }
        console.log(e,">>>>>>>>>>>>",values.bookingType );
    }

    useEffect(() => {
        if (values.officeId && values.transportType) {
            if(bookingFor === 3){
                fetchInOutTeamsTime(true);
                fetchInOutTeamsTime();
            }
            else{
                fetchInOutTimes(true);  
                fetchInOutTimes();
            }
        }
        if (values.transportType !== TRANSPORT_TYPES.CAB && !nodalPoints?.length && values.officeId) {
            fetchNodalPoints();
        }
    }, [values.transportType, values.officeId]);

    useEffect(() => {
        if (values.transportType !== TRANSPORT_TYPES.CAB) {
            formik.setFieldValue("isCustomiseSchedule", false);
            setCustomizedScheduledBean([]);
            setMultiLoginTimes([]);
            setMultiLogoutTimes([]);
        }
    }, [values.transportType]);

    useEffect(() => {
        const startDate = formik.values.bookingFromDate ? moment(formik.values.bookingFromDate, DATE_FORMAT) : "";
        const endDate = formik.values.bookingToDate ? moment(formik.values.bookingToDate, DATE_FORMAT) : "";
        if (values.isCustomiseSchedule && startDate && endDate && (values.officeId || values.loginShift || values.logoutShift || values.nextDayLogOut)) {
            const customisedData = [];
            const loginTimeShifts = [];
            const logoutTimeShifts = [];
            let currentDate = startDate.clone();
            let count = 0;
            while (currentDate.isSameOrBefore(endDate, 'day')) {
                customisedData[count] = {};
                if (values.officeId) {
                    customisedData[count].officeId = values.officeId;
                }
                if (values.loginShift) {
                    customisedData[count].loginShift = values.loginShift;
                }
                if (values.logoutShift) {
                    customisedData[count].logoutShift = values.logoutShift;
                }
                if (values.nextDayLogOut) {
                    customisedData[count].nextDayLogOutCustomize = values.nextDayLogOut;
                }
                if (Object.keys(customisedData[count])?.length) {
                    customisedData[count].scheduleDate = moment(currentDate).format("YYYY-MM-DD");
                }
                if (loginTimes?.length) {
                    loginTimeShifts[count] = loginTimes;
                }
                if (logoutTimes?.length) {
                    logoutTimeShifts[count] = logoutTimes;
                }
                currentDate.add(1, 'day');
                count++;
            }
            if (customisedData?.length) {
                setCustomizedScheduledBean(customisedData);
            }
            if (loginTimeShifts?.length) {
                setMultiLoginTimes(loginTimeShifts);
            }
            if (logoutTimeShifts?.length) {
                setMultiLogoutTimes(logoutTimeShifts);
            }
        } else {
            setCustomizedScheduledBean([]);
            setMultiLoginTimes([]);
            setMultiLogoutTimes([]);                    
        }
    }, [values.isCustomiseSchedule]);

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
            console.log(data.areaName)
            setSelectedOtherUserDetails(data);
            setAreaName(data?.areaName);
        } catch (e) {
            console.error(e);
        }
    };

    const onChangeHandler = (val) => {
        console.log(val);
        if (val?.empId) {
            setSelectedUsers([val.data]);
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
        var idArray = teamUsers.map(item => item.email);
        console.log(idArray, 'ids');
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

    const handleMultiSubmit = () => {
        setIsSubmit(true);
        console.log(customizedScheduledBean)
        let isInvalid = customizedScheduledBean.some(individualBean => {
            if (individualBean.officeId) {
                if ((individualBean.bookingType === 'LOGIN' && individualBean.loginShift) ||
                    (individualBean.bookingType === 'LOGOUT' && individualBean.logoutShift) ||
                    (individualBean.bookingType === 'Both' && individualBean.logoutShift && individualBean.loginShift)) {
                    console.log(false);
                    return false;
                }
            }
            console.log(true);
            return true;
        });
        if (!isInvalid) {
            var modifiedCustomizeSchedule = [];
            customizedScheduledBean.map((val,index)=>{
                val.bookingType === 'LOGOUT' && val['loginShift'] && delete val['loginShift'];
                val.bookingType === 'LOGIN' && val['logoutShift'] && delete val['logoutShift'];
                //this is for only login or logout if in future the booking is created for both need to update the logic
                val['shiftId'] = customizedShiftIdBean[index].shiftId;
                modifiedCustomizeSchedule.push(val);
            })
            setCustomizedScheduledBean(modifiedCustomizeSchedule);
            console.log(modifiedCustomizeSchedule,">>>>>>>santosh");
            handleSubmit();
        }
    };

    const handleScheduleChange = (event) => {
        formik.setFieldValue("isCustomiseSchedule", !Boolean(values.isCustomiseSchedule));
    };

    return (
        <div>
            <div className={styles.bookingForContainer}>
                <div className='form-control-input'>
                    {!editFlag &&
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
                    }
                </div>
            </div>
            {currentBookingFlow === 1 && <div className={styles.mainBookingContainer}>
                <div className={styles.dateRangeContainer}>
                    <div className={`form-control-input ${styles.formControlInput}`}>
                        {
                            editFlag ?
                            <>
                                <InputLabel>Booking Date</InputLabel>
                                <div className={styles.bookingDateRangeInnerContainer}>
                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                        <DatePicker 
                                            disabled={editFlag || values.isCustomiseSchedule} 
                                            name="bookingDate" format={'DD-MM-YYYY'} 
                                            value={values.bookingDate ? moment(values.bookingDate) : null} 
                                        />
                                    </LocalizationProvider>
                                </div>
                            </>
                            :
                            <>
                                <InputLabel>Select Date Range</InputLabel>
                                <div className={styles.dateRangeInnerContainer}>
                                    <LocalizationProvider dateAdapter={AdapterMoment}>
                                        <FormControl>
                                            <DatePicker disabled={editFlag || values.isCustomiseSchedule} name="bookingFromDate" format={'DD-MM-YYYY'} value={values.bookingFromDate ? moment(values.bookingFromDate) : null} onChange={(e) => handleDateChange(e, "bookingFromDate")} />
                                            {touched.bookingFromDate && errors.bookingFromDate && <FormHelperText className='errorHelperText'>{errors.bookingFromDate}</FormHelperText>}
                                        </FormControl>
                                        <FormControl>
                                            <DatePicker disabled={editFlag || values.isCustomiseSchedule} name="bookingToDate" format={'DD-MM-YYYY'} value={values.bookingToDate ? moment(values.bookingToDate) : null} onChange={(e) => handleDateChange(e, "bookingToDate")} />
                                            {touched.bookingToDate && errors.bookingToDate && <FormHelperText className='errorHelperText'>{errors.bookingToDate}</FormHelperText>}
                                        </FormControl>
                                    </LocalizationProvider>
                                    <div className={`form-control-input`} style={{margin: '5px 0 0 20px'}}>
                                        <FormControl required>
                                            <FormGroup
                                                onChange={handleChange}
                                                value={values.bookingOnWorkingDay}
                                                style={{flexDirection: "row"}}>
                                                  <FormControlLabel name="bookingOnWorkingDay" value={true} control={<Checkbox />} label="Booking on week offs" />
                                            </FormGroup>
                                        </FormControl>
                                    </div>
                                </div>
                                
                            </>
                        }
                    </div>
                </div>
                {
                    bookingFor === 3 &&
                    <div className={styles.userCountContainer}>
                        <div className={`form-control-input ${styles.formControlInput}`}>
                            <InputLabel>Selected User Count : {selectedUsers.length}</InputLabel>
                        </div>
                    </div>
                }
                <div className={`${styles.mainBookingDataContainer} pt-2`}>
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
                            {!editFlag &&
                                <FormGroup ref={customiseSchRef} value={values.isCustomiseSchedule} onChange={handleScheduleChange}>
                                    <InputLabel>Customize Schedule</InputLabel>
                                    <FormControlLabel disabled={isSelectedDate()} name="isCustomiseSchedule" control={<Switch checked={values.isCustomiseSchedule} />} label={values.isCustomiseSchedule ? "On" : "Off"} />
                                </FormGroup>
                            }
                        </div>
                    </div>
                    <div>
                        {renderDateRange()}
                    </div>
                    {values.transportType !== TRANSPORT_TYPES.CAB && !values.isCustomiseSchedule &&
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
                                        <MenuItem key={idx} value={point.locationName}>{point.locationName}</MenuItem>
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
                                        <MenuItem key={idx} value={point.locationName}>{point.locationName}</MenuItem>
                                    ))}
                                </Select>
                                {touched.dropPoint && errors.dropPoint && <FormHelperText className='errorHelperText'>{errors.dropPoint}</FormHelperText>}
                            </FormControl>
                        </div>
                    </div>}
                    <div className='addBtnContainer' style={{paddingBottom: "20px", flexDirection: "row-reverse"}}>
                        <div>
                            { editFlag && <button onClick={backHandler} className='btn btn-secondary'>Back</button>}

                            <button type="submit" onClick={values.isCustomiseSchedule ? handleMultiSubmit : handleSubmit} className='btn btn-primary'>{editFlag ? 'Update': 'Create'} Booking</button>
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