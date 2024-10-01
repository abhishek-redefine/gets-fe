import React, { useEffect, useState } from 'react';
import Grid from '../grid';
import OfficeService from '@/services/office.service';
import { DEFAULT_PAGE_SIZE } from '@/constants/app.constants.';
import AddVendor from './add-vendor';
import UploadButton from '../buttons/uploadButton';

const VendorTeamManagement = ({
    roleType,
    onSuccess
}) => {

    const headers = [{
        key: "vendorId",
        display: "Vendor Id"
    },
    {
        key: "officeIds",
        display: "Vendor Office",
        type: "arr"
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
            display: "Edit Vendor",
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
        onSuccess();
        fetchAllVendors();
    };

    const uploadFunction = async (item) => {
        var form = new FormData();
        form.append('model', '{"importJobDTO": {"importType": "IMPORT_TYPE_ESCORT","entityName": "ESCORT"}}');
        form.append('file', item);
        RoleService.uploadForm(form);
    }

    const fetchAllVendors = async () => {
        try {
            setLoading(true);
            // await new Promise((resolve) => setTimeout(resolve, 5000));
            const params = new URLSearchParams(pagination);
            const response = await OfficeService.getAllVendors(params.toString());
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
        fetchAllVendors();
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

    const addVendor = () => {
        setEditEmployeeData({});
        setIsAddEdit(true);
    }

    return (
        <div className='internalSettingContainer'>
            {!isAddEdit && <div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <UploadButton uploadFunction={uploadFunction} />
                    <div className='btnContainer'>
                        <button onClick={addVendor} className='btn btn-primary'>Add Vendor</button>
                    </div>
                </div>
                <div className='gridContainer'>
                    <Grid onMenuItemClick={onMenuItemClick} handlePageChange={handlePageChange} pagination={paginationData} headers={headers} listing={employeeListing} isLoading={loading} />
                </div>
            </div>}
            {isAddEdit && <div>
                <AddVendor editEmployeeData={editEmployeeData} onUserSuccess={onUserSuccess} roleType={roleType} />
            </div>}
        </div>
    );
}

export default VendorTeamManagement;