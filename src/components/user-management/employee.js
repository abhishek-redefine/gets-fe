import React, { useEffect, useState } from 'react';
import Grid from '../grid';
import AddEmployee from './add-employee';
import OfficeService from '@/services/office.service';
import { DEFAULT_PAGE_SIZE } from '@/constants/app.constants.';
import UploadButton from '../buttons/uploadButton';
import RoleService from '@/services/role.service';
import BookingService from '@/services/booking.service';

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
    const [loading, setLoading] = useState(false);

    const onUserSuccess = () => {
        setIsAddEdit(false);
        setEditEmployeeData({})
        onSuccess();
        fetchAllEmployees();
    };

    const fetchAllEmployees = async () => {
        try {
            setLoading(true);
            // await new Promise((resolve) => setTimeout(resolve, 5000));
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
        } finally {
            setLoading(false);
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

    const uploadFunction = async (item) => {
        try{
            console.log("entered")
            var form = new FormData();
            form.append('model', '{"importJobDTO": {"importType": "IMPORT_TYPE_EMPLOYEE","entityName": "EMPLOYEE"}}');
            form.append('file', item);
            const response = await BookingService.uploadForm(form);
            console.log(response)
            if (response?.data?.isSuccessFul) {
                dispatch(toggleToast({ message: 'All Booking records uploaded successfully!', type: 'success' }));
            } else {
                console.log(response?.data?.successRecords, response?.data?.successRecords > 0)
                if (response?.data?.successRecords > 0) {
                    dispatch(toggleToast({ message: `${response?.data?.successRecords} out of ${response?.data?.totalRecords} Booking records uploaded successfully!`, type: 'success' }));
                } else {
                    dispatch(toggleToast({ message: `Booking records failed to upload. Please try again later.`, type: 'error' }));
                }
            }
            fetchAllEmployees();
        }
        catch(err){
            console.log(err);
        }
    }

    return (
        <div className='internalSettingContainer'>
            {!isAddEdit && <div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <UploadButton uploadFunction={(e)=>uploadFunction(e)}/>
                    <div className='btnContainer'>
                        <button onClick={() => setIsAddEdit(true)} className='btn btn-primary'>Add Employee</button>
                    </div>
                </div>
                <div className='gridContainer'>
                    <Grid onMenuItemClick={onMenuItemClick} handlePageChange={handlePageChange} pagination={paginationData} headers={headers} listing={employeeListing} isLoading={loading}/>
                </div>
            </div>}
            {isAddEdit && <div>
                <AddEmployee editEmployeeData={editEmployeeData} onUserSuccess={onUserSuccess} roleType={roleType} />
            </div>}
        </div>
    );
}

export default EmployeeManagement;