import React, { useEffect, useState } from 'react';
import Grid from '../grid';
import OfficeService from '@/services/office.service';
import { DEFAULT_PAGE_SIZE } from '@/constants/app.constants.';
import AddAdmin from './add-admin';
import UploadButton from '../buttons/uploadButton';
import { toggleToast } from '@/redux/company.slice';
import { useDispatch } from 'react-redux';

const AdminManagement = ({
    roleType,
    onSuccess
}) => {
    const dispatch = useDispatch()
    const headers = [{
        key: "name",
        display: "Admin Name"
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
            display: "Edit Admin",
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
        fetchAllAdmins();
    };

    const fetchAllAdmins = async () => {
        try {
            const params = new URLSearchParams(pagination);
            const response = await OfficeService.getAllAdmins(params.toString());
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
        fetchAllAdmins();
    }, [pagination]);

    const handlePageChange = (page) => {
        let updatedPagination = { ...pagination };
        updatedPagination.pageNo = page;
        setPagination(updatedPagination);
    };

    const uploadFunction = async (item) => {
        try{
            var form = new FormData();
            form.append('model', '{"importJobDTO": {"importType": "IMPORT_TYPE_ADMIN_USER","entityName": "ADMIN USER"}}');
            form.append('file', item);
            const response = await OfficeService.uploadForm(form);
            console.log(response)
            if (response?.data?.isSuccessFul) {
                dispatch(toggleToast({ message: 'All Admin records uploaded successfully!', type: 'success' }));
            } else {
                console.log(response?.data?.successRecords, response?.data?.successRecords > 0)
                if (response?.data?.successRecords > 0) {
                    dispatch(toggleToast({ message: `${response?.data?.successRecords} out of ${response?.data?.totalRecords} Admin records uploaded successfully!`, type: 'success' }));
                } else {
                    dispatch(toggleToast({ message: `Admin records failed to upload. Please try again later.`, type: 'error' }));
                }
            }
            fetchAllAdmins();
        }
        catch(err){
            console.log(err);
        }
    }

    const onMenuItemClick = (key, values) => {
        if (key === "edit") {
            setEditEmployeeData(values);
            setIsAddEdit(true);
        }
    };

    const addAdmin = () => {
        setEditEmployeeData({});
        setIsAddEdit(true);
    }

    return (
        <div className='internalSettingContainer'>
            {!isAddEdit && <div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <UploadButton uploadFunction={uploadFunction} />
                    <div className='btnContainer'>
                        <button onClick={addAdmin} className='btn btn-primary'>Add Admin</button>
                    </div>
                </div>
                <div className='gridContainer'>
                    <Grid onMenuItemClick={onMenuItemClick} handlePageChange={handlePageChange} pagination={paginationData} headers={headers} listing={employeeListing} />
                </div>
            </div>}
            {isAddEdit && <div>
                <AddAdmin editEmployeeData={editEmployeeData} onUserSuccess={onUserSuccess} roleType={roleType} />
            </div>}
        </div>
    );
}

export default AdminManagement;