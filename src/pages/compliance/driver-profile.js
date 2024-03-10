import compliance from '@/layouts/compliance';
import React, { useEffect, useState } from 'react';
import Grid from '@/components/grid';
import AddNewDriver from '@/components/compliance/add_new_driver';
import UploadButton from '@/components/buttons/uploadButton';
import ComplianceService from '@/services/compliance.service';
import xlsx from "json-as-xlsx";

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
            key: "driverId",
            display: "Driver ID"
        },
        {
            key: "vehicleId",
            display: "Vehicle ID"
        },
        {
            key: "status",
            display: "Status"
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
            key: "age",
            display: "Age"
        },
        {
            key: "aadharId",
            display: "Adhaar Id"
        },
        {
            key: "createdAt",
            display: "Created At"
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
                }
            ]
        }];

    const [addDriverOpen, setAddDriverOpen] = useState(false)
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
            setEditDriverData(clickedItem);
            setAddDriverOpen(true);
        } else if (key === "deactivate") {
            console.log(key, clickedItem);
        } else if (key === "activate") {
            console.log(key, clickedItem);
        } else if (key === "addEHSEntry") {
            console.log(key, clickedItem);
        }
    };

    const initializer = async () => {
        try {
            const response = await ComplianceService.getAllDrivers();
            setDriverData(response.data.data)
            console.log(response.data.data)
        } catch (e) {
        }
    }

    useEffect(() => {
        initializer();
    }, []);

    return (
        <div className='internalSettingContainer'>
            {!addDriverOpen && <div>
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
        </div>
    );
}

export default compliance(DriverProfile);


