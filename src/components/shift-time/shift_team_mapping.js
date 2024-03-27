import ShiftService from "@/services/shift.service";
import OfficeService from "@/services/office.service";
import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toggleToast } from "@/redux/company.slice";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";

const ShiftTeamMapping = ({ onUserSuccess, editEmployeeData }) => {
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState({
    shiftTime: [],
    teamId: 0,
    zoneId: 0,
    officeId: "",
    shiftType: "",
    transportType: "",
  });
  const [pagination, setPagination] = useState({
    page: 0,
    size: 100,        
});

  const formik = useFormik({
    initialValues: formValues,
    onSubmit: async (values) => {
      const allValues = { ...values };
      console.log(allValues);
      const payload = {
        shiftTeamZoneMapping: {
          teamId: allValues.teamId,
          zoneId: allValues.zoneId,
          officeId: allValues.officeId,
          shiftType: allValues.shiftType,
          transportType: allValues.transportType,
        },
        shiftId : allValues.shiftTime
      };
      try {
        const response = await ShiftService.shiftTeamZoneMapping(payload);
        console.log(response);
        dispatch(
          toggleToast({
            message: "Shift Mapped successfully!",
            type: "success",
          })
        );
        setFormValues({
          shiftTime: [],
          teamId: 0,
          zoneId: 0,
          officeId: "",
          shiftType: "",
          transportType: "",
        });
        initializer();
      } catch (err) {
        console.log("Error", err);
      }
    },
  });
  const { values, errors, touched, handleChange, handleSubmit } = formik;

  const [formValuesList, setFormValuesList] = useState({
    officeId: [],
    shiftType: [],
    transportTypes: [],
    shiftTime: [],
  });
  const [searchedTeam, setSearchedTeam] = useState([]);
  const [openSearchTeam, setOpenSearchTeam] = useState(false);
  const [listData, setListData] = useState([]);

  const handleFormSubmit = async () => {
    var data = formValues;
    data.shiftTime = {
      hour: Number(formValues.shiftTime.slice(0, 2)),
      minute: Number(formValues.shiftTime.slice(3, 5)),
      second: 0,
      nano: 0,
    };
    console.log(data);
    // const response = await ShiftService.shiftTeamZoneMapping({ "shiftTeamZoneMapping": data });
    // console.log('handleFormSubmit', response)
    // if success
    setOpenSearchTeam(false);
    dispatch(
      toggleToast({ message: "Shift Mapped successfully!", type: "success" })
    );
    setFormValues({
      shiftTime: [],
      teamId: 0,
      zoneId: 0,
      officeId: "",
      shiftType: "",
      transportType: "",
    });
    initializer();
  };

  const dropDownListValuesSetFunction = (data) => {
    var FormValuesList = {
      officeId: [],
      shiftType: [],
      transportTypes: [],
      shiftTime: [],
    };

    data.map((item) => {
      if (FormValuesList.officeId.indexOf(item.officeIds) === -1) {
        FormValuesList.officeId.push(item.officeIds);
      }
      if (FormValuesList.shiftType.indexOf(item.shiftType) === -1) {
        FormValuesList.shiftType.push(item.shiftType);
      }
      if (FormValuesList.transportTypes.indexOf(item.transportTypes) === -1) {
        FormValuesList.transportTypes.push(item.transportTypes);
      }
      if (FormValuesList.shiftTime.indexOf(item.shiftTime) === -1) {
        var object = {
          id: item.id,
          shiftTime: item.shiftTime,
        };
        FormValuesList.shiftTime.push(object);
      }
    });
    console.log("FormValuesList>>>>", FormValuesList);
    setFormValuesList(FormValuesList);
  };

  const searchForTeam = async (e) => {
    try {
      if (e.target.value) {
        const response = await OfficeService.searchTeam(e.target.value);
        const { data } = response || {};
        setSearchedTeam(data);
      } else {
        setSearchedTeam([]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onChangeHandler = (newValue, name, key) => {
    if (newValue) {
      values.teamId = newValue.teamId;
      setFormValues({ ...formValues, teamId: newValue.teamId });
    }
  };

  const initializer = async () => {
    const params = new URLSearchParams(pagination);
    const response = await ShiftService.getAllShiftsWOPagination(params);
    var data = response.data.data.filter((item) => item.enabled === true);
    console.log("response>>>>>", data);
    dropDownListValuesSetFunction(data);
    setListData(data);
  };

  const handleSelect = (e) => {
    console.log(e);
    console.log(values);
    var allValues = { ...values };
    var name = e.target.name;
    console.log("Name>>>>", name);
    handleChange(e);
    let data;
    if (name === "officeId") {
      data = listData.filter((item) => item.officeIds === e.target.value);
    } else if (name === "shiftType") {
      data = listData.filter((item) => item.shiftType === e.target.value);
      console.log("data shiftType>>>>", data);
    } else if (name === "transportType") {
      data = listData.filter((item) => item.transportTypes === e.target.value);
    }
    console.log("data>>>>", data);
    dropDownListValuesSetFunction(data);
    setListData(data);
    setFormValues({ ...formValues, name: e.target.value });
  };

  useEffect(() => {
    initializer();
  }, []);

  return (
    <div style={{ marginTop: "20px" }}>
      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "30%",
            padding: "20px",
            background: "white",
            fontWeight: "600",
          }}
        >
          Select Shift Timings For Mapping
        </div>
        <div
          style={{
            width: "30%",
            padding: "20px",
            background: "white",
            fontWeight: "600",
          }}
        >
          Select Teams and Zones For Mapping
        </div>
      </div>
      <div style={{ display: "flex" }}>
        <div
          className="addUpdateFormContainer"
          style={{ width: "30%", marginTop: "0px" }}
        >
          <div style={{ borderRight: "1px solid black" }}>
            <div className="form-control-input">
              {
                <FormControl required fullWidth>
                  <InputLabel id="office-label">Office ID</InputLabel>
                  <Select
                    labelId="office-label"
                    id="officeId"
                    name="officeId"
                    value={values.officeId}
                    label="Office"
                    onChange={(e) => {
                      handleSelect(e);
                      handleChange(e);
                    }}
                  >
                    {formValuesList.officeId.map((item, idx) => (
                      <MenuItem key={idx} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              }
            </div>
          </div>
          <div style={{ borderRight: "1px solid black" }}>
            <div className="form-control-input">
              <FormControl required fullWidth>
                <InputLabel id="shift-type-label">Shift Type</InputLabel>
                <Select
                  labelId="shift-type-label"
                  id="shiftType"
                  value={values.shiftType}
                  name="shiftType"
                  label="Shift Type"
                  disabled={values.officeId === ""}
                  onChange={(e) => {
                    handleSelect(e);
                  }}
                >
                  {!!formValuesList.shiftType?.length &&
                    formValuesList.shiftType.map((item, idx) => (
                      <MenuItem key={idx} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div style={{ borderRight: "1px solid black" }}>
            <div className="form-control-input">
              {
                <FormControl required fullWidth>
                  <InputLabel id="transport-type-label">
                    Transport Type
                  </InputLabel>
                  <Select
                    labelId="transport-type-label"
                    id="transportType"
                    name="transportType"
                    value={values.transportType}
                    label="Transport Type"
                    disabled={values.shiftType === ""}
                    onChange={(e) => {
                      handleSelect(e);
                    }}
                  >
                    {formValuesList.transportTypes.map((item, idx) => (
                      <MenuItem key={idx} value={item}>
                        {item}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              }
            </div>
          </div>
          <div style={{ borderRight: "1px solid black" }}>
            <div className="form-control-input">
              {
                <FormControl required fullWidth>
                  <InputLabel id="shift-time-label">Shift Time</InputLabel>
                  <Select
                    labelId="shift-time-label"
                    id="shiftTime"
                    name="shiftTime"
                    multiple
                    value={values.shiftTime}
                    label="Shift Time"
                    disabled={values.transportType === ""}
                    onChange={handleChange}
                  >
                    {formValuesList.shiftTime.map((item, idx) => (
                      <MenuItem key={idx} value={item.id}>
                        {item.shiftTime}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              }
            </div>
          </div>
        </div>
        <div
          className="addUpdateFormContainer"
          style={{ width: "30%", marginTop: "0px" }}
        >
          <div>
            <div className="form-control-input">
              <FormControl variant="outlined">
                <Autocomplete
                  disablePortal
                  id="search-team"
                  options={searchedTeam}
                  autoComplete
                  open={openSearchTeam}
                  onOpen={() => {
                    setOpenSearchTeam(true);
                  }}
                  onClose={() => {
                    setOpenSearchTeam(false);
                  }}
                  onChange={(e, val) => onChangeHandler(val, "team", "teamId")}
                  getOptionKey={(team) => team.teamId}
                  getOptionLabel={(team) => team.teamName}
                  freeSolo
                  name="team"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search Team"
                      onChange={searchForTeam}
                    />
                  )}
                />
              </FormControl>
            </div>
          </div>
          {/* <div>
                        <div className='form-control-input'>
                            <FormControl required fullWidth>
                                <InputLabel id="primary-office-label">Zone Name</InputLabel>
                                <Select
                                    labelId="primary-office-label"
                                    id="primaryOfficeId"
                                    value={values.primaryOfficeId}
                                    error={touched.primaryOfficeId && Boolean(errors.primaryOfficeId)}
                                    name="primaryOfficeId"
                                    label="Primary Office"
                                    onChange={handleChange}
                                >
                                    {!!offices?.length && offices.map((office, idx) => (
                                        <MenuItem key={idx} value={office.officeId}>{getFormattedLabel(office.officeId)}, {office.address}</MenuItem>
                                    ))}
                                </Select>
                                {touched.primaryOfficeId && errors.primaryOfficeId && <FormHelperText className='errorHelperText'>{errors.primaryOfficeId}</FormHelperText>}
                            </FormControl>
                        </div>
                    </div> */}
        </div>
      </div>
      <div className="addBtnContainer" style={{ justifyContent: "right" }}>
        <div>
          <button onClick={onUserSuccess} className="btn btn-secondary">
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-primary"
          >
            {editEmployeeData?.id ? "Create" : "Update"}{" "}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftTeamMapping;
