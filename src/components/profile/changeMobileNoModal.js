import { TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toggleToast } from "@/redux/company.slice";
import OfficeService from "@/services/office.service";

const AddressChangeModal = (props) => {
  const { onClose, userDetails } = props;
  const dispatch = useDispatch();
  const [values, setValues] = useState({
    mob: "",
  });
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const RaiseChangeMobileRequest = async () => {
    console.log("User details>>>", userDetails);
    try {
      const payload = {
        empId: userDetails.id,
        empName: userDetails.name,
        empEmail: userDetails.email,
        requestType: "mobile",
        mob: values.mob,
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
      RaiseChangeMobileRequest();
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
      <h3 style={{ marginBottom: "10px" }}>
        Mobile Number Change Request Form
      </h3>
      <div>
        <div
          style={{ marginLeft: 0, marginRight: 35, minWidth: "100%" }}
          className="form-control-input"
        >
          <TextField
            value={values.mob}
            onChange={handleChange}
            error={!!error.address}
            helperText={error.address}
            id="mob"
            name="mob"
            label="Mobile No*"
            variant="outlined"
            fullWidth
          />
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
