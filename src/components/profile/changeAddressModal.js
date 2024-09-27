import {
  Autocomplete,
  Box,
  FormControl,
  Modal,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toggleToast } from "@/redux/company.slice";
import GeocodeModal from "./geocodeModal";
import RoutingService from "@/services/route.service";
import OfficeService from "@/services/office.service";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  height: 550,
  borderRadius: 5,
};

const AddressChangeModal = (props) => {
  const { onClose, userDetails } = props;
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    address: "",
    geoCode: "",
    landmark: "",
    nodal: "",
    areaName: "",
    zoneName: "",
  });
  const [error, setError] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openSearchZone, setOpenSearchZone] = useState(false);
  const [openSearchArea, setOpenSearchArea] = useState(false);
  const [openSearchNodalPoint, setOpenSearchNodalPoint] = useState(false);
  const [searchedZone, setSearchedZone] = useState([]);
  const [searchedArea, setSearchedArea] = useState([]);
  const [searchedNodalPoints, setSearchedNodalPoints] = useState([]);

  const handleModalOpen = () => setOpenModal(true);

  const handleModalClose = () => {
    console.log("Geocode modal closed");
    setOpenModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleGeocode = (geocode) => {
    console.log("Here in parent geocode: " + geocode);
    let geocodeSeparate = geocode.split(",");
    geocodeSeparate[0] = parseFloat(geocodeSeparate[0]).toFixed(5);
    geocodeSeparate[1] = parseFloat(geocodeSeparate[1]).toFixed(5);
    setValues((prevValues) => ({
      ...prevValues,
      geoCode: `${geocodeSeparate[0]}, ${geocodeSeparate[1]}`,
    }));
  };

  const searchForZone = async (e) => {
    try {
      if (e.target.value) {
        const response = await RoutingService.autoSuggestZone(e.target.value);
        const { data } = response || {};
        setSearchedZone(data);
      } else {
        setSearchedZone([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const searchForArea = async (e) => {
    try {
      if (e.target.value) {
        const response = await RoutingService.autoSuggestArea(
          e.target.value,
          values.zoneName
        );
        const { data } = response || {};
        setSearchedArea(data);
      } else {
        setSearchedArea([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const searchForNodalPoint = async (event) => {
    const { target } = event;
    const { value } = target;
    try {
      const response = await RoutingService.autoSuggestNodalPoints(
        value,
        values.areaName
      );
      console.log(response);
      const { data } = response || {};
      setSearchedNodalPoints(data);
    } catch (err) {
      console.log(err);
    }
  };

  const RaiseChangeAddressRequest = async () => {
    console.log("User details>>>", userDetails);
    try {
      const payload = {
        empId: userDetails.id,
        empName: userDetails.name,
        empEmail: userDetails.email,
        requestType: "address",
        address: values.address,
        geoCode: values.geoCode,
        mob: userDetails.mob,
        zoneName: values.zoneName,
        areaName: values.areaName,
        nodal: values.nodal,
        landMark: values.landmark,
        status: "RAISED",
        officeId: userDetails.primaryOfficeId,
      };
      const response = await OfficeService.raiseRequest(payload);
      console.log("Updated status response data", response.data);
      if (response.status === 200) {
        dispatch(
          toggleToast({
            message: response.data,
            type: "success",
          })
        );
      }
      if (response.status === 500) {
        dispatch(
          toggleToast({
            message: "Failed! Try again later.",
            type: "error",
          })
        );
      }
    } catch (err) {
      console.log("Error updating feedback status", err);
    }
  };

  const onSubmitHandler = () => {
    let hasError = false;
    const newError = {};

    Object.entries(values).forEach(([key, value]) => {
      if (!value) {
        newError[key] = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is mandatory.`;
        hasError = true;
      }
    });

    setError(newError);

    if (!hasError) {
      console.log("Form submitted successfully.");
      console.log("form values: ", values);
      RaiseChangeAddressRequest();
      onClose();
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#FFF",
        borderRadius: 10,
        fontFamily: "DM Sans",
        padding: "30px 40px",
        // backgroundColor: "yellow",
      }}
    >
      <h3 style={{ marginBottom: "10px" }}>Address Change Request Form</h3>
      <div>
        <div
          style={{ marginLeft: 0, marginRight: 35, minWidth: "180px" }}
          className="form-control-input"
        >
          <TextField
            style={{ width: "250px" }}
            value={values.address}
            onChange={handleChange}
            error={!!error.address}
            helperText={error.address}
            name="address"
            label="Address*"
            variant="outlined"
            fullWidth
          />
        </div>
        <div
          style={{ marginLeft: 0, marginRight: 35, minWidth: "180px" }}
          className="form-control-input"
        >
          <TextField
            style={{ width: "250px" }}
            value={values.landmark}
            onChange={handleChange}
            error={!!error.landmark}
            helperText={error.landmark}
            name="landmark"
            label="Landmark*"
            variant="outlined"
            fullWidth
          />
        </div>
        <div
          style={{ marginLeft: 0, marginRight: 35, minWidth: "180px" }}
          className="form-control-input"
        >
          <TextField
            style={{ width: "250px" }}
            value={values.geoCode}
            onClick={handleModalOpen}
            onChange={(e) => setValues({ geoCode: e.target.value })}
            error={!!error.geoCode}
            helperText={error.geoCode}
            name="geoCode"
            label="Geocode*"
            variant="outlined"
            fullWidth
          />
          <Modal
            open={openModal}
            onClose={handleModalClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <GeocodeModal
                geocode={handleGeocode}
                onClose={handleModalClose}
              />
            </Box>
          </Modal>
        </div>
        <div
          style={{ marginLeft: 0, marginRight: 35, minWidth: "180px" }}
          className="form-control-input"
        >
          <FormControl variant="outlined">
            <Autocomplete
              disablePortal
              id="search-zone"
              sx={{ width: "250px" }}
              options={searchedZone}
              autoComplete
              open={openSearchZone}
              onOpen={() => {
                setOpenSearchZone(true);
              }}
              onClose={() => {
                setOpenSearchZone(false);
              }}
              onChange={(event, newValue) => {
                setValues((prevValues) => ({
                  ...prevValues,
                  zoneName: newValue ? newValue.zoneName : "",
                }));
              }}
              getOptionLabel={(zone) => zone.zoneName}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Zone*"
                  onChange={searchForZone}
                  error={!!error.zoneName}
                  helperText={error.zoneName}
                />
              )}
            />
          </FormControl>
        </div>
        <div
          style={{ marginLeft: 0, marginRight: 35, minWidth: "180px" }}
          className="form-control-input"
        >
          <FormControl variant="outlined">
            <Autocomplete
              disablePortal
              id="search-area"
              sx={{ width: "250px" }}
              options={searchedArea}
              autoComplete
              open={openSearchArea}
              onOpen={() => {
                setOpenSearchArea(true);
              }}
              onClose={() => {
                setOpenSearchArea(false);
              }}
              onChange={(event, newValue) => {
                setValues((prevValues) => ({
                  ...prevValues,
                  areaName: newValue ? newValue.areaName : "",
                }));
              }}
              getOptionLabel={(area) => area.areaName}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Area*"
                  onChange={searchForArea}
                  error={!!error.areaName}
                  helperText={error.areaName}
                />
              )}
            />
          </FormControl>
        </div>
        <div
          style={{ marginLeft: 0, marginRight: 35, minWidth: "180px" }}
          className="form-control-input"
        >
          <FormControl variant="outlined" fullWidth>
            <Autocomplete
              disablePortal
              id="search-nodal-point"
              sx={{ width: "250px" }}
              options={searchedNodalPoints}
              autoComplete
              open={openSearchNodalPoint}
              onOpen={() => {
                setOpenSearchNodalPoint(true);
              }}
              onClose={() => {
                setOpenSearchNodalPoint(false);
              }}
              onChange={(event, newValue) => {
                setValues((prevValues) => ({
                  ...prevValues,
                  nodal: newValue ? newValue.nodalName : "",
                }));
              }}
              getOptionLabel={(mp) => mp.nodalName}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nodal Point*"
                  onChange={searchForNodalPoint}
                  error={!!error.nodal}
                  helperText={error.nodal}
                />
              )}
            />
          </FormControl>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          type="button"
          style={{
            backgroundColor: "#f6ce47",
            color: "black",
            width: "160px",
            border: "none",
            borderRadius: "6px",
            fontSize: "15px",
            padding: "15px 35px",
            cursor: "pointer",
            marginTop: "15px",
            marginBottom: "5px",
          }}
          onClick={onSubmitHandler}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default AddressChangeModal;
