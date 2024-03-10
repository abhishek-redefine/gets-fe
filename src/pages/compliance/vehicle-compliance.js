import compliance from '@/layouts/compliance';
import React, { useEffect, useState } from 'react';
import Grid from '@/components/grid';
import ShiftService from '@/services/shift.service';

const VehicleCompliance = () => {
    const headers = [{
        key: "vehicleId",
        display: "Vehicle ID"
    },
    {
        key: "registrationNo",
        display: "Registration No"
    },
    {
        key: "vehicleType",
        display: "Vehicle Type"
    },
    {
        key: "officeId",
        display: "Office ID"
    },
    {
        key: "vendorName",
        display: "Vendor Name"
    },
    {
        key: "vehicleComplianceStatus",
        display: "Vehicle Compliance Status"
    },
    {
        key: "vehicleAge",
        display: "Vehicle Age"
    },
    {
        key: "insuranceExpiry",
        display: "Insurance Expiry"
    },
    {
        key: "roadTaxExpiry",
        display: "Road Tax Expiry"
    },
    {
        key: "pollutionExpiry",
        display: "Pollution Expiry"
    },
    {
        key: "permitExpiry",
        display: "Permit Expiry"
    },
    {
        key: "fitnessExpiry",
        display: "Fitness Expiry"
    },
    {
        key: "manufacturingDate",
        display: "Manufacturing Date"
    },
    {
        key: "registrationDate",
        display: "Registration Date"
    },
    {
        key: "inductionDate",
        display: "Induction Date"
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

export default compliance(VehicleCompliance);