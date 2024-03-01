import React, { useEffect, useState } from 'react';
import Grid from '../grid';
import CreateShiftTime from '@/components/shift-time/create_shift_time';
import ShiftService from '@/services/shift.service';

const ViewShiftTime = () => {
    const [viewShiftTimeData, setViewShiftTimeData] = useState()
    const [showEditShiftTime, setShowEditShiftTime] = useState(false)
    const [valueEditShiftTime, setValueEditShiftTime] = useState(false)
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
    {
        key: "startDateEndDate",
        display: "Start Date/End Date"
    },
    {
        key: "hamburgerMenu",
        html: <><span className="material-symbols-outlined">more_vert</span></>,
        navigation: true,
        menuItems: [{
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
    }];

    const [pagination, setPagination] = useState({
        pageNo: 1,
        pageSize: 10,
    });

    const initializer = async () => {
        try {
            const params = new URLSearchParams(pagination);
            const response = await ShiftService.getAllShiftsWOPagination(params.toString());

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

                item.startDateEndDate = item.shiftStartDate.slice(0, 10) + " - " + item.shiftEndDate.slice(0, 10);
            })
            setViewShiftTimeData(response.data.data)
        } catch (e) {
        }
    }

    const onMenuItemClick = async (key, clickedItem) => {
        console.log(key, clickedItem)
        if (key === "edit") {
            setShowEditShiftTime(true)
            setValueEditShiftTime(clickedItem)
        } else if(key==="enable") {
            const response = await ShiftService.enableDisableShifts(clickedItem.id,true);
            console.log(response)
        } else if(key==="disable") {
            const response = await ShiftService.enableDisableShifts(clickedItem.id,false);
            console.log(response)
        }
    }

    useEffect(() => {
        initializer()
    }, []);

    return (
        <>
            {
                showEditShiftTime ?
                    <CreateShiftTime editValues={valueEditShiftTime} />
                    :
                    <div className='internalSettingContainer'>
                        <div>
                            <div className='gridContainer'>
                                <Grid headers={headers} listing={viewShiftTimeData} onMenuItemClick={onMenuItemClick} />
                            </div>
                        </div>
                    </div>
            }
        </>
    );
}

export default ViewShiftTime;