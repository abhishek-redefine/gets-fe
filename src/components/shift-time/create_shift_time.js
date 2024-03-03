import ShiftService from '@/services/shift.service';
import OfficeService from '@/services/office.service';
import dayjs from 'dayjs';
import { getFormattedLabel } from '@/utils/utils';
import { FormControl, FormControlLabel, InputLabel, MenuItem, Select } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimeField } from '@mui/x-date-pickers/TimeField'
import React, { useEffect, useState } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { toggleToast } from '@/redux/company.slice';
import { useDispatch } from 'react-redux';


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const CreateShiftTime = ({
    editEmployeeData,
    editValues
}) => {
    console.log('CreateShiftTime', editValues)
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    const dayNames = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];

    const dispatch = useDispatch();

    const [days, setDays] = useState([]); //['Monday','Tuesday']
    const [shiftTypeList, setShiftTypeList] = useState([]);
    const [transportTypeList, setTransportTypeList] = useState([]);
    const [routeTypeList, setRouteTypeList] = useState([]);
    const [officeList, setOfficeList] = useState([]);
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs().month(new Date().getMonth() + 1));
    const [formValues, setFormValues] = useState({
        "shiftTime": editValues ? editValues.shiftTime : '00:00',
        "shiftType": editValues ? editValues.shiftType : "",
        "officeIds": editValues ? editValues.officeIds : "",
        "transportTypes": editValues ? editValues.transportTypes : "",
        "weekDaysVisibility": editValues ? "" : "",
        "isVisibleOnHoliday": editValues ? editValues.isVisibleOnHoliday : false,
        "shiftStartDate": editValues ? "" : "",
        "shiftEndDate": editValues ? "" : "",
        "routeTypes": editValues ? editValues.routeTypes : "",
        "sundayShift": editValues ? editValues.sundayShift : false,
        "mondayShift": editValues ? editValues.mondayShift : false,
        "tuesdayShift": editValues ? editValues.tuesdayShift : false,
        "wednesdayShift": editValues ? editValues.wednesdayShift : false,
        "thursdayShift": editValues ? editValues.thursdayShift : false,
        "fridayShift": editValues ? editValues.fridayShift : false,
        "saturdayShift": editValues ? editValues.saturdayShift : false,
        "enabled": editValues ? editValues.enabled : true,
        "shiftCancelBookingAttribute": editValues ? editValues.shiftCancelBookingAttribute : "{\"Monday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Tuesday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Wednesday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Thursday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Friday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Saturday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Sunday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0}}",
        "shiftCreateBookingAttribute": editValues ? editValues.shiftCreateBookingAttribute : "{\"Monday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Tuesday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Wednesday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Thursday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Friday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Saturday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Sunday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0}}",
        "shiftNoShowBookingAttribute": editValues ? editValues.shiftNoShowBookingAttribute : "{\"Monday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Tuesday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Wednesday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Thursday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Friday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Saturday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Sunday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0}}",
    });

    const handleDaySelect = (event) => {
        const {
            target: { value },
        } = event;
        var daysValue = typeof value === 'string' ? value.split(',') : value
        var daysValueObject = {
            "sundayShift": false,
            "mondayShift": false,
            "tuesdayShift": false,
            "wednesdayShift": false,
            "thursdayShift": false,
            "fridayShift": false,
            "saturdayShift": false
        }

        if (typeof daysValue === 'string') {
            if (daysValue === 'Monday') {
                daysValueObject["mondayShift"] = true
            }
            if (daysValue === 'Tuesday') {
                daysValueObject["tuesdayShift"] = true
            }
            if (daysValue === 'Wednesday') {
                daysValueObject["wednesdayShift"] = true
            }
            if (daysValue === 'Thursday') {
                daysValueObject["thursdayShift"] = true
            }
            if (daysValue === 'Friday') {
                daysValueObject["fridayShift"] = true
            }
            if (daysValue === 'Saturday') {
                daysValueObject["saturdayShift"] = true
            }
            if (daysValue === 'Sunday') {
                daysValueObject["sundayShift"] = true
            }
        } else {
            if (daysValue.indexOf('Monday') > -1) {
                daysValueObject["mondayShift"] = true
            }
            if (daysValue.indexOf('Tuesday') > -1) {
                daysValueObject["tuesdayShift"] = true
            }
            if (daysValue.indexOf('Wednesday') > -1) {
                daysValueObject["wednesdayShift"] = true
            }
            if (daysValue.indexOf('Thursday') > -1) {
                daysValueObject["thursdayShift"] = true
            }
            if (daysValue.indexOf('Friday') > -1) {
                daysValueObject["fridayShift"] = true
            }
            if (daysValue.indexOf('Saturday') > -1) {
                daysValueObject["saturdayShift"] = true
            }
            if (daysValue.indexOf('Sunday') > -1) {
                daysValueObject["sundayShift"] = true
            }
        }
        console.log(typeof value === 'string' ? value.split(',') : value)
        setFormValues({
            ...formValues, ...daysValueObject
        })
        setDays(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const createShiftFormSubmit = async () => {
        try {
            const response = await ShiftService.createShift({ "shift": formValues });
            if (response.data === 'Shift has been created') {
                setFormValues({
                    "shiftTime": '00:00',
                    "shiftType": "",
                    "officeIds": "",
                    "transportTypes": "",
                    "weekDaysVisibility": "",
                    "isVisibleOnHoliday": false,
                    "shiftStartDate": "",
                    "shiftEndDate": "",
                    "routeTypes": "",
                    "sundayShift": false,
                    "mondayShift": false,
                    "tuesdayShift": false,
                    "wednesdayShift": false,
                    "thursdayShift": false,
                    "fridayShift": false,
                    "saturdayShift": false,
                    "enabled": true,
                    "shiftCancelBookingAttribute": "{\"Monday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Tuesday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Wednesday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Thursday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Friday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Saturday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Sunday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0}}",
                    "shiftCreateBookingAttribute": "{\"Monday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Tuesday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Wednesday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Thursday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Friday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Saturday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Sunday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0}}",
                    "shiftNoShowBookingAttribute": "{\"Monday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Tuesday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Wednesday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Thursday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Friday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Saturday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Sunday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0}}",
                });
                setDays([])
                dispatch(toggleToast({ message: 'Shift created successfully!', type: 'success' }));
            }
        } catch (e) {
        }
    }
    const editShiftFormSubmit = async () => {
        try {
            console.log(formValues)
            formValues.id=editValues.id;
            // const response = await ShiftService.updateShift({ "shift": formValues });
            if (response.data === 'Shift has been created') {
                setFormValues({
                    "shiftTime": '00:00',
                    "shiftType": "",
                    "officeIds": "",
                    "transportTypes": "",
                    "weekDaysVisibility": "",
                    "isVisibleOnHoliday": false,
                    "shiftStartDate": "",
                    "shiftEndDate": "",
                    "routeTypes": "",
                    "sundayShift": false,
                    "mondayShift": false,
                    "tuesdayShift": false,
                    "wednesdayShift": false,
                    "thursdayShift": false,
                    "fridayShift": false,
                    "saturdayShift": false,
                    "enabled": true,
                    "shiftCancelBookingAttribute": "{\"Monday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Tuesday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Wednesday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Thursday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Friday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Saturday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Sunday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0}}",
                    "shiftCreateBookingAttribute": "{\"Monday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Tuesday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Wednesday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Thursday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Friday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Saturday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Sunday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0}}",
                    "shiftNoShowBookingAttribute": "{\"Monday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Tuesday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Wednesday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Thursday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Friday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Saturday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Sunday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0}}",
                });
                setDays([])
                dispatch(toggleToast({ message: 'Shift created successfully!', type: 'success' }));
            }
        } catch (e) {
        }
    }

    const initializer = async () => {
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

        if (editValues) {
            var Days = []
            if (editValues.mondayShift) {
                Days.push("Monday")
            }
            if (editValues.tuesdayShift) {
                Days.push("Tuesday")
            }
            if (editValues.wednesdayShift) {
                Days.push("Wednesday")
            }
            if (editValues.thursdayShift) {
                Days.push("Thursday")
            }
            if (editValues.fridayShift) {
                Days.push("Friday")
            }
            if (editValues.saturdayShift) {
                Days.push("Saturday")
            }
            if (editValues.sundayShift) {
                Days.push("Sunday")
            }
            setDays(Days)
        }

        setOfficeList(clientOfficeDTO);
        setShiftTypeList(shiftTypeResponse.data);
        setTransportTypeList(transportTypeResponse.data);
        setRouteTypeList(routeTypeResponse.data);
    };

    useEffect(() => {
        initializer();
    }, []);

    return (
        <div>
            <div className='addUpdateFormContainer'>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className='form-control-input'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['TimeField', 'TimeField', 'TimeField']}>
                                <TimeField
                                    label="Shift Time"
                                    value={dayjs().hour(Number(formValues.shiftTime.slice(0, 2))).minute(Number(formValues.shiftTime.slice(3, 5)))}
                                    format="HH:mm"
                                    onChange={(e) => {
                                        var ShiftTime = e.$d.toLocaleTimeString('it-IT').slice(0, -3);
                                        setFormValues({ ...formValues, shiftTime: ShiftTime });
                                    }}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>
                    <div className='form-control-input'>
                        <FormControl required fullWidth>
                            <InputLabel id="admin-role">Shift Type</InputLabel>
                            <Select
                                labelId="admin-role"
                                id="roles"
                                value={formValues.shiftType}
                                name="roles"
                                label="Admin Role"
                                onChange={(e) => setFormValues({ ...formValues, shiftType: e.target.value })}
                            >
                                {shiftTypeList?.map((item, idx) => (
                                    <MenuItem key={idx} value={item.value}>{item.displayName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className='form-control-input'>
                        <FormControl required fullWidth>
                            <InputLabel id="admin-role">Transport Type</InputLabel>
                            <Select
                                labelId="admin-role"
                                id="roles"
                                value={formValues.transportTypes}
                                name="roles"
                                label="Admin Role"
                                onChange={(e) => setFormValues({ ...formValues, transportTypes: e.target.value })}
                            >
                                {!!transportTypeList?.length && transportTypeList.map((item, idx) => (
                                    <MenuItem key={idx} value={item.value}>{item.displayName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className='form-control-input'>
                        <FormControl required fullWidth>
                            <InputLabel id="primary-office-label">Office ID</InputLabel>
                            <Select
                                labelId="primary-office-label"
                                id="primaryOfficeId"
                                value={formValues.officeIds}
                                name="primaryOfficeId"
                                label="Primary Office"
                                onChange={(e) => setFormValues({ ...formValues, officeIds: e.target.value })}
                            >
                                {!!officeList?.length && officeList.map((office, idx) => (
                                    <MenuItem key={idx} value={office.officeId}>{getFormattedLabel(office.officeId)}, {office.address}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className='form-control-input'>
                        <FormControl sx={{ m: 1, width: 200 }}>
                            <InputLabel id="demo-multiple-checkbox-label">Shift Weekday Visibility</InputLabel>
                            <Select
                                labelId="demo-multiple-checkbox-label"
                                id="demo-multiple-checkbox"
                                multiple
                                value={days}
                                onChange={handleDaySelect}
                                input={<OutlinedInput label="Shift Weekday Visibility" />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                                defaultValue={'Monday'}
                            >
                                {dayNames.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={days.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className='form-control-input'>
                        <FormControlLabel control={<Checkbox color="default" checked={formValues.isVisibleOnHoliday} onChange={(e) => e.target.checked ? setFormValues({ ...formValues, isVisibleOnHoliday: true }) : setFormValues({ ...formValues, isVisibleOnHoliday: false })} />} label="Visible on company holidays" />
                    </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className='form-control-input'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker', 'DatePicker']}>
                                <DatePicker
                                    label="Start Date"
                                    value={startDate}
                                    onChange={(newValue) => {
                                        var ShiftStartDate = newValue.$d.toISOString().slice(0, 10).split("-").reverse().join("-");
                                        ShiftStartDate += ' ' + newValue.$H + ':' + newValue.$m + ':' + newValue.$s;
                                        setStartDate(newValue);
                                        setFormValues({ ...formValues, shiftStartDate: ShiftStartDate });
                                    }}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>
                    {/* <div className='form-control-input'>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker', 'DatePicker']}>
                                <DatePicker
                                    label="End Date"
                                    value={endDate}
                                    onChange={(newValue) => {
                                        var ShiftEndDate = newValue.$d.toISOString().slice(0, 10).split("-").reverse().join("-");
                                        ShiftEndDate += ' ' + newValue.$H + ':' + newValue.$m + ':' + newValue.$s;
                                        setEndDate(newValue);
                                        setFormValues({ ...formValues, shiftEndDate: ShiftEndDate });
                                    }}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </div> */}
                    <div className='form-control-input'>
                        <FormControl required fullWidth>
                            <InputLabel id="admin-role">Route Type</InputLabel>
                            <Select
                                labelId="admin-role"
                                id="roles"
                                value={formValues.routeTypes}
                                name="roles"
                                label="Admin Role"
                                onChange={(e) => setFormValues({ ...formValues, routeTypes: e.target.value })}
                            >
                                {!!routeTypeList?.length && routeTypeList.map((item, idx) => (
                                    <MenuItem key={idx} value={item.value}>{item.displayName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>
                {/* <div>
                    <div className='form-control-input'>
                        <FormControl required>
                            <RadioGroup
                                style={{ flexDirection: "row" }}
                                aria-labelledby="transport-eligibility"
                                onChange={handleChange}
                                value={values.transportEligibilities}
                                name="transportEligibilities"
                            >
                                <FormControlLabel value={'Add Ceiling'} onChange={handleChange} control={<Radio />} label={'Add Ceiling'} />
                            </RadioGroup>
                        </FormControl>
                    </div>
                    <div className='form-control-input'>
                        <TextField
                            value={values.address} onChange={handleChange}
                            name="address" required id="address" label="Ceiling Limit" variant="outlined" />
                    </div>
                </div> */}
            </div>
            <div className='addBtnContainer' style={{ justifyContent: 'right' }}>
                <div>
                    <button className='btn btn-secondary'>Cancel</button>
                    <button type='submit' onClick={()=> editValues ? editShiftFormSubmit():createShiftFormSubmit()} className='btn btn-primary'>{editValues ? 'Update' : 'Create'} </button>
                </div>
            </div>
        </div>
    );
}

export default CreateShiftTime;