import React, { useEffect, useState } from 'react';
import Grid from '../grid';
import CreateShiftTime from '@/components/shift-time/create_shift_time';
import ShiftService from '@/services/shift.service';
import { useDispatch } from 'react-redux';
import { toggleToast } from '@/redux/company.slice';
import OfficeService from '@/services/office.service';
import { getFormattedLabel } from '@/utils/utils';
import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';

const ViewShiftTime = () => {
    const headers = [{
        key: "officeIds",
        display: "Office IDs"
    },
    {
        key: "shiftType",
        display: "Shift Type"
    },
    {
        key: "shiftTime",
        display: "Shift Time"
    },
    {
        key: "transportTypes",
        display: "Transport Type"
    },
    {
        key: "routeTypes",
        display: "Route Type"
    },
    {
        key: "shiftWeekdayVisibility",
        display: "Shift Weekday Visibility"
    },
    // {
    //     key: "startDateEndDate",
    //     display: "Start Date/End Date"
    // },
    {
        key: "hamburgerMenu",
        html: <><span className="material-symbols-outlined">more_vert</span></>,
        navigation: true,
        menuItems: [
            {
                display: "Edit",
                key: "edit"
            },
            {
                display: "Enable",
                key: "enable"
            },
            {
                display: "Disable",
                key: "disable"
            }
        ]
    }
    ];

    const dispatch = useDispatch();

    const [offices, setOffice] = useState([]);
    const [shiftTypes,setShiftTypes] = useState([]);
    const [routeTypes,setRouteTypes] = useState([]);
    const [transportTypes,setTransportTypes] = useState([]);

    const [searchValues, setSearchValues] = useState({
        officeId: "",
        shiftType: "",
        routeType: "",
        transportType: "",
    });
    const handleFilterChange = (e) => {
        const { target } = e;
        const { value, name } = target;
        let newSearchValues = {...searchValues};
        newSearchValues[name] = value;
        setSearchValues(newSearchValues);
    };

    const [viewShiftTimeData, setViewShiftTimeData] = useState();
    const [showEditShiftTime, setShowEditShiftTime] = useState(false);
    const [valueEditShiftTime, setValueEditShiftTime] = useState(false);
    const [paginationData, setPaginationData] = useState();
    const [pagination, setPagination] = useState({
        page: 0,
        size: 10
    });
    
    const handlePageChange = (page) => {
        console.log(page);
        let updatedPagination = {...pagination};
        updatedPagination.page = page;
        setPagination(updatedPagination);
    };

    const filterHandler = () => {
        let newPagination = {...pagination};
        if (newPagination.page === 0) {
            fetchAllShift(false);
        } else {
            newPagination.page = 0;
            setPagination(newPagination);
        }
    };

    const resetHandler = () =>{
        let newPagination = {...pagination};
        setSearchValues({
            officeId: "",
            shiftType: "",
            routeType: "",
            transportType: "",
        })
        if (newPagination.page === 0) {
            fetchAllShift(true);
        } else {
            newPagination.page = 0;
            setPagination(newPagination);
        }
    }

    const fetchAllShift = async (resetFlag) => {
        try {
            const params = new URLSearchParams(pagination);
            let allSearchValues = {...searchValues};
            if(resetFlag){
                Object.keys(allSearchValues).forEach((objKey)=>{
                    delete allSearchValues[objKey];
                })
            }
            Object.keys(allSearchValues).forEach((objKey) => {
                if (allSearchValues[objKey] === null || allSearchValues[objKey] === "") {
                    delete allSearchValues[objKey];
                }
            });
            const response = await ShiftService.getAllShiftSearchByBean(params.toString(),allSearchValues);
            const { data } = response || {};
            response.data.data.map((item) => {
                item.shiftWeekdayVisibility = "";

                if (item.mondayShift) {
                    item.shiftWeekdayVisibility += "MON";
                }
                if (item.tuesdayShift) {
                    if (item.shiftWeekdayVisibility) {
                        item.shiftWeekdayVisibility += ", TUES";
                    } else {
                        item.shiftWeekdayVisibility += "TUES";
                    }
                }
                if (item.wednesdayShift) {
                    if (item.shiftWeekdayVisibility) {
                        item.shiftWeekdayVisibility += ", WED";
                    } else {
                        item.shiftWeekdayVisibility += "WED";
                    }
                }
                if (item.thursdayShift) {
                    if (item.shiftWeekdayVisibility) {
                        item.shiftWeekdayVisibility += ", THURS";
                    } else {
                        item.shiftWeekdayVisibility += "THURS";
                    }
                }
                if (item.fridayShift) {
                    if (item.shiftWeekdayVisibility) {
                        item.shiftWeekdayVisibility += ", FRI";
                    } else {
                        item.shiftWeekdayVisibility += "FRI";
                    }
                }
                if (item.saturdayShift) {
                    if (item.shiftWeekdayVisibility) {
                        item.shiftWeekdayVisibility += ", SAT";
                    } else {
                        item.shiftWeekdayVisibility += "SAT";
                    }
                }
                if (item.sundayShift) {
                    if (item.shiftWeekdayVisibility) {
                        item.shiftWeekdayVisibility += ", SUN";
                    } else {
                        item.shiftWeekdayVisibility += "SUN";
                    }
                }
                // item.startDateEndDate = item.shiftStartDate.slice(0, 10) + " - " + item.shiftEndDate.slice(0, 10);
            })
            setViewShiftTimeData(response.data.data);
            let localPaginationData = {...data};
            delete localPaginationData?.data;
            setPaginationData(localPaginationData)
        } catch (e) {
        }
    };

    const onMenuItemClick = async (key, clickedItem) => {
        if (key === "edit") {
            setValueEditShiftTime(clickedItem)
            setShowEditShiftTime(true)
        } else if (key === "enable") {
            const response = await ShiftService.enableDisableShifts(clickedItem.id, true);
            if (response.status === 200) {
                dispatch(toggleToast({ message: 'Shift enabled successfully!', type: 'success' }));
                fetchAllShift(false);
            }
        } else if (key === "disable") {
            const response = await ShiftService.enableDisableShifts(clickedItem.id, false);
            if (response.status === 200) {
                dispatch(toggleToast({ message: 'Shift disabled successfully!', type: 'success' }));
                fetchAllShift(false);
            }
        }
    };

    const fetchMasterData = async() =>{
        console.log("fetching master data")
        try {
            var officeResponse;
            var shiftTypeResponse;
            var transportTypeResponse;
            var routeTypeResponse;

            await Promise.allSettled([
                officeResponse = await OfficeService.getAllOffices(),
                shiftTypeResponse = await ShiftService.getMasterData('ShiftType'),
                transportTypeResponse = await ShiftService.getMasterData('TransportType'),
                routeTypeResponse = await ShiftService.getMasterData('RouteType')
            ])

            const { data } = officeResponse || {};
            const { clientOfficeDTO } = data || {};
            setOffice(clientOfficeDTO);
            setShiftTypes(shiftTypeResponse.data);
            setTransportTypes(transportTypeResponse.data);
            setRouteTypes(routeTypeResponse.data);
        }
        catch(err){
            console.log("Error",err);
        }
    }

    useEffect(() => {
        fetchMasterData();
    }, []);

    useEffect(()=>{
        fetchAllShift(false);
    },[pagination])

    return (
        <>
            {
                showEditShiftTime ?
                    <CreateShiftTime editValues={valueEditShiftTime} />
                    :
                    <div className='internalSettingContainer'>
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
                            <div style={{minWidth: "180px"}} className='form-control-input'>
                                <FormControl fullWidth>
                                    <InputLabel id="shift-type-label">Shift Type</InputLabel>
                                    <Select
                                        style={{width: "180px"}}                                    
                                        labelId="shift-type-label"
                                        id="shiftType"
                                        value={searchValues.shiftType}
                                        name="shiftType"
                                        label="Shift Type"
                                        onChange={handleFilterChange}
                                    >
                                        {shiftTypes.map((sT, idx) => (
                                            <MenuItem key={idx} value={sT.value}>{getFormattedLabel(sT.value)}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div style={{minWidth: "180px"}} className='form-control-input'>
                                <FormControl fullWidth>
                                    <InputLabel id="route-type-label">Route Type</InputLabel>
                                    <Select
                                        style={{width: "180px"}}                                    
                                        labelId="route-type-label"
                                        id="routeType"
                                        value={searchValues.routeType}
                                        name="routeType"
                                        label="Route Type"
                                        onChange={handleFilterChange}
                                    >
                                        {!!routeTypes?.length && routeTypes.map((item, idx) => (
                                            <MenuItem key={idx} value={item.value}>{item.displayName}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div style={{minWidth: "180px"}} className='form-control-input'>
                                <FormControl fullWidth>
                                    <InputLabel id="transport-type-label">Transport Type</InputLabel>
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
                                </FormControl>
                            </div>
                            <div className='form-control-input' style={{minWidth: "70px"}}>
                                <button type='submit' onClick={filterHandler} className='btn btn-primary filterApplyBtn'>Apply</button>
                            </div>
                            <div className='form-control-input' style={{minWidth: "70px"}}>
                                <button type='submit' onClick={resetHandler} className='btn btn-primary filterApplyBtn'>Reset</button>
                            </div>
                        </div>
                        <div>
                            <div className='gridContainer'>
                                <Grid pageNoText="pageNumber" pagination={paginationData} headers={headers} listing={viewShiftTimeData} onMenuItemClick={onMenuItemClick} handlePageChange={handlePageChange} enableDisableRow={true} />
                            </div>
                        </div>
                    </div>
            }
        </>
    );
}

export default ViewShiftTime;