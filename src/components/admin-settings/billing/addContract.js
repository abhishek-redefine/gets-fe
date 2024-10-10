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
import OfficeService from "@/services/office.service";
import { getFormattedLabel } from "@/utils/utils";
import ContractService from "@/services/contract.service";

export const validationSchema = yup.object({
  officeId: yup.string("Select Office Id").required("Select Office Id"),
  contractId: yup.string("Enter Contract Id").required("Enter Contract Id"),
  contractName: yup
    .string("Enter Contract Name")
    .required("Enter Contract Name"),
  startDate: yup.date("Enter Start Date").required("Enter Start Date"),
  // endDate: yup.date("Enter End Date").required("Enter End Date"),
  // vehicleAcOption: yup
  //   .string("Select Vehicle AC Option")
  //   .required("Select Vehicle AC Option"),
  // fuelType: yup.string("Select Fuel Type").required("Select Fuel Type"),
  // workingShift: yup
  //   .string("Select Working Shift")
  //   .required("Select Working Shift"),
  // ageCriteria: yup.number("Enter Age Criteria").required("Enter Age Criteria"),
  // vehicleType: yup
  //   .string("Select Vehicle Type")
  //   .required("Select Vehicle Type"),
  sittingCapacity: yup
    .number("Enter Sitting Capacity")
    .required("Enter Sitting Capacity"),
  tripRate: yup.number("Enter Trip Rate").required("Enter Trip Rate"),
  escortTripRate: yup
    .number("Enter Escort Trip Rate")
    .required("Enter Escort Trip Rate"),
  totalNoOfKms: yup
    .number("Enter Total No Of Kms")
    .required("Enter Total No Of Kms"),
  totalNoOfHrs: yup
    .number("Enter Total No Of Hrs")
    .required("Enter Total No Of Hrs"),
  // packageType: yup
  //   .string("Select Package Type")
  //   .required("Select Package Type"),
  packageAmount: yup
    .number("Enter Package Amount")
    .required("Enter Package Amount"),
  extraKmRate: yup
    .number("Enter Extra Km Rate")
    .required("Enter Extra Km Rate"),
  extraHrRate: yup
    .number("Enter Extra Hr Rate")
    .required("Enter Extra Hr Rate"),
  workingDays: yup.number("Enter Working Days").required("Enter Working Days"),
  minBusinessDays: yup
    .number("Enter Min. Business Days")
    .required("Enter Min. Business Days"),
  adjustmentDays: yup
    .number("Enter Adjustment Days")
    .required("Enter Adjustment Days"),
  proDate: yup.string("Select Pro Date").required("Select Pro Date"),
  kmTripRate: yup.number("Enter Per Km Rate").required("Enter Per Km Rate"),
  // emptyDistanceApproval: yup
  //   .string("Select Empty Distance Approval")
  //   .required("Select Empty Distance Approval"),

  zoneFields: yup.array().of(
    yup.object().shape({
      zoneName: yup.string("Enter Zone Name").required("Enter Zone Name"),
      tripRate: yup.number("Enter Trip Rate").required("Enter Trip Rate"),
      escortTripRate: yup
        .number("Enter Escort Trip Rate")
        .required("Enter Escort Trip Rate"),
    })
  ),

  tripSlabFields: yup.array().of(
    yup.object().shape({
      startKm: yup.number("Enter Start Km").required("Enter Start Km"),
      // endKm: yup.string("Enter End Km").required("Enter End Km"),
      tripRate: yup.number("Enter Rate").required("Enter Rate"),
    })
  ),
});

const AddContract = ({ EditContractData, onUserSuccess }) => {
  const [initialValues, setInitialValues] = useState({
    contractType: "FLAT_TRIP_BASED",
    officeId: "",
    contractId: "",
    contractName: "",
    startDate: "",
    // endDate: "",
    // vehicleAcOption: null,
    // fuelType: null,
    // workingShift: "",
    // ageCriteria: "",
    // vehicleType: "",
    sittingCapacity: "",
    tripRate: "",
    escortTripRate: "",
    zoneFields: [{ zoneName: "", tripRate: "", escortTripRate: "" }],
    totalNoOfHrs: "",
    totalNoOfKms: "",
    // packageType: "",
    packageAmount: "",
    extraKmRate: "",
    extraHrRate: "",
    workingDays: "",
    minBusinessDays: "",
    adjustmentDays: "",
    proDate: null,
    tripSlabFields: [{ startKm: "", endKm: "", tripRate: "" }],
    kmTripRate: "",
    // emptyDistanceApproval: null,
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState({});

  const ContractType = [
    "FLAT_TRIP_BASED",
    "ZONE_BASED",
    "PACKAGE_BASED",
    "TRIP_SLAB_BASED",
    "KM_BASED",
  ];

  const WorkingShift = ["Day", "Night", "Flexible"];

  const VehicleType = ["Cab", "Shuttle", "Bus"];

  const PackageType = ["Full", "Minimum Billable Days", "Prorate Days"];

  useState(() => {
    console.log("EditContractData?.id>>>", EditContractData?.id);
    if (EditContractData?.id) {
      let newEditInfo = Object.assign(initialValues, EditContractData);
      // console.log("newEditInfo>>>", newEditInfo);
      setInitialValues(newEditInfo);
    }
  }, [EditContractData]);

  const handleResetField = () => {
    handleReset();
    initialValues.contractType = values.contractType;
    formik.setFieldValue("zoneFields", [
      { zoneName: "", tripRate: "", escortTripRate: "" },
    ]);
    formik.setFieldValue("tripSlabFields", [
      { startKm: "", endKm: "", tripRate: "" },
    ]);
    console.log(initialValues);
  };

  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: validationSchema,
    onSubmit: async (values) => {
      // console.log("validationSchema>>>", validationSchema);
      console.log("values>>>", values);
      let allValues = { ...values };
      allValues.tripSlabFields = allValues.tripSlabFields
        .map((slab, index) => {
          let { startKm, endKm, tripRate } = slab;

          if (index === allValues.tripSlabFields.length - 1 && endKm === "") {
            const { endKm, ...slabWithoutEndKm } = slab;
            return slabWithoutEndKm;
          }

          return slab;
        })
        .filter((slab) => slab.startKm !== "" && slab.tripRate !== "");
      console.log("allValues>>>", allValues);
      if (allValues.proDate) {
        allValues.proDate = allValues.proDate === "true" ? "true" : "false";
      }
      Object.keys(allValues).forEach((objKey) => {
        if (allValues[objKey] === null || allValues[objKey] === "") {
          delete allValues[objKey];
        }
      });
      try {
        const payload = {
          contractId: allValues.contractId,
          contractName: allValues.contractName,
          startDate: allValues.startDate,
          sittingCapacity: allValues.sittingCapacity,
        };

        if (allValues.contractType === "FLAT_TRIP_BASED") {
          payload.contractType = "FLAT_TRIP_BASED";
          payload.tripRate = allValues.tripRate;
          payload.escortTripRate = allValues.escortTripRate;
        } else if (allValues.contractType === "ZONE_BASED") {
          payload.contractType = "ZONE_BASED";
          payload.zoneBasedContractDTOs = allValues.zoneFields;
        } else if (allValues.contractType === "PACKAGE_BASED") {
          payload.contractType = "PACKAGE_BASED";
          payload.totalNoOfHrs = allValues.totalNoOfHrs;
          payload.totalNoOfKms = allValues.totalNoOfKms;
          payload.packageAmount = allValues.packageAmount;
          payload.extraKmRate = allValues.extraKmRate;
          payload.extraHrRate = allValues.extraHrRate;
          payload.workingDays = allValues.workingDays;
          payload.minBusinessDays = allValues.minBusinessDays;
          payload.adjustmentDays = allValues.adjustmentDays;
          payload.proDate = allValues.proDate;
        } else if (allValues.contractType === "TRIP_SLAB_BASED") {
          payload.contractType = "TRIP_SLAB_BASED";
          payload.slabBasedContractDTOs = allValues.tripSlabFields.map(
            (slab) => ({
              startKm: parseInt(slab.startKm, 10),
              endKm:
                slab.endKm !== undefined ? parseInt(slab.endKm, 10) : undefined,
              tripRate: parseInt(slab.tripRate, 10),
            })
          );
        } else if (allValues.contractType === "KM_BASED") {
          payload.contractType = "KM_BASED";
          payload.kmTripRate = allValues.kmTripRate;
        }
        if (initialValues?.id) {
          console.log("initialValues.id>>>", initialValues.id);
          setLoading(true);
          // await new Promise((resolve) => setTimeout(resolve, 5000));
          const response = await ContractService.UpdateContract(
            initialValues.id,
            payload
          );
          if (response.status === 200) {
            dispatch(
              toggleToast({
                message: "Contract details updated successfully!",
                type: "success",
              })
            );
          } else if (response.status === 500) {
            dispatch(
              toggleToast({
                message:
                  "Contract details not updated. Please try again later!",
                type: "error",
              })
            );
          }
        } else {
          setLoading(true);
          // await new Promise((resolve) => setTimeout(resolve, 5000));
          const response = await ContractService.CreateContract(payload);
          if (response.status === 201) {
            dispatch(
              toggleToast({
                message: "Contract details added successfully!",
                type: "success",
              })
            );
          } else if (response.status === 500) {
            dispatch(
              toggleToast({
                message: "Contract details not added. Please try again later!",
                type: "error",
              })
            );
          }
        }
        onUserSuccess(true);
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
  const [office, setOffice] = useState([]);
  const fetchAllOffices = async () => {
    try {
      const response = await OfficeService.getAllOffices();
      const { data } = response || {};
      const { clientOfficeDTO } = data || {};
      setOffice(clientOfficeDTO);
    } catch (e) {}
  };

  const handleDateChange = (date, name) => {
    const selectedDate =
      date && moment(date).isValid() ? moment(date).format(DATE_FORMAT) : "";
    formik.setFieldValue(name, selectedDate);
  };

  const handleZoneChange = (index, event) => {
    const { name, value } = event.target;
    const updatedZones = [...formik.values.zoneFields];
    updatedZones[index][name] = value;
    formik.setFieldValue("zoneFields", updatedZones);
  };

  const addZoneField = () => {
    formik.setFieldValue("zoneFields", [
      ...formik.values.zoneFields,
      { zoneName: "", tripRate: "", escortTripRate: "" },
    ]);
  };

  const removeZoneField = (index) => {
    const updatedZones = formik.values.zoneFields.filter((_, i) => i !== index);
    formik.setFieldValue("zoneFields", updatedZones);
  };

  const handleTripSlabChange = (index, event) => {
    const { name, value } = event.target;
    const updatedTripSlab = [...formik.values.tripSlabFields];
    updatedTripSlab[index][name] = value;
    formik.setFieldValue("tripSlabFields", updatedTripSlab);
  };

  const addTripSlabField = () => {
    formik.setFieldValue("tripSlabFields", [
      ...formik.values.tripSlabFields,
      { startKm: "", endKm: "", tripRate: "" },
    ]);
  };

  const removeTripSlabField = (index) => {
    const updatedTripSlab = formik.values.tripSlabFields.filter(
      (_, i) => i !== index
    );
    formik.setFieldValue("tripSlabFields", updatedTripSlab);
  };

  const handleSubmitForm = async () => {
    let hasError = false;
    const newError = {};

    Object.entries(values).forEach(([key, value]) => {
      console.log("values: ", values, key, value)
      if (!value) {
        newError[key] = `This field is mandatory.`;
        hasError = true;
      }
    });

    setError(newError);

    if (!hasError) {
      handleSubmit();
      console.log("Form submitted", values);
    }
  };

  useEffect(() => {
    fetchAllOffices();
  }, []);

  useEffect(() => {
    if (!EditContractData) {
      formik.resetForm({
        values: {
          type: values.type,
          officeId: "",
          contractId: "",
          contractName: "",
          // endDate: "",
          startDate: "",
          // vehicleAcOption: null,
          // fuelType: null,
          // workingShift: "",
          // ageCriteria: "",
          // vehicleType: "",
          sittingCapacity: "",
          tripRate: "",
          escortTripRate: "",
          zoneFields: [{ zoneName: "", tripRate: "", escortTripRate: "" }],
          totalNoOfHrs: "",
          totalNoOfKms: "",
          // packageType: "",
          packageAmount: "",
          extraKmRate: "",
          extraHrRate: "",
          workingDays: "",
          minBusinessDays: "",
          adjustmentDays: "",
          proDate: null,
          tripSlabFields: [{ startKm: "", endKm: "", tripRate: "" }],
          kmTripRate: "",
          // emptyDistanceApproval: null,
        },
      });
    }
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
              labelId="contractTypeLabel"
              id="contracType"
              value={values.contractType}
              name="contractType"
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
        {/* <div className="form-control-input">
          <FormControl required>
            <InputLabel id="office-id-label">Office ID</InputLabel>
            <Select
              labelId="office-id-label"
              id="officeId"
              value={values.officeId}
              error={touched.officeId && Boolean(errors.officeId)}
              name="officeId"
              label="Office ID"
              // multiple
              onChange={handleChange}
            >
              {!!office?.length &&
                office.map((office, idx) => (
                  <MenuItem key={idx} value={office.officeId}>
                    {getFormattedLabel(office.officeId)}, {office.address}
                  </MenuItem>
                ))}
            </Select>
            {touched.officeId && errors.officeId && (
              <FormHelperText
                className="errorHelperText"
                style={{ color: "#d32f2f" }}
              >
                {errors.officeId}
              </FormHelperText>
            )}
          </FormControl>
        </div> */}
        <div className="form-control-input">
          <TextField
            // error={touched.contractId && Boolean(errors.contractId)}
            // helperText={touched.contractId && errors.contractId}
            onChange={handleChange}
            required
            id="contractId"
            name="contractId"
            value={values.contractId}
            label="Contract ID"
            variant="outlined"
            error={!!error.contractId}
            helperText={error.contractId}
          />
        </div>
        <div className="form-control-input">
          <TextField
            // error={touched.contractName && Boolean(errors.contractName)}
            // helperText={touched.contractName && errors.contractName}
            onChange={handleChange}
            required
            id="contractName"
            name="contractName"
            value={values.contractName}
            label="Contract Name"
            variant="outlined"
            error={!!error.contractName}
            helperText={error.contractName}
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
                  // error: touched.startDate && Boolean(errors.startDate),
                  // helperText: touched.startDate && errors.startDate,
                  error: Boolean(error.startDate),
                  helperText: error.startDate,
                },
              }}
            />
          </LocalizationProvider>
        </div>
        {/* <div className="form-control-input">
          <InputLabel htmlFor="end-date">End Date</InputLabel>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DatePicker
              required
              name="endDate"
              format={DATE_FORMAT}
              value={values.endDate ? moment(values.endDate) : null}
              onChange={(e) => handleDateChange(e, "endDate")}
              slotProps={{
                textField: {
                  error: touched.endDate && Boolean(errors.endDate),
                  helperText: touched.endDate && errors.endDate,
                },
              }}
            />
          </LocalizationProvider>
        </div> */}
        {/* <div>
          <div className="form-control-input" style={{}}>
            <FormControl required>
              <FormLabel id="vehicle-ac-option-Label">
                Vehicle AC Option
              </FormLabel>
              <RadioGroup
                style={{ flexDirection: "row" }}
                aria-labelledby="vehicle-ac-option-label"
                value={values.vehicleAcOption}
                error={
                  touched.vehicleAcOption && Boolean(errors.vehicleAcOption)
                }
                name="vehicleAcOption"
                onChange={handleChange}
              >
                <FormControlLabel
                  value={"AC"}
                  onChange={handleChange}
                  control={<Radio />}
                  label={"AC"}
                />
                <FormControlLabel
                  value={"Non AC"}
                  onChange={handleChange}
                  control={<Radio />}
                  label={"Non AC"}
                />
              </RadioGroup>
              {touched.vehicleAcOption && errors.vehicleAcOption && (
                <FormHelperText
                  className="errorHelperText"
                  style={{ color: "#d32f2f" }}
                >
                  {errors.vehicleAcOption}
                </FormHelperText>
              )}
            </FormControl>
          </div>
        </div>
        <div>
          <div className="form-control-input" style={{}}>
            <FormControl required>
              <FormLabel id="fuel-type-Label">Fuel Type</FormLabel>
              <RadioGroup
                style={{ flexDirection: "row" }}
                aria-labelledby="fuel-type-label"
                value={values.fuelType}
                error={touched.fuelType && Boolean(errors.fuelType)}
                name="fuelType"
                onChange={handleChange}
              >
                <FormControlLabel
                  value={"CNG"}
                  onChange={handleChange}
                  control={<Radio />}
                  label={"CNG"}
                />
                <FormControlLabel
                  value={"Petrol"}
                  onChange={handleChange}
                  control={<Radio />}
                  label={"Petrol"}
                />
                <FormControlLabel
                  value={"Diesel"}
                  onChange={handleChange}
                  control={<Radio />}
                  label={"Diesel"}
                />
              </RadioGroup>
              {touched.fuelType && errors.fuelType && (
                <FormHelperText
                  className="errorHelperText"
                  style={{ color: "#d32f2f" }}
                >
                  {errors.fuelType}
                </FormHelperText>
              )}
            </FormControl>
          </div>
        </div> */}
        {/* {formik.values.type !== "KM_BASED" && (
          <div className="form-control-input">
            <FormControl required fullWidth>
              <InputLabel id="working-shift-Label">Working Shift</InputLabel>
              <Select
                labelId="working-shift-Label"
                id="workingShift"
                value={values.workingShift}
                name="workingShift"
                label="Working Shift"
                onChange={handleChange}
                error={touched.workingShift && Boolean(errors.workingShift)}
              >
                {!!WorkingShift?.length &&
                  WorkingShift.map((type, idx) => (
                    <MenuItem key={idx} value={type}>
                      {type}
                    </MenuItem>
                  ))}
              </Select>
              {touched.workingShift && errors.workingShift && (
                <FormHelperText
                  className="errorHelperText"
                  style={{ color: "#d32f2f" }}
                >
                  {errors.workingShift}
                </FormHelperText>
              )}
            </FormControl>
          </div>
        )} */}
        {/* <div className="form-control-input">
          <TextField
            error={touched.ageCriteria && Boolean(errors.ageCriteria)}
            helperText={touched.ageCriteria && errors.ageCriteria}
            onChange={handleChange}
            required
            id="ageCriteria"
            name="ageCriteria"
            value={values.ageCriteria}
            label="Age Criteria (above)"
            variant="outlined"
            type="number"
          />
        </div> */}
        {/* <div className="form-control-input">
          <FormControl required fullWidth>
            <InputLabel id="vehicle-type-Label">Vehicle Type</InputLabel>
            <Select
              labelId="vehicle-type-Label"
              id="vehicleType"
              value={values.vehicleType}
              name="vehicleType"
              label="Vehicle Type"
              onChange={handleChange}
              error={touched.vehicleType && Boolean(errors.vehicleType)}
            >
              {!!VehicleType?.length &&
                VehicleType.map((type, idx) => (
                  <MenuItem key={idx} value={type}>
                    {type}
                  </MenuItem>
                ))}
            </Select>
            {touched.vehicleType && errors.vehicleType && (
              <FormHelperText
                className="errorHelperText"
                style={{ color: "#d32f2f" }}
              >
                {errors.vehicleType}
              </FormHelperText>
            )}
          </FormControl>
        </div> */}
        <div className="form-control-input">
          <TextField
            // error={touched.sittingCapacity && Boolean(errors.sittingCapacity)}
            // helperText={touched.sittingCapacity && errors.sittingCapacity}
            onChange={handleChange}
            required
            type="number"
            id="sittingCapacity"
            name="sittingCapacity"
            value={values.sittingCapacity}
            label="Sitting Capacity"
            variant="outlined"
            error={!!error.sittingCapacity}
            helperText={error.sittingCapacity}
          />
        </div>

        {formik.values.contractType === "FLAT_TRIP_BASED" && (
          <>
            <div className="form-control-input">
              <TextField
                // error={touched.tripRate && Boolean(errors.tripRate)}
                // helperText={touched.tripRate && errors.tripRate}
                onChange={handleChange}
                type="number"
                required
                id="tripRate"
                name="tripRate"
                value={values.tripRate}
                label="Trip Rate"
                variant="outlined"
                error={!!error.tripRate}
                helperText={error.tripRate}
              />
            </div>

            <div className="form-control-input">
              <TextField
                // error={touched.escortTripRate && Boolean(errors.escortTripRate)}
                // helperText={touched.escortTripRate && errors.escortTripRate}
                onChange={handleChange}
                type="number"
                required
                id="escortTripRate"
                name="escortTripRate"
                value={values.escortTripRate}
                label="Escort Trip Rate"
                variant="outlined"
                error={!!error.escortTripRate}
                helperText={error.escortTripRate}
              />
            </div>
          </>
        )}

        {formik.values.contractType === "ZONE_BASED" && (
          <>
            {formik.values.zoneFields.map((zone, index) => (
              <div key={index} className="">
                <div className="form-control-input">
                  <TextField
                    name="zoneName"
                    value={zone.zoneName}
                    label="Zone Name"
                    onChange={(e) => handleZoneChange(index, e)}
                    required
                    variant="outlined"
                    // error={
                    //   formik.errors.zoneFields?.[index]?.zoneName &&
                    //   Boolean(formik.errors.zoneFields[index].zoneName)
                    // }
                    // helperText={formik.errors.zoneFields?.[index]?.zoneName}
                    error={!!error.zoneFields?.[index]?.zoneName}
                    helperText={error.zoneFields?.[index]?.zoneName}
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
                    // error={
                    //   formik.errors.zoneFields?.[index]?.tripRate &&
                    //   Boolean(formik.errors.zoneFields[index].tripRate)
                    // }
                    // helperText={formik.errors.zoneFields?.[index]?.tripRate}
                    error={!!error.zoneFields?.[index]?.tripRate}
                    helperText={error.zoneFields?.[index]?.tripRate}
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
                    // error={
                    //   formik.errors.zoneFields?.[index]?.escortTripRate &&
                    //   Boolean(formik.errors.zoneFields[index].escortTripRate)
                    // }
                    // helperText={
                    //   formik.errors.zoneFields?.[index]?.escortTripRate
                    // }
                    error={!!error.zoneFields?.[index]?.escortTripRate}
                    helperText={error.zoneFields?.[index]?.escortTripRate}
                  />
                </div>
                {formik.values.zoneFields.length > 1 && (
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

        {formik.values.contractType === "PACKAGE_BASED" && (
          <>
            {/* <div className="form-control-input">
              <FormControl required fullWidth>
                <InputLabel id="package-type-Label">Package Type</InputLabel>
                <Select
                  labelId="package-type-Label"
                  id="packageType"
                  value={values.packageType}
                  name="packageType"
                  label="Package Type"
                  onChange={handleChange}
                  error={touched.packageType && Boolean(errors.packageType)}
                >
                  {!!PackageType?.length &&
                    PackageType.map((type, idx) => (
                      <MenuItem key={idx} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                </Select>
                {touched.packageType && errors.packageType && (
                  <FormHelperText
                    className="errorHelperText"
                    style={{ color: "#d32f2f" }}
                  >
                    {errors.packageType}
                  </FormHelperText>
                )}
              </FormControl>
            </div> */}

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
                // error={touched.packageAmount && Boolean(errors.packageAmount)}
                // helperText={touched.packageAmount && errors.packageAmount}
                error={!!error.packageAmount}
                helperText={error.packageAmount}
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
                // error={touched.totalNoOfKms && Boolean(errors.totalNoOfKms)}
                // helperText={touched.totalNoOfKms && errors.totalNoOfKms}
                error={!!error.totalNoOfKms}
                helperText={error.totalNoOfKms}
              />
            </div>

            <div className="form-control-input">
              <TextField
                // error={touched.totalNoOfHrs && Boolean(errors.totalNoOfHrs)}
                // helperText={touched.totalNoOfHrs && errors.totalNoOfHrs}
                onChange={handleChange}
                type="number"
                required
                id="totalNoOfHrs"
                name="totalNoOfHrs"
                value={values.totalNoOfHrs}
                label="Total No Of Hours"
                variant="outlined"
                error={!!error.totalNoOfHrs}
                helperText={error.totalNoOfHrs}
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
                // error={touched.workingDays && Boolean(errors.workingDays)}
                // helperText={touched.workingDays && errors.workingDays}
                error={!!error.workingDays}
                helperText={error.workingDays}
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
                // error={touched.extraKmRate && Boolean(errors.extraKmRate)}
                // helperText={touched.extraKmRate && errors.extraKmRate}
                error={!!error.extraKmRate}
                helperText={error.extraKmRate}
              />
            </div>

            <div className="form-control-input">
              <TextField
                id="extraHrRate"
                name="extraHrRate"
                value={values.extraHrRate}
                label="Extra Hrs Rate"
                onChange={handleChange}
                type="number"
                required
                variant="outlined"
                // error={touched.extraHrRate && Boolean(errors.extraHrRate)}
                // helperText={touched.extraHrRate && errors.extraHrRate}
                error={!!error.extraHrRate}
                helperText={error.extraHrRate}
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
                // error={
                //   touched.minBusinessDays && Boolean(errors.minBusinessDays)
                // }
                // helperText={touched.minBusinessDays && errors.minBusinessDays}
                error={!!error.minBusinessDays}
                helperText={error.minBusinessDays}
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
                // error={touched.adjustmentDays && Boolean(errors.adjustmentDays)}
                // helperText={touched.adjustmentDays && errors.adjustmentDays}
                error={!!error.adjustmentDays}
                helperText={error.adjustmentDays}
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
                    // error={touched.proDate && Boolean(errors.proDate)}
                    error={!!error.proDate}
                    name="proDate"
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value={"true"}
                      onChange={handleChange}
                      control={<Radio />}
                      label={"Yes"}
                    />
                    <FormControlLabel
                      value={"false"}
                      onChange={handleChange}
                      control={<Radio />}
                      label={"No"}
                    />
                  </RadioGroup>
                  {/* {touched.proDate && errors.proDate && (
                    <FormHelperText
                      className="errorHelperText"
                      style={{ color: "#d32f2f" }}
                    >
                      {errors.proDate}
                    </FormHelperText>
                  )} */}
                  {error.proDate && (
                    <FormHelperText
                      className="errorHelperText"
                      style={{ color: "#d32f2f" }}
                    >
                      {error.proDate}
                    </FormHelperText>
                  )}
                </FormControl>
              </div>
            </div>
          </>
        )}

        {formik.values.contractType === "TRIP_SLAB_BASED" && (
          <>
            {formik.values.tripSlabFields.map((tripSlab, index) => (
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
                    // error={
                    //   formik.errors.tripSlabFields?.[index]?.startKm &&
                    //   Boolean(formik.errors.tripSlabFields[index].startKm)
                    // }
                    // helperText={formik.errors.tripSlabFields?.[index]?.startKm}
                    error={!!error.tripSlabFields?.[index]?.startKm}
                    helperText={error.tripSlabFields?.[index]?.startKm}
                  />
                </div>

                <div className="form-control-input">
                  <TextField
                    name="endKm"
                    value={tripSlab.endKm}
                    label="End Km"
                    onChange={(e) => handleTripSlabChange(index, e)}
                    required={index !== values.tripSlabFields.length - 1}
                    type="number"
                    variant="outlined"
                    disabled={index === values.tripSlabFields.length - 1}
                    // error={
                    //   formik.errors.tripSlabFields?.[index]?.endKm &&
                    //   Boolean(formik.errors.tripSlabFields[index].endKm)
                    // }
                    // helperText={formik.errors.tripSlabFields?.[index]?.endKm}
                  />
                </div>

                <div className="form-control-input">
                  <TextField
                    name="tripRate"
                    value={tripSlab.tripRate}
                    label="Trip Rate"
                    onChange={(e) => handleTripSlabChange(index, e)}
                    required
                    type="number"
                    variant="outlined"
                    // error={
                    //   formik.errors.tripSlabFields?.[index]?.tripRate &&
                    //   Boolean(formik.errors.tripSlabFields[index].tripRate)
                    // }
                    // helperText={formik.errors.tripSlabFields?.[index]?.tripRate}
                    error={!!error.tripSlabFields?.[index]?.tripRate}
                    helperText={error.tripSlabFields?.[index]?.tripRate}
                  />
                </div>
                {formik.values.tripSlabFields.length > 1 && (
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

        {formik.values.contractType === "KM_BASED" && (
          <>
            <div className="form-control-input">
              <TextField
                // error={touched.kmTripRate && Boolean(errors.kmTripRate)}
                // helperText={touched.kmTripRate && errors.kmTripRate}
                onChange={handleChange}
                type="number"
                required
                id="kmTripRate"
                name="kmTripRate"
                value={values.kmTripRate}
                label="Per Km Rate"
                variant="outlined"
                error={!!error.kmTripRate}
                helperText={error.kmTripRate}
              />
            </div>
          </>
        )}

        {/* <div>
          <div className="form-control-input" style={{}}>
            <FormControl required>
              <FormLabel id="empty-distance-approval-Label">
                Empty Distance Approval
              </FormLabel>
              <RadioGroup
                style={{ flexDirection: "row" }}
                aria-labelledby="empty-distance-approval-label"
                value={values.emptyDistanceApproval}
                error={
                  touched.emptyDistanceApproval &&
                  Boolean(errors.emptyDistanceApproval)
                }
                name="emptyDistanceApproval"
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
              {touched.emptyDistanceApproval &&
                errors.emptyDistanceApproval && (
                  <FormHelperText
                    className="errorHelperText"
                    style={{ color: "#d32f2f" }}
                  >
                    {errors.emptyDistanceApproval}
                  </FormHelperText>
                )}
            </FormControl>
          </div>
        </div> */}

        <div className="addBtnContainer">
          <div>
            <button onClick={handleResetField} className="btn btn-secondary">
              Reset
            </button>
          </div>
          <div>
            <button onClick={onUserSuccess} className="btn btn-secondary">
              Back
            </button>
            <button
              type="submit"
              onClick={handleSubmitForm}
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
