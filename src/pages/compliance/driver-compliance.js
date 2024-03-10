import compliance from '@/layouts/compliance';
import React, { useEffect, useState } from 'react';
import Grid from '@/components/grid';
import ShiftService from '@/services/shift.service';

const DriverCompliance = () => {
    const headers = [{
        key: "driverName",
        display: "Driver Name"
    },
    {
        key: "vendorName",
        display: "Vendor Name"
    },
    {
        key: "complianceStatus",
        display: "Compliance Status"
    },
    {
        key: "officeId",
        display: "Office ID"
    },
    {
        key: "licenseNo",
        display: "License No."
    },
    {
        key: "licenseExpiryDate",
        display: "License Expiry Date"
    },
    {
        key: "age",
        display: "Age"
    },
    {
        key: "bGVStatus",
        display: "BGV Status"
    },
    {
        key: "bGVExpiry",
        display: "BGV Expiry"
    },
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
                display: "Deactivate",
                key: "deactivate"
            }
        ]
    }];
    const [viewShiftTimeData, setViewShiftTimeData] = useState()
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
                // item.startDateEndDate = item.shiftStartDate.slice(0, 10) + " - " + item.shiftEndDate.slice(0, 10);
            })
            setViewShiftTimeData(response.data.data)
        } catch (e) {
        }
    }

    useEffect(() => {
        initializer();
    }, []);

    return (
        <div className='internalSettingContainer'>
            <div>
                <div className='gridContainer'>
                    <Grid headers={headers} listing={viewShiftTimeData} enableDisableRow={true} />
                </div>
            </div>

        </div>
    );
}

export default compliance(DriverCompliance);