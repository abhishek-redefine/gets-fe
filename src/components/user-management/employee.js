import React, { useEffect, useState } from 'react';
import Grid from '../grid';
import AddEmployee from './add-employee';
import OfficeService from '@/services/office.service';
import { DEFAULT_PAGE_SIZE } from '@/constants/app.constants.';
import UploadButton from '../buttons/uploadButton';
import RoleService from '@/services/role.service';

const EmployeeManagement = ({
    roleType,
    onSuccess
}) => {

    const headers = [{
        key: "empId",
        display: "Employee ID"
    },
    {
        key: "name",
        display: "Employee Name"
    },
    {
        key: "primaryOfficeId",
        display: "Office"
    },
    {
        key: "email",
        display: "Email"
    },
    {
        key: "mob",
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
            display: "Edit Employee",
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
        fetchAllEmployees();
    };

    const fetchAllEmployees = async () => {
        try {
            const params = new URLSearchParams(pagination);
            const response = await OfficeService.getAllEmployees(params.toString());
            const { data } = response || {};
            const { paginatedResponse } = data || {};
            setEmployeeListing(paginatedResponse?.content);
            let localPaginationData = { ...paginatedResponse };
            delete localPaginationData?.content;
            setPaginationData(localPaginationData);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchAllEmployees();
    }, [pagination]);

    const handlePageChange = (page) => {
        let updatedPagination = { ...pagination };
        updatedPagination.pageNo = page;
        setPagination(updatedPagination);
    };

    const onMenuItemClick = (key, values) => {
        if (key === "edit") {
            setEditEmployeeData(values);
            setIsAddEdit(true);
        }
    };

    const uploadFunction=(item)=>{
        RoleService.uploadForm(item);
    }

    return (
        <div className='internalSettingContainer'>
            {!isAddEdit && <div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <UploadButton uploadFunction={uploadFunction}/>
                    <div className='btnContainer'>
                        <button onClick={() => setIsAddEdit(true)} className='btn btn-primary'>Add Employee</button>
                    </div>
                </div>
                <div className='gridContainer'>
                    <Grid onMenuItemClick={onMenuItemClick} handlePageChange={handlePageChange} pagination={paginationData} headers={headers} listing={employeeListing} />
                </div>
            </div>}
            {isAddEdit && <div>
                <AddEmployee editEmployeeData={editEmployeeData} onUserSuccess={onUserSuccess} roleType={roleType} />
            </div>}
        </div>
    );
}

export default EmployeeManagement;