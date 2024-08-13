import moment from "moment/moment";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { useEffect, useState } from "react";
import DispatchService from "@/services/dispatch.service";
import { useFormik } from "formik";
import { DATE_FORMAT } from "@/constants/app.constants.";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import dayjs from "dayjs";
import ConfirmationModal from "./tripGenratedSuccesModal";
import LoaderComponent from "../common/loading";

const ReplicateTripModal = ({
  data,
  date,
  shiftTime,
  shiftType,
  officeId,
  selectedDate,
  onClose,
}) => {
  const [tripIdList, setTripIdList] = useState([]);
  const [passFlag, setPassFlag] = useState(false);
  const [messageShow, setMessageShow] = useState(false);
  const [initialValues, setInitialValues] = useState({
    existingTripDate: "2024-07-15",
    replicationDate: date,
    shiftTime: data.shiftTime,
    shiftType: data.shiftType,
    fleetMix: {
      "4s": -1,
      "6s": 1,
      "7s": 1,
      "12s": 1,
    },
    action: "VERIFY",
    officeId: data.officeId,
    pickupTime: "00:00",
    schemaVersion: "NORMAL",
  });

  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    onSubmit: async (values) => {
      let allValues = { ...values };
      const fleetMix = [
        {
          noOfVehicle: allValues.fleetMix["4s"],
          noOfSeats: 4,
        },
        {
          noOfVehicle: allValues.fleetMix["6s"],
          noOfSeats: 6,
        },
        {
          noOfVehicle: allValues.fleetMix["7s"],
          noOfSeats: 7,
        },
        {
          noOfVehicle: allValues.fleetMix["12s"],
          noOfSeats: 12,
        },
      ];
      allValues.fleetMix = fleetMix;
      console.log(allValues);
      try {
        setLoading(true);
        const response = await DispatchService.replicateTrip(allValues);
        console.log(response);
        if (response.status === 201) {
          setMessageShow(true);
          setPassFlag(true);
        }
      } catch (err) {
        setMessageShow(true);
        setPassFlag(false);
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
  });

  const { values, errors, touched, handleChange, handleSubmit } = formik;

  const getTripDetails = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { target } = e;
    const { value, name } = target;
    console.log(name, value);
    let prev = { ...initialValues };
    if (name === "fourSeater") {
      prev.fleetMix["4s"] = value;
      formik.setFieldValue("fleetMix.4s", value);
    } else if (name === "sixSeater") {
      prev.fleetMix["6s"] = value;
      formik.setFieldValue("fleetMix.6s", value);
    } else if (name === "sevenSeater") {
      prev.fleetMix["7s"] = value;
      formik.setFieldValue("fleetMix.7s", value);
    } else if (name === "twelveSeater") {
      prev.fleetMix["12s"] = value;
      formik.setFieldValue("fleetMix.12s", value);
    } else {
      formik.setFieldValue(name, value);
    }
  };

  useEffect(() => {
    getTripDetails();
  }, []);

  return (
    <div>
      <div
        style={{ padding: "30px", backgroundColor: "#FFF", borderRadius: 10 }}
      >
        {!messageShow ? (
          <div>
            <div>
              <h3>Replicate Trips</h3>
            </div>

            <div
              style={{ marginTop: 20, display: "flex" }}
              className="form-control-input"
            >
              <div
                style={{
                  border: "2px solid #e7e7e7",
                  borderRadius: 4,
                  marginRight: 15,
                  minWidth: "150px",
                }}
              >
                <div
                  style={{
                    borderBottom: "2px solid #e7e7e7",
                    padding: "5px 10px",
                  }}
                >
                  <p>Office ID</p>
                </div>
                <div style={{ padding: "5px 10px" }}>
                  <p>{data?.officeId}</p>
                </div>
              </div>
              <div
                style={{
                  border: "2px solid #e7e7e7",
                  borderRadius: 4,
                  marginRight: 15,
                  minWidth: "150px",
                }}
              >
                <div
                  style={{
                    borderBottom: "2px solid #e7e7e7",
                    padding: "5px 10px",
                  }}
                >
                  <p>Shift Time</p>
                </div>
                <div style={{ padding: "5px 10px" }}>
                  <p>{data?.shiftTime}</p>
                </div>
              </div>
              <div
                style={{
                  border: "2px solid #e7e7e7",
                  borderRadius: 4,
                  marginRight: 15,
                  minWidth: "150px",
                }}
              >
                <div
                  style={{
                    borderBottom: "2px solid #e7e7e7",
                    padding: "5px 10px",
                  }}
                >
                  <p>Shift Type</p>
                </div>
                <div style={{ padding: "5px 10px" }}>
                  <p>{data?.shiftType}</p>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", margin: "0 20px" }}>
              <div style={{ minWidth: "160px" }}>
                <InputLabel htmlFor="existingTripDate">
                  Existing Trip Date
                </InputLabel>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    name="existingTripDate"
                    format={"YYYY-MM-DD"}
                    maxDate={moment()}
                    value={moment(values.existingTripDate)}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "existingTripDate",
                        e.format("YYYY-MM-DD")
                      )
                    }
                  />
                </LocalizationProvider>
              </div>
              <div style={{ minWidth: "160px", margin: "0 20px" }}>
                <InputLabel htmlFor="replicationDate">
                  Replication Date
                </InputLabel>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                  <DatePicker
                    disabled={true}
                    name="replicationDate"
                    format={"YYYY-MM-DD"}
                    value={moment(values.replicationDate)}
                  />
                </LocalizationProvider>
              </div>
              <div style={{ marginRight: 20 }}>
                <InputLabel htmlFor="pickupTime">Pickup Time</InputLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimeField
                    name="pickupTime"
                    value={dayjs()
                      .hour(Number(values.pickupTime?.slice(0, 2)))
                      .minute(Number(values.pickupTime?.slice(3, 5)))}
                    format="HH:mm"
                    onChange={(e) => {
                      var ShiftTime = e?.$d
                        .toLocaleTimeString("it-IT")
                        .slice(0, -3);

                      handleFilterChange({
                        target: { name: "pickupTime", value: ShiftTime },
                      });
                    }}
                  />
                </LocalizationProvider>
              </div>
            </div>

            <div style={{ width: "100%", display: "flex", margin: "0 20px" }}>
              <div style={{ marginTop: 20 }}>
                <div style={{ marginBottom: 10 }}>
                  <p>Fleet mix</p>
                </div>
                <div
                  className="d-flex"
                  style={{ border: "2px solid #e7e7e7", width: "100%" }}
                >
                  <div
                    style={{ width: "50%", borderRight: "2px solid #e7e7e7" }}
                  >
                    <div
                      style={{
                        borderBottom: "2px solid #e7e7e7",
                        padding: "5px 0",
                      }}
                    >
                      <p style={{ textAlign: "center" }}>Vehicle Type</p>
                    </div>
                    <div>
                      <p style={{ textAlign: "center", margin: "11px 0" }}>
                        4s
                      </p>
                      <p style={{ textAlign: "center", marginBottom: 11 }}>
                        6s
                      </p>
                      <p style={{ textAlign: "center", marginBottom: 11 }}>
                        7s
                      </p>
                      <p style={{ textAlign: "center", marginBottom: 11 }}>
                        12s
                      </p>
                    </div>
                  </div>
                  <div style={{ width: "50%" }}>
                    <div
                      style={{
                        borderBottom: "2px solid #e7e7e7",
                        padding: "5px 0",
                      }}
                    >
                      <p style={{ textAlign: "center" }}>Available</p>
                    </div>
                    <div>
                      <div
                        id="4s"
                        className="d-flex"
                        style={{ justifyContent: "center", margin: "10px 0" }}
                      >
                        <input
                          type="number"
                          name="fourSeater"
                          className="seaterInput"
                          value={values.fleetMix["4s"]}
                          onChange={handleFilterChange}
                        />
                      </div>
                      <div
                        id="6s"
                        className="d-flex"
                        style={{ justifyContent: "center", marginBottom: 10 }}
                      >
                        <input
                          type="number"
                          name="sixSeater"
                          className="seaterInput"
                          value={values.fleetMix["6s"]}
                          onChange={handleFilterChange}
                        />
                      </div>
                      <div
                        id="7s"
                        className="d-flex"
                        style={{ justifyContent: "center", marginBottom: 10 }}
                      >
                        <input
                          type="number"
                          name="sevenSeater"
                          className="seaterInput"
                          value={values.fleetMix["7s"]}
                          onChange={handleFilterChange}
                        />
                      </div>
                      <div
                        id="12s"
                        className="d-flex"
                        style={{ justifyContent: "center", marginBottom: 10 }}
                      >
                        <input
                          type="number"
                          name="twelveSeater"
                          className="seaterInput"
                          value={values.fleetMix["12s"]}
                          onChange={handleFilterChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
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
        ) : (
          <ConfirmationModal
            pass={passFlag}
            onClose={onClose}
            type={"replicate"}
          />
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

export default ReplicateTripModal;
