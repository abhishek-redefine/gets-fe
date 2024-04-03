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

const EhsEntryComponent = ({ listing, ehsStatusList }) => {
  const [initialValues, setInitialValues] = useState({
    ehsTitle: "",
    ehsMandate: "",
    ehsFrequency: "",
    checkedDueDate: "",
    ehsStatus: "PASS",
    remark: "",
    file: "",
  });
  const [ehsStatus, setEhsStatus] = useState(initialValues.ehsStatus);
  const [remark, setRemark] = useState(initialValues.remark);

  useEffect(() => {
    if (listing?.id) {
      console.log("value in listing", listing);
      const editValues = { ...initialValues, ...listing };
      console.log(editValues);
      setInitialValues(editValues);
    }
  }, [listing]);

  return (
    <tr key={listing?.id}>
      <td>
        <p>{initialValues.ehsTitle}</p>
      </td>
      <td>
        <p>{initialValues.ehsMandate.replace("_", " ")}</p>
      </td>
      <td>
        <p>{initialValues.ehsFrequency}</p>
      </td>
      <td>
        <InputLabel htmlFor="start-date">Start Date</InputLabel>
        {/* <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            name="startDate"
            format={DATE_FORMAT}
            value={values.startDate ? moment(values.startDate) : null}
            onChange={(e) => handleDateChange(e, "startDate")}
          />
        </LocalizationProvider> */}
        <p>{initialValues.checkedDueDate}</p>
      </td>
      <td>
        <div className="form-control">
          <FormControl required fullWidth>
            <InputLabel id="ehsStatus-label">Ehs Status</InputLabel>
            <Select
              labelId="ehsStatus-label"
              id="ehsStatus"
              name="ehsStatus"
              value={ehsStatus}
              label="ehsStatus"
              onChange={(e) => setEhsStatus(e.target.value)}
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
          />
        </div>
        <p>{initialValues.remark}</p>
      </td>
      <td>
        <p>{initialValues.file}</p>
      </td>
    </tr>
  );
};

export default EhsEntryComponent;
