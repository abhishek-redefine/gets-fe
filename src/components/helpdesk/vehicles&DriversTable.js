import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";



const VehiclesNDriversTable = ({list}) => {
  const [data, setData] = useState([]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'id', 
        header: 'Trip ID',
        size: 150,
        Cell: ({ cell }) => {
          return <div>TRIP-{cell.getValue()}</div>;
        },
      },
    //   {
    //     accessorKey: 'empIds',
    //     header: 'Trip Status',
    //     size: 150,
    //   },
      {
        accessorKey: 'shiftTime', 
        header: 'Shift Time',
        size: 150,
      },
    //   {
    //     accessorKey: 'firstPickupLastDrop',
    //     header: 'First Pickup / Last Drop',
    //     size: 150,
    //   },
    //   {
    //     accessorKey: 'tripDistance',
    //     header: 'Trip Distance',
    //     size: 150,
    //   },
      {
        accessorKey: 'officeId',
        header: 'Office ID',
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

  useEffect(()=>{
    setData(list)
  },[list])

  return (
    <div>
      <div
        style={{
          padding: "8px 20px 0",
        }}
      >
        <MaterialReactTable table={tableInstance} />
      </div>
    </div>
  );
};

export default VehiclesNDriversTable;




