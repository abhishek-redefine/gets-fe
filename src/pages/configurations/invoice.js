import React, { useEffect, useState } from "react";
import Configurations from "@/layouts/configurations";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { DATE_FORMAT } from "@/constants/app.constants.";

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 150,
      width: 250,
    },
  },
};

const Invoice = () => {
  const [values, setValues] = useState({
    invoiceFields: [{ month: "", startDate: "", endDate: "" }],
  });

  const monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const [errors, setErrors] = useState([
    { month: false, startDate: false, endDate: false },
  ]);

  const handleInvoiceFieldsChange = (index, name, value) => {
    const updatedInvoiceFields = [...values.invoiceFields];
    if (name === "startDate" || name === "endDate")
      updatedInvoiceFields[index][name] = value
        ? value.format("YYYY-MM-DD")
        : "";
    else updatedInvoiceFields[index][name] = value;
    setValues((prevValues) => ({
      ...prevValues,
      invoiceFields: updatedInvoiceFields,
    }));
  };

  const addInvoiceField = () => {
    setValues((prevValues) => ({
      ...prevValues,
      invoiceFields: [
        ...prevValues.invoiceFields,
        { month: "", startDate: "", endDate: "" },
      ],
    }));
  };

  const removeInvoiceField = (index) => {
    const updatedInvoiceFields = values.invoiceFields.filter(
      (_, i) => i !== index
    );
    setValues((prevValues) => ({
      ...prevValues,
      invoiceFields: updatedInvoiceFields,
    }));
  };

  const validateFields = () => {
    let validationErrors = [...errors];
    let valid = true;

    values.invoiceFields.forEach((field, index) => {
      let fieldErrors = { month: false, startDate: false, endDate: false };

      if (!field.month) {
        fieldErrors.month = true;
        valid = false;
      }
      if (!field.startDate) {
        fieldErrors.startDate = true;
        valid = false;
      }
      if (!field.endDate) {
        fieldErrors.endDate = true;
        valid = false;
      }

      validationErrors[index] = fieldErrors;
    });

    setErrors(validationErrors);
    return valid;
  };

  const handleSave = () => {
    if (validateFields()) {
      console.log("Values>>>", values);
    } else {
      console.log("Please fill all required fields.");
    }
  };

  const handleResetButton = () => {
    let allValues = {
      invoiceFields: [{ month: "", startDate: "", endDate: "" }],
    };
    setValues(allValues);
    setErrors([{ month: false, startDate: false, endDate: false }]);
  };

  //   useEffect(() => {}, []);

  return (
    <div className="mainSettingsContainer">
      <h2>Invoice</h2>
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "20px 30px",
          borderRadius: 5,
          marginTop: 20,
        }}
      >
        {values.invoiceFields.map((invoice, index) => (
          <div key={index}>
            <div className="form-control-input">
              <FormControl fullWidth>
                <InputLabel id="month-label">Month</InputLabel>
                <Select
                  labelId="month-label"
                  id="month"
                  value={invoice.month}
                  name="month"
                  label="Month"
                  onChange={(e) =>
                    handleInvoiceFieldsChange(
                      index,
                      e.target.name,
                      e.target.value
                    )
                  }
                  required
                  MenuProps={MenuProps}
                  style={{ backgroundColor: "#ffffff" }}
                >
                  {monthList.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
                </Select>
                {errors[index]?.month && (
                  <FormHelperText style={{ color: "#d32f2f" }}>
                    Month is required
                  </FormHelperText>
                )}
              </FormControl>
            </div>

            <div
              className="form-control-input"
              style={{ backgroundColor: "white" }}
            >
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  name="startDate"
                  format={DATE_FORMAT}
                  value={invoice.startDate ? moment(invoice.startDate) : null}
                  onChange={(date) =>
                    handleInvoiceFieldsChange(index, "startDate", date)
                  }
                  required
                  label="Start Date"
                  error={errors[index]?.startDate}
                  slotProps={{
                    textField: {
                      helperText:
                        errors[index]?.startDate && "Start Date is required",
                      FormHelperTextProps: {
                        sx: {
                          color: "#d32f2f",
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            </div>

            <div
              className="form-control-input"
              style={{ backgroundColor: "white" }}
            >
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  name="endDate"
                  format={DATE_FORMAT}
                  value={invoice.endDate ? moment(invoice.endDate) : null}
                  onChange={(date) =>
                    handleInvoiceFieldsChange(index, "endDate", date)
                  }
                  required
                  label="End Date"
                  error={errors[index]?.endDateDate}
                  slotProps={{
                    textField: {
                      helperText:
                        errors[index]?.endDate && "End Date is required",
                      FormHelperTextProps: {
                        sx: {
                          color: "#d32f2f",
                        },
                      },
                    },
                  }}
                  minDate={invoice.startDate ? moment(invoice.startDate) : null}
                />
              </LocalizationProvider>
            </div>

            {values.invoiceFields.length > 1 && (
              <IconButton
                onClick={() => removeInvoiceField(index)}
                aria-label="remove row"
              >
                <RemoveIcon />
              </IconButton>
            )}
            <IconButton onClick={addInvoiceField} aria-label="add row">
              <AddIcon />
            </IconButton>
          </div>
        ))}

        <div className="addBtnContainer" style={{ marginTop: 250 }}>
          <div>
            <button className="btn btn-secondary" onClick={handleResetButton}>
              Reset
            </button>
          </div>
          <div style={{ display: "flex" }}>
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configurations(Invoice);
