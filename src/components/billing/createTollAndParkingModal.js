import {
    Autocomplete,
    TextField,
    Paper,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { getFormattedLabel } from "@/utils/utils";
import { setMasterData } from "@/redux/master.slice";
import { DATE_FORMAT, MASTER_DATA_TYPES } from "@/constants/app.constants.";
import OfficeService from "@/services/office.service";
import { useSelector } from "react-redux";
import ComplianceService from "@/services/compliance.service";
import { useDispatch } from "react-redux";
import { toggleToast } from '@/redux/company.slice';
import BillingService from "@/services/billing.service";

const CreateTollAndParkingModal = ({ onClose }) => {
    const [searchValues, setSearchValues] = useState({
        "officeId": "",
        "date": moment().format("YYYY-MM-DD"),
        "appliedOn": "Vehicle",
        "tripId": "TRIP-",
        "vehicleId": "",
        "amount": 0,
        "remarks": ""
    });
    const [error, setError] = useState(false);
    const [office, setOffice] = useState([]);
    const [vehicleId, setVehicleId] = useState(1);
    const [searchedVehicle, setSearchedvehicle] = useState([]);
    const [openSearchVehicle, setOpenSearchVehicle] = useState(false);

    const searchForVehicle = async (e) => {
        try {
            if (e.target.value) {
                console.log("searchForVehicle", e.target.value);
                const response = await ComplianceService.searchVehicle(e.target.value);
                console.log(response);
                const { data } = response || {};
                setSearchedvehicle(data);
                console.log("Searched vehicle>>", searchedVehicle);
            } else {
                setSearchedvehicle([]);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const onChangeVehicleHandler = (newValue) => {
        console.log("on vehicle change handler", newValue);
        setVehicleId(newValue?.vehicleId);
        searchValues["vehicleId"] = newValue?.vehicleRegistrationNumber;
    };

    const appliedOn = ["Vehicle", "Trip"];

    const fetchAllOffices = async () => {
        try {
            const response = await OfficeService.getAllOffices();
            const { data } = response || {};
            const { clientOfficeDTO } = data || {};
            console.log(clientOfficeDTO);
            setSearchValues(
                { ...searchValues },
                (searchValues["officeId"] = clientOfficeDTO[0]?.officeId)
            );
            setOffice(clientOfficeDTO);
        } catch (e) { }
    };

    const handleFilterChange = (e) => {
        const { target } = e;
        const { value, name } = target;
        let newSearchValues = { ...searchValues };
        console.log(value, name);
        if (name === "date") newSearchValues[name] = value.format("YYYY-MM-DD");
        else newSearchValues[name] = value;
        setSearchValues(newSearchValues);
    };

    const onSubmitHandler = async() => {
        try {
            const selectedAppliedOn = searchValues.appliedOn;
            var allValues = {...searchValues};
            if(selectedAppliedOn === "Vehicle"){
                delete allValues.tripId;
                allValues.vehicleId = vehicleId;
            }else{
                delete allValues.vehicleId;
                allValues.tripId = allValues.tripId.substring(5,allValues.tripId.length)
            }
            console.log(allValues);
            const response = await BillingService.createTax(allValues);
            console.log(response.status);
        } catch (er) {
            console.log(er);
        }
    }

    useEffect(() => {
        fetchAllOffices();
    }, []);

    return (
        <div
            style={{
                backgroundColor: "#FFF",
                borderRadius: 10,
                fontFamily: "DM Sans",
                padding: "30px 40px",
            }}
        >
            <h3 style={{}}>Create Toll and Parking Ticket</h3>
            <div style={{}}>
                {office.length > 0 && (
                    <div
                        style={{ margin: "0 30px 0 0px", minWidth: "180px" }}
                        className="form-control-input"
                    >
                        <FormControl fullWidth>
                            <InputLabel id="primary-office-label">Office ID *</InputLabel>
                            <Select
                                style={{ width: "250px", backgroundColor: "white" }}
                                labelId="primary-office-label"
                                id="officeId"
                                value={searchValues.officeId}
                                name="officeId"
                                label="Office ID"
                                onChange={handleFilterChange}
                            >
                                {!!office?.length &&
                                    office.map((office, idx) => (
                                        <MenuItem key={idx} value={office.officeId}>
                                            {getFormattedLabel(office.officeId)}, {office.address}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </div>
                )}
                <div
                    className="form-control-input"
                    style={{ backgroundColor: "white" }}
                >
                    <InputLabel style={{ backgroundColor: "#ffffff" }} htmlFor="date">
                        Date*
                    </InputLabel>
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                        <DatePicker
                            name="date"
                            format={DATE_FORMAT}
                            value={searchValues.date ? moment(searchValues.date) : null}
                            onChange={(e) =>
                                handleFilterChange({
                                    target: { name: "date", value: e },
                                })
                            }
                            sx={{ width: "250px" }}
                        />
                    </LocalizationProvider>
                </div>

                <div
                    style={{ margin: "0 30px 0 0px", minWidth: "180px" }}
                    className="form-control-input"
                >
                    <FormControl fullWidth>
                        <InputLabel id="appliedOn-label">Applied On*</InputLabel>
                        <Select
                            style={{ width: "250px", backgroundColor: "white" }}
                            labelId="shiftType-label"
                            id="appliedOn"
                            name="appliedOn"
                            value={searchValues.appliedOn}
                            label="Shift Type"
                            onChange={handleFilterChange}
                        >
                            {appliedOn.map((sT, idx) => (
                                <MenuItem key={idx} value={sT}>
                                    {getFormattedLabel(sT)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>

                {
                    searchValues.appliedOn === "Vehicle" ?
                        <div
                            style={{ margin: "20px 20px", minWidth: "180px" }}
                            className="form-control-input"
                        >
                            <FormControl variant="outlined">
                                <Autocomplete
                                    disablePortal
                                    id="search-vehicle"
                                    sx={{ width: "250px" }}
                                    options={searchedVehicle}
                                    autoComplete
                                    open={openSearchVehicle}
                                    onOpen={() => {
                                        setOpenSearchVehicle(true);
                                    }}
                                    onClose={() => {
                                        setOpenSearchVehicle(false);
                                    }}
                                    onChange={(e, val) =>
                                        onChangeVehicleHandler(val, "vehicle", "vehicleId")
                                    }
                                    getOptionKey={(vehicle) => vehicle.vehicleId}
                                    getOptionLabel={(vehicle) => vehicle.vehicleRegistrationNumber}
                                    freeSolo
                                    name="vehicle"
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Search Vehicle *"
                                            onChange={searchForVehicle}
                                            value={searchValues.vehicleNumber}
                                            error={!!error.vehicleNumber}
                                            helperText={error.vehicleNumber}
                                        />
                                    )}
                                />
                            </FormControl>
                        </div>
                        :
                        <div
                            style={{ margin: "20px 20px", minWidth: "180px" }}
                            className="form-control-input"
                        >
                            <FormControl variant="outlined">
                                <TextField
                                    style={{ width: "250px" }}
                                    id="tripId"
                                    label="Trip-Id*"
                                    name="tripId"
                                    value={searchValues.tripId}
                                    variant="outlined"
                                    fullWidth
                                    onChange={(e) => {
                                        const inputValue = e.target.value;
                                        const prefix = "TRIP-";

                                        // Ensure the input value starts with "TRIP-"
                                        let updatedTripId = inputValue;

                                        if (!inputValue.startsWith(prefix)) {
                                            // Prepend the prefix if missing
                                            updatedTripId = prefix + inputValue.replace(prefix, "");
                                        }

                                        if (updatedTripId === prefix + "TRIP") {
                                            // Avoid "TRIP-TRIP" scenario
                                            updatedTripId = prefix;
                                        }

                                        // Update the state
                                        setSearchValues((prevValues) => ({
                                            ...prevValues,
                                            tripId: updatedTripId,
                                        }));
                                    }}
                                />
                            </FormControl>
                        </div>
                }
                <div
                    style={{ margin: "20px 30px 20px 0", minWidth: "180px" }}
                    className="form-control-input"
                >
                    <FormControl fullWidth>
                        <TextField
                            style={{ width: "250px" }}
                            id="amount"
                            label="Amount*"
                            name="amount"
                            value={searchValues.amount}
                            variant="outlined"
                            fullWidth
                            onChange={handleFilterChange}
                        />
                    </FormControl>
                </div>
                <div
                    style={{ margin: "20px 0px 20px 20px", minWidth: "180px" }}
                    className="form-control-input"
                >
                    <FormControl fullWidth>
                        <TextField
                            style={{ width: "250px" }}
                            id="remarks"
                            label="Remarks*"
                            name="remarks"
                            value={searchValues.remarks}
                            variant="outlined"
                            fullWidth
                            onChange={handleFilterChange}
                        />
                    </FormControl>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", margin: '0 60px' }}>
                    <div>
                        <button
                            type="button"
                            style={{
                                backgroundColor: "#d8d2d2",
                                color: "black",
                                width: "180px",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "15px",
                                padding: "15px 35px",
                                cursor: "pointer",
                                marginTop: "30px",
                                marginBottom: "5px",
                            }}
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                    <div>
                        <button
                            type="button"
                            style={{
                                backgroundColor: "#f6ce47",
                                color: "black",
                                width: "180px",
                                border: "none",
                                borderRadius: "6px",
                                fontSize: "15px",
                                padding: "15px 35px",
                                cursor: "pointer",
                                marginTop: "30px",
                                marginBottom: "5px",
                            }}
                            onClick={onSubmitHandler}
                        >
                            Create Ticket
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CreateTollAndParkingModal;