import React, { useEffect, useState } from 'react';
import AddEscort from './add-escort';
import Grid from '../grid';
import OfficeService from '@/services/office.service';
import { DEFAULT_PAGE_SIZE } from '@/constants/app.constants.';

const EscortManagement = ({
    onSuccess
}) => {

    const headers = [{
        key: "escortId",
        display: "Escort ID"
    },
    {
        key: "name",
        display: "Escort Name"
    },
    {
        key: "officeIds",
        display: "Office",
        type: "arr"
    },
    {
        key: "email",
        display: "Email"
    },
    {
        key: "mobile",
        display: "Mobile No"
    },
    {
        key: "address",
        display: "Address"
    },
    {
        key: "hamburgerMenu",
        html: <><span className="material-symbols-outlined">more_vert</span></>,
        navigation: true,
        menuItems: [{
            display: "Edit Escort",
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
        fetchAllEscorts();
    };

    const fetchAllEscorts = async () => {
        try {
            const params = new URLSearchParams(pagination);
            const response = await OfficeService.getAllEscorts(params.toString());
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
        fetchAllEscorts();
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

    const addEscort = () => {
        setEditEmployeeData({});
        setIsAddEdit(true);   
    }

    return (
        <div className='internalSettingContainer'>
            {!isAddEdit && <div>
                <div className='btnContainer'>
                    <button onClick={addEscort} className='btn btn-primary'>Add Escort</button>
                </div>
                <div className='gridContainer'>
                    <Grid onMenuItemClick={onMenuItemClick} handlePageChange={handlePageChange} pagination={paginationData} headers={headers} listing={employeeListing} />
                </div>
            </div>}
            {isAddEdit && <div>
                <AddEscort editEmployeeData={editEmployeeData} onUserSuccess={onUserSuccess} />
            </div>}
        </div>
    );
}

export default EscortManagement;