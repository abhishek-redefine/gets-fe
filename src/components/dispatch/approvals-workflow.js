import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { approvalsWorkflowData } from "../../sampleData/approvalsWorkflowData";



const ApprovalsWorkflowTable = () => {
  const [data, setData] = useState(approvalsWorkflowData);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'tripId', 
        header: 'Trip ID',
        size: 150,
      },
      {
        accessorKey: 'tripStatus',
        header: 'Trip Status',
        size: 150,
      },
      {
        accessorKey: 'shiftTime', 
        header: 'Shift Time',
        size: 150,
      },
      {
        accessorKey: 'shiftType',
        header: 'Shift Type',
        size: 150,
      },
      {
        accessorKey: 'cabDetails',
        header: 'Cab Details',
        size: 150,
      },
      {
        accessorKey: 'signIn',
        header: 'Sign In',
        size: 150,
      },
      {
        accessorKey: 'signOut',
        header: 'Sign Out',
        size: 150,
      },
      {
        accessorKey: 'smsStatus',
        header: 'SMS Status',
        size: 150,
      },
    ],
    [],
  );

  const tableInstance = useMaterialReactTable({
    columns,
    data,
    getRowId: row => row.tripId,
  });


  return (
    <div>
      <div
        style={{
          backgroundColor: "#f9f9f9",
          padding: "16px 20px",
          borderRadius: "10px",
        }}
      >
        <MaterialReactTable table={tableInstance} />
      </div>
    </div>
  );
};

export default ApprovalsWorkflowTable;




