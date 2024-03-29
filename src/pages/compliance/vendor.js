import React, { useEffect, useState } from 'react';
import Grid from '@/components/grid';
import AddPenalty from '@/components/compliance/addPenalty';
import compliance from '@/layouts/compliance';
import AddVendor from '@/components/compliance/addVendor';
import ComplianceService from '@/services/compliance.service';
import { toggleToast } from '@/redux/company.slice';
import { useDispatch } from 'react-redux';
import { FormControl, InputLabel, MenuItem, Select,Autocomplete,TextField } from '@mui/material';
import OfficeService from '@/services/office.service';
import { getFormattedLabel } from '@/utils/utils';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import RemarkModal from '@/components/modal/remarkModal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    height: 190
  };

const Vendor = () => {
    const headers = [
        {
            key: "id",
            display: "Vendor ID"
        },
        {
            key: "name",
            display: "Vendor Name"
        },
        {
            key: "contactPersonEmail",
            display: "Contact Person Email ID"
        },
        {
            key: "contactPersonMobile",
            display: "Contact Person Phone Number"
        },
        {
            key: "address",
            display: "City"
        },
        {
            key: "vendorOfficeId",
            display: "Office ID"
        },
        {
            key: "createdAt",
            display: "Created at"
        },
        {
            key: "updatedAt",
            display: "Updated at"
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
                    display: "Disable",
                    key: "deactivate"
                },
                {
                    display: "Enable",
                    key: "activate"
                },
            ]
        }];
    const dispatch = useDispatch();

    const [isAddVendor, setIsAddVendor] = useState(false);
    const [vendorListing, setVendorListing] = useState();
    const [editVendorData, setEditVendorData] = useState({});
    const [officeList,setOfficeList] = useState([]);
    const [officeId,setOfficeId] = useState("");
    const [searchVendor,setSearchVendor] = useState([]);
    const [openSearchVendor, setOpenSearchVendor] = useState(false);
    const [vendorId,setVendorId] = useState();
    const [resetFlag,setResetFlag] = useState(false);
    const [open, setOpen] = useState(false);
    const [selectedVendor,setSelectedVendor] = useState();
    const [isEnableFlag,setIsEnableFlag] = useState(false);
    
    const handleOpen = (id,isEnable) => {
        console.log(`id = ${id}, isEnable = ${isEnable}`)
        setSelectedVendor(id);
        setIsEnableFlag(isEnable);
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }
    const onConfirmHandler = (remark) =>{
        console.log(`remark == ${remark}`)
        enableDisableVendor(selectedVendor, isEnableFlag,remark);
    }

    const onChangeHandler = (newValue, name, key) => {
        console.log(newValue)
        setVendorId(newValue?.vendorId || "");
    };

    const searchForVendor = async(e) =>{
        try {
            if (e.target.value) {
                const response = await ComplianceService.searchVendor(e.target.value);
                const { data } = response || {};
                setSearchVendor(data);
            } else {
                setSearchVendor([]);
            }
        } catch (e) {
            console.error(e);
        }
    }

    const fetchAllVendors = async () => {
        try {
            const response = await ComplianceService.getAllVendorCompany();
            setVendorListing(response.data.paginatedResponse.content);
        } catch (e) {
            console.error(e);
        }
    };

    const searchVendorById = async() =>{
        try{
            if(vendorId){
                const response = await ComplianceService.getVendorCompanyById(vendorId);
                setVendorListing([response.data.vendorCompany]);
            //console.log(response.data.vendorCompany);
            }
        }
        catch(err){
            console.log(err);
        }
    }

    const fetchAllOffice = async() =>{
        try{
            const response = await OfficeService.getAllOffices();
            const { data } = response || {};
            const { clientOfficeDTO } = data || {};
            console.log(clientOfficeDTO,"Client office Dto")
            setOfficeList(clientOfficeDTO);
        }catch(err){
            console.log(err);
        }
    }

    const applyFilter = async() =>{
        console.log("apply filter");
    }

    const resetFilter = () =>{
        setOfficeId("");
        setOfficeList([]);
        setSearchVendor([]);
        setResetFlag(!resetFlag);
    }

    useEffect(() => {
        fetchAllVendors();
        //fetchAllOffice();
    }, [isAddVendor,resetFlag]);

    const onMenuItemClick =async (key, clickedItem) => {
        if (key === "edit") {
            console.log("edit btn clicked")
            setEditVendorData(clickedItem);
            setIsAddVendor(true);
        }
        else if(key === "deactivate"){
            console.log("deactivate");
            handleOpen(clickedItem.id,false);
        }
        else if(key === 'activate'){
            console.log("activate");
            handleOpen(clickedItem.id,true);
        }
    };

    const enableDisableVendor = async(id,isEnable,remark) =>{
        try{
            const response = await ComplianceService.enableDisableVendorCompany(id,isEnable,remark)
            if (response.status === 200) {
                dispatch(toggleToast({ message: 'Vendor company deactivated successfully!', type: 'success' }));
                setOpen(false);
                fetchAllVendors();
            } else {
                dispatch(toggleToast({ message: 'Vendor company deactivation unsuccessful. Please try again later!', type: 'error' }));
            }
        }
        catch(err){
            console.log(err);
        }
    }

    const SetAddVendorOpen = (value)=>{
        setEditVendorData([]);
        setVendorListing([]);
        setIsAddVendor(value);
    }

    return (
        <div className='internalSettingContainer'>
            
            {!isAddVendor && <div>
                <div className='filterContainer' >
                    <div style={{width: '100%',display: 'flex', justifyContent: 'space-between'}}>
                        {/* <div style={{display: 'flex', justifyContent: 'start',alignItems: 'flex-start'}}>
                            <div style={{minWidth: "180px"}} className='form-control-input'>
                                <FormControl fullWidth>
                                    <InputLabel id="primary-office-label">Primary Office</InputLabel>
                                    <Select
                                        style={{width: "180px"}}                                    
                                        labelId="primary-office-label"
                                        id="officeId"
                                        value={officeId}
                                        name="officeId"
                                        label="Office ID"
                                        onChange={(e)=>setOfficeId(e.target.value)}
                                    >
                                        {!!officeList?.length && officeList.map((office, idx) => (
                                            <MenuItem key={idx} value={office.officeId}>{getFormattedLabel(office.officeId)}, {office.address}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </div>
                            <div className='form-control-input' style={{minWidth: "70px"}}>
                                <button type='submit' onClick={applyFilter} className='btn btn-primary filterApplyBtn'>Apply</button>
                            </div>
                        </div> */}
                        <div style={{display: 'flex', justifyContent: 'start'}}>
                            <div className='form-control-input'>
                                <FormControl variant="outlined">
                                    <Autocomplete
                                        disablePortal
                                        id="search-reporting-manager"
                                        options={searchVendor}
                                        autoComplete
                                        open={openSearchVendor}
                                        onOpen={() => {
                                            setOpenSearchVendor(true);
                                        }}
                                        onClose={() => {
                                            setOpenSearchVendor(false);
                                        }}
                                        onChange={(e, val) => onChangeHandler(val, "Vendor", "vendorId")}
                                        getOptionKey={(vendor) => vendor.vendorId}
                                        getOptionLabel={(vendor) => vendor.vendorName}
                                        freeSolo
                                        name="Vendor"
                                        renderInput={(params) => <TextField {...params} label="Search Vendor" onChange={searchForVendor} />}
                                    />
                                </FormControl>
                            </div>
                            <div className='form-control-input' style={{minWidth: "70px"}}>
                                <button type='button' onClick={searchVendorById} className='btn btn-primary filterApplyBtn'>Search</button>
                            </div>
                            <div className='form-control-input' style={{minWidth: "70px"}}>
                                <button type='button' onClick={resetFilter} className='btn btn-primary filterApplyBtn'>Reset</button>
                            </div>
                        </div>
                    </div>    
                </div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <div className='btnContainer'>
                        <button onClick={() => setIsAddVendor(true)} className='btn btn-primary'>Add Vendor</button>
                    </div>
                </div>
                <div className='gridContainer'>
                    <Grid onMenuItemClick={onMenuItemClick} headers={headers} listing={vendorListing} enableDisableRow={true}/>
                </div>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <RemarkModal onClose={handleClose} onSubmit={onConfirmHandler}/>
                    </Box>
                </Modal>
            </div>
            }
            {
                isAddVendor && <div>
                    <AddVendor EditVendorData={editVendorData} SetAddVendorOpen={SetAddVendorOpen}/>
                </div>
            }
        </div>
    );
}

export default compliance(Vendor);