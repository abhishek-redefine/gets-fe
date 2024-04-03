const { useState, useEffect } = require("react");
import MasterDataService from "@/services/masterdata.service";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { toggleToast } from "@/redux/company.slice";
import { useDispatch } from "react-redux";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ComplianceService from "@/services/compliance.service";

const EhsEntryComponent = ({ listing, ehsStatusList, type }) => {
  const dispatch = useDispatch();
  const [initialValues, setInitialValues] = useState({
    ehsTitle: "",
    ehsMandatoryStatus: "",
    ehsFrequency: "",
    ehsDueDate: "",
    ehsStatus: "",
    remark: "",
    file: "",
  });
  const [ehsStatus, setEhsStatus] = useState(initialValues.ehsStatus);
  const [remark, setRemark] = useState(initialValues.remark);

  const UpdateEhs = (value, name) => {
    console.log(value);

    if (listing?.id) {
      let jsonData = { ...listing };
      switch (name) {
        case "DueDate":
          jsonData.ehsDueDate = dayjs(value).format("YYYY-MM-DD");
          break;
        case "ehsStatus":
          jsonData.ehsStatus = value;
          break;
        case "remark":
          jsonData.remarks = value;
          break;
        default:
          break;
      }

      console.log(jsonData);
      if (type === "driver") {
        var formData = new FormData();
        formData.append("model", JSON.stringify({ driverEhsDTO: jsonData }));
        updateEhsDriver(formData);
      } else {
        var formData = new FormData();
        formData.append("model", JSON.stringify({ vehicleEhsDTO: jsonData }));
        updateEhsVehicle(formData);
      }
    }
  };

  const updateEhsVehicle = async (data) => {
    try {
      const response = await ComplianceService.updateVehicleEhs(data);
      if (response.status === 200) {
        dispatch(
          toggleToast({
            message: "Driver EHS details updated successfully!",
            type: "success",
          })
        );
      } else {
        dispatch(
          toggleToast({
            message: "Driver EHS details not updated. Please try again later!",
            type: "success",
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  const uploadHandler = async (file) => {
    try {
      const jsonData = listing;
      var formData = new FormData();
      console.log(file);
      if (type === "driver") {
        formData.append("file", file);
        formData.append("model", JSON.stringify({ driverEhsDTO: jsonData }));
        updateEhsDriver(formData);
      } else {
        formData.append("file", file);
        formData.append("model", JSON.stringify({ vehicleEhsDTO: jsonData }));
        updateEhsVehicle(formData);
      }
    } catch (er) {
      console.log(er);
    }
  };

  const updateEhsDriver = async (formData) => {
    try {
      const response = await ComplianceService.updateDriverEhs(formData);
      if (response.status === 200) {
        dispatch(
          toggleToast({
            message: "Driver EHS details updated successfully!",
            type: "success",
          })
        );
      } else {
        dispatch(
          toggleToast({
            message: "Driver EHS details not updated. Please try again later!",
            type: "success",
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (listing?.id) {
      console.log("value in listing", listing);
      const editValues = { ...initialValues, ...listing };
      console.log(editValues);
      setInitialValues(editValues);
    }
    console.log(ehsStatusList);
  }, [listing]);

  return (
    <tr key={listing?.id}>
      <td style={{ width: 210 }}>
        <FormControl fullWidth>
          <InputLabel style={{ color: "black" }}>
            {initialValues.ehsTitle}
          </InputLabel>
        </FormControl>
      </td>
      <td style={{ width: 175 }}>
        <FormControl fullWidth>
          <InputLabel style={{ color: "black" }}>
            {initialValues.ehsMandatoryStatus.replace("_", " ")}
          </InputLabel>
        </FormControl>
      </td>
      <td>
        <FormControl fullWidth>
          <InputLabel style={{ color: "black" }}>
            {initialValues.ehsFrequency}
          </InputLabel>
        </FormControl>
      </td>
      <td>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            name="DueDate"
            format={"DD-MM-YYYY"}
            minDate={dayjs()}
            onChange={(e) => {
              var date = dayjs(e).format("YYYY-MM-DD");
              //console.log(date);
              UpdateEhs(date, "DueDate");
            }}
          />
        </LocalizationProvider>
        <InputLabel>{initialValues.checkedDueDate}</InputLabel>
      </td>
      <td>
        <div className="form-control">
          <FormControl required fullWidth>
            <InputLabel id="ehsStatus-label">Ehs Status</InputLabel>
            <Select
              labelId="ehsStatus-label"
              id="ehsStatus"
              name="ehsStatus"
              value={initialValues.ehsStatus}
              label="ehsStatus"
              onChange={(e) => {
                var allValue = { ...initialValues };
                allValue.ehsStatus = e.target.value;
                setInitialValues(allValue);
                setEhsStatus(e.target.value);
                UpdateEhs(e.target.value, "ehsStatus");
              }}
            >
              {ehsStatusList &&
                ehsStatusList.map((g, idx) => (
                  <MenuItem key={idx} value={g.value}>
                    {g.value}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
      </td>
      <td>
        <div>
          <TextField
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            required
            id="remark"
            name="remark"
            label="remark"
            variant="outlined"
            onBlur={() => UpdateEhs(remark, "remark")}
          />
        </div>
        <InputLabel>{initialValues.remark}</InputLabel>
      </td>
      <td>
        <TextField
          id="outlined-basic"
          type="file"
          inputProps={{
            accept: ".jpeg, .pdf, .gif, .png, .jpg",
          }}
          onChange={(event) => {
            const files = event.target.files;
            if (files.length > 0) {
              const file = files[0];
              if (file.size > 2 * 1024 * 1024) {
                alert("File size exceeds 2MB limit.");
              } else {
                uploadHandler(file);
              }
            }
          }}
        />
        {/* <input
          type="file"
          accept="image/jpeg,image/gif,image/png,application/pdf,image/x-eps"
        /> */}
        <InputLabel>{initialValues.file}</InputLabel>
      </td>
    </tr>
  );
};

export default EhsEntryComponent;
