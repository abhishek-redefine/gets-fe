import React, { useEffect, useState } from 'react';
import Grid from '../grid';
import UploadButton from '../buttons/uploadButton';
import AddEHS from './addEHS';
import ComplianceService from '@/services/compliance.service';

const EHS = () => {
    const headers = [
    {
        key: "ehsTitle",
        display: "EHS Title"
    },
    {
        key: "ehsCategory",
        display: "EHS Category"
    },
    {
        key: "ehsMandate",
        display: "EHS Mandate"
    },
    {
        key: "ehsFrequencyType",
        display: "EHS Frequency Type"
    },
    {
        key: "ehsFrequency",
        display: "EHS Frequency"
    },
    {
        key: "vehicleType",
        display: "Vehile Type"
    },
    {
        key: "hamburgerMenu",
        html: <><span className="material-symbols-outlined">more_vert</span></>,
        navigation: true,
        menuItems: [{
            display: "Edit",
            key: "edit"
        },
        {
            display: "Deactivate",
            key: "deactivate"
        }]
    }];

    const [isAddEHS, setIsAddEHS] = useState(false);
    const [ehsListing, setEhsListing] = useState();
    const [editEhsData, setEditEhsData] = useState({});

    const fetchAllEHS = async () => {
        try {
            const response = await ComplianceService.getAllEHS();
            setEhsListing(response.data.paginatedResponse.content);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchAllEHS();
    }, []);

    const onMenuItemClick = (key, values) => {
        if (key === "edit") {
            setEditEhsData(values);
            setIsAddEHS(true);
        }
    };

    const uploadFunction = (item) => {
        console.log('UploadFunction')
    };

    return (
        <div className='internalSettingContainer'>
            {!isAddEHS && <div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <UploadButton uploadFunction={uploadFunction} />
                    <div className='btnContainer'>
                        <button onClick={() => setIsAddEHS(true)} className='btn btn-primary'>Add EHS</button>
                    </div>
                </div>
                <div className='gridContainer'>
                    <Grid onMenuItemClick={onMenuItemClick} headers={headers} listing={ehsListing} />
                </div>
            </div>}
            {
                isAddEHS && <div>
                    <AddEHS EditEhsData={editEhsData} />
                </div>
            }
        </div>
    );
}

export default EHS;