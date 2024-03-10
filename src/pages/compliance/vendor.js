import compliance from '@/layouts/compliance';
import React, { useEffect, useState } from 'react';
import Grid from '@/components/grid';
import ShiftService from '@/services/shift.service';
import AddNewVehicle from '@/components/compliance/add_new_vehicle';

const EHS = () => {
    const headers = [{
        key: "sNo",
        display: "S.No."
    },
    {
        key: "vendorId",
        display: "Vendor ID"
    },
    {
        key: "vendorName",
        display: "Vendor Name"
    },
    {
        key: "emailId",
        display: "Email ID"
    },
    {
        key: "phoneNo",
        display: "Phone No"
    },
    {
        key: "city",
        display: "City"
    },
    {
        key: "officeId",
        display: "Office ID"
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
    const [addVehicleOpen, setAddVehicleOpen] = useState(false)
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
            {!addVehicleOpen && <div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <div className='btnContainer'>
                        <button onClick={() => setAddVehicleOpen(true)} className='btn btn-primary'>Add Vendor</button>
                    </div>
                </div>
                <div className='gridContainer'>
                    <Grid headers={headers} listing={viewShiftTimeData} enableDisableRow={true} />
                </div>
            </div>}
            {
                addVehicleOpen && <AddNewVehicle SetAddVehicleOpen={setAddVehicleOpen} />
            }
        </div>
    );
}

export default compliance(EHS);