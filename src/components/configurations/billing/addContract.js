import {
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import { toggleToast } from "@/redux/company.slice";
import LoaderComponent from "@/components/loader";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DATE_FORMAT } from "@/constants/app.constants.";
import moment from "moment";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export const validationSchema = yup.object({
  contractId: yup.string("Enter Contract Id").required("Enter Contract Id"),
  contractName: yup
    .string("Enter Contract Name")
    .required("Enter Contract Name"),
  startDate: yup.date("Enter Start Date").required("Enter Start Date"),
  sittingCapacity: yup
    .string("Enter Sitting Capacity")
    .required("Enter Sitting Capacity"),
  tripRate: yup.string("Enter Trip Rate").required("Enter Trip Rate"),
  escortTripRate: yup
    .string("Enter Escort Trip Rate")
    .required("Enter Escort Trip Rate"),
  totalNoOfHrs: yup
    .string("Enter Total No Of Hrs")
    .required("Enter Total No Of Hrs"),
  totalNoOfKms: yup
    .string("Enter Total No Of Kms")
    .required("Enter Total No Of Kms"),
  packageAmount: yup
    .string("Enter Package Amount")
    .required("Enter Package Amount"),
  extraKmRate: yup
    .string("Enter Extra Km Rate")
    .required("Enter Extra Km Rate"),
  extraHrRate: yup
    .string("Enter Extra Hr Rate")
    .required("Enter Extra Hr Rate"),
  workingDays: yup.string("Enter Working Days").required("Enter Working Days"),
  minBusinessDays: yup
    .string("Enter Min. Business Days")
    .required("Enter Min. Business Days"),
  adjustmentDays: yup
    .string("Enter Adjustment Days")
    .required("Enter Adjustment Days"),
  proDate: yup.string("Select Pro Date").required("Select Pro Date"),
  kmTripRate: yup.string("Enter Km Trip Rate").required("Enter Km Trip Rate"),

  zoneFields: yup.array().of(
    yup.object({
      zoneName: yup.string("Enter Zone Name").required("Enter Zone Name"),
      tripRate: yup.string("Enter Trip Rate").required("Enter Trip Rate"),
      escortTripRate: yup
        .string("Enter Escort Trip Rate")
        .required("Enter Escort Trip Rate"),
    })
  ),

  tripSlabFields: yup.array().of(
    yup.object({
      startKm: yup.string("Enter Start Km").required("Enter Start Km"),
      // endKm: yup.string("Enter End Km").required("Enter End Km"),
      rate: yup.string("Enter Rate").required("Enter Rate"),
    })
  ),
});

const AddContract = ({ EditContractData, SetIsAddContract }) => {
  const [initialValues, setInitialValues] = useState({
    type: "Flat Trip Based",
    contractId: "",
    contractName: "",
    startDate: "",
    sittingCapacity: "",
    tripRate: "",
    escortTripRate: "",
    zoneName: "",
    totalNoOfHrs: "",
    totalNoOfKms: "",
    packageAmount: "",
    extraKmRate: "",
    extraHrRate: "",
    workingDays: "",
    minBusinessDays: "",
    adjustmentDays: "",
    proDate: "",
    startKm: "",
    endKm: "",
    rate: "",
    kmTripRate: "",
  });

  const [zoneFields, setZoneFields] = useState([
    { zoneName: "", tripRate: "", escortTripRate: "" },
  ]);

  const [tripSlabFields, setTripSlabFields] = useState([
    { startKm: "", endKm: "", rate: "" },
  ]);

  const [loading, setLoading] = useState(false);
  const ContractType = [
    "Flat Trip Based",
    "Zone Based",
    "Package Based",
    "Trip Slab Based",
    "KM Based",
  ];

  useState(() => {
    console.log("EditContractData?.id>>>", EditContractData?.id);
    if (EditContractData?.id) {
      let newEditInfo = Object.assign(initialValues, EditContractData);
      console.log(newEditInfo);
      //   newEditInfo.ehsAppliedOnDriver
      //     ? (newEditInfo.ehsAppliedOn = "Driver")
      //     : (newEditInfo.ehsAppliedOn = "Vehicle");
      //   newEditInfo.officeIds = newEditInfo.officeIds;
      setInitialValues(newEditInfo);
    }
  }, [EditContractData]);

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log(values);
      try {
        if (EditContractData?.id) {
          setLoading(true);
          // await new Promise((resolve) => setTimeout(resolve, 5000));
          //   const response = await ComplianceService.updateEHS({ ehs: values });
          //   if (response.status === 200) {
          //     dispatch(
          //       toggleToast({
          //         message: "Contract details updated successfully!",
          //         type: "success",
          //       })
          //     );
          //     SetIsAddContract(false);
          //   } else if (response.status === 500) {
          //     dispatch(
          //       toggleToast({
          //         message:
          //           "Contract details not updated. Please try again later!",
          //         type: "error",
          //       })
          //     );
          SetIsAddContract(false);
          //   }
        } else {
          setLoading(true);
          // await new Promise((resolve) => setTimeout(resolve, 5000));
          //   const response = await ComplianceService.createEHS({ ehs: values });
          //   if (response.status === 201) {
          //     dispatch(
          //       toggleToast({
          //         message: "Contract details added successfully!",
          //         type: "success",
          //       })
          //     );
          //     SetIsAddContract(false);
          //   } else if (response.status === 500) {
          //     dispatch(
          //       toggleToast({
          //         message: "Contract details not added. Please try again later!",
          //         type: "error",
          //       })
          //     );
          SetIsAddContract(false);
          //   }
        }
      } catch (err) {
        dispatch(
          toggleToast({
            message: "Contract details not added. Please try again later!",
            type: "error",
          })
        );
        console.log(err);
      } finally {
        setLoading(false);
      }
    },
  });

  const { errors, touched, values, handleChange, handleSubmit, handleReset } =
    formik;
  const dispatch = useDispatch();

  const handleDateChange = (date, name) => {
    const selectedDate =
      date && moment(date).isValid() ? moment(date).format(DATE_FORMAT) : "";
    formik.setFieldValue(name, selectedDate);
  };

  // const handleZoneChange = (index, event) => {
  //   const { name, value } = event.target;
  //   const updatedZones = [...zoneFields];
  //   updatedZones[index][name] = value;
  //   setZoneFields(updatedZones);
  // };

  const handleZoneChange = (index, event) => {
    const { name, value } = event.target;
    const updatedZones = [...zoneFields];
    updatedZones[index][name] = value;
    setZoneFields(updatedZones);
    formik.setFieldValue("zoneFields", updatedZones);
  };

  const addZoneField = () => {
    setZoneFields([
      ...zoneFields,
      { zoneName: "", tripRate: "", escortTripRate: "" },
    ]);
  };

  const removeZoneField = (index) => {
    const updatedZones = zoneFields.filter((_, i) => i !== index);
    setZoneFields(updatedZones);
  };

  const handleTripSlabChange = (index, event) => {
    const { name, value } = event.target;
    const updatedTripSlab = [...tripSlabFields];
    updatedTripSlab[index][name] = value;
    setTripSlabFields(updatedTripSlab);
    formik.setFieldValue("tripSlabFields", updatedTripSlab);
  };

  const addTripSlabField = () => {
    setTripSlabFields([
      ...tripSlabFields,
      { startKm: "", endKm: "", rate: "" },
    ]);
  };

  const removeTripSlabField = (index) => {
    const updatedTripSlab = tripSlabFields.filter((_, i) => i !== index);
    setTripSlabFields(updatedTripSlab);
  };

  useEffect(() => {
    console.log("zone fields>>", zoneFields);
  }, [zoneFields]);

  useEffect(() => {
    console.log("Trip slab fields>>", tripSlabFields);
  }, [tripSlabFields]);

  useEffect(() => {
    console.log("initialValues>>", values);
  }, [values]);

  useEffect(() => {
    formik.resetForm({
      values: {
        type: values.type,
        contractId: "",
        contractName: "",
        startDate: "",
        sittingCapacity: "",
        tripRate: "",
        escortTripRate: "",
        zoneName: "",
        totalNoOfHrs: "",
        totalNoOfKms: "",
        packageAmount: "",
        extraKmRate: "",
        extraHrRate: "",
        workingDays: "",
        minBusinessDays: "",
        adjustmentDays: "",
        proDate: null,
        startKm: "",
        endKm: "",
        rate: "",
        kmTripRate: "",
      },
    });
    setZoneFields([{ zoneName: "", tripRate: "", escortTripRate: "" }]);
    setTripSlabFields([{ startKm: "", endKm: "", rate: "" }]);
  }, [values.type]);

  return (
    <div>
      <h4 className="pageSubHeading">
        {EditContractData?.id ? "Edit" : "Add"} Contract
      </h4>
      <div className="addUpdateFormContainer">
        <div className="form-control-input">
          <FormControl required fullWidth>
            <InputLabel id="contractTypeLabel">Contract Type</InputLabel>
            <Select
              labelId="typeLabel"
              id="contracType"
              value={values.type}
              name="type"
              label="Contract Type"
              onChange={handleChange}
            >
              {!!ContractType?.length &&
                ContractType.map((type, idx) => (
                  <MenuItem key={idx} value={type}>
                    {type}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </div>
        <div className="form-control-input">
          <TextField
            error={touched.contractId && Boolean(errors.contractId)}
            helperText={touched.contractId && errors.contractId}
            onChange={handleChange}
            required
            id="contractId"
            name="contractId"
            value={values.contractId}
            label="Contract ID"
            variant="outlined"
          />
        </div>
        <div className="form-control-input">
          <TextField
            error={touched.contractName && Boolean(errors.contractName)}
            helperText={touched.contractName && errors.contractName}
            onChange={handleChange}
            required
            id="contractName"
            name="contractName"
            value={values.contractName}
            label="Contract Name"
            variant="outlined"
          />
        </div>
        <div className="form-control-input">
          <TextField
            error={touched.sittingCapacity && Boolean(errors.sittingCapacity)}
            helperText={touched.sittingCapacity && errors.sittingCapacity}
            onChange={handleChange}
            required
            type="number"
            id="sittingCapacity"
            name="sittingCapacity"
            value={values.sittingCapacity}
            label="Sitting Capacity"
            variant="outlined"
          />
        </div>

        <div className="form-control-input">
          <InputLabel htmlFor="start-date">Start Date</InputLabel>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              required
              name="startDate"
              format={DATE_FORMAT}
              value={values.startDate ? moment(values.startDate) : null}
              onChange={(e) => handleDateChange(e, "startDate")}
              slotProps={{
                textField: {
                  error: touched.startDate && Boolean(errors.startDate),
                  helperText: touched.startDate && errors.startDate,
                },
              }}
            />
          </LocalizationProvider>
        </div>

        {formik.values.type === "Flat Trip Based" && (
          <>
            <div className="form-control-input">
              <TextField
                error={touched.tripRate && Boolean(errors.tripRate)}
                helperText={touched.tripRate && errors.tripRate}
                onChange={handleChange}
                type="number"
                required
                id="tripRate"
                name="tripRate"
                value={values.tripRate}
                label="Trip Rate"
                variant="outlined"
              />
            </div>

            <div className="form-control-input">
              <TextField
                error={touched.escortTripRate && Boolean(errors.escortTripRate)}
                helperText={touched.escortTripRate && errors.escortTripRate}
                onChange={handleChange}
                type="number"
                required
                id="escortTripRate"
                name="escortTripRate"
                value={values.escortTripRate}
                label="Escort Trip Rate"
                variant="outlined"
              />
            </div>
          </>
        )}

        {formik.values.type === "Zone Based" && (
          <>
            {zoneFields.map((zone, index) => (
              <div key={index} className="">
                <div className="form-control-input">
                  <TextField
                    name="zoneName"
                    value={zone.zoneName}
                    label="Zone Name"
                    onChange={(e) => handleZoneChange(index, e)}
                    required
                    variant="outlined"
                    // error={touched.zoneName && Boolean(errors.zoneName)}
                    // helperText={touched.zoneName && errors.zoneName}
                    error={
                      formik.errors.zoneFields?.[index]?.zoneName &&
                      Boolean(formik.errors.zoneFields[index].zoneName)
                    }
                    helperText={formik.errors.zoneFields?.[index]?.zoneName}
                  />
                </div>

                <div className="form-control-input">
                  <TextField
                    name="tripRate"
                    value={zone.tripRate}
                    label="Trip Rate"
                    onChange={(e) => handleZoneChange(index, e)}
                    required
                    type="number"
                    variant="outlined"
                    error={
                      formik.errors.zoneFields?.[index]?.tripRate &&
                      Boolean(formik.errors.zoneFields[index].tripRate)
                    }
                    helperText={formik.errors.zoneFields?.[index]?.tripRate}
                  />
                </div>

                <div className="form-control-input">
                  <TextField
                    name="escortTripRate"
                    value={zone.escortTripRate}
                    label="Escort Trip Rate"
                    onChange={(e) => handleZoneChange(index, e)}
                    required
                    type="number"
                    variant="outlined"
                    error={
                      formik.errors.zoneFields?.[index]?.escortTripRate &&
                      Boolean(formik.errors.zoneFields[index].escortTripRate)
                    }
                    helperText={formik.errors.zoneFields?.[index]?.escortTripRate}
                  />
                </div>
                {zoneFields.length > 1 && (
                  <IconButton
                    onClick={() => removeZoneField(index)}
                    aria-label="remove row"
                  >
                    <RemoveIcon />
                  </IconButton>
                )}
                <IconButton onClick={addZoneField} aria-label="add row">
                  <AddIcon />
                </IconButton>
              </div>
            ))}
          </>
        )}

        {formik.values.type === "Package Based" && (
          <>
            <div className="form-control-input">
              <TextField
                error={touched.totalNoOfHrs && Boolean(errors.totalNoOfHrs)}
                helperText={touched.totalNoOfHrs && errors.totalNoOfHrs}
                onChange={handleChange}
                type="number"
                required
                id="totalNoOfHrs"
                name="totalNoOfHrs"
                value={values.totalNoOfHrs}
                label="Total No Of Hrs"
                variant="outlined"
              />
            </div>

            <div className="form-control-input">
              <TextField
                id="totalNoOfKms"
                name="totalNoOfKms"
                value={values.totalNoOfKms}
                label="Total No Of Kms"
                onChange={handleChange}
                type="number"
                required
                variant="outlined"
                error={touched.totalNoOfKms && Boolean(errors.totalNoOfKms)}
                helperText={touched.totalNoOfKms && errors.totalNoOfKms}
              />
            </div>

            <div className="form-control-input">
              <TextField
                id="packageAmount"
                name="packageAmount"
                value={values.packageAmount}
                label="Package Amount"
                onChange={handleChange}
                type="number"
                required
                variant="outlined"
                error={touched.packageAmount && Boolean(errors.packageAmount)}
                helperText={touched.packageAmount && errors.packageAmount}
              />
            </div>

            <div className="form-control-input">
              <TextField
                id="extraKmRate"
                name="extraKmRate"
                value={values.extraKmRate}
                label="Extra Km Rate"
                onChange={handleChange}
                type="number"
                required
                variant="outlined"
                error={touched.extraKmRate && Boolean(errors.extraKmRate)}
                helperText={touched.extraKmRate && errors.extraKmRate}
              />
            </div>

            <div className="form-control-input">
              <TextField
                id="extraHrRate"
                name="extraHrRate"
                value={values.extraHrRate}
                label="Extra Hr Rate"
                onChange={handleChange}
                type="number"
                required
                variant="outlined"
                error={touched.extraHrRate && Boolean(errors.extraHrRate)}
                helperText={touched.extraHrRate && errors.extraHrRate}
              />
            </div>

            <div className="form-control-input">
              <TextField
                id="workingDays"
                name="workingDays"
                value={values.workingDays}
                label="Working Days"
                onChange={handleChange}
                type="number"
                required
                variant="outlined"
                error={touched.workingDays && Boolean(errors.workingDays)}
                helperText={touched.workingDays && errors.workingDays}
              />
            </div>

            <div className="form-control-input">
              <TextField
                id="minBusinessDays"
                name="minBusinessDays"
                value={values.minBusinessDays}
                label="Min Business Days"
                onChange={handleChange}
                type="number"
                required
                variant="outlined"
                error={
                  touched.minBusinessDays && Boolean(errors.minBusinessDays)
                }
                helperText={touched.minBusinessDays && errors.minBusinessDays}
              />
            </div>

            <div className="form-control-input">
              <TextField
                id="adjustmentDays"
                name="adjustmentDays"
                value={values.adjustmentDays}
                label="Adjustment Days"
                onChange={handleChange}
                type="number"
                required
                variant="outlined"
                error={touched.adjustmentDays && Boolean(errors.adjustmentDays)}
                helperText={touched.adjustmentDays && errors.adjustmentDays}
              />
            </div>

            <div>
              <div className="form-control-input" style={{}}>
                <FormControl required>
                  <FormLabel id="proDate-Label">Pro Date</FormLabel>
                  <RadioGroup
                    style={{ flexDirection: "row" }}
                    aria-labelledby="proDate-label"
                    value={values.proDate}
                    error={touched.proDate && Boolean(errors.proDate)}
                    name="proDate"
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value={"Yes"}
                      onChange={handleChange}
                      control={<Radio />}
                      label={"Yes"}
                    />
                    <FormControlLabel
                      value={"No"}
                      onChange={handleChange}
                      control={<Radio />}
                      label={"No"}
                    />
                  </RadioGroup>
                  {touched.proDate && errors.proDate && (
                    <FormHelperText
                      className="errorHelperText"
                      style={{ color: "#d32f2f" }}
                    >
                      {errors.proDate}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
            </div>
          </>
        )}

        {formik.values.type === "Trip Slab Based" && (
          <>
            {tripSlabFields.map((tripSlab, index) => (
              <div key={index} className="">
                <div className="form-control-input">
                  <TextField
                    name="startKm"
                    value={tripSlab.startKm}
                    label="Start Km"
                    onChange={(e) => handleTripSlabChange(index, e)}
                    required
                    type="number"
                    variant="outlined"
                    error={
                      formik.errors.tripSlabFields?.[index]?.startKm &&
                      Boolean(formik.errors.tripSlabFields[index].startKm)
                    }
                    helperText={formik.errors.tripSlabFields?.[index]?.startKm}
                  />
                </div>

                <div className="form-control-input">
                  <TextField
                    name="endKm"
                    value={tripSlab.endKm}
                    label="End Km"
                    onChange={(e) => handleTripSlabChange(index, e)}
                    required={index !== tripSlabFields.length - 1}
                    type="number"
                    variant="outlined"
                    disabled={index === tripSlabFields.length - 1}
                    error={
                      formik.errors.tripSlabFields?.[index]?.endKm &&
                      Boolean(formik.errors.tripSlabFields[index].endKm)
                    }
                    helperText={formik.errors.tripSlabFields?.[index]?.endKm}
                  />
                </div>

                <div className="form-control-input">
                  <TextField
                    name="rate"
                    value={tripSlab.rate}
                    label="Rate"
                    onChange={(e) => handleTripSlabChange(index, e)}
                    required
                    type="number"
                    variant="outlined"
                    error={
                      formik.errors.tripSlabFields?.[index]?.rate &&
                      Boolean(formik.errors.tripSlabFields[index].rate)
                    }
                    helperText={formik.errors.tripSlabFields?.[index]?.rate}
                  />
                </div>
                {tripSlabFields.length > 1 && (
                  <IconButton
                    onClick={() => removeTripSlabField(index)}
                    aria-label="remove row"
                  >
                    <RemoveIcon />
                  </IconButton>
                )}
                <IconButton onClick={addTripSlabField} aria-label="add row">
                  <AddIcon />
                </IconButton>
              </div>
            ))}
          </>
        )}

        {formik.values.type === "KM Based" && (
          <>
            <div className="form-control-input">
              <TextField
                error={touched.kmTripRate && Boolean(errors.kmTripRate)}
                helperText={touched.kmTripRate && errors.kmTripRate}
                onChange={handleChange}
                type="number"
                required
                id="kmTripRate"
                name="kmTripRate"
                value={values.kmTripRate}
                label="Km Trip Rate"
                variant="outlined"
              />
            </div>
          </>
        )}

        <div className="addBtnContainer">
          <div>
            <button onClick={handleReset} className="btn btn-secondary">
              Reset
            </button>
          </div>
          <div>
            <button
              onClick={() => SetIsAddContract(false)}
              className="btn btn-secondary"
            >
              Back
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-primary"
            >
              {EditContractData?.id ? "Update" : "Create"} Contract
            </button>
          </div>
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

export default AddContract;


