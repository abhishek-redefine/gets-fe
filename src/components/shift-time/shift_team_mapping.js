import ShiftService from '@/services/shift.service';
import OfficeService from '@/services/office.service';
import dayjs, { Dayjs } from 'dayjs';
import { getFormattedLabel } from '@/utils/utils';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimeField } from '@mui/x-date-pickers/TimeField';
import { Autocomplete, FormControl, FormControlLabel, RadioGroup, Radio, FormHelperText, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';

const ShiftTeamMapping = ({
    onUserSuccess,
    editEmployeeData
}) => {
    const [formValues, setFormValues] = useState({
        "id": 0,
        "shiftTime": {
            "hour": 0,
            "minute": 0,
            "second": 0,
            "nano": 0
        },
        "teamId": 0,
        "zoneId": 0,
        "officeId": "",
        "shiftType": "",
        "transportType": ""
    })
    const [shiftType, setShiftType] = useState([]);
    const [transportType, setTransportType] = useState([]);
    const [offices, setOffice] = useState([]);
    const [shiftTypeDisabled, setShiftTypeDisabled] = useState(true)
    const [transportTypeDisabled, setTransportTypeDisabled] = useState(true)
    const [shiftTimeDisabled, setShiftTimeDisabled] = useState(true)
    const [searchedTeam, setSearchedTeam] = useState([]);
    const [openSearchTeam, setOpenSearchTeam] = useState(false);
    const [openSearchRM, setOpenSearchRM] = useState(false);

    const handleFormSubmit = () => {
        console.log('handleFormSubmit', formValues)
    };

    const searchForRM = async (e) => {
        try {
            if (e.target.value) {
                const response = await OfficeService.searchRM(e.target.value);
                const { data } = response || {};
                setSearchedReportingManager(data);
            } else {
                setSearchedReportingManager([]);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const searchForTeam = async (e) => {
        try {
            if (e.target.value) {
                const response = await OfficeService.searchTeam(e.target.value);
                const { data } = response || {};
                setSearchedTeam(data);
            } else {
                setSearchedTeam([]);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const onChangeHandler = (newValue, name, key) => {
        formik.setFieldValue(name, newValue?.[key] || "");
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

    const initializer = async () => {
        const shiftTypeResponse = await ShiftService.getMasterData('ShiftType');
        setShiftType(shiftTypeResponse.data)
        const transportTypeResponse = await ShiftService.getMasterData('TransportType');
        setTransportType(transportTypeResponse.data)
    }

    useEffect(() => {
        fetchAllOffices();
        initializer();
    }, []);

    return (
        <div style={{ marginTop: '20px' }}>
            <div style={{ display: 'flex' }}>
                <div style={{ width: '30%', padding: '20px', background: 'white', fontWeight: '600' }}>
                    Select Shift Timings For Mapping
                </div>
                <div style={{ width: '30%', padding: '20px', background: 'white', fontWeight: '600' }}>
                    Select Teams and Zones For Mapping
                </div>
            </div>
            <div style={{ display: 'flex' }}>
                <div className='addUpdateFormContainer' style={{ width: '30%', marginTop: '0px' }}>
                    <div style={{ borderRight: '1px solid black' }}>
                        <div className='form-control-input'>
                            {<FormControl required fullWidth>
                                <InputLabel id="gender-label">Office ID</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={formValues.officeId}
                                    label="Gender"
                                    onChange={(e) => { setFormValues({ ...formValues, officeId: e.target.value }); setShiftTypeDisabled(false); }}
                                >
                                    {offices.map((office, idx) => (
                                        <MenuItem key={idx} value={office.officeId}>{getFormattedLabel(office.officeId)}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>}
                        </div>
                    </div>
                    <div style={{ borderRight: '1px solid black' }}>
                        <div className='form-control-input'>
                            <FormControl required fullWidth disabled={shiftTypeDisabled}>
                                <InputLabel id="primary-office-label">Shift Type</InputLabel>
                                <Select
                                    labelId="primary-office-label"
                                    id="primaryOfficeId"
                                    value={formValues.shiftType}
                                    name="primaryOfficeId"
                                    label="Primary Office"
                                    onChange={(e) => { setFormValues({ ...formValues, shiftType: e.target.value }); setTransportTypeDisabled(false); }}
                                >
                                    {!!shiftType?.length && shiftType.map((item, idx) => (
                                        <MenuItem key={idx} value={item.value}>{item.displayName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div style={{ borderRight: '1px solid black' }}>
                        <div className='form-control-input'>
                            {<FormControl required fullWidth disabled={transportTypeDisabled}>
                                <InputLabel id="gender-label">Transport Type</InputLabel>
                                <Select
                                    labelId="gender-label"
                                    id="gender"
                                    name="gender"
                                    value={formValues.transportType}
                                    label="Gender"
                                    onChange={(e) => { setFormValues({ ...formValues, transportType: e.target.value }); setShiftTimeDisabled(false); }}
                                >
                                    {transportType.map((item, idx) => (
                                        <MenuItem key={idx} value={item.value}>{item.displayName}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>}
                        </div>
                    </div>
                    <div style={{ borderRight: '1px solid black' }}>
                        <div className='form-control-input'>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer components={['TimeField', 'TimeField', 'TimeField']}>
                                    <TimeField
                                        label="Shift Time"
                                        defaultValue={dayjs().hour(0).minute(0)}
                                        format="HH:mm"
                                        onChange={(e) => {
                                            console.log(e); setFormValues({
                                                ...formValues, shiftTime: {
                                                    "hour": e.$H,
                                                    "minute": e.$m,
                                                    "second": e.$s,
                                                    "nano": e.$ms
                                                }
                                            });
                                        }}
                                        disabled={shiftTimeDisabled}
                                    />
                                </DemoContainer>
                            </LocalizationProvider>
                        </div>
                    </div>
                </div>
                <div className='addUpdateFormContainer' style={{ width: '30%', marginTop: '0px' }}>
                    <div>
                        <div className='form-control-input'>
                            <FormControl variant="outlined">
                                <Autocomplete
                                    disablePortal
                                    id="search-team"
                                    options={searchedTeam}
                                    autoComplete
                                    open={openSearchTeam}
                                    onOpen={() => {
                                        setOpenSearchTeam(true);
                                    }}
                                    onClose={() => {
                                        setOpenSearchTeam(false);
                                    }}
                                    onChange={(e, val) => onChangeHandler(val, "team", "teamId")}
                                    getOptionKey={(team) => team.teamId}
                                    getOptionLabel={(team) => team.teamName}
                                    freeSolo
                                    name="team"
                                    renderInput={(params) => <TextField {...params} label="Search Team" onChange={searchForTeam} />}
                                />
                            </FormControl>
                        </div>
                    </div>
                    {/* <div>
                        <div className='form-control-input'>
                            <FormControl required fullWidth>
                                <InputLabel id="primary-office-label">Zone Name</InputLabel>
                                <Select
                                    labelId="primary-office-label"
                                    id="primaryOfficeId"
                                    value={values.primaryOfficeId}
                                    error={touched.primaryOfficeId && Boolean(errors.primaryOfficeId)}
                                    name="primaryOfficeId"
                                    label="Primary Office"
                                    onChange={handleChange}
                                >
                                    {!!offices?.length && offices.map((office, idx) => (
                                        <MenuItem key={idx} value={office.officeId}>{getFormattedLabel(office.officeId)}, {office.address}</MenuItem>
                                    ))}
                                </Select>
                                {touched.primaryOfficeId && errors.primaryOfficeId && <FormHelperText className='errorHelperText'>{errors.primaryOfficeId}</FormHelperText>}
                            </FormControl>
                        </div>
                    </div> */}
                </div>
            </div>
            <div className='addBtnContainer' style={{ justifyContent: 'right' }}>
                <div>
                    <button onClick={onUserSuccess} className='btn btn-secondary'>Cancel</button>
                    <button type='submit' onClick={handleFormSubmit} className='btn btn-primary'>{editEmployeeData?.id ? 'Create' : 'Update'} </button>
                </div>
            </div>
        </div >
    );
}

export default ShiftTeamMapping;