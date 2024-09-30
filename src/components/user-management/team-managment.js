import React, { useEffect, useState } from 'react';
import Grid from '../grid';
import OfficeService from '@/services/office.service';
import { DEFAULT_PAGE_SIZE } from '@/constants/app.constants.';
import AddTeam from './add-team';
import UploadButton from '../buttons/uploadButton';

const TeamManagement = ({
    onSuccess
}) => {

    const headers = [
        {
            key: "officeIds",
            display: "Office Id",
            type: "arr"
        },
        {
            key: "name",
            display: "Team Name"
        },
        // {
        //     key: "shiftType",
        //     display: "Shift Type"
        // },
        {
            key: "sendNotification",
            display: "Notification"
        },
        {
            key: "description",
            display: "Description"
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
    const [loading, setLoading] = useState(false);

    const onUserSuccess = () => {
        setIsAddEdit(false);
        setEditEmployeeData({});
        onSuccess();
        fetchAllTeams();
    };

    const fetchAllTeams = async () => {
        try {
            setLoading(true);
            // await new Promise((resolve) => setTimeout(resolve, 5000));
            const params = new URLSearchParams(pagination);
            const response = await OfficeService.getAllTeams(params.toString());
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
        fetchAllTeams();
    }, [pagination]);

    const handlePageChange = (page) => {
        let updatedPagination = { ...pagination };
        updatedPagination.pageNo = page;
        setPagination(updatedPagination);
    };

    const uploadFunction = async (item) => {
        var form = new FormData();
        form.append('model', '{"importJobDTO": {"importType": "IMPORT_TYPE_ESCORT","entityName": "ESCORT"}}');
        form.append('file', item);
        RoleService.uploadForm(form);
    }
    
    const onMenuItemClick = (key, values) => {
        if (key === "edit") {
            setEditEmployeeData(values);
            setIsAddEdit(true);
        }
    };

    return (
        <div className='internalSettingContainer'>
            {!isAddEdit && <div>
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <UploadButton uploadFunction={uploadFunction} />
                    <div className='btnContainer'>
                        <button onClick={() => setIsAddEdit(true)} className='btn btn-primary'>Add Team</button>
                    </div>
                </div>
                <div className='gridContainer'>
                    <Grid onMenuItemClick={onMenuItemClick} handlePageChange={handlePageChange} pagination={paginationData} headers={headers} listing={employeeListing} isLoading={loading} />
                </div>
            </div>}
            {isAddEdit && <div>
                <AddTeam editEmployeeData={editEmployeeData} onUserSuccess={onUserSuccess} />
            </div>}
        </div>
    );
}

export default TeamManagement;