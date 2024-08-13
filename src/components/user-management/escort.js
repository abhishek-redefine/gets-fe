import React, { useEffect, useState } from "react";
import AddEscort from "./add-escort";
import Grid from "../grid";
import OfficeService from "@/services/office.service";
import { DEFAULT_PAGE_SIZE } from "@/constants/app.constants.";
import UploadButton from "../buttons/uploadButton";
import RoleService from "@/services/role.service";
import { Button } from "@mui/material";
import FormData from "form-data";
import { toggleToast } from "@/redux/company.slice";
import { useDispatch } from "react-redux";
import LoaderComponent from "../common/loading";

const EscortManagement = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const headers = [
    {
      key: "escortId",
      display: "Escort ID",
    },
    {
      key: "name",
      display: "Escort Name",
    },
    {
      key: "officeIds",
      display: "Office",
      type: "arr",
    },
    {
      key: "email",
      display: "Email",
    },
    {
      key: "mobile",
      display: "Mobile No",
    },
    {
      key: "address",
      display: "Address",
    },
    {
      key: "hamburgerMenu",
      html: (
        <>
          <span className="material-symbols-outlined">more_vert</span>
        </>
      ),
      navigation: true,
      menuItems: [
        {
          display: "Edit Escort",
          key: "edit",
        },
      ],
    },
  ];

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
    fetchAllEscorts();
  };

  const fetchAllEscorts = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
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
  };

  const uploadFunction = async (item) => {
    var form = new FormData();
    form.append(
      "model",
      '{"importJobDTO": {"importType": "IMPORT_TYPE_ESCORT","entityName": "ESCORT"}}'
    );
    form.append("file", item);
    const response = await OfficeService.uploadForm(form);
    console.log(response);
    if (response?.data?.isSuccessFul) {
      dispatch(
        toggleToast({
          message: "All Escort records uploaded successfully!",
          type: "success",
        })
      );
    } else {
      console.log(
        response?.data?.successRecords,
        response?.data?.successRecords > 0
      );
      if (response?.data?.successRecords > 0) {
        dispatch(
          toggleToast({
            message: `${response?.data?.successRecords} out of ${response?.data?.totalRecords} Escort records uploaded successfully!`,
            type: "success",
          })
        );
      } else {
        dispatch(
          toggleToast({
            message: `Escort records failed to upload. Please try again later.`,
            type: "error",
          })
        );
      }
    }
  };

  return (
    <div>
      <div className="internalSettingContainer">
        {!isAddEdit && (
          <div>
            <div style={{ display: "flex", justifyContent: "end" }}>
              <UploadButton uploadFunction={uploadFunction} />
              <div className="btnContainer">
                <button onClick={addEscort} className="btn btn-primary">
                  Add Escort
                </button>
              </div>
            </div>
            <div className="gridContainer">
              <Grid
                onMenuItemClick={onMenuItemClick}
                handlePageChange={handlePageChange}
                pagination={paginationData}
                headers={headers}
                listing={employeeListing}
              />
            </div>
          </div>
        )}
        {isAddEdit && (
          <div>
            <AddEscort
              editEmployeeData={editEmployeeData}
              onUserSuccess={onUserSuccess}
            />
          </div>
        )}
      </div>
      {loading ? (
        <div
          style={{
            position: "absolute",
            // backgroundColor: "pink",
            zIndex: "1",
            top: "55%",
            left: "50%",
          }}
        >
          <LoaderComponent />
        </div>
      ) : (
        " "
      )}
    </div>
  );
};

export default EscortManagement;
