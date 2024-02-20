import React, { useEffect, useState } from 'react';
import Grid from '../grid';
import OfficeService from '@/services/office.service';
import { DEFAULT_PAGE_SIZE } from '@/constants/app.constants.';
import AddTeam from './add-team';

const TeamManagement = ({
    onSuccess
}) => {

    const headers = [
    {
        key: "officeId",
        display: "Office Id"
    },
    {
        key: "name",
        display: "Vendor Name"
    },
    {
        key: "gstNo",
        display: "GST No"
    },
    {
        key: "contactPerson",
        display: "Contact Person"
    },
    {
        key: "mob",
        display: "Mobile No"
    },
    {
        key: "hamburgerMenu",
        html: <><span className="material-symbols-outlined">more_vert</span></>,
        navigation: true,
        menuItems: [{
            display: "Edit Team",
            key: "edit"
        }]
    }];

    const [isAddEdit, setIsAddEdit] = useState(false);
    const [paginationData, setPaginationData] = useState();
    const [pagination, setPagination] = useState({
        pageNo: 0,
        pageSize: DEFAULT_PAGE_SIZE,        
    });
    const [employeeListing, setEmployeeListing] = useState();
    const [editEmployeeData, setEditEmployeeData] = useState({});

    const onUserSuccess = () => {
        setIsAddEdit(false);
        onSuccess();
        fetchAllTeams();
    };

    const fetchAllTeams = async () => {
        try {
            const params = new URLSearchParams(pagination);
            const response = await OfficeService.getAllTeams(params.toString());
            const { data } = response || {};
            const { paginatedResponse } = data || {};        
            setEmployeeListing(paginatedResponse?.content);
            let localPaginationData = {...paginatedResponse};
            delete localPaginationData?.content;
            setPaginationData(localPaginationData);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchAllTeams();
    }, [pagination]);

    const handlePageChange = (page) => {
        let updatedPagination = {...pagination};
        updatedPagination.pageNo = page;
        setPagination(updatedPagination);
    };

    const onMenuItemClick = (key, values) => {
      if (key === "edit") {
        setEditEmployeeData(values);
        setIsAddEdit(true);
      }
    };

    return (
        <div className='internalSettingContainer'>
            {!isAddEdit && <div>
                <div className='btnContainer'>
                    <button onClick={() => setIsAddEdit(true)} className='btn btn-primary'>Add Team</button>
                </div>
                <div className='gridContainer'>
                    <Grid onMenuItemClick={onMenuItemClick} handlePageChange={handlePageChange} pagination={paginationData} headers={headers} listing={employeeListing} />
                </div>
            </div>}
            {isAddEdit && <div>
                <AddTeam editEmployeeData={editEmployeeData} onUserSuccess={onUserSuccess} />
            </div>}
        </div>       
    );
}

export default TeamManagement;