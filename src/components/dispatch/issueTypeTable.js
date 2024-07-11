import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { issueTypeData } from "@/sampleData/travelledEmployeesInfoData";


const TravelledEmployeeTable = () => {
  const [data, setData] = useState(issueTypeData);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'empId',
        header: 'Employee ID',
        size: 150,
      },
      {
        accessorKey: 'empName', 
        header: 'Employee Name',
        size: 150,
      },
      {
        accessorKey: 'gender',
        header: 'Gender',
        size: 150,
      },
      {
        accessorKey: 'pickup/dropPoint',
        header: 'Pickup/Drop Point',
        size: 150,
      },
      {
        accessorKey: 'landmark',
        header: 'Landmark',
        size: 150,
      },
      {
        accessorKey: 'vehicleReportTime',
        header: 'Vehicle Report Time',
        size: 200,
      },
      {
        accessorKey: 'signIn',
        header: 'Sign In',
        size: 100,
      },
      {
        accessorKey: 'signOut',
        header: 'sign Out',
        size: 100,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 150,
      },
      {
        accessorKey: 'phoneNo',
        header: 'Phone No.',
        size: 150,
      },
      {
        accessorKey: 'action',
        header: 'Action',
        size: 150,
      }, 
    ],
    [],
  );

  const tableInstance = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    enableTopToolbar: false,
    initialState: { density: 'compact' },
    muiTableBodyCellProps: {
        sx: {
          fontFamily: 'DM Sans',  
          fontSize: "14px", 
        },
      },
  });


  return (
    <div>
      <div>
        <MaterialReactTable table={tableInstance} />
      </div>
    </div>
  );
};

export default TravelledEmployeeTable;




