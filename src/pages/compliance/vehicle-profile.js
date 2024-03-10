import compliance from '@/layouts/compliance';
import React, { useEffect, useState } from 'react';
import Grid from '@/components/grid';
import ComplianceService from '@/services/compliance.service';
import AddNewVehicle from '@/components/compliance/add_new_vehicle';
import xlsx from "json-as-xlsx";

const VehicleProfile = () => {
    const headers = [{
        key: "sNo",
        display: "S.No."
    },
    {
        key: "vehicleNo",
        display: "Vehicle No."
    },
    {
        key: "vehicleId",
        display: "Vehicle Id"
    },
    {
        key: "vendor",
        display: "Vendor"
    },
    {
        key: "model",
        display: "Model"
    },
    {
        key: "capacity",
        display: "Capacity"
    },
    {
        key: "driverId",
        display: "Driver ID"
    },
    {
        key: "driverName",
        display: "Driver Name"
    },
    {
        key: "status",
        display: "Status"
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
    
    const [addVehicleOpen, setAddVehicleOpen] = useState(false)
    const [vehicleData, setVehicleData] = useState()
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
            fileName: "Vehicle Report",
            extraLength: 20,
            writeMode: "writeFile",
            writeOptions: {},
            RTL: false,
        }

        xlsx(data, settings)
    }


    const initializer = async () => {
        try {
            const response = await ComplianceService.getAllVehicles();
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
            {!addVehicleOpen && <div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <div className='btnContainer'>
                        <button onClick={() => setAddVehicleOpen(true)} className='btn btn-primary'>Add Vehicle</button>
                    </div>
                </div>
                <div className='gridContainer'>
                    <Grid headers={headers} listing={vehicleData} enableDisableRow={true} />
                </div>
            </div>}
            {
                addVehicleOpen && <AddNewVehicle SetAddVehicleOpen={setAddVehicleOpen} />
            }
        </div>
    );
}

export default compliance(VehicleProfile);