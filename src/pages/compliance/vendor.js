import React, { useEffect, useState } from 'react';
import Grid from '@/components/grid';
import AddPenalty from '@/components/compliance/addPenalty';
import compliance from '@/layouts/compliance';
import AddVendor from '@/components/compliance/addVendor';
import ComplianceService from '@/services/compliance.service';
import { toggleToast } from '@/redux/company.slice';
import { useDispatch } from 'react-redux';

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
            key: "hamburgerMenu",
            html: <><span className="material-symbols-outlined">more_vert</span></>,
            navigation: true,
            menuItems: [
                {
                    display: "Edit",
                    key: "edit"
                }
            ]
        }];
    const dispatch = useDispatch();

    const [isAddVendor, setIsAddVendor] = useState(false);
    const [vendorListing, setVendorListing] = useState();
    const [editVendorData, setEditVendorData] = useState({});

    const fetchAllVendors = async () => {
        try {
            const response = await ComplianceService.getAllVendorCompany();
            setVendorListing(response.data.paginatedResponse.content);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchAllVendors();
    }, []);

    const onMenuItemClick =async (key, clickedItem) => {
        if (key === "edit") {
            setEditVendorData(clickedItem);
            setIsAddVendor(true);
        }
    };

    return (
        <div className='internalSettingContainer'>
            {!isAddVendor && <div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <div className='btnContainer'>
                        <button onClick={() => setIsAddVendor(true)} className='btn btn-primary'>Add Vendor</button>
                    </div>
                </div>
                <div className='gridContainer'>
                    <Grid onMenuItemClick={onMenuItemClick} headers={headers} listing={vendorListing} />
                </div>
            </div>}
            {
                isAddVendor && <div>
                    <AddVendor EditVendorData={editVendorData} />
                </div>
            }
        </div>
    );
}

export default compliance(Vendor);