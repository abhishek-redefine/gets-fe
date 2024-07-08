import { Label } from "@mui/icons-material";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import React, { useEffect, useState } from "react";
import moment from "moment";
import DispatchService from "@/services/dispatch.service";
import { DATE_FORMAT } from "@/constants/app.constants.";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimeField } from "@mui/x-date-pickers/TimeField";
import { getFormattedLabel } from "@/utils/utils";
import dayjs from "dayjs";

const CabStickerModal = (props) => {
  const {
    data,
    officeData,
    selectedDate,
    dummy,

  } = props;

  const vehicleType = ["4s", "6s", "7s", "12s"];
  const vendorName = ["Vendor Name A", "Vendor Name B", "Vendor Name C", "Vendor Name D"];

  const [searchValues, setSearchValues] = useState({
    officeId: "",
    date: moment().format("YYYY-MM-DD"),
    shiftType: "",
  });

  const [selectFormat, setSelectFormat] = useState("Linear");

  const [ state, setState] = useState({
    linear: {

    }


  });

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  

  const [dummyRouteOptions, setDummyOption] = useState({
    date: selectedDate,
    officeId: "",
    shiftTime: moment().format("HH:mm"),
    shiftType: "",
    escortCriteria: "",
  });

  const handleFilterChangeDummyRoute = async (e) => {
    const { target } = e;
    const { value, name } = target;
    let dummyOption = { ...dummyRouteOptions };
    if (name === "date") dummyOption[name] = value.format("YYYY-MM-DD");
    else dummyOption[name] = value;
    setDummyOption(dummyOption);
  };

  const handleFormatChange = (e) => {
    setSelectFormat(e.target.value);
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <>
      <div
        style={{
          padding: "30px",
          backgroundColor: "#FFF",
          borderRadius: 10,
          padding: "50px",
        }}
      >
        <div>
          <div style={{ display: "flex" }}>
            {/* oficeData */}
            <div
              style={{
                borderRadius: 20,
                marginRight: 15,
                backgroundColor: "#f6ce47",
                minWidth: "140px",
                textAlign: "center",
              }}
            >
              {!dummy ? (
                <div style={{ padding: "10px 15px" }}>
                  <p>{data?.officeId}</p>
                </div>
              ) : (
                <>
                  <FormControl fullWidth>
                    <Select
                      id="officeId"
                      value={dummyRouteOptions.officeId}
                      name="officeId"
                      onChange={handleFilterChangeDummyRoute}
                    >
                      {!!officeData?.length &&
                        officeData.map((office, idx) => (
                          <MenuItem key={idx} value={office.officeId}>
                            {getFormattedLabel(office.officeId)},{" "}
                            {office.address}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </>
              )}
            </div>

            {/* date */}
            <div
              style={{
                borderRadius: 20,
                marginRight: 15,
                backgroundColor: "#f6ce47",
                minWidth: "140px",
                textAlign: "center",
              }}
            >
              {dummy ? (
                <>
                  <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                      name="date"
                      format={DATE_FORMAT}
                      value={
                        dummyRouteOptions.date
                          ? moment(dummyRouteOptions.date)
                          : null
                      }
                      onChange={(e) =>
                        handleFilterChangeDummyRoute({
                          target: { name: "date", value: e },
                        })
                      }
                    />
                  </LocalizationProvider>
                </>
              ) : (
                <div style={{ padding: "10px 15px" }}>
                  <p>{moment(selectedDate).format("DD-MM-YYYYY")}</p>
                </div>
              )}
            </div>

            {/* Shift Time */}
            <div
              style={{
                borderRadius: 20,
                marginRight: 15,
                backgroundColor: "#f6ce47",
                minWidth: "140px",
                textAlign: "center",
              }}
            >
              {!dummy ? (
                <div style={{ padding: "10px 15px" }}>
                  <p>{data?.shiftTime}</p>
                </div>
              ) : (
                <>
                  <FormControl required>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <TimeField
                        value={dayjs()
                          .hour(Number(dummyRouteOptions.shiftTime.slice(0, 2)))
                          .minute(
                            Number(dummyRouteOptions.shiftTime.slice(3, 5))
                          )}
                        format="HH:mm"
                        onChange={(e) => {
                          var ShiftTime = e.$d
                            .toLocaleTimeString("it-IT")
                            .slice(0, -3);

                          handleFilterChangeDummyRoute({
                            target: { name: "shiftTime", value: ShiftTime },
                          });
                        }}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </>
              )}
            </div>

            {/* ShiftType */}
            <div
              style={{
                borderRadius: 20,
                marginRight: 15,
                backgroundColor: "#f6ce47",
                minWidth: "140px",
                textAlign: "center",
              }}
            >
              {!dummy ? (
                <div style={{ padding: "10px 15px" }}>
                  <p>{data.shiftType}</p>
                </div>
              ) : (
                <FormControl fullWidth>
                  <Select
                    id="shiftType"
                    name="shiftType"
                    value={dummyRouteOptions.shiftType}
                    onChange={handleFilterChangeDummyRoute}
                  >
                    {shiftTypes.map((sT, idx) => (
                      <MenuItem key={idx} value={sT.value}>
                        {getFormattedLabel(sT.value)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", margin: "40px 0" }}>
          <h4 style={{ marginRight: "10px" }}>Select Format</h4>
          <input
            type="radio"
            id="linear"
            name="selectFormat"
            value="Linear"
            style={{ margin: "0 10px" }}
            checked={selectFormat === "Linear"}
            onChange={handleFormatChange}
          />
          <label for="linear">Linear</label>
          <input
            type="radio"
            id="vehicleType"
            name="selectFormat"
            value="Vehicle Type"
            style={{ margin: "0 10px" }}
            checked={selectFormat === "Vehicle Type"}
            onChange={handleFormatChange}
          />
          <label for="vehicleType">Vehicle Type</label>
          <input
            type="radio"
            id="vendor"
            name="selectFormat"
            value="Vendor"
            style={{ margin: "0 10px" }}
            checked={selectFormat === "Vendor"}
            onChange={handleFormatChange}
          />
          <label for="vendor">Vendor</label>
        </div>

        {/* Select Format */}
        {selectFormat === "Linear" && (
          <div
            style={{
              maxWidth: "100px",
              display: "flex",
              justifyContent: "space-between",
              margin: "30px 0 155px",
            }}
          >
            <div>
              <p style={{ fontWeight: "bold" }}>Start</p>
              <input
                type="number"
                htmlFor="start"
                name="start"
                className="seaterInput"
                
                style={{ width: "30px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              />
            </div>
            <div>
              <p style={{ fontWeight: "bold" }}>End</p>
              <input
                type="number"
                htmlFor="end"
                name="end"
                className="seaterInput"
                
                style={{ width: "30px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              />
            </div>
          </div>
        )}
        {selectFormat === "Vehicle Type" && (
          <div style={{display: 'flex', justifyContent: 'space-between', maxWidth:'400px'}}>
            
            {/* Vehicle Type */}
            <div>
            <p style={{ fontWeight: "bold"}}>Vehicle Type</p>
              {vehicleType.map((type, idx) => (
                <p style={{width:'40px', height: "30px", margin:'10px 0', padding:'2px', textAlign: 'center', border:'solid 2px #e7e7e7', borderRadius: '5px'}}>{type}</p>
              ))}
            </div>

            {/* Prefix */}
            <div>
              <p style={{ fontWeight: "bold" }}>Prefix</p>
              <input
                type="text"
                maxLength="3"
                className="seaterInput"               
                style={{ textTransform: "uppercase", width: "50px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              /><br/>
              <input
                type="text"
                maxLength="3"
                className="seaterInput"
                style={{ textTransform: "uppercase", width: "50px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              /><br/>
              <input
                type="text"
                maxLength="3"
                className="seaterInput"
                style={{ textTransform: "uppercase", width: "50px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              /><br/>
              <input
                type="text"
                maxLength="3"
                className="seaterInput"
                style={{ textTransform: "uppercase", width: "50px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              />
            </div>

            {/* start */}
            <div>
            <p style={{ fontWeight: "bold" }}>Start</p>
              <input
                type="number"
                className="seaterInput"
                style={{ width: "30px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              /><br/>
              <input
                type="number"
                className="seaterInput"
                style={{ width: "30px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              /><br/>
              <input
                type="number"
                className="seaterInput"
                style={{ width: "30px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              /><br/>
              <input
                type="number"
                className="seaterInput"
                style={{ width: "30px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              /><br/>
            </div>

            {/* End */}
            <div>
            <p style={{ fontWeight: "bold" }}>End</p>
              <input
                type="number"
                className="seaterInput"
                style={{ width: "30px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              /><br/>
              <input
                type="number"
                className="seaterInput"
                style={{ width: "30px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              /><br/>
              <input
                type="number"
                className="seaterInput"
                style={{ width: "30px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              /><br/>
              <input
                type="number"
                className="seaterInput"
                style={{ width: "30px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              /><br/>
            </div>
          </div>
        )}
        {selectFormat === "Vendor" && (
          <div style={{display: 'flex', justifyContent: 'space-between', maxWidth:'450px'}}>
            
            {/* Vendor Name */}
            <div>
            <p style={{ fontWeight: "bold"}}>Vendor Name</p>
              {vendorName.map((type, idx) => (
                <p style={{width:'auto', height: "30px", margin:'10px 0', padding:'2px 10px', textAlign: 'center', border:'solid 2px #e7e7e7', borderRadius: '5px'}}>{type}</p>
              ))}
            </div>

            {/* Prefix */}
            <div>
              <p style={{ fontWeight: "bold" }}>Prefix</p>
              <input
                type="text"
                maxLength="3"
                className="seaterInput"
                style={{ textTransform: "uppercase", width: "50px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              /><br/>
              <input
                type="text"
                maxLength="3"
                className="seaterInput"
                style={{ textTransform: "uppercase", width: "50px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              /><br/>
              <input
                type="text"
                maxLength="3"
                className="seaterInput"
                style={{ textTransform: "uppercase", width: "50px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              /><br/>
              <input
                type="text"
                maxLength="3"
                className="seaterInput"
                style={{ textTransform: "uppercase", width: "50px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              />
            </div>

            {/* start */}
            <div>
            <p style={{ fontWeight: "bold" }}>Start</p>
              <input
                type="number"
                className="seaterInput"
                style={{ width: "30px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              /><br/>
              <input
                type="number"
                className="seaterInput"
                style={{ width: "30px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              /><br/>
              <input
                type="number"
                className="seaterInput"
                style={{ width: "30px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              /><br/>
              <input
                type="number"
                className="seaterInput"
                style={{ width: "30px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              /><br/>
            </div>

            {/* End */}
            <div>
            <p style={{ fontWeight: "bold" }}>End</p>
              <input
                type="number"
                className="seaterInput"
                style={{ width: "30px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              /><br/>
              <input
                type="number"
                className="seaterInput"
                style={{ width: "30px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              /><br/>
              <input
                type="number"
                className="seaterInput"
                style={{ width: "30px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              /><br/>
              <input
                type="number"
                className="seaterInput"
                style={{ width: "30px", height: "30px", margin:'10px 0 0', padding:'2px', textAlign: 'center', }}
              /><br/>
            </div>
          </div>
        )}

        <div
          className="d-flex"
          style={{
            marginTop: 25,
            justifyContent: "center",
          }}
        >
          <div className="form-control-input">
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: "10px 20px", width: "100px" }}
            >
              Assign
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CabStickerModal;
