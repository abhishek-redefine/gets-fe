import compliance from '@/layouts/compliance';
import React, { useEffect, useState } from 'react';
import Grid from '@/components/grid';
import ComplianceService from '@/services/compliance.service';
import { Autocomplete } from '@mui/material';
import xlsx from "json-as-xlsx";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { toggleToast } from '@/redux/company.slice';
import { useDispatch } from 'react-redux';

const VehicleDriverMapping = () => {
    const headers = [
        {
            key: "vehicleRegistrationNumber",
            display: "Vehicle No."
        },
        {
            key: "vehicleId",
            display: "Vehicle Id"
        },
        {
            key: "vendorName",
            display: "Vendor"
        },
        {
            key: "vehicleModel",
            display: "Model"
        },
        {
            key: "fuelType",
            display: "Capacity"
        },
        {
            key: "driverId",
            display: "Driver ID"
        },
        {
            key: "ehsStatus",
            display: "EHS Status"
        },
        {
            key: "hamburgerMenu",
            html: <><span className="material-symbols-outlined">more_vert</span></>,
            navigation: true,
            menuItems: [
                {
                    display: "Change Driver",
                    key: "changeDriver"
                }
            ]
        }];

    const [vehicleData, setVehicleData] = useState();
    const [open, setOpen] = useState(false);
    const [vehicleModel, setVehicleModel] = useState();
    const [vehicleRegistrationNumber, setVehicleRegistrationNumber] = useState();
    const [openSearchDriver, setOpenSearchDriver] = useState(false);
    const [searchedDriver, setSearchedDriver] = useState([]);
    const [mappedDriver, setMappedDriver] = useState();
    const [vehicleId, setVehicleId] = useState();
    const [selectedVehicle, setSelectedVehicle] = useState();

    const dispatch = useDispatch();

    const searchForDriver = async (e) => {
        try {
            if (e.target.value) {
                console.log('searchForDriver', e.target.value)
                const response = await ComplianceService.searchDriver(e.target.value);
                console.log(response)
                const { data } = response || {};
                setSearchedDriver(data);
            } else {
                setSearchedDriver([]);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const driverMapping = async () => {
        selectedVehicle.driverId = mappedDriver;
        const response = await ComplianceService.updateVehicle({ "vehicleDTO": selectedVehicle });
        if (response.status === 200) {
            dispatch(toggleToast({ message: 'Vehicle Driver mapping successful!', type: 'success' }));
        } else {
            dispatch(toggleToast({ message: 'Vehicle Driver mapping unsuccessful.Please try again after some time!', type: 'error' }));
        }
    }

    const onMenuItemClick = async (key, clickedItem) => {
        if (key === "changeDriver") {
            setVehicleModel(clickedItem.vehicleModel);
            setVehicleRegistrationNumber(clickedItem.vehicleRegistrationNumber);
            setVehicleId(clickedItem.vehicleId)
            setSelectedVehicle(clickedItem);
            handleClickOpen();
        }
    };

    const initializer = async () => {
        try {
            const response = await ComplianceService.getAllVehicles();
            setVehicleData(response.data.data)
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
                    <Grid headers={headers} listing={vehicleData} onMenuItemClick={onMenuItemClick} enableDisableRow={true} />
                </div>
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const email = formJson.email;
                        console.log(email);
                        handleClose();
                    },
                }}
                fullWidth
                maxWidth="lg"
            >
                <DialogTitle>{`Change Driver for ${vehicleModel}--${vehicleRegistrationNumber}`}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Select new driver from drop down
                    </DialogContentText>
                    <Autocomplete
                        disablePortal
                        id="search-driver"
                        options={searchedDriver}
                        autoComplete
                        open={openSearchDriver}
                        onOpen={() => {
                            setOpenSearchDriver(true);
                        }}
                        onClose={() => {
                            setOpenSearchDriver(false);
                        }}
                        onChange={(e, val) => setMappedDriver(val.driverId)}
                        getOptionKey={(driver) => driver.driverId}
                        getOptionLabel={(driver) => driver.driverName}
                        freeSolo
                        name="driver"
                        renderInput={(params) => <TextField {...params} label="Search Driver" onChange={searchForDriver} />}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit" onClick={driverMapping}>Change Driver</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default compliance(VehicleDriverMapping);