import React, { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import LoaderComponent from "../loader";

const GenerateCostingTable = ({ list, isLoading }) => {
  const [data, setData] = useState([]);
  const [totalKm, setTotalKm] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [totalTripDuration, setTotalTripDuration] = useState(0);

  const columns = useMemo(
    () => [
      {
        accessorKey: "vendorName",
        header: "Vendor Name",
        size: 200,
      },
      {
        accessorKey: "tripCount",
        header: "Trip Count",
        size: 200,
      },
      {
        accessorKey: "totalKm",
        header: "Total Km",
        size: 200,
        footer: `${totalKm} Km`
      },
      {
        accessorKey: "totalCost",
        header: "Total Cost",
        size: 200,
        footer: `Rs. ${totalCost}`
      },
      {
        accessorKey: "totalTripDuration",
        header: "Total Trip Duration",
        size: 200,
        footer: `${totalTripDuration} hrs`
      },
      {
        accessorKey: "fromDate",
        header: "From Date",
        size: 200,
      },
      {
        accessorKey: "toDate",
        header: "To Date",
        size: 200,
      }
    ],
    [totalKm, totalCost, totalTripDuration]
  );

  const tableInstance = useMaterialReactTable({
    columns,
    data,
    state: { isLoading },
    muiCircularProgressProps: {
      Component: <LoaderComponent />,
    },
  });

  useEffect(() => {
    console.log("Costing >>>>>>", list);
    let tc = 0;
    let ttd = 0;
    let tk = 0;
    list.length > 0 && list.map((val) => {
      tc += val.totalCost;
      ttd += val.totalTripDuration;
      tk += val.totalKm;
    })
    setTotalCost(tc);
    setTotalKm(tk);
    setTotalTripDuration(ttd);
    setData(list);
  }, [list]);

  return (
    <div>
      <MaterialReactTable table={tableInstance} />
    </div>
  );
};

export default GenerateCostingTable;
