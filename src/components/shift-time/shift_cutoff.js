import React, { useEffect, useState } from 'react';
import Grid from '../grid';
import CutoffForEdit from './cutoffForEdit'
import CutoffForCancel from './cutoffForCancel'
import CutoffForNoShow from './cutoffForNoShow'
import ShiftService from '@/services/shift.service';

const ShiftCutoff = () => {
    const headers = [{
        key: "officeIds",
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
        // }
    ];
    const [cutOffState, setCutOffState] = useState({
        forEdit: false,
        forCancel: false,
        forNoShow: false
    })
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
            {!cutOffState.forEdit && !cutOffState.forCancel && !cutOffState.forNoShow && <div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <div className='btnContainer'>
                        <button onClick={() => setCutOffState({ ...cutOffState, forEdit: true })} className='btn btn-primary'>Cutoff for edit</button>
                    </div>
                    <div className='btnContainer' style={{ marginLeft: '10px', marginRight: '10px' }}>
                        <button onClick={() => setCutOffState({ ...cutOffState, forCancel: true })} className='btn btn-primary'>Cutoff for cancel</button>
                    </div>
                    <div className='btnContainer'>
                        <button onClick={() => setCutOffState({ ...cutOffState, forNoShow: true })} className='btn btn-primary'>Cutoff for no show</button>
                    </div>
                </div>
                <div className='gridContainer'>
                    <Grid headers={headers} listing={viewShiftTimeData} enableDisableRow={true} />
                </div>
            </div>}
            {cutOffState.forEdit && <div>
                <CutoffForEdit SetForEdit={setCutOffState} />
            </div>}
            {cutOffState.forCancel && <div>
                <CutoffForCancel SetForCancel={setCutOffState} />
            </div>}
            {cutOffState.forNoShow && <div>
                <CutoffForNoShow SetForNoShow={setCutOffState} />
            </div>}
        </div>
    );
}

export default ShiftCutoff;