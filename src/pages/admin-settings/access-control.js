import React, { useEffect, useState } from 'react';
import AdminSettings from '@/layouts/admin-settings';
import styles from '@/styles/AdminSettings.module.css';
import { Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select } from '@mui/material';
import RoleService from '@/services/role.service';
import { PERMISSIONS } from '@/constants/app.constants.';
import { toggleToast } from '@/redux/company.slice';
import { useDispatch } from 'react-redux';

const AccessControl = () => {

  const dispatch = useDispatch();
  const [selectedRole, setSelectedRole] = useState("");
  const [allRoles, setAllRoles] = useState();
  const [allModules, setAllModules] = useState([]);
  const [modulePermissionsByRole, setModulePermissionsByRole] = useState([]);
  const [modulePermissionAPICalled, setModulePermissionAPICalled] = useState(false);
  const [permissionsToSave, setPermissionsToSave] = useState({});
  const [isEdit, setIsEdit] = useState(false);

  const handleChange = (e) => {
    let val = e.target.value;
    setSelectedRole(val);
  };

  const getRoles = async () => {
    try {
      const response = await RoleService.getAllRoles();
      const { data } = response || {};
      setAllRoles(data);
    } catch (e) {

    }
  };

  const getModules = async () => {
    try {
      const response = await RoleService.getAllModules();
      const { data } = response || {};
      const { modules } = data || {};
      setAllModules(modules);
    } catch (e) {

    }
  };

  const getPermissionsByRole = async (role) => {
    try {
      const response = await RoleService.getRolePermissions(role);
      const { data } = response || {};
      setModulePermissionsByRole(data);
      setModulePermissionAPICalled(true);
      setIsEdit(!!data.length);
    } catch (e) {
      setModulePermissionAPICalled(true);
    }
  };

  useEffect(() => {
    getRoles();
    getModules();
  }, []);

  const viewRole = () => {
    setModulePermissionsByRole([]);
    setModulePermissionAPICalled(false);
    getPermissionsByRole(selectedRole);
  };

  const setPermission = (singleModule, subModule, permission) => {
    let currentPermissions = {...permissionsToSave};
    if (!currentPermissions?.role) {
      currentPermissions.role = selectedRole;
    }
    let subModuleData = {
      name: subModule.name,
      description: subModule.description,
      functionalities: [{
        permissions: [permission]
      }]
    };
    if (isEdit) {
      subModuleData.id = subModule.id;
    }
    let moduleData = {
      name: singleModule.name,
      description: singleModule.description,
      submodules: [subModuleData]
    };
    if (isEdit) {
      moduleData.id = singleModule.id;
    }
    if (!currentPermissions?.modules) {    
      currentPermissions.modules = [];
      currentPermissions.modules.push(moduleData);
    } else {
      let isModuleFound = currentPermissions.modules.some((sModule, idx) => {
        if (sModule?.name === singleModule?.name) {
          let isSubModuleFound = sModule?.submodules?.some((sSubModule, sIdx) => {
            if (sSubModule?.name === subModule?.name) {
              let idxOfPerm = currentPermissions.modules[idx]?.submodules[sIdx].functionalities[0]?.permissions.indexOf(permission);
              if (idxOfPerm > -1) {
                currentPermissions.modules[idx]?.submodules[sIdx].functionalities[0]?.permissions?.splice(idxOfPerm, 1);
                if (currentPermissions.modules[idx]?.submodules[sIdx].functionalities[0]?.permissions.length === 0) {
                  currentPermissions.modules[idx]?.submodules.splice(sIdx, 1);                  
                }
                if (currentPermissions.modules[idx]?.submodules.length === 0) {
                  currentPermissions.modules.splice(idx, 1);
                }
                if (currentPermissions.modules.length === 0) {
                  currentPermissions = {};
                }
              } else {
                currentPermissions.modules[idx]?.submodules[sIdx].functionalities[0]?.permissions?.push(permission);
              }
              return true;
            }
            return false;
          });
          if (!isSubModuleFound) {
            currentPermissions.modules[idx]?.submodules.push(subModuleData);
          }
          return true;
        }
        return false;
      });
      if (!isModuleFound) {
        currentPermissions.modules.push(moduleData);
      }
    }
    setPermissionsToSave(currentPermissions);
  };

  const savePermissions = async () => {
    try {
      if (!modulePermissionsByRole?.length) {
        await RoleService.saveRolePermissions(permissionsToSave);
      } else {
        await RoleService.updateRolePermissions(permissionsToSave);
      }
      dispatch(toggleToast({ message: 'Permissions updated successfully', type: 'success' }));
    } catch (e) {
      dispatch(toggleToast({ message: 'Error saving permissions, please try again', type: 'error' }));
    }
  };

  return (
    <div className='mainSettingsContainer'>
      <h2>Access Control</h2>
      <div className={styles.roleSelectionContainer}>
        <p>Select Role to continue</p>
        {!!allRoles?.length && <div>
          <FormControl fullWidth>
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                  labelId="role-label"
                  id="demo-simple-select"
                  value={selectedRole}
                  label="Role"
                  onChange={handleChange}
              >
                  {allRoles.map((role, rIdx) => (
                    !!role?.roleName && <MenuItem key={rIdx} value={role?.roleName}>{role?.displayName}</MenuItem>
                  ))}
              </Select>
          </FormControl>
        </div>}
        <div>
          <button onClick={viewRole} disabled={!selectedRole} className='btn btn-primary'>View Role</button>
        </div>
      </div>
      {!!(selectedRole && modulePermissionAPICalled) && <div className={styles.permissionContainer}>
        <table className='commonTable'>
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
                  {singleModule?.submodules?.length ?
                    <>
                      {singleModule?.submodules.map(((subModule, sIdx) => (
                        <p key={sIdx}>{subModule?.description || subModule?.name}</p>
                      )))}
                    </>
                  : ""}
                </td>
                <td>
                {singleModule?.submodules?.length ?
                  <>
                    {singleModule?.submodules.map(((subModule, sIdx_i) => (
                      <p key={sIdx_i} className='pWithoutPadding'>
                        {!!(subModule?.functionalities?.[0]?.permissions?.length) && 
                        subModule?.functionalities?.[0]?.permissions?.map((permission, pIdx) => (
                          <FormControlLabel key={pIdx} control={<Checkbox onChange={() => setPermission(singleModule, subModule, permission)} />} label={PERMISSIONS[permission]} />
                        ))}
                      </p>
                    )))}
                  </> : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className='bottomBtnContainerRescue'></div>
        <div className='bottomBtnContainer'>
          <button onClick={() => savePermissions()} className='btn btn-primary btn-primary-width'>Save</button>
        </div>
      </div>}
    </div>
  )
}

export default AdminSettings(AccessControl);;