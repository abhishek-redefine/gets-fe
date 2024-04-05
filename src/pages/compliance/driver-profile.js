import compliance from '@/layouts/compliance';
import React, { useEffect, useState } from 'react';
import Grid from '@/components/grid';
import AddNewDriver from '@/components/compliance/add_new_driver';
import UploadButton from '@/components/buttons/uploadButton';
import ComplianceService from '@/services/compliance.service';
import xlsx from "json-as-xlsx";
import { toggleToast } from '@/redux/company.slice';
import { useDispatch } from 'react-redux';
import AddDriverPendingApproval from '@/components/compliance/addDriverPendingApproval';
import EhsEntryDriver from '@/components/compliance/addEhsEntryDriver';
import { FormControl, InputLabel, MenuItem, Select,Autocomplete,TextField } from '@mui/material';
import OfficeService from '@/services/office.service';
import { getFormattedLabel } from '@/utils/utils';
import { DEFAULT_PAGE_SIZE } from '@/constants/app.constants.';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import RemarkModal from '@/components/modal/remarkModal';
import BookingService from '@/services/booking.service';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    height: 190
  };

const DriverProfile = () => {
    const headers = [
        {
            key: "name",
            display: "Name"
        },
        {
            key: "licenseNo",
            display: "License No."
        },
        {
            key: "vendorName",
            display: "Vendor"
        },
        {
            key: "mobile",
            display: "Phone No."
        },
        {
            key: "id",
            display: "Driver ID"
        },
        {
            key: "officeId",
            display: "Office ID"
        },
        {
            key: "gender",
            display: "Gender"
        },
        {
            key: "aadharId",
            display: "Adhaar Id"
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
                // {
                //     display: "Add EHS Entry",
                //     key: "addEHSEntry"
                // },
                {
                    display: "View Driver",
                    key: "viewDriver"
                },

            ]
        }];
    const dispatch = useDispatch();

    const [addDriverOpen, setAddDriverOpen] = useState(false)
    const [viewDriverOpen, setViewDriverOpen] = useState(false)
    const [viewEhsDriverOpen, setViewEhsDriverOpen] = useState(false)
    const [editDriverData, setEditDriverData] = useState(false)
    const [searchVendor,setSearchVendor] = useState([]);
    const [openSearchVendor, setOpenSearchVendor] = useState(false);
    const [vendorName,setVendorName]= useState();
    const [officeList,setOfficeList] = useState([]);
    const [officeId,setOfficeId] = useState("");
    const [complianceList,setComplianceList] = useState([]);
    const [status,setStatus] = useState("");
    const [driverData, setDriverData] = useState();
    const [selectedDriver,setSelectedDriver] = useState();
    const [isEnableFlag,setIsEnableFlag] = useState(false);
    const [pagination, setPagination] = useState({
        page: 0,
        size: DEFAULT_PAGE_SIZE,
    });
    const [driverStateList,setDriverStateList] = useState([]);
    const [driverState,setDriverState] = useState("");
    const [ehsStatusList,setEhsStatusList] = useState([]);
    const [ehsStatus,setEhsStatus] = useState("");
    const [paginationData, setPaginationData] = useState();
    const [searchBean,setSearchBean] = useState({
        officeId : "",
        complianceStatus : "",
        vendorName : "",
        ehsStatus: "",
        driverState: ""
    });
    const [open, setOpen] = useState(false);
    const handleOpen = (id,isEnable) => {
        console.log(`id = ${id}, isEnable = ${isEnable}`)
        setSelectedDriver(id);
        setIsEnableFlag(isEnable);
        setOpen(true);
    }
    const handleClose = () => setOpen(false);

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
            setDriverStateList(response.data);
        
        }catch(err){
            console.log(err);
        }
    }

    const cancelHandler = () =>{
        setEditDriverData([]);
        setAddDriverOpen(false);
    }

    const onChangeHandler = (newValue, name, key) => {
        console.log(newValue);
        setVendorName(newValue?.vendorName || "");
    };

    const downloadReport = () => {
        var data = [
            {
                sheet: "Driver Report",
                columns: [
                    { label: "Aadhar Id", value: "aadharId" },
                    { label: "Address", value: "address" },
                    { label: "Alt Mobile", value: "altMobile" },
                    { label: "Badge Url", value: "badgeUrl" },
                    { label: "BGV Url", value: "bgvUrl" },
                    { label: "Driving Training Certificate Url", value: "driverTrainingCertUrl" },
                    { label: "Email", value: "email" },
                    { label: "Enabled", value: "enabled" },
                    { label: "Gender", value: "gender" },
                    { label: "ID", value: "id" },
                    { label: "License No", value: "licenseNo" },
                    { label: "License Url", value: "licenseUrl" },
                    { label: "Medical Certificate Url", value: "medicalCertUrl" },
                    { label: "Mobile", value: "mobile" },
                    { label: "Name", value: "name" },
                    { label: "Office ID", value: "officeId" },
                    { label: "Pan No", value: "panNo" },
                    { label: "Police Verification Url", value: "policeVerificationUrl" },
                    { label: "Remarks", value: "remarks" },
                    { label: "Undertaking Url", value: "undertakingUrl" },
                    { label: "Vendor Name", value: "vendorName" },
                ],
                content: driverData,
            }
        ]

        var settings = {
            fileName: "Driver Report",
            extraLength: 20,
            writeMode: "writeFile",
            writeOptions: {},
            RTL: false,
        }

        xlsx(data, settings)
    }

    const onMenuItemClick = async (key, clickedItem) => {
        if (key === "edit") {
            const response = await ComplianceService.getSingleDriver(clickedItem.id);
            setEditDriverData(clickedItem);
            setAddDriverOpen(true);
            
        } else if (key === "deactivate") {
            handleOpen(clickedItem.id,false);
        } else if (key === "activate") {
            handleOpen(clickedItem.id,true);
        } else if (key === "viewDriver") {
            setEditDriverData(clickedItem);
            setViewDriverOpen(true);
        } else if (key === "addEHSEntry") {
            setEditDriverData(clickedItem);
            setViewEhsDriverOpen(true);
        }
    };

    const initializer = async (resetFlag,filter={}) => {
        try {
            console.log(filter);
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
            const response = !resetFlag ? await ComplianceService.getAllDrivers(params.toString(),allValuesSearch) : await ComplianceService.getAllDrivers(params.toString,{});
            const { data } = response || {};
            const { data: paginatedResponse } = data || {};
            console.log(paginatedResponse);
            setDriverData(paginatedResponse || []);
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

    const applyFilter = async() =>{
        console.log(ehsStatus,driverState);
        let newPagination = {...pagination};
        let allSearchValues = {...searchBean};
        allSearchValues.officeId = officeId || "";
        allSearchValues.complianceStatus = status || "";
        allSearchValues.vendorName = vendorName || "";
        allSearchValues.ehsStatus = ehsStatus || "";
        allSearchValues.driverState = driverState || "";
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
        setDriverState("");
        setEhsStatus("");
        setSearchBean({});
        handlePageChange(0);
    }

    const handlePageChange = (page) => {
        let updatedPagination = {...pagination};
        updatedPagination.page = page;
        setPagination(updatedPagination);
    };

    useEffect(() => {
        fetchAllOffice();
        fetchComplianceStatus();
        fetchEhsStatus();
        fetchVehicleState();
    }, []);

    useEffect(()=>{
        initializer(false);
    },[pagination,addDriverOpen,viewDriverOpen])

    const onSuccess= () =>{
        setViewDriverOpen(false);
    }

    const onConfirmHandler = (remark) =>{
        console.log(`remark == ${remark}`)
        enableDisableDriver(selectedDriver, isEnableFlag,remark);
    }
    const enableDisableDriver = async(id,isEnable,remark) =>{
        try{
            const response = await ComplianceService.enableDisableDriver(id,isEnable, remark);
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
    const uploadFunction = async (item) => {
        try{
            var form = new FormData();
            form.append('model', '{"importJobDTO": {"importType": "IMPORT_TYPE_DRIVER","entityName": "DRIVER"}}');
            form.append('file', item);
            const response = await BookingService.uploadForm(form);
            console.log(response)
            if (response?.data?.isSuccessFul) {
                dispatch(toggleToast({ message: 'All Driver records uploaded successfully!', type: 'success' }));
            } else {
                console.log(response?.data?.successRecords, response?.data?.successRecords > 0)
                if (response?.data?.successRecords > 0) {
                    dispatch(toggleToast({ message: `${response?.data?.successRecords} out of ${response?.data?.totalRecords} Booking records uploaded successfully!`, type: 'success' }));
                } else {
                    dispatch(toggleToast({ message: `Driver records failed to upload. Please try again later.`, type: 'error' }));
                }
            }
            initializer(false);
        }
        catch(err){
            console.log(err);
        }
        
    }

    return (
        <div className='internalSettingContainer'>
            {!addDriverOpen && !viewDriverOpen && !viewEhsDriverOpen && <div>
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
                                value={status}
                                name="statusId"
                                label="Status"
                                onChange={(e)=>setStatus(e.target.value)}
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
                            <InputLabel id="driver-state-label">Driver State</InputLabel>
                            <Select
                                style={{width: "180px"}}                                    
                                labelId="driver-state-label"
                                id="driverStateId"
                                value={driverState}
                                name="driverStateId"
                                label="Driver State"
                                onChange={(e)=>setDriverState(e.target.value)}
                            >
                                {!!driverStateList?.length && driverStateList.map((status, idx) => (
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
                    <UploadButton uploadFunction={uploadFunction}/>
                    <div className='btnContainer'>
                        <button onClick={() => setAddDriverOpen(true)} className='btn btn-primary' style={{ width: '137.94px' }}>Add Driver</button>
                    </div>
                    <div className='btnContainer' style={{marginLeft: '30px'}}>
                        <button onClick={() => downloadReport()} className='btn btn-download'>Download File</button>
                    </div>
                </div>
                <div className='gridContainer'>
                    <Grid headers={headers} listing={driverData} onMenuItemClick={onMenuItemClick} enableDisableRow={true} handlePageChange={handlePageChange} pagination={paginationData}/>
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
                addDriverOpen && <AddNewDriver SetAddDriverOpen={cancelHandler} EditDriverData={editDriverData} />
            }
            {
                viewDriverOpen && <AddDriverPendingApproval SetAddDriverOpen={onSuccess} ViewDetailsData={editDriverData} isView={true}/>
            }
            {
                viewEhsDriverOpen && <EhsEntryDriver SetAddDriverOpen={setAddDriverOpen} EhsDetailsData={editDriverData} />
            }
        </div>
    );
}

export default compliance(DriverProfile);


