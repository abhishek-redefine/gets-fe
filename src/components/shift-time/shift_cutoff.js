import React, { useEffect, useState } from 'react';
import Grid from '../grid';
import CutoffForEdit from './cutoffForEdit'
import CutoffForCancel from './cutoffForCancel'
import CutoffForNoShow from './cutoffForNoShow'
import ShiftService from '@/services/shift.service';

const ShiftCutoff = ({
    onSuccess
}) => {
    const [forEdit, setForEdit] = useState(false);
    const [forCancel, setForCancel] = useState(false);
    const [forNoShow, setForNoShow] = useState(false);
    const [viewShiftTimeData, setViewShiftTimeData] = useState()
    const headers = [{
        key: "officeId",
        display: "Office ID"
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
        key: "transportType",
        display: "Transport Type"
    },
    {
        key: "routeType",
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

    useEffect(() => {
        initializer()
    }, []);

    return (
        <div className='internalSettingContainer'>
            {!forEdit && !forCancel && !forNoShow && <div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <div className='btnContainer'>
                        <button onClick={() => setForEdit(true)} className='btn btn-primary'>Cutoff for edit</button>
                    </div>
                    <div className='btnContainer' style={{ marginLeft: '10px', marginRight: '10px' }}>
                        <button onClick={() => setForCancel(true)} className='btn btn-primary'>Cutoff for cancel</button>
                    </div>
                    <div className='btnContainer'>
                        <button onClick={() => setForNoShow(true)} className='btn btn-primary'>Cutoff for no show</button>
                    </div>
                </div>
                <div className='gridContainer'>
                    <Grid headers={headers} listing={viewShiftTimeData} />
                </div>
            </div>}
            {forEdit && <div>
                <CutoffForEdit SetForEdit={setForEdit} />
            </div>}
            {forCancel && <div>
                <CutoffForCancel SetForCancel={setForCancel} />
            </div>}
            {forNoShow && <div>
                <CutoffForNoShow SetForNoShow={setForNoShow} />
            </div>}
        </div>
    );
}

export default ShiftCutoff;