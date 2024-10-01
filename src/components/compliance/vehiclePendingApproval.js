import compliance from '@/layouts/compliance';
import React, { useEffect, useState } from 'react';
import Grid from '@/components/grid';
import ComplianceService from '@/services/compliance.service';
import AddNewVehicle from '@/components/compliance/add_new_vehicle';
import xlsx from "json-as-xlsx";
import UploadButton from '@/components/buttons/uploadButton';
import AddVehiclePendingApproval from '@/components/compliance/addVehiclePendingApproval';
import { DEFAULT_PAGE_SIZE } from '@/constants/app.constants.';

const VehiclePendingApproval = () => {
    const headers = [
        {
            key: "vehicleId",
            display: "Vehicle ID"
        },
        {
            key: "vehicleRegistrationNumber",
            display: "Registration No"
        },
        {
            key: "vehicleType",
            display: "Vehicle Type"
        },
        {
            key: "officeId",
            display: "Office ID"
        },
        {
            key: "vendorName",
            display: "Vendor Name"
        },
        {
            key: "complianceStatus",
            display: "Vehicle Compliance Status"
        },
        {
            key: "insuranceExpiryDate",
            display: "Insurance Expiry"
        },
        {
            key: "roadTaxExpiryDate",
            display: "Road Tax Expiry"
        },
        {
            key: "pollutionExpiryDate",
            display: "Pollution Expiry"
        },
        {
            key: "nationalPermitExpiryDate",
            display: "National Permit Expiry"
        },
        {
            key: "fitnessExpiryDate",
            display: "Fitness Expiry"
        },
        {
            key: "manufacturingDate",
            display: "Manufacturing Date"
        },
        {
            key: "inductionDate",
            display: "Induction Date"
        },
        {
            key: "inductionDate",
            display: "Induction Date"
        },
        {
            key: "hamburgerMenu",
            html: <><span className="material-symbols-outlined">more_vert</span></>,
            navigation: true,
            menuItems: [
                {
                    display: "View Vehicle",
                    key: "viewVehicle"
                }
            ]
        }];

    const [addVehicleOpen, setAddVehicleOpen] = useState(false)
    const [viewVehicleOpen, setViewVehicleOpen] = useState(false)
    const [editVehicleData, setEditVehicleData] = useState(false)
    const [vehicleData, setVehicleData] = useState()
    const [loading, setLoading] = useState(false);

    const onMenuItemClick = async (key, clickedItem) => {
        if (key === "viewVehicle") {
            setEditVehicleData(clickedItem);
            setViewVehicleOpen(true);
        }
    };

    ////////////////////////////////////////////
    const [pagination, setPagination] = useState({
        page: 0,
        size: DEFAULT_PAGE_SIZE,
    });
    const [paginationData, setPaginationData] = useState();

    const handlePageChange = (page) => {
        let updatedPagination = {...pagination};
        updatedPagination.page = page;
        setPagination(updatedPagination);
    };
    ////////////////////////////////////////////

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
            setLoading(true);
            // await new Promise((resolve) => setTimeout(resolve, 5000));
            var filter = { complianceStatus : "PENDING"}
            let params = new URLSearchParams(pagination);
            const response = await ComplianceService.getAllVehicles(params.toString(),filter);
            const { data } = response || {};
            const { data: paginatedResponse } = data || {};
            setVehicleData(paginatedResponse);
            let localPaginationData = {...data};
            delete localPaginationData?.data;
            setPaginationData(localPaginationData);
        } catch (e) {
        } finally {
            setLoading(false);
        }
    }

    const onSuccess = () =>{
        setViewVehicleOpen(false);
    }

    useEffect(() => {
        initializer();
    }, [pagination,viewVehicleOpen]);

    return (
        <div className='internalSettingContainer'>
            {!viewVehicleOpen && <div>

                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <div className='btnContainer'>
                        <button onClick={() => downloadReport()} className='btn btn-download'>Download File</button>
                    </div>
                </div>
                <div className='gridContainer'>
                    <Grid headers={headers} listing={vehicleData} onMenuItemClick={onMenuItemClick} enableDisableRow={true} handlePageChange={handlePageChange} pagination={paginationData} isLoading={loading} />
                </div>
            </div>}
            {
                viewVehicleOpen && <AddVehiclePendingApproval ViewDetailsData={editVehicleData} viewVehicleOpen={onSuccess}/>
            }
        </div>
    );
}

export default VehiclePendingApproval;