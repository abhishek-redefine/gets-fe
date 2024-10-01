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

    const [paginationData, setPaginationData] = useState();
    const [pagination,setPagination] = useState({
        pageNo : 0,
        pageSize : 10,
    })
    const [loading, setLoading] = useState(false);

    const handlePageChange = (page) => {
        console.log(page);
        let updatedPagination = {...pagination};
        updatedPagination.pageNo = page;
        setPagination(updatedPagination);
    };

    const fetchAllPenalties = async () => {
        try {
            setLoading(true);
            // await new Promise((resolve) => setTimeout(resolve, 5000));
            const params = new URLSearchParams(pagination)
            const response = await ComplianceService.getAllPenalty(params);
            setPenaltyListing(response.data.paginatedResponse.content);

            const data = response.data;
            let localPaginationData = {...data};
            delete localPaginationData?.paginatedResponse.contents;
            setPaginationData(localPaginationData.paginatedResponse);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllPenalties();
    }, [pagination]);

    const onMenuItemClick = (key, values) => {
        if (key === "edit") {
            setEditPenaltyData(values);
            setIsAddPenalty(true);
        }
    };

    return (
        <div className='internalSettingContainer'>
            {
                !isAddPenalty && <div>
                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                        <div className='btnContainer'>
                            <button onClick={() => setIsAddPenalty(true)} className='btn btn-primary'>Add Penalty</button>
                        </div>
                    </div>
                    <div className='gridContainer'>
                        <Grid 
                            onMenuItemClick={onMenuItemClick} 
                            headers={headers} 
                            listing={penaltyListing} 
                            pageNoText="pageNo"
                            handlePageChange={handlePageChange}
                            pagination={paginationData}  
                            isLoading={loading}  
                        />
                    </div>
                </div>
            }
            {
                isAddPenalty && <div>
                    <AddPenalty EditPenaltyData={editPenaltyData} isAddPenalty={()=>setIsAddPenalty(false)}/>
                </div>
            }
        </div>
    );
}

export default Penalty;