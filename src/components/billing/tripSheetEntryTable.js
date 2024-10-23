import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import LoaderComponent from "../loader";

const TripSheetEntryTable = ({
  list,
  onRowsSelected,
  selectedRow,
  isLoading,
}) => {
  const [data, setData] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "Trip ID",
        size: 150,
        Cell: ({ cell }) => {
          return <div>TRIP-{cell.getValue()}</div>;
        },
      },
      {
        accessorKey: "vehicleId",
        header: "Vehicle ID",
        size: 150,
      },
      {
        accessorKey: "vehicleNumber",
        header: "Vehicle Registration",
        size: 250,
      },
      {
        accessorKey: "vehicleType",
        header: "Vehicle Type",
        size: 150,
      },
      {
        accessorKey: "date",
        header: "Date",
        size: 100,
      },

      {
        accessorKey: "km",
        header: "Km.",
        size: 100,
      },
      {
        accessorKey: "hrs",
        header: "Hrs",
        size: 100,
      },
      {
        accessorKey: "shiftTime",
        header: "Shift Time",
        size: 150,
      },
      {
        accessorKey: "shiftType",
        header: "Shift Type",
        size: 150,
      },
    ],
    []
  );

  const tableInstance = useMaterialReactTable({
    columns,
    data,
    enableRowSelection: true,
    enableMultiRowSelection: false,
    getRowId: (originalRow) => originalRow?.vehicleId,
    state: { rowSelection, isLoading },
    onRowSelectionChange: setRowSelection,
    muiCircularProgressProps: {
      Component: <LoaderComponent />,
    },
  });

  useEffect(() => {
    tableInstance.getSelectedRowModel().flatRows[0]?.original &&
      onRowsSelected(tableInstance.getSelectedRowModel().flatRows[0]?.original);
  }, [rowSelection]);

  useEffect(() => {
    if (!selectedRow) {
      setRowSelection({});
    }
  }, [selectedRow]);

  useEffect(() => {
    setData(list);
  }, [list]);

  return (
    <div>
      <MaterialReactTable
        table={tableInstance}
        getRowId={(row) => row.vehicleId}
      />
    </div>
  );
};

export default TripSheetEntryTable;
