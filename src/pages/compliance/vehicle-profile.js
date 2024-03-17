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
                {
                    display: "Add EHS Entry",
                    key: "addEHSEntry"
                }
            ]
        }];
    const dispatch = useDispatch();

    const [addVehicleOpen, setAddVehicleOpen] = useState(false)
    const [viewVehicleOpen, setViewVehicleOpen] = useState(false)
    const [editVehicleData, setEditVehicleData] = useState(false)
    const [vehicleData, setVehicleData] = useState()
    const [pagination, setPagination] = useState({
        pageNo: 1,
        pageSize: 10,
    });

    const onMenuItemClick = async (key, clickedItem) => {
        if (key === "edit") {
            const response = await ComplianceService.getSingleVehicle(clickedItem.id);
            setEditVehicleData(clickedItem);
            setAddVehicleOpen(true);
        } else if (key === "deactivate") {
            const response = await ComplianceService.enableDisableVehicle(clickedItem.id, false);
            if (response.status === 200) {
                dispatch(toggleToast({ message: 'Vehicle deactivated successfully!', type: 'success' }));
                initializer();
            } else {
                dispatch(toggleToast({ message: 'Vehicle deactivation unsuccessful. Please try again later!', type: 'error' }));
            }
        } else if (key === "activate") {
            const response = await ComplianceService.enableDisableVehicle(clickedItem.id, true);
            if (response.status === 200) {
                dispatch(toggleToast({ message: 'Vehicle activated successfully!', type: 'success' }));
                initializer();
            } else {
                dispatch(toggleToast({ message: 'Vehicle activation unsuccessful. Please try again later!', type: 'error' }));
            }
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
                    { label: "Medical Certificate Url", value: "medicalCertificateUrl" },
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
            {!addVehicleOpen && !viewVehicleOpen && <div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <UploadButton />
                    <div className='btnContainer'>
                        <button onClick={() => setAddVehicleOpen(true)} className='btn btn-primary' style={{ width: '137.94px' }}>Add Vehicle</button>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <div className='btnContainer'>
                        <button onClick={() => downloadReport()} className='btn btn-download'>Download File</button>
                    </div>
                </div>
                <div className='gridContainer'>
                    <Grid headers={headers} listing={vehicleData} onMenuItemClick={onMenuItemClick} enableDisableRow={true} />
                </div>
            </div>}
            {
                addVehicleOpen && <AddNewVehicle SetAddVehicleOpen={setAddVehicleOpen} EditVehicleData={editVehicleData} />
            }
            {
                viewVehicleOpen && <AddVehiclePendingApproval ViewDetailsData={editVehicleData} />
            }
        </div>
    );
}

export default compliance(VehicleProfile);