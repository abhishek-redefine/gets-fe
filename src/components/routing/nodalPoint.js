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
import { toggleToast } from "@/redux/company.slice";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import MasterDataService from "@/services/masterdata.service";
import { validationSchema } from "./nodalPoint/validationSchema.js";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs from "dayjs";
import GeocodeModal from "../user-management/geocodeModal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  height: 420,
  borderRadius: 5,
};

const geoCodeModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  height: 550,
  borderRadius: 5,
};

const NodalPoint = () => {
  const headers = [
    {
      key: "officeId",
      display: "Office ID",
    },
    {
      key: "zoneName",
      display: "Zone",
    },
    {
      key: "areaName",
      display: "Area Name",
    },
    {
      key: "areaDistance",
      display: "Area Distance",
    },
    {
      key: "name",
      display: "Nodal Point Name",
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
  const [zones, setZones] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [shiftTypes, setShiftTypes] = useState([]);
  const [nodalPoints, setNodalPoints] = useState([]);
  const [reportingTime, setReportingTime] = useState("00:00");
  const [searchValues, setSearchValues] = useState({
    officeId: "",
    areaName: "",
  });
  const [initialValues, setInitialValues] = useState({
    name: "",
    officeId: "",
    enabled: true,
    areaName: "",
    shiftType: "",
    geoCode: "",
    reportingTime: "00:00",
  });
  const [openModal, setOpenModal] = useState(false);
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => {
    handleReset();
    setOpenModal(false);
  };
  const dispatch = useDispatch();
  const [paginationData, setPaginationData] = useState();
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
  });

  const [openGeocodeModal, setOpenGeocodeModal] = useState(false);
  const handleGeocodeModalOpen = () => setOpenGeocodeModal(true);
  const handleGeocodeModalClose = () => {
    setOpenGeocodeModal(false);
  };

  const [coordinates, setCoordinates] = useState({ geoCode: "" });

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

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      values.reportingTime = reportingTime;
      console.log("clicked", values);
      try {
        const response = await RoutingService.createNodalPoint({
          nodalDTO: values,
        });
        console.log(response);
        if (response.status === 201) {
          dispatch(
            toggleToast({
              message: "Nodal Point created successfully!",
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
        fetchAllNodalPoints();
        handleModalClose();
      } catch (err) {
        console.log(err);
      }
    },
  });

  const { errors, touched, values, handleChange, handleSubmit, handleReset } =
    formik;

  const fetchAllOffices = async () => {
    try {
      const response = await OfficeService.getAllOffices();
      const { data } = response || {};
      const { clientOfficeDTO } = data || {};
      setOffice(clientOfficeDTO);
    } catch (e) { }
  };
  // const fetchAllZones = async () => {
  //   try {
  //     const page = {
  //       page: 0,
  //       size: 100
  //     }
  //     let params = new URLSearchParams(page)
  //     const response = await RoutingService.getAllZones(params);
  //     const { data } = response;
  //     const clientZoneDTO = data.data;
  //     console.log(clientZoneDTO);
  //     setZones(clientZoneDTO);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };
  const fetchAllAreas = async () => {
    try {
      const page = {
        page: 0,
        size: 100
      }
      let params = new URLSearchParams(page)
      const response = await RoutingService.getAllArea(params);
      console.log(response.data);
      const areaDTO = response.data.data;
      setAreaList(areaDTO);
    } catch (err) {
      console.log(err);
    }
  };

  const resetFilter = () => {
    setSearchValues({
      officeId: "",
      areaName: "",
    })
    fetchAllNodalPoints(true);
  }

  const fetchAllNodalPoints = async (search = false) => {
    try {
      let params = new URLSearchParams(pagination);
      let allSearchValues = { ...searchValues };
      Object.keys(allSearchValues).forEach((objKey) => {
        if (
          allSearchValues[objKey] === null ||
          allSearchValues[objKey] === ""
        ) {
          delete allSearchValues[objKey];
        }
      });
      const response = search ? await RoutingService.getAllNodalPoints(
        params,
        {}
      ) 
      :
      await RoutingService.getAllNodalPoints(
        params,
        allSearchValues
      );
      const { data } = response;
      console.log(data);
      setNodalPoints(data.data);
      let localPaginationData = { ...data };
      delete localPaginationData?.data;
      setPaginationData(localPaginationData);
    } catch (err) {
      console.log(err);
    }
  };

  const onMenuItemClick = (key, clickedItem) => {
    if (key === "deactivate") {
      console.log("disable");
      enableDisableNodalPoint(clickedItem.id, false);
    } else if (key === "activate") {
      enableDisableNodalPoint(clickedItem.id, true);
    }
  };

  const enableDisableNodalPoint = async (id, flag) => {
    try {
      const response = await RoutingService.enableDisableNodalPoint(id, flag);
      console.log(response);
      fetchAllNodalPoints();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchMasterData = async () => {
    try {
      const shiftResponse = await MasterDataService.getMasterData("ShiftType");
      const { data } = shiftResponse || {};
      setShiftTypes(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleGeocode = (geocode) => {
    console.log("Here in parent geocode: " + geocode);
    formik.setFieldValue("geoCode", geocode);
    setCoordinates((prevValues) => ({
      ...prevValues,
      geoCode: geocode,
    }));
  };

  useEffect(() => {
    fetchAllOffices();
    // fetchAllZones();
    fetchAllAreas();
    fetchAllNodalPoints();
    fetchMasterData();
    //fetch zone and area too
  }, []);

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
            {/* <div style={{ minWidth: "180px" }} className="form-control-input">
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
                        overflowY: 'auto',
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
            </div> */}
            <div style={{ minWidth: "180px" }} className="form-control-input">
              <FormControl fullWidth>
                <InputLabel id="area-label">Area</InputLabel>
                <Select
                  style={{ width: "180px" }}
                  labelId="area-label"
                  id="areaName"
                  value={searchValues.areaName}
                  name="areaName"
                  label="areaName"
                  onChange={handleFilterChange}
                  MenuProps={{
                    MenuListProps: {
                      sx: {
                        maxHeight: 200,
                        overflowY: 'auto',
                      },
                    },
                  }}
                >
                  {!!areaList?.length &&
                    areaList.map((area, idx) => (
                      <MenuItem key={idx} value={area.name}>
                        {area.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
            <div className="form-control-input" style={{ minWidth: "70px" }}>
              <button
                type="submit"
                onClick={() => fetchAllNodalPoints()}
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
        </div>
        <div style={{ display: "flex", justifyContent: "end" }}>
          <div className="form-control-input">
            <button className="btn btn-primary">Upload File</button>
          </div>
          <div className="form-control-input">
            <button onClick={handleModalOpen} className="btn btn-primary">
              Add Nodal Point
            </button>
          </div>
        </div>
        <Grid
          headers={headers}
          listing={nodalPoints}
          onMenuItemClick={onMenuItemClick}
          handlePageChange={handlePageChange}
          enableDisableRow={true}
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
                <h4>Add Nodal Point</h4>
              </div>
              <div style={{ display: "flex" }}>
                <div style={{ padding: "10px 20px", width: "50%" }}>
                  <FormControl fullWidth>
                    <InputLabel id="primary-office-label">Office Id</InputLabel>
                    <Select
                      required
                      labelId="primary-office-label"
                      id="officeId"
                      value={values.officeId}
                      error={touched.officeId && Boolean(errors.officeId)}
                      name="officeId"
                      label="Office ID"
                      onChange={handleChange}
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
                    <InputLabel id="area-label">Area</InputLabel>
                    <Select
                      labelId="area-label"
                      id="area"
                      value={values.areaName}
                      error={touched.areaName && Boolean(errors.areaName)}
                      name="areaName"
                      label="areaName"
                      onChange={handleChange}
                      MenuProps={{
                        MenuListProps: {
                          sx: {
                            maxHeight: 200,
                            overflowY: 'auto',
                          },
                        },
                      }}
                    >
                      {!!areaList?.length &&
                        areaList.map((area, idx) => (
                          <MenuItem key={idx} value={area.name}>
                            {area.name}
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
                    <TextField
                      error={touched.name && Boolean(errors.name)}
                      onChange={handleChange}
                      required
                      id="name"
                      name="name"
                      label="Nodal Point Name"
                      variant="outlined"
                      value={values.name}
                    />
                  </FormControl>
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div style={{ padding: "10px 20px", width: "50%" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimeField
                      fullWidth
                      label="Reporting Time"
                      value={dayjs()
                        .hour(Number(initialValues.reportingTime.slice(0, 2)))
                        .minute(
                          Number(initialValues.reportingTime.slice(3, 5))
                        )}
                      format="HH:mm"
                      onChange={(e) => {
                        var ReportingTime = e.$d
                          .toLocaleTimeString("it-IT")
                          .slice(0, -3);
                        setInitialValues({
                          ...initialValues,
                          reportingTime: ReportingTime,
                        });
                        setReportingTime(ReportingTime);
                      }}
                    />
                  </LocalizationProvider>
                </div>
                <div style={{ padding: "10px 20px", width: "50%" }}>
                  <FormControl fullWidth>
                    <TextField
                      error={touched.geoCode && Boolean(errors.geoCode)}
                      // onChange={handleChange}
                      onChange={(e) => {
                        console.log("Clicked");
                        formik.setFieldValue("geoCode", e.target.value);
                      }}
                      required
                      id="geoCode"
                      name="geoCode"
                      label="Geo Location"
                      variant="outlined"
                      // value={values.geoCode}
                      value={values.geoCode}
                      onClick={handleGeocodeModalOpen}
                    />
                    <Modal
                      open={openGeocodeModal}
                      onClose={handleGeocodeModalClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={geoCodeModalStyle}>
                        <GeocodeModal
                          geocode={handleGeocode}
                          onClose={handleGeocodeModalClose}
                        />
                      </Box>
                    </Modal>
                  </FormControl>
                </div>
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
  );
};

export default NodalPoint;
