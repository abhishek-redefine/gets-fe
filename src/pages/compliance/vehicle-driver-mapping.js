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
import { DEFAULT_PAGE_SIZE } from '@/constants/app.constants.';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    height: 190,
    p:4
  };

const VehicleDriverMapping = () => {
    const headers = [
        {
            key: "vehicleNumber",
            display: "Vehicle No."
        },
        {
            key: "vehicleId",
            display: "Vehicle Id"
        },
        {
            key: "driverName",
            display: "Driver Name"
        },
        {
            key: "vendorName",
            display: "Vendor"
        },
        {
            key: "licenseNo",
            display: "License Number"
        },
        {
            key: "officeId",
            display: "Office Id"
        },
        {
            key: "createdAt",
            display: "Created at"
        },
        {
            key: "createdBy",
            display: "Created by"
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
    const [vendorName,setVendorName] = useState("");
    const [pagination,setPagination] = useState({
        page: 0,
        size : DEFAULT_PAGE_SIZE
    })

    //////////////////////////////////////////////////
    const [openModal,setOpenModal] = useState(false);
    const handleModalOpen = () => {
        setOpen(false);
        setOpenModal(true);
    }
    const handleModalClose = () => setOpenModal(false);
    //////////////////////////////////////////////////

    const dispatch = useDispatch();

    const searchForDriver = async (e) => {
        try {
            if (e.target.value) {
                console.log('searchForDriver', e.target.value)
                const response = await ComplianceService.searchDriverWithVendor(e.target.value,vendorName);
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
        //selectedVehicle.driverId = mappedDriver;
        try{
            const response = await  ComplianceService.forceMappingVehicle(mappedDriver,{vehicleDriverMappingDTO: selectedVehicle})
            //const response = await ComplianceService.updateVehicle({ "vehicleDTO": selectedVehicle });
            if (response.status === 201) {
                dispatch(toggleToast({ message: 'Vehicle Driver mapping successful!', type: 'success' }));
                setOpenModal(close);
            } else {
                dispatch(toggleToast({ message: 'Vehicle Driver mapping unsuccessful.Please try again after some time!', type: 'error' }));
            } 
            initializer();
        }catch(err){
            console.log(err);
        }
        
    }

    const onMenuItemClick = async (key, clickedItem) => {
        if (key === "changeDriver") {
            setVehicleModel(clickedItem.vehicleId);
            setVehicleRegistrationNumber(clickedItem.vehicleNumber);
            setVehicleId(clickedItem.vehicleId)
            setVendorName(clickedItem.vendorName);
            setSelectedVehicle(clickedItem);
            handleClickOpen();
        }
    };

    const initializer = async () => {
        try {
            let params = new URLSearchParams(pagination);
            const response = await ComplianceService.getAllVehiclesMapping(params.toString(),{});
            setVehicleData(response.data.data)
        } catch (e) {
        }
    }

    useEffect(() => {
        initializer();
    }, []);

    return (
        <div className='internalSettingContainer'>
            <div className='filter'>
                
            </div>
            <div>
                <div className='gridContainer'>
                    <Grid headers={headers} listing={vehicleData} onMenuItemClick={onMenuItemClick} />
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
                <DialogTitle>{`Change Driver for ${vehicleModel}-${vehicleRegistrationNumber}`}</DialogTitle>
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
                    <Button type="button" onClick={handleModalOpen}>Change Driver</Button>
                </DialogActions>
            </Dialog>
            <Modal
                open={openModal}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <div>
                        <h4 style={{paddingLeft:15}}>
                        Are you sure ?
                        </h4>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-evenly',paddingTop:20}}>
                        <button className='btn btn-secondary' style={{margin: '10px 10px'}} onClick={handleModalClose}>No</button>
                        <button className='btn btn-primary' style={{margin: '10px 10px'}} onClick={driverMapping}>Yes</button>
                    </div>
                </Box>
            </Modal>
        </div>
    );
}

export default compliance(VehicleDriverMapping);