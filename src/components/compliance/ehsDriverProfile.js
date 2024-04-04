import React, { useEffect, useState } from 'react';
import Grid from '@/components/grid';
import ComplianceService from '@/services/compliance.service';
import { useDispatch } from 'react-redux';
import EhsEntryDriver from './ehsEntryDriver';
import { Button,FormControl,Autocomplete,TextField,Select,InputLabel,MenuItem } from '@mui/material';
import OfficeService from '@/services/office.service';
import { getFormattedLabel } from '@/utils/utils';
import { DEFAULT_PAGE_SIZE } from '@/constants/app.constants.';
import { useRouter } from 'next/router';

const EhsDriverProfile = () => {
    const router = useRouter();
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
            key: 'ehsStatus',
            display: "Ehs Status"
        },
        {
            key: 'driverState',
            display: 'State'
        },
        {
            key: "hamburgerMenu",
            html: <><span className="material-symbols-outlined">more_vert</span></>,
            navigation: true,
            menuItems: [
                {
                    display: "View EHS Entry",
                    key: "addEhsEntry"
                }
            ]
        }];

    const dispatch = useDispatch();

    const [ehsDriverOpen, setEhsDriverOpen] = useState(false)
    const [ehsDriverData, setEhsDriverData] = useState(false)
    const [driverData, setDriverData] = useState()
    const [openSearchDriver, setOpenSearchDriver] = useState(false);
    const [searchedDriver, setSearchedDriver] = useState([]);
    const [driverId,setDriverId] = useState("");
    const [officeList,setOfficeList] = useState([]);
    const [officeId,setOfficeId] = useState("");
    const [ehsStatusList,setEhsStatusList] = useState([]);
    const [ehsStatus,setEhsStatus] = useState("");

    const [pagination, setPagination] = useState({
        page: 0,
        size: DEFAULT_PAGE_SIZE,
    });
    const [paginationData, setPaginationData] = useState();
    const [searchBean,setSearchBean] = useState({
        officeId : "",
        complianceStatus : "COMPLIANT",
        ehsStatus: "",
    });
    const handlePageChange = (page) => {
        let updatedPagination = {...pagination};
        updatedPagination.page = page;
        setPagination(updatedPagination);
    };
    const searchByBean = () =>{
        var allSearchValues = {...searchBean};
        allSearchValues.officeId = officeId;
        allSearchValues.ehsStatus = ehsStatus;
        initializer(false,allSearchValues);
    }

    const onChangeDriverHandler = (newValue, name, key) => {
        console.log("on change handler", newValue);
        setDriverId(newValue?.driverId);
    };
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

    const fetchEhsStatus = async() =>{
        try{
            const response = await ComplianceService.getMasterData('EhsStatus');
            console.log(response.data);
            setEhsStatusList(response.data);

        }catch(err){
            console.log(err);
        }
    }

    const onMenuItemClick = async (key, clickedItem) => {
        if (key === "addEhsEntry") {
            setEhsDriverData(clickedItem);
            setEhsDriverOpen(true);
        }
    };

    const initializer = async (resetFlag=false,filter={complianceStatus : "COMPLIANT"}) => {
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
            params = new URLSearchParams(pagination);
            const response = await ComplianceService.getAllDrivers(params.toString(),allValuesSearch);
            setDriverData(response.data.data)
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        fetchAllOffice();
        fetchEhsStatus();
        initializer();
    }, []);

    const searchDriverById = async() =>{
        try{
            if(driverId && driverId != ""){
                const response = await ComplianceService.getDriverById(driverId);
                console.log(response.data);
                let list = [response.data.driver];
                setDriverData(list);
            }
        }
        catch(err){
            console.log(err);
        }
    }

    return (
        <div className='internalSettingContainer'>
            {!ehsDriverOpen && <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    {/* <div style={{ display: 'flex', justifyContent: 'start' }}>
                    <div className='form-control-input'>
                        <FormControl variant="outlined">
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
                                onChange={(e, val) => onChangeDriverHandler(val, "driver", "driverId")}
                                getOptionKey={(driver) => driver.driverId}
                                getOptionLabel={(driver) => driver.driverName}
                                freeSolo
                                name="driver"
                                renderInput={(params) => <TextField {...params} label="Search Driver" onChange={searchForDriver} />}
                            />
                        </FormControl>
                    </div> 
                    <div className='form-control-input' style={{minWidth: "70px"}}>
                        <button type='button' onClick={searchDriverById} className='btn btn-primary filterApplyBtn'>Search</button>
                    </div>
                    </div> */}
                    <div style={{ display: 'flex' }}>
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
                        <div className='form-control-input' style={{minWidth: "70px"}}>
                            <button type='button' onClick={searchByBean} className='btn btn-primary filterApplyBtn'>Apply</button>
                        </div>
                        <div className='form-control-input' style={{minWidth: "70px"}}>
                            <button type='button' onClick={()=>initializer(true)} className='btn btn-primary filterApplyBtn'>Reset</button>
                        </div>
                    </div>
                    <div style={{ display: 'flex' }}>
                        <div style={{margin: 20}}>
                            <button type='button' className='btn btn-primary' onClick={()=>router.push('ehsEntry')} style={{padding:18}}>Add EHS Entry</button>
                        </div>
                    </div>
                </div>
                <div className='gridContainer'>
                    <Grid headers={headers} listing={driverData} onMenuItemClick={onMenuItemClick} enableDisableRow={true} />
                </div>
            </div>}
            {
                ehsDriverOpen && <EhsEntryDriver EhsDriverData={ehsDriverData} SetEhsDriverOpen={setEhsDriverOpen} ehsStatusList={ehsStatusList}/>
            }
        </div>
    );
}

export default EhsDriverProfile;


