import compliance from '@/layouts/compliance';
import React, { useEffect, useState } from 'react';
import Grid from '@/components/grid';
import ComplianceService from '@/services/compliance.service';
import AddNewVehicle from '@/components/compliance/add_new_vehicle';
import xlsx from "json-as-xlsx";
import UploadButton from '@/components/buttons/uploadButton';
import AddVehiclePendingApproval from '@/components/compliance/addVehiclePendingApproval';
import { toggleToast } from '@/redux/company.slice';
import { useDispatch } from 'react-redux';
import { FormControl, InputLabel, MenuItem, Select,Autocomplete,TextField } from '@mui/material';
import OfficeService from '@/services/office.service';
import { getFormattedLabel } from '@/utils/utils';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import RemarkModal from '@/components/modal/remarkModal';
import { DEFAULT_PAGE_SIZE } from '@/constants/app.constants.';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    height: 190
};

const VehicleProfile = () => {
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
            key: "complianceStatus",
            display: "Compliance Status"
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
                    display: "Deactivate",
                    key: "deactivate"
                },
                {
                    display: "Activate",
                    key: "activate"
                },
                {
                    display: "View Vehicle",
                    key: "viewVehicle"
                },
                // {
                //     display: "Add EHS Entry",
                //     key: "addEHSEntry"
                // }
            ]
        }];
    const dispatch = useDispatch();

    const [addVehicleOpen, setAddVehicleOpen] = useState(false)
    const [viewVehicleOpen, setViewVehicleOpen] = useState(false)
    const [editVehicleData, setEditVehicleData] = useState(false)
    const [vehicleData, setVehicleData] = useState()
    const [searchVendor,setSearchVendor] = useState([]);
    const [openSearchVendor, setOpenSearchVendor] = useState(false);
    const [officeList,setOfficeList] = useState([]);
    const [officeId,setOfficeId] = useState("");
    const [complianceList,setComplianceList] = useState([]);
    const [complianceStatus,setComplianceStatus] = useState("");
    const [vehicleStateList,setVehicleStateList] = useState([]);
    const [vehicleState,setVehicleState] = useState("");
    const [ehsStatusList,setEhsStatusList] = useState([]);
    const [ehsStatus,setEhsStatus] = useState("");
    const [selectedVehicle,setSelectedVehicle] = useState();
    const [isEnableFlag,setIsEnableFlag] = useState(false);
    const [open, setOpen] = useState(false);
    const handleOpen = (id,isEnable) => {
        console.log(`id = ${id}, isEnable = ${isEnable}`)
        setSelectedVehicle(id);
        setIsEnableFlag(isEnable);
        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    const [pagination, setPagination] = useState({
        page: 0,
        size: DEFAULT_PAGE_SIZE,
    });
    const [paginationData, setPaginationData] = useState();
    const [searchBean,setSearchBean] = useState({
        officeId : "",
        complianceStatus : "",
        vendorName : "",
        vehicleState : "",
        ehsStatus: ""
    });
    const [vendorName,setVendorName] = useState("")

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

    const onChangeHandler = (newValue, name, key) => {
        console.log(newValue);
        setVendorName(newValue?.vendorName || "");
    };

    const onMenuItemClick = async (key, clickedItem) => {
        if (key === "edit") {
            const response = await ComplianceService.getSingleVehicle(clickedItem.id);
            setEditVehicleData(clickedItem);
            setAddVehicleOpen(true);
        } else if (key === "deactivate") {
            handleOpen(clickedItem.id,false);
        } else if (key === "activate") {
            handleOpen(clickedItem.id,true);
        } else if (key === "viewVehicle") {
            setEditVehicleData(clickedItem);
            setViewVehicleOpen(true);
        }
    };

    const downloadReport = () => {
        var data = [
            {
                sheet: "Vehicle Report",
                columns: [
                    { label: "Vehicle Id", value: "vehicleId" },
                    { label: "Vehicle Registration Number", value: "vehicleRegistrationNumber" },
                    { label: "Sticker Number", value: "stickerNumber" },
                    { label: "Vehicle Type", value: "vehicleType" },
                    { label: "Vehicle Owner Name", value: "vehicleOwnerName" },
                    { label: "Model Year", value: "modelYear" },
                    { label: "Vehicle Make", value: "vehicleMake" },
                    { label: "Vehicle Model", value: "vehicleModel" },
                    { label: "Fuel Type", value: "fuelType" },
                    { label: "Vendor Name", value: "vendorName" },
                    { label: "Office Id", value: "officeId" },
                    { label: "Registration Date", value: "registrationDate" },
                    { label: "Induction Date", value: "inductionDate" },
                    { label: "Manufacturing Date", value: "manufacturingDate" },
                    { label: "Insurance Expiry Date", value: "insuranceExpiryDate" },
                    { label: "Road Expiry Date", value: "roadTaxExpiryDate" },
                    { label: "Pollution Expiry Date", value: "pollutionExpiryDate" },
                    { label: "State Permit Expiry Date", value: "statePermitExpiryDate" },
                    { label: "National Permit Expiry Date", value: "nationalPermitExpiryDate" },
                    { label: "Fitness Expiry Date", value: "fitnessExpiryDate" },
                    { label: "Fitness Date", value: "fitnessDate" },
                    { label: "Garage Geo Code", value: "garageGeoCode" },
                    { label: "Garage Location", value: "garageLocation" },
                    { label: "EHS Status", value: "ehsStatus" },
                    { label: "RFID Status", value: "rfidStatus" },
                    { label: "AC Status", value: "acStatus" },
                    { label: "GPS Status", value: "gpsStatus" },
                    { label: "Vehicle Remarks", value: "vehicleRemarks" },
                    { label: "Registration Certificate Url", value: "registrationCertificateUrl" },
                    { label: "Insurance Url", value: "insuranceUrl" },
                    { label: "Pollution Certificate Url", value: "pollutionCertificateUrl" },
                    { label: "Road Tax Certificate Url", value: "roadTaxCertificateUrl" },
                    { label: "Fitness Certificate Url", value: "fitnessCertificateUrl" },
                    { label: "State Permit Url", value: "statePermitUrl" },
                    { label: "National Permit Url", value: "nationalPermitUrl" },
                    { label: "Driver Id", value: "driverId" },
                    { label: "EHS Done By", value: "ehsDoneBy" },
                ],
                content: vehicleData,
            }
        ]

        var settings = {
            fileName: "Vehicle Report",
            extraLength: 20,
            writeMode: "writeFile",
            writeOptions: {},
            RTL: false,
        }

        xlsx(data, settings)
    }


    const initializer = async (resetFlag,filter={}) => {
        try {
            var allValuesSearch = {...filter};
            Object.keys(allValuesSearch).forEach((objKey) => {
                if (allValuesSearch[objKey] === null || allValuesSearch[objKey] === "") {
                    delete allValuesSearch[objKey];
                }
            });
            let params;
            if(resetFlag){
                params = new URLSearchParams({
                    pageNo: 0,
                    pageSize: DEFAULT_PAGE_SIZE,
                });
            }
            console.log("Search bean>>>>",allValuesSearch)
            params = new URLSearchParams(pagination);
            const response = !resetFlag ? await ComplianceService.getAllVehicles(params.toString(),allValuesSearch) : await ComplianceService.getAllVehicles(params.toString(),{});
            const { data } = response || {};
            const { data: paginatedResponse } = data || {};
            console.log(paginatedResponse);
            setVehicleData(paginatedResponse || []);
            let localPaginationData = {...data};
            delete localPaginationData?.data;
            setPaginationData(localPaginationData);
        } catch (e) {
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

    const fetchComplianceStatus = async() =>{
        try{
            const response = await ComplianceService.getMasterData('ComplianceStatus');
            console.log(response.data);
            setComplianceList(response.data);
        }
        catch(err){
            console.log(err);
        }
    }

    const fetchEhsStatus = async() =>{
        try{
            const response = await ComplianceService.getMasterData('EhsStatus');
            console.log(response.data);
            setEhsStatusList(response.data);

        }catch(err){
            console.log(err);
        }
    }

    const fetchVehicleState = async() =>{
        try{
            const response = await ComplianceService.getMasterData('State');
            console.log(response.data);
            setVehicleStateList(response.data);
        
        }catch(err){
            console.log(err);
        }
    }

    const applyFilter = async() =>{
        let newPagination = {...pagination};
        let allSearchValues = {...searchBean};
        allSearchValues.officeId = officeId || "";
        allSearchValues.complianceStatus = complianceStatus || "";
        allSearchValues.vendorName = vendorName || "";
        allSearchValues.ehsStatus = ehsStatus || "";
        allSearchValues.vehicleState = vehicleState || "";
        console.log("all search values",allSearchValues);
        setSearchBean(allSearchValues);
        if (newPagination.page === 0) {
            initializer(false,allSearchValues);
        } else {
            newPagination.page = 0;
            setPagination(newPagination);
            initializer(false,allSearchValues);
        }
    }

    const resetFilter = () =>{
        setVendorName("");
        setOfficeId("");
        setStatus("");
        setSearchBean({});
        handlePageChange(0);
    }
    const handlePageChange = (page) => {
        let updatedPagination = {...pagination};
        updatedPagination.page = page;
        setPagination(updatedPagination);
    };

    const cancelHandler = () =>{
        setEditVehicleData([]);
        setAddVehicleOpen(false);
    }

    useEffect(() => {
        fetchAllOffice();
        fetchComplianceStatus();
        fetchEhsStatus();
        fetchVehicleState();
    }, []);

    const onSuccess = () =>{
        setViewVehicleOpen(false);
    }

    useEffect(()=>{
        initializer(false);
    },[pagination,addVehicleOpen,viewVehicleOpen])

    const onConfirmHandler = (remark) =>{
        console.log(`remark == ${remark}`)
        enableDisableVehicle(selectedVehicle, isEnableFlag,remark);
    }

    const enableDisableVehicle = async(id,isEnable,remark) =>{
        try{
            const response = await ComplianceService.enableDisableVehicle(id,isEnable, remark);
            if(response.status === 200){
                dispatch(toggleToast({ message: 'Driver deactivated successfully!', type: 'success' }));
                setOpen(false);
                initializer(false);
            }
             else {
                dispatch(toggleToast({ message: 'Driver deactivation unsuccessful. Please try again later!', type: 'error' }));
            }
        }
        catch(err){
            console.log(err);
        }
    }

    return (
        <div className='internalSettingContainer'>
            {!addVehicleOpen && !viewVehicleOpen && <div>
                <div style={{ display: 'flex', justifyContent: 'start' }}>
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
                    <div style={{minWidth: "180px"}} className='form-control-input'>
                        <FormControl fullWidth>
                            <InputLabel id="status-label">Compliance Status</InputLabel>
                            <Select
                                style={{width: "180px"}}                                    
                                labelId="status-label"
                                id="status"
                                value={complianceStatus}
                                name="statusId"
                                label="Compliance Status"
                                onChange={(e)=>setComplianceStatus(e.target.value)}
                            >
                                {!!complianceList?.length && complianceList.map((status, idx) => (
                                    <MenuItem key={idx} value={status.value}>{status.displayName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div style={{minWidth: "180px"}} className='form-control-input'>
                        <FormControl fullWidth>
                            <InputLabel id="ehs-status-label">EHS Status</InputLabel>
                            <Select
                                style={{width: "180px"}}                                    
                                labelId="ehs-status-label"
                                id="ehsStatusId"
                                value={ehsStatus}
                                name="ehsStatusId"
                                label="EHS Status"
                                onChange={(e)=>setEhsStatus(e.target.value)}
                            >
                                {!!ehsStatusList?.length && ehsStatusList.map((status, idx) => (
                                    <MenuItem key={idx} value={status.value}>{status.displayName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div style={{minWidth: "180px"}} className='form-control-input'>
                        <FormControl fullWidth>
                            <InputLabel id="vehicle-state-label">Vehicle State</InputLabel>
                            <Select
                                style={{width: "180px"}}                                    
                                labelId="vehicle-state-label"
                                id="vehicleStateId"
                                value={vehicleState}
                                name="vehicleStateId"
                                label="Vehicle State"
                                onChange={(e)=>setVehicleState(e.target.value)}
                            >
                                {!!vehicleStateList?.length && vehicleStateList.map((status, idx) => (
                                    <MenuItem key={idx} value={status.value}>{status.displayName}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
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
                                renderInput={(params) => <TextField {...params} label="Search Vendor Name" onChange={searchForVendor} />}
                            />
                        </FormControl>
                    </div>
                    <div className='form-control-input' style={{minWidth: "70px"}}>
                        <button type='submit' onClick={applyFilter} className='btn btn-primary filterApplyBtn'>Apply</button>
                    </div>
                    <div className='form-control-input' style={{minWidth: "70px"}}>
                        <button type='submit' onClick={resetFilter} className='btn btn-primary filterApplyBtn'>Reset</button>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <UploadButton />
                    <div className='btnContainer'>
                        <button onClick={() => setAddVehicleOpen(true)} className='btn btn-primary' style={{ width: '137.94px' }}>Add Vehicle</button>
                    </div>
                    <div className='btnContainer' style={{marginLeft: '30px'}}>
                        <button onClick={() => downloadReport()} className='btn btn-download'>Download File</button>
                    </div>
                </div>
                <div className='gridContainer'>
                    <Grid headers={headers} listing={vehicleData} onMenuItemClick={onMenuItemClick} enableDisableRow={true} handlePageChange={handlePageChange} pagination={paginationData}/>
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
            </div>}
            {
                addVehicleOpen && <AddNewVehicle SetAddVehicleOpen={cancelHandler} EditVehicleData={editVehicleData} />
            }
            {
                viewVehicleOpen && <AddVehiclePendingApproval ViewDetailsData={editVehicleData} viewVehicleOpen={onSuccess}/>
            }
        </div>
    );
}

export default compliance(VehicleProfile);