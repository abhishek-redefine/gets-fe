import React, { useEffect, useState } from "react";
import Grid from "../grid";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import OfficeService from "@/services/office.service";
import { getFormattedLabel } from "@/utils/utils";
import RoutingService from "@/services/route.service";
import { validationSchema } from "./area/validationSchema";
import { toggleToast } from "@/redux/company.slice";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import MasterDataService from "@/services/masterdata.service";
import { param } from "jquery";
import LoaderComponent from "../common/loading";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  height: 400,
  borderRadius: 5,
};

const Area = ({ roleType, onSuccess }) => {
  const headers = [
    {
      key: "officeId",
      display: "Office ID",
    },
    {
      key: "id",
      display: "Area Id",
    },
    {
      key: "name",
      display: "Area Name",
    },
    {
      key: "distance",
      display: "Distance",
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
          display: "Enable",
          key: "activate",
        },
        {
          display: "Disable",
          key: "deactivate",
        },
      ],
    },
  ];
  const [offices, setOffice] = useState([]);
  const [searchValues, setSearchValues] = useState({
    officeId: "",
    zoneName: "",
  });
  const [shiftTypes, setShiftTypes] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [zones, setZones] = useState([]);
  const [zoneList, setZoneList] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: "",
    officeId: "",
    zoneName: "",
    shiftType: "",
    serviceType: "",
    enabled: true,
  });
  const [openModal, setOpenModal] = useState(false);
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => {
    handleReset();
    setOpenModal(false);
  };
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("clicked", values);
      try {
        setLoading(true);
        const response = await RoutingService.createArea({ areaDTO: values });
        console.log(response);
        if (response.status === 201) {
          dispatch(
            toggleToast({
              message: "Area Name created successfully!",
              type: "success",
            })
          );
        } else {
          dispatch(
            toggleToast({
              message: "Some error occured, please try again later!",
              type: "error",
            })
          );
        }
        handleReset();
        fetchAllArea();
        handleModalClose();
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
  });
  const { errors, touched, values, handleChange, handleSubmit, handleReset } =
    formik;

  const onMenuItemClick = (key, clickedItem) => {
    if (key === "deactivate") {
      enableDisableArea(clickedItem.id, false);
    } else if (key === "activate") {
      enableDisableArea(clickedItem.id, true);
    }
  };

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    let newSearchValues = { ...searchValues };
    newSearchValues[name] = value;
    setSearchValues(newSearchValues);
  };

  const officeIdChangeHandler = (e) => {
    handleReset();
    console.log(e);
    const { target } = e;
    const { value, name } = target;
    console.log(value, name);
    getZonesByOfficeId(value);
    handleChange(e);
  };

  const getZonesByOfficeId = async (officeId) => {
    try {
      setLoading(true);
      const response = await RoutingService.getZonesByOfficeId(officeId);
      const zoneDTO = response.data.data;
      console.log(zoneDTO);
      setZoneList(zoneDTO);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllOffices = async () => {
    try {
      setLoading(true);
      const response = await OfficeService.getAllOffices();
      const { data } = response || {};
      const { clientOfficeDTO } = data || {};
      setOffice(clientOfficeDTO);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };
  const fetchAllZones = async () => {
    try {
      setLoading(true);
      const page = {
        page: 0,
        size: 100,
      };
      let params = new URLSearchParams(page);
      const response = await RoutingService.getAllZones(params);
      const { data } = response;
      const clientZoneDTO = data.data;
      console.log(clientZoneDTO);
      setZones(clientZoneDTO);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMasterData = async () => {
    try {
      setLoading(true);
      const shiftResponse = await MasterDataService.getMasterData("ShiftType");
      const serviceResponse = await MasterDataService.getMasterData(
        "ServiceType"
      );
      const { data } = shiftResponse || {};
      setShiftTypes(data);
      setServiceTypes(serviceResponse.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const [paginationData, setPaginationData] = useState();
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
  });
  const handlePageChange = (page) => {
    console.log(page);
    let updatedPagination = { ...pagination };
    updatedPagination.pageNo = page;
    setPagination(updatedPagination);
  };

  const fetchAllArea = async (search = false) => {
    try {
      setLoading(true);
      let params = new URLSearchParams(pagination);
      let allSearchValues = { ...searchValues };
      Object.keys(allSearchValues).map((objKey) => {
        if (
          allSearchValues[objKey] === null ||
          allSearchValues[objKey] === ""
        ) {
          delete allSearchValues[objKey];
        }
      });
      const response = search
        ? await RoutingService.getAllArea(params, allSearchValues)
        : await RoutingService.getAllArea(params);
      console.log(response.data);
      const areaDTO = response.data.data;
      setAreaList(areaDTO);

      const data = response;
      let localPaginationData = { ...data };
      delete localPaginationData?.data;
      setPaginationData(localPaginationData);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const resetFilter = () => {
    setSearchValues({
      officeId: "",
      zoneName: "",
    });
    fetchAllArea();
  };

  const enableDisableArea = async (id, flag) => {
    try {
      setLoading(true);
      const response = await RoutingService.enableDisableArea(id, flag);
      console.log(response);
      fetchAllArea();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOffices();
    fetchMasterData();
    fetchAllZones();
    fetchAllArea();
  }, [pagination]);

  return (
    <div>
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
              <div style={{ minWidth: "180px" }} className="form-control-input">
                <FormControl fullWidth>
                  <InputLabel id="zoneName-label">Zone</InputLabel>
                  <Select
                    required
                    labelId="zoneName-label"
                    id="zoneName"
                    value={searchValues.zoneName}
                    name="zoneName"
                    label="Zone Name"
                    onChange={handleFilterChange}
                    MenuProps={{
                      MenuListProps: {
                        sx: {
                          maxHeight: 200,
                          overflowY: "auto",
                        },
                      },
                    }}
                  >
                    {!!zones?.length &&
                      zones.map((zone, idx) => (
                        <MenuItem key={idx} value={zone.name}>
                          {zone.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
              <div className="form-control-input" style={{ minWidth: "70px" }}>
                <button
                  type="submit"
                  onClick={() => fetchAllArea(true)}
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
            <div style={{ display: "flex", justifyContent: "end" }}>
              <div className="form-control-input">
                <button className="btn btn-primary" onClick={handleModalOpen}>
                  Add Area Name
                </button>
              </div>
            </div>
          </div>
          <Grid
            headers={headers}
            listing={areaList}
            onMenuItemClick={onMenuItemClick}
            enableDisableRow={true}
            pageNoText="pageNumber"
            handlePageChange={handlePageChange}
            pagination={paginationData}
          />
          <Modal
            open={openModal}
            onClose={handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <div style={{ padding: "20px" }}>
                <div style={{ margin: "20px 20px 0 20px" }}>
                  <h4>Add Area Name</h4>
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ padding: "10px 20px", width: "50%" }}>
                    <FormControl fullWidth>
                      <InputLabel id="primary-office-label">
                        Office Id
                      </InputLabel>
                      <Select
                        required
                        labelId="primary-office-label"
                        id="officeId"
                        value={values.officeId}
                        error={touched.officeId && Boolean(errors.officeId)}
                        name="officeId"
                        label="Office ID"
                        onChange={(e) => officeIdChangeHandler(e)}
                      >
                        {!!offices?.length &&
                          offices.map((office, idx) => (
                            <MenuItem key={idx} value={office.officeId}>
                              {getFormattedLabel(office.officeId)},{" "}
                              {office.address}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div style={{ padding: "10px 20px", width: "50%" }}>
                    <FormControl fullWidth>
                      <InputLabel id="zoneName-label">Zone</InputLabel>
                      <Select
                        required
                        labelId="zoneName-label"
                        id="zoneName"
                        disabled={values?.officeId ? false : true}
                        value={values.zoneName}
                        error={touched.zoneName && Boolean(errors.zoneName)}
                        name="zoneName"
                        label="Zone Name"
                        onChange={handleChange}
                        MenuProps={{
                          MenuListProps: {
                            sx: {
                              maxHeight: 200,
                              overflowY: "auto",
                            },
                          },
                        }}
                      >
                        {!!zoneList?.length &&
                          zoneList.map((zone, idx) => (
                            <MenuItem key={idx} value={zone.name}>
                              {zone.name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <div style={{ padding: "10px 20px", width: "50%" }}>
                    <FormControl fullWidth>
                      <InputLabel id="shift-type-label">Shift Type</InputLabel>
                      <Select
                        required
                        labelId="shift-type-label"
                        id="shiftType"
                        value={values.shiftType}
                        error={touched.shiftType && Boolean(errors.shiftType)}
                        name="shiftType"
                        label="Shift Type"
                        onChange={handleChange}
                      >
                        {!!shiftTypes?.length &&
                          shiftTypes.map((shift, idx) => (
                            <MenuItem key={idx} value={shift.value}>
                              {shift.displayName}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div style={{ padding: "10px 20px", width: "50%" }}>
                    <FormControl fullWidth>
                      <InputLabel id="service-type-label">
                        Service Type
                      </InputLabel>
                      <Select
                        required
                        labelId="service-type-label"
                        id="serviceType"
                        value={values.serviceType}
                        error={
                          touched.serviceType && Boolean(errors.serviceType)
                        }
                        name="serviceType"
                        label="Service Type"
                        onChange={handleChange}
                      >
                        {!!serviceTypes?.length &&
                          serviceTypes.map((service, idx) => (
                            <MenuItem key={idx} value={service.value}>
                              {service.displayName}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </div>
                </div>
                <div style={{ padding: "10px 20px", width: "50%" }}>
                  <FormControl fullWidth>
                    <TextField
                      error={touched.name && Boolean(errors.name)}
                      onChange={handleChange}
                      required
                      id="name"
                      name="name"
                      label="Area Name"
                      variant="outlined"
                      value={values.name}
                    />
                  </FormControl>
                </div>
                <div
                  className="form-control-input"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <div className="form-control-input">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      onClick={handleSubmit}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
            </Box>
          </Modal>
        </div>
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

export default Area;
