import React, { useEffect, useState } from "react";
import Grid from "../grid";
import UploadButton from "../buttons/uploadButton";
import AddEHS from "./addEHS";
import ComplianceService from "@/services/compliance.service";
import { display } from "@mui/system";
import LoaderComponent from "../common/loading";

const EHS = () => {
  const headers = [
    {
      key: "ehsTitle",
      display: "EHS Title",
    },
    {
      key: "ehsCategory",
      display: "EHS Category",
    },
    {
      key: "ehsMandate",
      display: "EHS Mandate",
    },
    {
      key: "ehsFrequency",
      display: "EHS Frequency",
    },
    {
      key: "createdAt",
      display: "Created At",
    },
    {
      key: "updatedAt",
      display: "Updated At",
    },
    {
      key: "vehicleType",
      display: "Vehicle Type",
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
          display: "Edit",
          key: "edit",
        },
        {
          display: "Deactivate",
          key: "deactivate",
        },
      ],
    },
  ];

  const [isAddEHS, setIsAddEHS] = useState(false);
  const [ehsListing, setEhsListing] = useState();
  const [editEhsData, setEditEhsData] = useState({});

  const [paginationData, setPaginationData] = useState();
  const [pagination, setPagination] = useState({
    pageNo: 0,
    pageSize: 10,
  });

  const [loading, setLoading] = useState(false);

  const handlePageChange = (page) => {
    console.log(page);
    let updatedPagination = { ...pagination };
    updatedPagination.pageNo = page;
    setPagination(updatedPagination);
  };

  const fetchAllEHS = async () => {
    try {
      setLoading(true);
      let params = new URLSearchParams(pagination);
      const response = await ComplianceService.getAllEHS(params, {});
      setEhsListing(response.data.data);

      const data = response.data;
      let localPaginationData = { ...data };
      delete localPaginationData?.data;
      setPaginationData(localPaginationData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEHS();
  }, [isAddEHS, pagination]);

  const onMenuItemClick = (key, values) => {
    if (key === "edit") {
      setEditEhsData(values);
      setIsAddEHS(true);
    }
  };

  return (
    <div>
      <div className="internalSettingContainer">
        {!isAddEHS && (
          <div>
            <div style={{ display: "flex", justifyContent: "end" }}>
              <div className="btnContainer">
                <button
                  onClick={() => setIsAddEHS(true)}
                  className="btn btn-primary"
                >
                  Add EHS
                </button>
              </div>
            </div>
            <div className="gridContainer">
              <Grid
                onMenuItemClick={onMenuItemClick}
                headers={headers}
                listing={ehsListing}
                pageNoText="pageNumber"
                handlePageChange={handlePageChange}
                pagination={paginationData}
              />
            </div>
          </div>
        )}
        {isAddEHS && (
          <div>
            <AddEHS EditEhsData={editEhsData} SetIsAddEhs={setIsAddEHS} />
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

export default EHS;
