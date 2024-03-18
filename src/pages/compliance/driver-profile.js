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
                    display: "Add EHS Entry",
                    key: "addEHSEntry"
                },
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
    const [driverData, setDriverData] = useState()
    const [pagination, setPagination] = useState({
        pageNo: 1,
        pageSize: 10,
    });

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
            const response = await ComplianceService.enableDisableDriver(clickedItem.id, false);
            if (response.status === 200) {
                dispatch(toggleToast({ message: 'Driver deactivated successfully!', type: 'success' }));
                initializer();
            } else {
                dispatch(toggleToast({ message: 'Driver deactivation unsuccessful. Please try again later!', type: 'error' }));
            }
        } else if (key === "activate") {
            const response = await ComplianceService.enableDisableDriver(clickedItem.id, true);
            if (response.status === 200) {
                dispatch(toggleToast({ message: 'Driver activated successfully!', type: 'success' }));
                initializer();
            } else {
                dispatch(toggleToast({ message: 'Driver activation unsuccessful. Please try again later!', type: 'error' }));
            }
        } else if (key === "viewDriver") {
            setEditDriverData(clickedItem);
            setViewDriverOpen(true);
        } else if (key === "addEHSEntry") {
            setEditDriverData(clickedItem);
            setViewEhsDriverOpen(true);
        }
    };

    const initializer = async () => {
        try {
            const response = await ComplianceService.getAllDrivers();
            setDriverData(response.data.data)
        } catch (e) {
        }
    }

    useEffect(() => {
        initializer();
    }, []);

    return (
        <div className='internalSettingContainer'>
            {!addDriverOpen && !viewDriverOpen && !viewEhsDriverOpen && <div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <UploadButton />
                    <div className='btnContainer'>
                        <button onClick={() => setAddDriverOpen(true)} className='btn btn-primary' style={{ width: '137.94px' }}>Add Driver</button>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <div className='btnContainer'>
                        <button onClick={() => downloadReport()} className='btn btn-download'>Download File</button>
                    </div>
                </div>
                <div className='gridContainer'>
                    <Grid headers={headers} listing={driverData} onMenuItemClick={onMenuItemClick} enableDisableRow={true} />
                </div>
            </div>}
            {
                addDriverOpen && <AddNewDriver SetAddDriverOpen={setAddDriverOpen} EditDriverData={editDriverData} />
            }
            {
                viewDriverOpen && <AddDriverPendingApproval SetAddDriverOpen={setAddDriverOpen} ViewDetailsData={editDriverData} />
            }
            {
                viewEhsDriverOpen && <EhsEntryDriver SetAddDriverOpen={setAddDriverOpen} EhsDetailsData={editDriverData} />
            }
        </div>
    );
}

export default compliance(DriverProfile);


