import ShiftService from '@/services/shift.service';
import OfficeService from '@/services/office.service';
import dayjs, { Dayjs } from 'dayjs';
import { getFormattedLabel } from '@/utils/utils';
import { FormControl, FormControlLabel, RadioGroup, Radio, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimeField } from '@mui/x-date-pickers/TimeField'
import React, { useEffect, useState } from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import { useTheme } from '@mui/material/styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const CreateShiftTime = ({
    roleType,
    onUserSuccess,
    editEmployeeData,
    editValues
}) => {
    console.log('CreateShiftTime', editValues)

    const theme = useTheme();

    const getWeekDaysVisibility = (EditValues) => {
        console.log(EditValues)
        return "MON"
    }
    const [visibleOnCompanyHoliday, setVisibleOnCompanyHoliday] = useState(false);
    const [days, setDays] = useState(['Monday','Tuesday']);
    const [formValues, setFormValues] = useState({
        "shiftTime": editValues ? dayjs().hour(Number(editValues.shiftTime.slice(0, 2))).minute(Number(editValues.shiftTime.slice(3, 5))) : dayjs().hour(0).minute(0),
        "shiftType": editValues ? editValues.shiftType : "LOGOUT",
        "officeIds": editValues ? editValues.officeIds : "HCLND0001",
        "transportTypes": editValues ? editValues.transportTypes : "CAB",
        "weekDaysVisibility": editValues ? "MON" : "MON",
        "isVisibleOnHoliday": editValues ? editValues.isVisibleOnHoliday : false,
        "shiftStartDate": editValues ? editValues.shiftStartDate : "17-01-2024 12:30:40",
        "shiftEndDate": editValues ? editValues.shiftEndDate : "17-03-2024 12:30:40",
        "routeTypes": editValues ? editValues.routeTypes : "HOME",
        "sundayShift": editValues ? editValues.sundayShift : false,
        "mondayShift": editValues ? editValues.mondayShift : true,
        "tuesdayShift": editValues ? editValues.tuesdayShift : true,
        "wednesdayShift": editValues ? editValues.wednesdayShift : true,
        "thursdayShift": editValues ? editValues.thursdayShift : true,
        "fridayShift": editValues ? editValues.fridayShift : true,
        "saturdayShift": editValues ? editValues.saturdayShift : false,
        "enabled": editValues ? editValues.enabled : true,
        "shiftCancelBookingAttribute": editValues ? editValues.shiftCancelBookingAttribute : "{\"Monday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Tuesday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Wednesday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":10,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Thursday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Friday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Saturday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Sunday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0}}",
        "shiftCreateBookingAttribute": editValues ? editValues.shiftCreateBookingAttribute : "{\"Monday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Tuesday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Wednesday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":10,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Thursday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Friday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Saturday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Sunday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0}}",
        "shiftNoShowBookingAttribute": editValues ? editValues.shiftNoShowBookingAttribute : "{\"Monday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Tuesday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Wednesday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":10,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Thursday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Friday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Saturday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0},\"Sunday\":{\"EmployeeAvailability\":\"No\",\"CutoffforEmployee\":0,\"SpocAvailability\":\"No\",\"CutoffforSpoc\":0}}",
    });
    const [shiftType, setShiftType] = useState([]);
    const [transportType, setTransportType] = useState([]);
    const [routeType, setRouteType] = useState([]);
    const [offices, setOffice] = useState([]);
    const [startDate, setStartDate] = useState(dayjs());
    const [endDate, setEndDate] = useState(dayjs().month(new Date().getMonth() + 3));

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };
    const shiftTypeArray = () => {
        var result = "";
        formValues?.shiftType?.map((item) => result += item.value);
        console.log('shiftTypeArray', [result])
    }
    function getStyles(name, personName, theme) {
        console.log('getStyles', name, personName)
        return {
            fontWeight:
                personName.indexOf(name) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }

    const names = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];

    var transportTypeNames = [
        'T1',
        'T2',
        'T3',
    ];

    const handleShiftTypeSelect = (event) => {
        const {
            target: { value },
        } = event;

        console.log(value, [formValues.shiftType])
        setFormValues({ ...formValues, shiftType: formValues.shiftType + ', ' + value[0] })
    };

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

        setFormValues({
            ...formValues, ...daysValueObject
        })
        setDays(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleFormSubmit = async () => {
        console.log('handleFormSubmit', formValues)
        try {
            const response = await ShiftService.createShift({ "shift": formValues });
            console.log(response)
        } catch (e) {
        }
    }

    const fetchAllOffices = async () => {
        try {
            const response = await OfficeService.getAllOffices();
            const { data } = response || {};
            const { clientOfficeDTO } = data || {};
            setOffice(clientOfficeDTO);
        } catch (e) {
        }
    };

    const initializer = async () => {
        const response = await OfficeService.getAllOffices();
        const { data } = response || {};

        const shiftTypeResponse = await ShiftService.getMasterData('ShiftType');
        setShiftType(shiftTypeResponse.data);
        const transportTypeResponse = await ShiftService.getMasterData('TransportType');
        setTransportType(transportTypeResponse.data);
        const routeTypeResponse = await ShiftService.getMasterData('RouteType');
        setRouteType(routeTypeResponse.data);
    };

    useEffect(() => {
        fetchAllOffices();
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
                                    defaultValue={formValues.shiftTime}
                                    format="HH:mm"
                                    onChange={(e) => {
                                        var ShiftTime = e.$d.toLocaleTimeString('it-IT').slice(0, -3);
                                        setStartDate(e);
                                        setFormValues({ ...formValues, shiftTime: ShiftTime });
                                    }}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>
                    {/* <div className='form-control-input'>
                        <FormControl sx={{ m: 1, width: 300 }}>
                            <InputLabel id="demo-multiple-name-label">Shift Type</InputLabel>
                            <Select
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                multiple
                                value={[formValues.shiftType]}
                                onChange={handleShiftTypeSelect}
                                input={<OutlinedInput label="Name" />}
                                MenuProps={MenuProps}
                            >
                                {shiftType.map((name, index) => (
                                    <MenuItem
                                        key={index}
                                        value={name.value}
                                        style={getStyles(name.value, formValues.shiftType, theme)}
                                    >
                                        {name.displayName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div> */}
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
                                {shiftType?.map((item, idx) => (
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
                                {!!transportType?.length && transportType.map((item, idx) => (
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
                                {!!offices?.length && offices.map((office, idx) => (
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
                                {names.map((name) => (
                                    <MenuItem key={name} value={name}>
                                        <Checkbox checked={days.indexOf(name) > -1} />
                                        <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className='form-control-input'>
                        {/* <FormControl required>
                            <RadioGroup
                                style={{ flexDirection: "row" }}
                                aria-labelledby="transport-eligibility"
                                value={true}
                                name="Visible on company holidays"
                            >
                                <FormControlLabel value={visibleOnCompanyHoliday} onClick={(e) => { setVisibleOnCompanyHoliday(!visibleOnCompanyHoliday); setFormValues({ ...formValues, isVisibleOnHoliday: !visibleOnCompanyHoliday }) }} control={<Radio />} label={'Visible on company holidays'} />
                            </RadioGroup>
                        </FormControl> */}
                        <FormControlLabel control={<Checkbox color="default" onChange={(e) => e.target.checked ? setFormValues({ ...formValues, isVisibleOnHoliday: true }) : setFormValues({ ...formValues, isVisibleOnHoliday: false })} />} label="Visible on company holidays" />
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
                                        console.log("Start Date", newValue)
                                        var ShiftStartDate = newValue.$d.toISOString().slice(0, 10).split("-").reverse().join("-");
                                        ShiftStartDate += ' ' + newValue.$H + ':' + newValue.$m + ':' + newValue.$s;
                                        setStartDate(newValue);
                                        setFormValues({ ...formValues, shiftStartDate: ShiftStartDate });
                                    }}
                                />
                            </DemoContainer>
                        </LocalizationProvider>
                    </div>
                    <div className='form-control-input'>
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
                    </div>
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
                                {!!routeType?.length && routeType.map((item, idx) => (
                                    <MenuItem key={idx} value={item.value}>{item.displayName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </div>
                {/* <div> */}

                {/* <div className='form-control-input'>
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
                </div> */}
                {/* </div> */}
            </div>

            <div className='addBtnContainer' style={{ justifyContent: 'right' }}>
                <div>
                    <button onClick={onUserSuccess} className='btn btn-secondary'>Cancel</button>
                    <button type='submit' onClick={handleFormSubmit} className='btn btn-primary'>{editEmployeeData?.id ? 'Update' : 'Create'} </button>
                </div>
            </div>
        </div>
    );
}

export default CreateShiftTime;