import ComplianceService from "@/services/compliance.service";
import DispatchService from "@/services/dispatch.service";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import LoaderComponent from "../loader";

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 150,
      width: 250,
    },
  },
};

const AddPenaltyModal = (props) => {
  const { data, onClose } = props;
  const [select, setSelect] = useState("No Action");
  const [penaltyType, setPenaltyType] = useState({});
  const [penaltyAmount, setPenaltyAmount] = useState(0);
  const [pagination, setPagination] = useState({
    pageNo: 0,
    pageSize: 100,
  });
  const [penaltyTypes, setPenaltyTypes] = useState([]);
  const [searchValues, setSearchValues] = useState({});
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (e) => {
    const { target } = e;
    const { name, value } = target;
    setPenaltyAmount(value.penaltyAmount);
    setPenaltyType(value);
    // setSearchValues({ ...searchValues, [e.target.name]: e.target.value });
  };

  const getOpsPenalty = async () => {
    try {
      const params = new URLSearchParams(pagination);
      const response = await ComplianceService.getAllPenalty(params);
      console.log(response.data.paginatedResponse.content);
      let data = response.data.paginatedResponse.content;
      data.push({ id: 0, penaltyName: "Miscellaneous", penaltyAmount: 0 });
      setPenaltyTypes(data);
    } catch (err) {
      console.log(err);
    }
  };

  const addPenalty = async () => {
    try {
      const payload = {
        tripId: data.id,
        penaltyType: penaltyType.penaltyName,
        penaltyAmount: penaltyAmount,
        penaltyAction: select,
      };
      console.log(payload);
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      const response = await DispatchService.addPenalty(payload);
      if (response.status === 200) {
        onClose();
      }
      console.log(response.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormatChange = (e) => {
    setSelect(e.target.value);
  };

  useEffect(() => {
    console.log("data: ", data);
  }, [data]);

  useEffect(() => {
    getOpsPenalty();
  }, []);

  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#FFF",
        borderRadius: 10,
        fontFamily: "DM Sans",
      }}
    >
      <div>
        <h3>Operation Penalty</h3>
        <div style={{ display: "flex", marginTop: "25px" }}>
          {/* Display Trip ID */}
          <div
            style={{
              border: "2px solid #e7e7e7",
              borderRadius: 4,
              marginRight: 25,
              minWidth: "150px",
            }}
          >
            <div
              style={{ borderBottom: "2px solid #e7e7e7", padding: "5px 10px" }}
            >
              <p>Trip ID</p>
            </div>
            <div style={{ padding: "5px 10px" }}>
              <p>TRIP-{data?.id}</p>
            </div>
          </div>
          {/* Display Office ID */}
          <div
            style={{
              border: "2px solid #e7e7e7",
              borderRadius: 4,
              marginRight: 25,
              minWidth: "150px",
            }}
          >
            <div
              style={{ borderBottom: "2px solid #e7e7e7", padding: "5px 10px" }}
            >
              <p>Office ID</p>
            </div>
            <div style={{ padding: "5px 10px" }}>
              <p>{data?.officeId}</p>
            </div>
          </div>
        </div>

        {/* Penalty Type Dropdown */}
        <div style={{ display: "flex", marginTop: 20 }}>
          <FormControl
            style={{
              width: "290px",
              margin: "20px 30px 0px 5px",
              padding: "4px 0",
              fontFamily: "DM Sans",
            }}
          >
            <InputLabel id="penalty-label" style={{ fontSize: "14px" }}>
              Penalty type
            </InputLabel>
            <Select
              style={{
                backgroundColor: "white",
                height: "40px",
                fontSize: "15px",
              }}
              labelId="penalty-type-label"
              id="penaltyType"
              name="penaltyType"
              value={penaltyType}
              label="Penalty type"
              onChange={handleFilterChange}
              MenuProps={MenuProps}
            >
              {penaltyTypes.map((item) => (
                <MenuItem
                  key={item.id}
                  value={item}
                  style={{ fontSize: "15px", textWrap: "wrap" }}
                >
                  {item.penaltyName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box
            component="form"
            style={{
              width: 290,
              height: 20,
              maxWidth: "100%",
              margin: "24px 19px 0px 0px",
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              id="outlined-basic"
              label="Penalty Amount"
              variant="outlined"
              size="small"
              fullWidth
              value={penaltyAmount}
              disabled={penaltyType?.penaltyName !== "Miscellaneous"}
              onChange={(e) => setPenaltyAmount(e.target.value)}
              inputProps={{ style: { fontFamily: "DM Sans", fontSize: 15 } }}
              InputLabelProps={{ style: { fontSize: 14 } }}
            />
          </Box>
        </div>

        {/* Penalty Action Required */}
        <div style={{ margin: "40px 0" }}>
          <h4 style={{ marginLeft: "5px" }}>Penalty Action Required</h4>
          <div style={{ marginTop: "15px" }}>
            <input
              type="radio"
              id="noAction"
              name="selectFormat"
              value="No Action"
              style={{ margin: "0 10px" }}
              checked={select === "No Action"}
              onChange={handleFormatChange}
            />
            <label htmlFor="noAction" style={{ marginRight: "15px" }}>
              No Action
            </label>
            <input
              type="radio"
              id="suspend"
              name="selectFormat"
              value="Suspend"
              style={{ margin: "0 10px" }}
              checked={select === "Suspend"}
              onChange={handleFormatChange}
            />
            <label htmlFor="suspend" style={{ marginRight: "15px" }}>
              Suspend
            </label>
            <input
              type="radio"
              id="terminate"
              name="selectFormat"
              value="Terminate"
              style={{ margin: "0 10px" }}
              checked={select === "Terminate"}
              onChange={handleFormatChange}
            />
            <label htmlFor="terminate" style={{ marginRight: "15px" }}>
              Terminate
            </label>
            <input
              type="radio"
              id="terminateAndBlacklist"
              name="selectFormat"
              value="Terminate and Blacklist"
              style={{ margin: "0 10px" }}
              checked={select === "Terminate and Blacklist"}
              onChange={handleFormatChange}
            />
            <label htmlFor="terminateAndBlacklist">
              Terminate and Blacklist
            </label>
          </div>
        </div>

        {/* Add Button */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            type="button"
            style={{
              backgroundColor: "#f6ce47",
              color: "black",
              border: "none",
              borderRadius: "6px",
              fontSize: "15px",
              padding: "13px 35px",
              cursor: "pointer",
              marginTop: "70px",
            }}
            onClick={() => addPenalty()}
          >
            Add
          </button>
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
    </div>
  );
};

export default AddPenaltyModal;
