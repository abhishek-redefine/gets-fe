import compliance from '@/layouts/compliance';
import React, { useEffect, useState } from 'react';
import Grid from '@/components/grid';
import ComplianceService from '@/services/compliance.service';
import AddVehiclePendingApproval from '@/components/compliance/addVehiclePendingApproval';
import EhsEntryDriver from './ehsEntryDriver';
import EhsEntryVehicle from './ehsEntryVehicle';

const EhsVehicleProfile = () => {
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
                    display: "Add EHS Entry",
                    key: "addEhsEntry"
                }
            ]
        }];

    const [ehsVehicleOpen, setEhsVehicleOpen] = useState(false)
    const [ehsVehicleData, setEhsVehicleData] = useState(false)
    const [vehicleData, setVehicleData] = useState()

    const onMenuItemClick = async (key, clickedItem) => {
        if (key === "addEhsEntry") {
            setEhsVehicleData(clickedItem);
            setEhsVehicleOpen(true);
        }
    };

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
            {!ehsVehicleOpen && <div>
                <div className='gridContainer'>
                    <Grid headers={headers} listing={vehicleData} onMenuItemClick={onMenuItemClick} enableDisableRow={true} />
                </div>
            </div>}
            {
                ehsVehicleOpen && <EhsEntryVehicle EhsVehicleData={ehsVehicleData} />
            }
        </div>
    );
}

export default EhsVehicleProfile;