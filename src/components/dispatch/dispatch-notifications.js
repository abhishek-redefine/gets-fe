import React, { useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { dispatchNotificationData } from "@/sampleData/dispatchNotificationData";



const DispatchNotificationTable = () => {
  const [data, setData] = useState(dispatchNotificationData);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'tripId', 
        header: 'Trip ID',
        size: 150,
      },
      {
        accessorKey: 'empId',
        header: 'Employee ID',
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
        accessorKey: 'pickupTime',
        header: 'Pickup Time',
        size: 150,
      },
      {
        accessorKey: 'pickupPoint',
        header: 'Pickup Point',
        size: 200,
      },
      {
        accessorKey: 'dropPoint',
        header: 'Drop Point',
        size: 200,
      },
      {
        accessorKey: 'smsStatus',
        header: 'SMS Status',
        size: 150,
      },
      {
        accessorKey: 'emailStatus',
        header: 'Email Status',
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

export default DispatchNotificationTable;




