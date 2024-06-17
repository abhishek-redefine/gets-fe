import moment from "moment/moment";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useEffect, useState } from "react";
import DispatchService from "@/services/dispatch.service";
import { useFormik } from "formik";

const ReplicateTripModal = ({ data, date }) => {
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [tripIdList, setTripIdList] = useState([]);
  const [initialValues, setInitialValues] = useState({
    date: moment().format("YYYY-MM-DD"),
    tripId: "",
  });

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      let allValues = { ...values };
      const payload = {
        replicationDetails: allValues,
      };
      try {
        const response = await DispatchService.replicateTrip(payload);
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    },
  });

  const { values, errors, touched, handleChange, handleSubmit } = formik;

  const getTripDetails = async () => {
    try {
      console.log(data.shiftId);
      const shiftId = data.shiftId;
      const tripDate = date;
      const queryParams = {
        shiftId: shiftId,
        tripDate: tripDate,
      };
      const params = new URLSearchParams(queryParams);
      const response = await DispatchService.getTripByShiftIdAndTripDate(
        params
      );
      console.log(response.data);
      if (response.data.length > 0) {
        setTripIdList(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    console.log(name, value);
    formik.setFieldValue(name, value);
  };
  useEffect(() => {
    getTripDetails();
  }, []);
  return (
    <div style={{ padding: "30px", backgroundColor: "#FFF", borderRadius: 10 }}>
      <div>
        <div>
          <h3>Replicate Trips</h3>
        </div>
        <div style={{ marginTop: 20, display: "flex" }}>
          <div style={{ minWidth: "160px" }} className="form-control-input">
            <InputLabel htmlFor="date">Date</InputLabel>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker
                name="date"
                format={"YYYY-MM-DD"}
                //minDate={moment()}
                value={moment()}
                onChange={(e) => setSelectedDate(e.format("YYYY-MM-DD"))}
              />
            </LocalizationProvider>
          </div>
          <div
            style={{
              minWidth: "360px",
              display: "flex",
              alignItems: "end",
              margin: 20,
            }}
          >
            <FormControl fullWidth>
              <InputLabel id="tripId-label">Trip Name</InputLabel>
              <Select
                style={{ width: "360px" }}
                labelId="tripId-label"
                id="tripId"
                name="tripId"
                value={values.tripId}
                label="Trip Name"
                onChange={handleFilterChange}
              >
                {tripIdList.map((sT, idx) => (
                  <MenuItem key={idx} value={sT.id}>
                    {sT.routeName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div
          className="d-flex"
          style={{
            marginTop: 25,
            width: "100%",
            justifyContent: "center",
          }}
        >
          <div className="form-control-input">
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-primary"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplicateTripModal;
