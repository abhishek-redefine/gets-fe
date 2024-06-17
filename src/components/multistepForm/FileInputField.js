import React, { useEffect, useState } from "react";
import { useField, useFormikContext } from "formik";
// import { MuiFileInput } from "mui-file-input";
// import AttachFileIcon from "@mui/icons-material/AttachFile";
import { FormHelperText } from "@mui/material";

const FileInputField = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const { setFieldValue } = useFormikContext();
  useEffect(() => {
    if (props.fileName) {
      console.log(props.fileName);
      setFieldValue(field.name, props.fileName);
    }
  }, []);
  return (
    <div className="form-control-input">
      <FormHelperText className="labelHelperText">{label}</FormHelperText>
      <div className="compliance-div">
        <input
          className="compliance-upload"
          type="file"
          {...props}
          accept=".jpeg, .pdf"
          onChange={(event) => {
            const file = event.target.files[0];
            console.log(file);
            if (file) {
              // Check if file size is greater than 2MB
              if (file.size > 2 * 1024 * 1024) {
                // Display error or handle as needed
                alert("File size exceeds 2MB limit.");
                field.name = null;
                setFieldValue(field.name, null);
                props.filledValue(field.name, null);
              } else {
                // File size is within limit, proceed with setting field value
                setFieldValue(field.name, file);
                props.filledValue(file);
              }
            }
          }}
        />
      </div>
      {/* <MuiFileInput
        {...field}
        {...props}
        size="small"
        variant="outlined"
        InputProps={{
          inputProps: {
            accept: ".jpeg, .pdf",
          },
          endAdornment: <AttachFileIcon />,
        }}
        onChange={(file) => {
          console.log(file);
          if (file) {
            // Check if file size is greater than 2MB
            if (file.size > 2 * 1024 * 1024) {
              // Display error or handle as needed
              alert("File size exceeds 2MB limit.");
              setFieldValue(field.name, null);
              props.filledValue(field.name, null);
            } else {
              // File size is within limit, proceed with setting field value
              setFieldValue(field.name, file);
              props.filledValue(file);
            }
          }
        }}
        // onChange={(file) => setFieldValue(field.name, file)}
        onError={meta.touched && Boolean(meta.error)}
      /> */}
      <FormHelperText className="errorHelperText">
        File size should be less than 2 MB
      </FormHelperText>
      {meta.touched && meta.error && (
        <FormHelperText className="errorHelperText">
          {meta.error}
        </FormHelperText>
      )}
    </div>
  );
};

export default FileInputField;
