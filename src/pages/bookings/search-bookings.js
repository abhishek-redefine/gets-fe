import Grid from '@/components/grid';
import { DATE_FORMAT, DEFAULT_PAGE_SIZE, MASTER_DATA_TYPES, SHIFT_TYPE } from '@/constants/app.constants.';
import bookings from '@/layouts/bookings';
import { toggleToast } from '@/redux/company.slice';
import { setMasterData } from '@/redux/master.slice';
import BookingService from '@/services/booking.service';
import MasterDataService from '@/services/masterdata.service';
import OfficeService from '@/services/office.service';
import { getFormattedLabel } from '@/utils/utils';
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const SearchBookings = () => {

    const headers = [{
        key: "id",
        display: "Booking ID"
    },
    {
        key: "bookingFromDate",
        display: "Booking From"
    },
    {
        key: "bookingToDate",
        display: "Booking To"
    },
    {
        key: "employeeId",
        display: "Employee Id"
    },
    {
        key: "officeId",
        display: "Office Id"
    },
    {
        key: "teamId",
        display: "Team Id"
    },
    {
        key: "bookingType",
        display: "Booking Type"
    },
    {
        key: "hamburgerMenu",
        html: <><span className="material-symbols-outlined">more_vert</span></>,
        navigation: true,
        menuItems: [{
            display: "Cancel Booking",
            key: "cancel"
        }]
    }];

    const { ShiftType: shiftTypes, TransportType: transportTypes } = useSelector((state) => state.master);
    const [bookingListing, setBookingListing] = useState([]);
    const [offices, setOffice] = useState([]);
    const [paginationData, setPaginationData] = useState();
    const [cancelBookingData, setCancelBookingData] = useState(null);
    const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
    const [logoutTimes, setLogoutTimes] = useState([]);
    const [loginTimes, setLoginTimes] = useState([]);
    const [searchValues, setSearchValues] = useState({
        officeId: "",
        bookingDate: null,
        shiftType: "",
        shiftTimeLogin: "",
        shiftTimeLogout: "",
        transportType: ""
    });
    const dispatch = useDispatch();
    const [pagination, setPagination] = useState({
        page: 0,
        size: DEFAULT_PAGE_SIZE,        
    });

    const fetchInOutTimes = async (isIn, newSearchValues) => {
        try {
            const response = await BookingService.getLoginLogoutTimes(newSearchValues.officeId, isIn, newSearchValues.transportType);
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

    const fetchAllBookings = async () => {
        try {
            const params = new URLSearchParams(pagination);
            let allSearchValues = {...searchValues};
            if (allSearchValues.bookingDate) {
                allSearchValues.bookingDate = moment(allSearchValues.bookingDate).format("YYYY-MM-DD");
            }
            Object.keys(allSearchValues).forEach((objKey) => {
                if (allSearchValues[objKey] === null || allSearchValues[objKey] === "") {
                    delete allSearchValues[objKey];
                }
            });
            const response = await BookingService.getAllBookings(params.toString(), allSearchValues);
            const { data } = response || {};
            const { data: paginatedResponse } = data || {};
            setBookingListing(paginatedResponse || []);
            let localPaginationData = {...data};
            delete localPaginationData?.data;
            setPaginationData(localPaginationData);
        } catch (e) {
            console.error(e);
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

    useEffect(() => {
        fetchAllBookings();
    }, [pagination]);

    useEffect(() => {
        if (!shiftTypes?.length) {
            fetchMasterData(MASTER_DATA_TYPES.SHIFT_TYPE);
        }
        if (!transportTypes.length) {
            fetchMasterData(MASTER_DATA_TYPES.TRANSPORT_TYPE);
        }
        fetchAllOffices();
    }, []);

    const handlePageChange = (page) => {
        let updatedPagination = {...pagination};
        updatedPagination.page = page;
        setPagination(updatedPagination);
    };

    const onMenuItemClick = (key, values) => {
        if (key === "edit") {
        //   editBooking(values);
        } else if (key === "cancel") {
            setCancelBookingData(values);
            setIsRemoveDialogOpen(true);
        }
    };

    const handleCancelDialogClose = () => {
        setIsRemoveDialogOpen(false);
        setCancelBookingData(null);
    };

    const handleCancelBooking = async () => {
        try {
            await BookingService.cancelBooking(cancelBookingData.id);
            dispatch(toggleToast({ message: 'Booking cancelled successfully!', type: 'success' }));
            handleCancelDialogClose();
        } catch (e) {
            console.error(e);
            dispatch(toggleToast({ message: e?.response?.data?.message || 'Error cancelling booking, please try again later!', type: 'error' }));
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

    const handleFilterChange = (e) => {
        const { target } = e;
        const { value, name } = target;
        let newSearchValues = {...searchValues};
        newSearchValues[name] = value;
        if (newSearchValues.officeId && newSearchValues.transportType && name !== "shiftTimeLogin" && name !== "shiftTimeLogout") {
            fetchInOutTimes(true, newSearchValues);
            fetchInOutTimes(false, newSearchValues);
        }
        setSearchValues(newSearchValues);
    };

    const searchBookings = () => {
        let newPagination = {...pagination};
        if (newPagination.page === 0) {
            fetchAllBookings();
        } else {
            newPagination.page = 0;
            setPagination(newPagination);
        }
    };

    return (
        <div>
            <div className='gridContainer'>
                <div className='filterContainer'>
                    <div style={{minWidth: "180px"}} className='form-control-input'>
                        <FormControl fullWidth>
                            <InputLabel id="primary-office-label">Primary Office</InputLabel>
                            <Select
                                style={{width: "180px"}}                                    
                                labelId="primary-office-label"
                                id="officeId"
                                value={searchValues.officeId}
                                name="officeId"
                                label="Office ID"
                                onChange={handleFilterChange}
                            >
                                {!!offices?.length && offices.map((office, idx) => (
                                    <MenuItem key={idx} value={office.officeId}>{getFormattedLabel(office.officeId)}, {office.address}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className='form-control-input'>
                        <InputLabel htmlFor="End-date">Booking Date</InputLabel>
                        <LocalizationProvider dateAdapter={AdapterMoment}>
                            <DatePicker name="bookingDate" format={DATE_FORMAT} value={searchValues.bookingDate ? moment(searchValues.bookingDate) : null} onChange={(e) => handleFilterChange({target: {name: "bookingDate", value: e}})} />
                        </LocalizationProvider>
                    </div>
                    <div style={{minWidth: "160px"}} className='form-control-input'>
                        {!!shiftTypes?.length && <FormControl fullWidth>
                            <InputLabel id="shiftType-label">Shift Type</InputLabel>
                            <Select
                                style={{width: "160px"}}
                                labelId="shiftType-label"
                                id="shiftType"
                                name="shiftType"
                                value={searchValues.shiftType}
                                label="Shift Type"
                                onChange={handleFilterChange}
                            >
                                {shiftTypes.map((sT, idx) => (
                                    <MenuItem key={idx} value={sT.value}>{getFormattedLabel(sT.value)}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>}
                    </div>
                    <div style={{minWidth: "170px"}} className='form-control-input'>
                        {!!transportTypes?.length && <FormControl fullWidth>
                            <InputLabel id="transportType-label">Transport Type</InputLabel>
                            <Select
                                style={{width: "170px"}}
                                labelId="transportType-label"
                                id="transportType"
                                name="transportType"
                                value={searchValues.transportType}
                                label="Transport Type"
                                onChange={handleFilterChange}
                            >
                                {transportTypes.map((sT, idx) => (
                                    <MenuItem key={idx} value={sT.value}>{getFormattedLabel(sT.value)}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>}
                    </div>
                    {!!loginTimes?.length && <div style={{minWidth: "160px"}} className='form-control-input'>
                        <FormControl fullWidth>
                            <InputLabel id="login-label">Login Time</InputLabel>
                            <Select
                                style={{width: "160px"}}
                                labelId="login-label"
                                id="shiftTimeLogin"
                                value={searchValues.shiftTimeLogin}
                                name="shiftTimeLogin"
                                label="Login Time"
                                onChange={handleFilterChange}
                            >
                                {!!loginTimes?.length && loginTimes.map((time, idx) => (
                                    <MenuItem key={idx} value={time}>{time}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>}
                    {!!logoutTimes?.length && <div style={{minWidth: "160px"}} className='form-control-input'>
                        <FormControl fullWidth>
                            <InputLabel id="logout-label">Logout Time</InputLabel>
                            <Select
                                style={{width: "160px"}}
                                labelId="logout-label"
                                id="shiftTimeLogout"
                                value={searchValues.shiftTimeLogout}
                                name="shiftTimeLogout"
                                label="Logout Time"
                                onChange={handleFilterChange}
                            >
                                {!!logoutTimes?.length && logoutTimes.map((time, idx) => (
                                    <MenuItem key={idx} value={time}>{time}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>}
                    <div className='form-control-input'>
                        <button type='submit' onClick={searchBookings} className='btn btn-primary filterApplyBtn'>Apply</button>
                    </div>
                </div>
                <Grid pageNoText="pageNumber" onMenuItemClick={onMenuItemClick} headers={headers} handlePageChange={handlePageChange} pagination={paginationData} listing={bookingListing} />
            </div>
            <Dialog open={isRemoveDialogOpen} onClose={handleCancelBooking}>
                <DialogTitle id="alert-dialog-title">Cancel Booking</DialogTitle>
                <DialogContent>
                    <div>
                        <p>Do you really want to cancel booking with Id {cancelBookingData?.id}?</p>
                    </div>
                </DialogContent>
                <DialogActions>
                    <div className='popupBtnContainer'>
                        <button className='btn btn-secondary' onClick={handleCancelDialogClose}>Cancel</button>
                        <button className='btn btn-primary' onClick={handleCancelBooking}>Yes</button>
                    </div>
                </DialogActions>
            </Dialog>
        </div>
    )
}

export default bookings(SearchBookings);