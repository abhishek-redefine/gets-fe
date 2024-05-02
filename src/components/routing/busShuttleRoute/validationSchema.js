import * as yup from "yup";
export const validationSchemaBus = yup.object({
  name: yup.string("Enter Bus Route Name").required("Enter Area Name"),
  officeId: yup.string("Select Office").required("Select Office"),
});

export const validationSchemaShuttle = yup.object({
  name: yup.string("Enter Shuttle Route Name").required("Enter Area Name"),
  officeId: yup.string("Select Office").required("Select Office"),
});
