import React, { useEffect, useState } from 'react';
import Grid from '../grid';
import UploadButton from '../buttons/uploadButton';
import AddPenalty from './addPenalty';
import ComplianceService from '@/services/compliance.service';

const Penalty = () => {
    const headers = [
    {
        key: "officeId",
        display: "Office Id"
    },
    {
        key: "penaltyCategory",
        display: "Penalty Category"
    },
    {
        key: "penaltyName",
        display: "Penalty Name"
    },
    {
        key: "penaltyType",
        display: "Penalty Type"
    },
    {
        key: "penaltyAmount",
        display: "Amount"
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

    const [isAddPenalty, setIsAddPenalty] = useState(false);
    const [penaltyListing, setPenaltyListing] = useState();
    const [editPenaltyData, setEditPenaltyData] = useState({});

    const fetchAllPenalties = async () => {
        try {
            const response = await ComplianceService.getAllPenalty();
            setPenaltyListing(response.data.paginatedResponse.content);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchAllPenalties();
    }, []);

    const onMenuItemClick = (key, values) => {
        if (key === "edit") {
            setEditPenaltyData(values);
            setIsAddPenalty(true);
        }
    };

    const uploadFunction = (item) => {
        console.log('UploadFunction')
    };

    return (
        <div className='internalSettingContainer'>
            {
                !isAddPenalty && <div>
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <UploadButton uploadFunction={uploadFunction} />
                        <div className='btnContainer'>
                            <button onClick={() => setIsAddPenalty(true)} className='btn btn-primary'>Add Penalty</button>
                        </div>
                    </div>
                    <div className='gridContainer'>
                        <Grid onMenuItemClick={onMenuItemClick} headers={headers} listing={penaltyListing} />
                    </div>
                </div>
            }
            {
                isAddPenalty && <div>
                    <AddPenalty EditPenaltyData={editPenaltyData} />
                </div>
            }
        </div>
    );
}

export default Penalty;