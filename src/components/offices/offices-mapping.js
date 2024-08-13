import React, { useEffect, useState } from "react";
import Grid from "../grid";
import OfficeService from "@/services/office.service";
import styles from "@/styles/AdminSettings.module.css";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import AddOfficeMapping from "./add-office-mapping";
import LoaderComponent from "../common/loading";

const OfficesMapping = ({ officeListing, onSuccess }) => {
  const headers = [
    {
      key: "primaryOfficeId",
      display: "Primary Office Id",
    },
    {
      key: "secondaryOfficeId",
      display: "Secondary Office Id",
    },
  ];

  const [isAddEdit, setIsAddEdit] = useState(false);
  const [selectedOfficeId, setSelectedOfficeId] = useState();
  const [isApiResponse, setIsApiResponse] = useState(false);
  const [officeMapping, setOfficeMapping] = useState();

  const [loading, setLoading] = useState(false);

  const onUserSuccess = () => {
    setIsAddEdit(false);
    fetchOfficeMapping();
  };

  const fetchOfficeMapping = async () => {
    setIsApiResponse(false);
    try {
      setLoading(true);
      const response = await OfficeService.getOfficeMapping(selectedOfficeId);
      const { data } = response || {};
      const { officeMappingDTOs } = data || {};
      setOfficeMapping(officeMappingDTOs);
      setIsApiResponse(true);
    } catch (e) {
      console.error(e);
      setIsApiResponse(true);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    let val = e.target.value;
    setSelectedOfficeId(val);
  };

  const viewOffice = () => {
    fetchOfficeMapping();
  };

  return (
    <div>
      <div className="internalSettingContainer">
        {!isAddEdit && (
          <div>
            <div className="btnContainerWithLeftContent">
              <div className={styles.roleSelectionContainer}>
                <p>Select Office to continue</p>
                {!!officeListing?.length && (
                  <div>
                    <FormControl fullWidth>
                      <InputLabel id="role-label">Office</InputLabel>
                      <Select
                        labelId="role-label"
                        id="demo-simple-select"
                        value={selectedOfficeId}
                        label="Role"
                        onChange={handleChange}
                      >
                        {officeListing.map(
                          (office, oIdx) =>
                            !!office?.officeId && (
                              <MenuItem key={oIdx} value={office?.officeId}>
                                {office?.officeId}, {office?.address},{" "}
                                {office?.city}
                              </MenuItem>
                            )
                        )}
                      </Select>
                    </FormControl>
                  </div>
                )}
                <div>
                  <button
                    onClick={viewOffice}
                    disabled={!selectedOfficeId}
                    className="btn btn-primary"
                  >
                    View Office
                  </button>
                </div>
              </div>
              <div>
                <button
                  onClick={() => setIsAddEdit(true)}
                  className="btn btn-primary"
                >
                  Add Office Mapping
                </button>
              </div>
            </div>
            {isApiResponse && !officeMapping?.length && (
              <p className="notFoundTableContent">No mapping found!</p>
            )}
            {!!officeMapping?.length && (
              <div className="gridContainer">
                <Grid headers={headers} listing={officeMapping} />
              </div>
            )}
          </div>
        )}
        {isAddEdit && (
          <div>
            <AddOfficeMapping onUserSuccess={onUserSuccess} />
          </div>
        )}
      </div>
      {loading ? (
        <div
          style={{
            position: "absolute",
            // backgroundColor: "pink",
            zIndex: "1",
            top: "55%",
            left: "50%",
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

export default OfficesMapping;
