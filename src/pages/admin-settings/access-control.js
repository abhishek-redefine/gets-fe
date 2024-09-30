import React, { useEffect, useState } from "react";
import AdminSettings from "@/layouts/admin-settings";
import styles from "@/styles/AdminSettings.module.css";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import RoleService from "@/services/role.service";
import { PERMISSIONS } from "@/constants/app.constants.";
import { toggleToast } from "@/redux/company.slice";
import { useDispatch } from "react-redux";
import LoaderComponent from "@/components/loader";

const AccessControl = () => {
  const dispatch = useDispatch();
  const [selectedRole, setSelectedRole] = useState("");
  const [allRoles, setAllRoles] = useState();
  const [allModules, setAllModules] = useState([]);
  const [modulePermissionsByRole, setModulePermissionsByRole] = useState([]);
  const [modulePermissionAPICalled, setModulePermissionAPICalled] =
    useState(false);
  const [allPermissions, setAllPermissions] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    let val = e.target.value;
    setSelectedRole(val);
  };

  const getRoles = async () => {
    try {
      const response = await RoleService.getAllRoles();
      const { data } = response || {};
      setAllRoles(data);
    } catch (e) {}
  };

  const getModules = async () => {
    try {
      const response = await RoleService.getAllModules();
      const { data } = response || {};
      const { modules } = data || {};
      setAllModules(modules);
    } catch (e) {}
  };

  const getPermissionsByRole = async (role) => {
    try {
      setLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 5000));
      const response = await RoleService.getRolePermissions(role);
      const { data } = response || {};
      setModulePermissionsByRole(data);
      setModulePermissionAPICalled(true);
      if (data.length) {
        setAllCheckedValues(data);
      }
    } catch (e) {
      setModulePermissionAPICalled(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRoles();
    getModules();
  }, []);

  const viewRole = () => {
    resetData();
    getPermissionsByRole(selectedRole);
  };

  const setAllCheckedValues = (apiModules) => {
    let currentPermissions = {};
    apiModules.forEach((module) => {
      module?.submodules?.forEach((submodule) => {
        const submodulePermissions =
          submodule?.functionalities?.[0]?.permissions;
        if (submodulePermissions?.length) {
          if (currentPermissions[module.name]) {
            currentPermissions[module.name][submodule.name] =
              submodulePermissions;
          } else {
            currentPermissions[module.name] = {
              [submodule.name]: submodulePermissions,
            };
          }
        }
      });
    });
    setAllPermissions(currentPermissions);
  };

  const savePermissions = async () => {
    let finalPermissions = {
      role: selectedRole,
      modules: [],
    };
    Object.keys(allPermissions)?.length;
    if (Object.keys(allPermissions)?.length) {
      Object.keys(allPermissions).forEach((moduleName) => {
        const moduleDetails = {};
        const allModuleDetails = allModules.filter(
          (module) => module.name === moduleName
        )?.[0];
        let currentModuleDetails = {};
        if (modulePermissionsByRole.length) {
          const savedModuleDetails = modulePermissionsByRole.filter(
            (savedModule) => savedModule.name === moduleName
          )?.[0];
          if (savedModuleDetails) {
            currentModuleDetails = savedModuleDetails;
          }
        }
        if (allModuleDetails && !currentModuleDetails.id) {
          currentModuleDetails = allModuleDetails;
        }
        if (currentModuleDetails.id) {
          moduleDetails.id = currentModuleDetails.id;
        }
        moduleDetails.name = currentModuleDetails.name;
        moduleDetails.description = currentModuleDetails.description;
        if (
          allPermissions?.[moduleName] &&
          Object.keys(allPermissions[moduleName])?.length
        ) {
          Object.keys(allPermissions[moduleName]).forEach((subModuleName) => {
            let submoduleDetails = {};
            if (currentModuleDetails.id) {
              const savedSubmodule = currentModuleDetails.submodules.filter(
                (submodule) => submodule.name === subModuleName
              )?.[0];
              if (savedSubmodule) {
                submoduleDetails = savedSubmodule;
              }
            }
            if (!submoduleDetails?.id) {
              submoduleDetails = allModuleDetails.submodules.filter(
                (submodule) => submodule.name === subModuleName
              )?.[0];
            }
            if (submoduleDetails) {
              submoduleDetails.functionalities[0].permissions =
                allPermissions[moduleName][subModuleName];
              if (moduleDetails.submodules?.length) {
                moduleDetails.submodules.push(submoduleDetails);
              } else {
                moduleDetails.submodules = [submoduleDetails];
              }
            }
          });
        }
        finalPermissions.modules.push(moduleDetails);
      });
    }
    try {
      if (!modulePermissionsByRole?.length) {
        setLoading(true);
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        await RoleService.saveRolePermissions(finalPermissions);
      } else {
        setLoading(true);
        // await new Promise((resolve) => setTimeout(resolve, 5000));
        await RoleService.updateRolePermissions(finalPermissions);
      }
      resetData();
      setSelectedRole("");
      dispatch(
        toggleToast({
          message: "Permissions updated successfully",
          type: "success",
        })
      );
    } catch (e) {
      dispatch(
        toggleToast({
          message: "Error saving permissions, please try again",
          type: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const resetData = () => {
    setModulePermissionsByRole([]);
    setModulePermissionAPICalled(false);
    setAllPermissions({});
  };

  const getChecked = (singleModule, subModule, permission) => {
    const currentModule = allPermissions[singleModule.name];
    if (currentModule) {
      const currentSubModule = currentModule[subModule.name];
      return currentSubModule?.includes(permission);
    }
    return false;
  };

  const setAllPermission = (singleModule, subModule, permission) => {
    const currentPermissions = { ...allPermissions };
    if (currentPermissions[singleModule.name]) {
      if (currentPermissions[singleModule.name]?.[subModule.name]) {
        const idxOfPermission =
          currentPermissions[singleModule.name][subModule.name].indexOf(
            permission
          );
        if (idxOfPermission > -1) {
          currentPermissions[singleModule.name][subModule.name].splice(
            idxOfPermission,
            1
          );
        } else {
          currentPermissions[singleModule.name][subModule.name].push(
            permission
          );
        }
      } else {
        currentPermissions[singleModule.name][subModule.name] = [permission];
      }
    } else {
      currentPermissions[singleModule.name] = {
        [subModule.name]: [permission],
      };
    }
    setAllPermissions(currentPermissions);
  };

  return (
    <div className="mainSettingsContainer">
      <h2>Access Control</h2>
      <div className={styles.roleSelectionContainer}>
        <p>Select Role to continue</p>
        {!!allRoles?.length && (
          <div>
            <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="demo-simple-select"
                value={selectedRole}
                label="Role"
                onChange={handleChange}
              >
                {allRoles.map(
                  (role, rIdx) =>
                    !!role?.roleName && (
                      <MenuItem key={rIdx} value={role?.roleName}>
                        {role?.displayName}
                      </MenuItem>
                    )
                )}
              </Select>
            </FormControl>
          </div>
        )}
        <div>
          <button
            onClick={viewRole}
            disabled={!selectedRole}
            className="btn btn-primary"
          >
            View Role
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
        <div>
          {!!(selectedRole && modulePermissionAPICalled) && (
            <div className={styles.permissionContainer}>
              <table className="commonTable">
                <thead>
                  <tr>
                    <td>Module</td>
                    <td>Sub Module</td>
                    <td>Permissions</td>
                  </tr>
                </thead>
                <tbody>
                  {allModules.map((singleModule, idx) => (
                    <tr key={idx}>
                      <td>{singleModule?.description}</td>
                      <td>
                        {singleModule?.submodules?.length ? (
                          <>
                            {singleModule?.submodules.map((subModule, sIdx) => (
                              <p key={sIdx}>
                                {subModule?.description || subModule?.name}
                              </p>
                            ))}
                          </>
                        ) : (
                          ""
                        )}
                      </td>
                      <td>
                        {singleModule?.submodules?.length ? (
                          <>
                            {singleModule?.submodules.map(
                              (subModule, sIdx_i) => (
                                <p key={sIdx_i} className="pWithoutPadding">
                                  {!!subModule?.functionalities?.[0]
                                    ?.permissions?.length &&
                                    subModule?.functionalities?.[0]?.permissions?.map(
                                      (permission, pIdx) => (
                                        <FormControlLabel
                                          checked={getChecked(
                                            singleModule,
                                            subModule,
                                            permission
                                          )}
                                          key={pIdx}
                                          control={
                                            <Checkbox
                                              onChange={() =>
                                                setAllPermission(
                                                  singleModule,
                                                  subModule,
                                                  permission
                                                )
                                              }
                                            />
                                          }
                                          label={PERMISSIONS[permission]}
                                        />
                                      )
                                    )}
                                </p>
                              )
                            )}
                          </>
                        ) : (
                          ""
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="bottomBtnContainerRescue"></div>
              <div className="bottomBtnContainer">
                <button
                  onClick={() => savePermissions()}
                  className="btn btn-primary btn-primary-width"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminSettings(AccessControl);
