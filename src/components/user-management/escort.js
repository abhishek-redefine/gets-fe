import React, { useEffect, useState } from 'react';
import AddEscort from './add-escort';
import Grid from '../grid';
import OfficeService from '@/services/office.service';
import { DEFAULT_PAGE_SIZE } from '@/constants/app.constants.';
import UploadButton from '../buttons/uploadButton';
import RoleService from '@/services/role.service';
import { Button } from '@mui/material';
import FormData from 'form-data';

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
            let localPaginationData = { ...paginatedResponse };
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

    const addEscort = () => {
        setEditEmployeeData({});
        setIsAddEdit(true);
    }

    const uploadFunction = async (item) => {
        var form = new FormData();
        form.append('model', new Blob(['{"importJobDTO": {"importType": "IMPORT_TYPE_ESCORT","entityName": "ESCORT"}}'], {
            contentType: "application/json"
        }));
        form.append('file', new Blob([item, {
            contentType: "multipart/form-data"
        }]));
        console.log('uploadFunction', form)
        RoleService.uploadForm(form);
    }

    return (
        <div className='internalSettingContainer'>
            {!isAddEdit && <div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <div className='btnContainer' style={{ width: '200px', marginRight: '10px' }}>
                        <label htmlFor="upload-photo">
                            <input
                                style={{ display: 'none' }}
                                id="upload-photo"
                                name="upload-photo"
                                type="file"
                                onChange={(e) => {
                                    uploadFunction(e.target.files[0])
                                }}
                            />
                            <Button variant="outlined" className='btn btn-primary' style={{
                                borderColor: "#F6CE47", color: '#000'
                            }} component="span">
                                Upload File
                            </Button>
                        </label>
                    </div>
                    <div className='btnContainer'>
                        <button onClick={addEscort} className='btn btn-primary'>Add Escort</button>
                    </div>
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