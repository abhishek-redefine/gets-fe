import React, { useState } from "react";
import { Input as BaseInput } from "@mui/base/Input";
import { styled } from "@mui/system";
import { TextField } from "@mui/icons-material";

const RemarkModal = (props) => {
  const { onClose, onSubmit } = props;
  const [remark, setRemark] = useState("");
  const [error, setError] = useState(false);

  const onSubmitHandler = () => {
    if (remark === "") {
      setError(true);
      return;
    }
    setError(false);
    onSubmit(remark);
  };

  const onCancelHandler = () => {
    onClose();
  };

  return (
    <div style={{ height: "100%", width: "100%", padding: 24 }}>
      <h4 style={{ marginBottom: 15 }}>Enter remark before confirmation</h4>
      <input
        className="form-control-remark"
        style={{ width: "100%", marginBottom: 10 }}
        value={remark}
        aria-multiline="true"
        aria-label="Demo input"
        onChange={(e) => setRemark(e.target.value)}
        placeholder="Remark*"
      />
      {error && (
        <p className="errorHelperText" style={{ padding: "0 0 0 5px" }}>
          Remark should not be empty
        </p>
      )}
      <div
        style={{ display: "flex", justifyContent: "end" }}
        className="btnContainer"
      >
        <button
          className="btn btn-secondary filterApplyBtn"
          style={{ marginRight: 15 }}
          onClick={onCancelHandler}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary filterApplyBtn"
          style={{ margin: 0 }}
          onClick={() => onSubmitHandler()}
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default RemarkModal;
