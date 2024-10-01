import React, { useEffect, useState } from "react";
import Grid from "../grid";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import OfficeService from "@/services/office.service";
import { getFormattedLabel } from "@/utils/utils";
import RoutingService from "@/services/route.service";
import { object } from "yup";
import LoaderComponent from "../loader";

const HomeRoute = () => {
  const headers = [
    {
      key: "officeId",
      display: "Office ID",
    },
    {
      key: "routeName",
      display: "Route Name",
    },
    {
      key: "areaName",
      display: "Area Name",
    },
    {
      key: "zone",
      display: "Zone Name",
    },
    // {
    //   key: "hamburgerMenu",
    //   html: (
    //     <>
    //       <span className="material-symbols-outlined">more_vert</span>
    //     </>
    //   ),
    //   navigation: true,
    //   menuItems: [
    //     {
    //       display: "Enable",
    //       key: "activate",
    //     },
    //     {
    //       display: "Disable",
    //       key: "deactivate",
    //     },
    //   ],
    // },
  ];
  const [offices, setOffice] = useState([]);
  const [searchValues, setSearchValues] = useState({ officeId: "" });
  const [homeRoutes, setHomeRoutes] = useState([]);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
  });
  const [paginationData, setPaginationData] = useState();
  const [loading, setLoading] = useState(false);

  const handlePageChange = (page) => {
    let updatedPagination = { ...pagination };
    updatedPagination.page = page;
    setPagination(updatedPagination);
  };

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    let newSearchValues = { ...searchValues };
    newSearchValues[name] = value;
    setSearchValues(newSearchValues);
  };

  const fetchAllOffices = async () => {
    try {
      const response = await OfficeService.getAllOffices();
      const { data } = response || {};
      const { clientOfficeDTO } = data || {};
      setOffice(clientOfficeDTO);
    } catch (e) {}
  };

  const uploadHandler = async (e) => {
    const { target } = e;
    const { files } = target;
    try {
      const formData = new FormData();
      formData.append(
        "model",
        '{"importJobDTO": {"importType": "IMPORT_TYPE_HOME_ROUTE","entityName": "HOME ROUTE"}}'
      );
      formData.append("file", files[0]);
      const response = await OfficeService.uploadForm(formData);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const resetFilter = () =>{
    setSearchValues({
      officeId : ""
    })
    fetchAllHomeRoutes(true);
  }

  const fetchAllHomeRoutes = async (search=false) => {
    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      const params = new URLSearchParams(pagination);
      console.log(searchValues);
      let allSearchValues = {...searchValues};
      Object.keys(allSearchValues).map((objKey)=>{
        if (allSearchValues[objKey] === null || allSearchValues[objKey] === "") {
          delete allSearchValues[objKey];
        }
      })
      const response = searchValues.officeId !== "" && !search ? await RoutingService.getAllHomeRoutes(params.toString(),searchValues.officeId) : await RoutingService.getAllHomeRoutes(params.toString());
      console.log(response);
      const { data } = response || {};
      const homeRouteDTO = response.data.data;
      setHomeRoutes(homeRouteDTO);
      let localPaginationData = { ...data };
      delete localPaginationData?.data;
      setPaginationData(localPaginationData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOffices();
  }, []);

  useEffect(() => {
    fetchAllHomeRoutes();
  }, [pagination]);

  return (
    <div className="internalSettingContainer">
      <div className="gridContainer">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="filterContainer">
            <div style={{ minWidth: "180px" }} className="form-control-input">
              <FormControl fullWidth>
                <InputLabel id="primary-office-label">Office Id</InputLabel>
                <Select
                  style={{ width: "180px" }}
                  labelId="primary-office-label"
                  id="officeId"
                  value={searchValues.officeId}
                  name="officeId"
                  label="Office ID"
                  onChange={handleFilterChange}
                >
                  {!!offices?.length &&
                    offices.map((office, idx) => (
                      <MenuItem key={idx} value={office.officeId}>
                        {getFormattedLabel(office.officeId)}, {office.address}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
            <div className="form-control-input" style={{ minWidth: "70px" }}>
              <button
                type="submit"
                onClick={() => fetchAllHomeRoutes()}
                className="btn btn-primary filterApplyBtn"
              >
                Apply
              </button>
            </div>
            <div className="form-control-input" style={{ minWidth: "70px" }}>
              <button
                type="submit"
                onClick={() => resetFilter()}
                className="btn btn-primary filterApplyBtn"
              >
                Reset
              </button>
            </div>
          </div>
          <div
            className="form-control-input"
            style={{ display: "flex", justifyContent: "end" }}
          >
            <div className="fileUpload">
              <input type="file" onChange={uploadHandler} className="upload file-input" />
              <span>Upload File</span>
            </div>
          </div>
        </div>
        <Grid
          headers={headers}
          pageNoText="pageNumber"
          pagination={paginationData}
          listing={homeRoutes}
          handlePageChange={handlePageChange}
          //enableDisableRow={true}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default HomeRoute;
