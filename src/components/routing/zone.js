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
import { validationSchema } from "./zone/validationSchema";
import { toggleToast } from "@/redux/company.slice";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import LoaderComponent from "../loader";

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

const Zone = ({ roleType, onSuccess }) => {
  const headers = [
    {
      key: "officeId",
      display: "Office ID",
    },
    {
      key: "id",
      display: "Zone Id",
    },
    {
      key: "name",
      display: "Zone Name",
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
          display: "Disable",
          key: "deactivate",
        },
        {
          display: "Enable",
          key: "activate",
        },
      ],
    },
  ];

  const [offices, setOffice] = useState([]);
  const [searchValues, setSearchValues] = useState({ officeId: "" });
  const [zones, setZones] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: "",
    officeId: "",
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
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        const response = await RoutingService.createZone({ zoneDTO: values });
        if (response.status === 201) {
          dispatch(
            toggleToast({
              message: "Zone created successfully!",
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
        fetchAllZones();
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

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    let newSearchValues = { ...searchValues };
    newSearchValues[name] = value;
    setSearchValues(newSearchValues);
  };

  const onMenuItemClick = (key, clickedItem) => {
    if (key === "deactivate") {
      enableDisableZone(clickedItem.id, false);
    } else if (key === "activate") {
      enableDisableZone(clickedItem.id, true);
    }
  };

  const enableDisableZone = async (id, flag) => {
    try {
      const response = await RoutingService.enableDisableZone(id, flag);
      if (response.status === 200) {
        fetchAllZones();
      }
    } catch (err) {
      dispatch(
        toggleToast({
          message: "Some error occured, please try again later!",
          type: "error",
        })
      );
      console.log(err);
    }
  };

  const fetchAllOffices = async () => {
    try {
      const response = await OfficeService.getAllOffices();
      const { data } = response || {};
      const { clientOfficeDTO } = data || {};
      setOffice(clientOfficeDTO);
    } catch (e) { }
  };


  const [paginationData, setPaginationData] = useState();
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
  })
  const handlePageChange = (page) => {
    console.log(page);
    let updatedPagination = { ...pagination };
    updatedPagination.page = page;
    setPagination(updatedPagination);
  };

  const fetchAllZones = async (search=false) => {
    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      console.log(search);
      let params = new URLSearchParams(pagination);
      const response = search ? await RoutingService.getAllZones(params,searchValues.officeId) : await RoutingService.getAllZones(params);
      const { data } = response;
      const clientZoneDTO = data.data;
      setZones(clientZoneDTO);

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
    fetchAllZones();
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
                onClick={() => fetchAllZones(true)}
                className="btn btn-primary filterApplyBtn"
              >
                Apply
              </button>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <div className="form-control-input">
              <button className="btn btn-primary" onClick={handleModalOpen}>
                Create Zone
              </button>
            </div>
          </div>
        </div>
        <Grid
          headers={headers}
          listing={zones}
          onMenuItemClick={onMenuItemClick}
          enableDisableRow={true}
          pageNoText="pageNumber"
          handlePageChange={handlePageChange}
          pagination={paginationData}
          isLoading={loading}
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
                <h4>Add Zone</h4>
              </div>
              <div style={{ padding: 20, width: "50%" }}>
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
                          {getFormattedLabel(office.officeId)}, {office.address}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </div>
              <div style={{ padding: "0 20px", width: "50%" }}>
                <FormControl fullWidth>
                  <TextField
                    error={touched.name && Boolean(errors.name)}
                    onChange={handleChange}
                    helperText={touched.name && errors.name}
                    required
                    id="name"
                    name="name"
                    label="Name"
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
            {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "fixed",
                // backgroundColor: "#000000",
                zIndex: 1,
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                opacity: 1,
                color: "#000000",
                // height: "100vh",
                // width: "100vw",
              }}
            >
              <LoaderComponent />
            </div>
            ) : (
              " "
            )}
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default Zone;
