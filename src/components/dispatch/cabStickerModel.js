import { Label } from "@mui/icons-material";
import { FormControl, InputLabel, Select, MenuItem, Autocomplete, TextField } from "@mui/material";
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
import ComplianceService from "@/services/compliance.service";

const CabStickerModal = (props) => {
  const {
    data,
    officeData,
    selectedDate,
    dummy,
    onClose
  } = props;

  const [searchVendor, setSearchVendor] = useState([]);
  const [openSearchVendor, setOpenSearchVendor] = useState(false);
  const [vendorName, setVendorName] = useState("")
  const searchForVendor = async (e) => {
    try {
      if (e.target.value) {
        const response = await ComplianceService.searchVendor(e.target.value);
        const { data } = response || {};
        setSearchVendor(data);
      } else {
        setSearchVendor([]);
      }
    } catch (e) {
      console.error(e);
    }
  }
  const onChangeHandler = (newValue, name, key) => {
    console.log(newValue);
    setVendorName(newValue?.vendorName || "");
  };

  const vehicleType = ["4s", "6s", "7s", "12s"];
  const [vendorList, setVendorList] = useState([]);

  const [searchValues, setSearchValues] = useState({
    officeId: "",
    date: moment().format("YYYY-MM-DD"),
    shiftType: "",
  });

  const [selectFormat, setSelectFormat] = useState("Linear");
  const [linearInput, setLinearInput] = useState({
    start: 0,
    end: 0,
  })
  const [vehicleInput, setVehicleInput] = useState({
    "4": {
      prefix: "",
      start: "",
      end: ""
    },
    "6": {
      prefix: "",
      start: "",
      end: ""
    },
    "7": {
      prefix: "",
      start: "",
      end: ""
    },
    "12": {
      prefix: "",
      start: "",
      end: ""
    },
  })
  const [vendorInput, setVendorInput] = useState({
    prefix: "",
    start: "",
    end: ""
  })
  const [vehicleTypeInput, setVehicleTypeInput] = useState({
    vehicleType
  })

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

  const createCabStickerHandler = async () => {
    try {
      let payload = {
        stickerDTOs: [],
      };
      if (selectFormat === "Linear") {
        payload.stickerDTOs = [
          {
            "officeId": data?.officeId,
            "shiftType": data?.shiftType,
            "shiftTime": data?.shiftTime,
            "stickerType": selectFormat.toUpperCase(),
            "start": parseInt(linearInput.start),
            "end": parseInt(linearInput.end),
          }
        ];
      }
      else if (selectFormat === "Vehicle Type") {
        var tempPayload = [];
        Object.entries(vehicleInput).map(([key, value]) => {
          tempPayload.push(
            {
              "officeId": data?.officeId,
              "shiftType": data?.shiftType,
              "shiftTime": data?.shiftTime,
              "stickerType": "VEHICLE",
              "start": parseInt(value.start),
              "end": parseInt(value.end),
              "prefix": value.prefix,
              "vehicleType": key,
            }
          )
        })
        payload.stickerDTOs = tempPayload;
      }
      else if (selectFormat === "Vendor") {
        payload.stickerDTOs = [
          {
            "officeId": data?.officeId,
            "shiftType": data?.shiftType,
            "shiftTime": data?.shiftTime,
            "stickerType": "VENDOR",
            "start": parseInt(vendorInput.start),
            "end": parseInt(vendorInput.end),
            "prefix": vendorInput.prefix,
            "vendorName": vendorName,
          }
        ]
      }
      console.log(payload)
      const response = await DispatchService.createCabSticker(payload);
      console.log(response.data);
      onClose();
    } catch (err) {
      console.log(err);
    }
  }

  const inputChangeHandler = (event,type) =>{
    const {target} = event;
    const {name, value} = target;
    console.log(name,value,type);
    setVehicleInput((vehicleInput)=>({...vehicleInput, [name]: { ...vehicleInput[name], [type]: value}}));
  }

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
            <div style={{ margin: "0 10px" }}>
              <p style={{ fontWeight: "bold", textAlign: 'center' }}>Start</p>
              <input
                type="number"
                htmlFor="start"
                name="start"
                className="seaterInput"
                style={{ width: "90px", height: "30px", margin: '10px 0 0', padding: '24px', textAlign: 'center', }}
                value={linearInput.start}
                onChange={(e) => {
                  setLinearInput((linearInput) => ({ ...linearInput, start: e.target.value }))
                }}
              />
            </div>
            <div style={{ margin: "0 10px" }}>
              <p style={{ fontWeight: "bold", textAlign: 'center' }}>End</p>
              <input
                type="number"
                htmlFor="end"
                name="end"
                className="seaterInput"
                style={{ width: "90px", height: "30px", margin: '10px 0 0', padding: '24px', textAlign: 'center', }}
                value={linearInput.end}
                onChange={(e) => setLinearInput((linearInput) => ({ ...linearInput, end: e.target.value }))}
              />
            </div>
          </div>
        )}
        {selectFormat === "Vehicle Type" && (
          <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '400px' }}>

            {/* Vehicle Type */}
            <div>
              <p style={{ fontWeight: "bold" }}>Vehicle Type</p>
              {
                Object.keys(vehicleInput).map((vehicle) => (
                  <p style={{ width: '40px', height: "30px", margin: '10px 0', padding: '2px', textAlign: 'center', border: 'solid 2px #e7e7e7', borderRadius: '5px' }}>{vehicle}s</p>
                ))
                // vehicleType.map((type, idx) => (
                //   <p style={{ width: '40px', height: "30px", margin: '10px 0', padding: '2px', textAlign: 'center', border: 'solid 2px #e7e7e7', borderRadius: '5px' }}>{type}</p>
                // ))
              }
            </div>

            {/* Prefix */}
            <div>
              <p style={{ fontWeight: "bold" }}>Prefix</p>
              {
                Object.entries(vehicleInput).map(([key, value]) => (
                  <>
                    <input
                      type="text"
                      maxLength="3"
                      name={key}
                      className="seaterInput"
                      value={value.prefix}
                      style={{ textTransform: "uppercase", width: "50px", height: "30px", margin: '10px 0 0', padding: '2px', textAlign: 'center', }}
                      onChange={(e)=>inputChangeHandler(e,"prefix")}
                    /><br />
                  </>
                ))
              }
            </div>

            {/* start */}
            <div>
              <p style={{ fontWeight: "bold" }}>Start</p>
              {
                Object.entries(vehicleInput).map(([key, value]) => (
                  <>
                    <input
                      type="number"
                      className="seaterInput"
                      name={key}
                      value={value.start}
                      style={{ width: "30px", height: "30px", margin: '10px 0 0', padding: '2px', textAlign: 'center', }}
                      onChange={(e)=>inputChangeHandler(e,"start")}
                    /><br />
                  </>
                ))
              }
            </div>

            {/* End */}
            <div>
              <p style={{ fontWeight: "bold" }}>End</p>
              {
                Object.entries(vehicleInput).map(([key, value]) => (
                  <>
                    <input
                      type="number"
                      className="seaterInput"
                      value={value.end}
                      name={key}
                      style={{ width: "30px", height: "30px", margin: '10px 0 0', padding: '2px', textAlign: 'center', }}
                      onChange={(e)=>inputChangeHandler(e,"end")}
                    /><br />
                  </>
                ))
              }
            </div>
          </div>
        )}
        {selectFormat === "Vendor" && (
          <div style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '450px' }}>

            {/* Vendor Name */}
            <div className='form-control-input' style={{ paddingTop: 10 }}>
              <FormControl variant="outlined">
                <Autocomplete
                  disablePortal
                  id="search-reporting-manager"
                  options={searchVendor}
                  autoComplete
                  open={openSearchVendor}
                  onOpen={() => {
                    setOpenSearchVendor(true);
                  }}
                  onClose={() => {
                    setOpenSearchVendor(false);
                  }}
                  onChange={(e, val) => onChangeHandler(val, "Vendor", "vendorId")}
                  getOptionKey={(vendor) => vendor.vendorId}
                  getOptionLabel={(vendor) => vendor.vendorName}
                  freeSolo
                  name="Vendor"
                  renderInput={(params) => <TextField {...params} label="Search Vendor Name" onChange={searchForVendor} />}
                />
              </FormControl>
            </div>

            {/* Prefix */}
            <div style={{ margin: "0 10px" }}>
              <p style={{ fontWeight: "bold" , textAlign: 'center'}}>Prefix</p>
              <input
                type="text"
                maxLength="3"
                className="seaterInput"
                style={{ textTransform: "uppercase", width: "90px", height: "30px", margin: '10px 0 0', padding: '25px', textAlign: 'center', }}
                value={vendorInput.prefix}
                onChange={(e)=>{
                  console.log(e.target.value);
                  setVendorInput((vendorInput)=>({...vendorInput, prefix : e.target.value}));
                }}
                // onChange={(e)=>setVendorInput((vendorInput)=>({...vendorInput, prefix : e.target.value}))}
              />
            </div>

            {/* start */}
            <div style={{ margin: "0 10px" }}>
              <p style={{ fontWeight: "bold", textAlign: 'center' }}>Start</p>
              <input
                type="number"
                className="seaterInput"
                style={{ width: "60px", height: "30px", margin: '10px 0 0', padding: '25px', textAlign: 'center', }}
                value={vendorInput.start}
                onChange={(e)=>setVendorInput((vendorInput)=>({...vendorInput, start : e.target.value}))}
              />
            </div>

            {/* End */}
            <div style={{ margin: "0 10px" }}>
              <p style={{ fontWeight: "bold", textAlign: 'center' }}>End</p>
              <input
                type="number"
                className="seaterInput"
                style={{ width: "60px", height: "30px", margin: '10px 0 0', padding: '25px', textAlign: 'center', }}
                value={vendorInput.end}
                onChange={(e)=>setVendorInput((vendorInput)=>({...vendorInput, end : e.target.value}))}
              />
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
              onClick={createCabStickerHandler}
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
