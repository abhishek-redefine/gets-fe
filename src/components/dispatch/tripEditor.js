import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import CloseFullscreenOutlinedIcon from "@mui/icons-material/CloseFullscreenOutlined";
import ContentCutOutlinedIcon from "@mui/icons-material/ContentCutOutlined";
import ContentPasteOutlinedIcon from "@mui/icons-material/ContentPasteOutlined";
import MergeOutlinedIcon from "@mui/icons-material/MergeOutlined";
import SwapVertOutlinedIcon from "@mui/icons-material/SwapVertOutlined";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import Diversity2OutlinedIcon from "@mui/icons-material/Diversity2Outlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AutoModeOutlinedIcon from "@mui/icons-material/AutoModeOutlined";
import React, { useState, useMemo, useEffect } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from 'material-react-table';
import { Box, Typography } from '@mui/material';
import DispatchService from "@/services/dispatch.service";


const initDataArray = [
  {
    "id": 1, "tripId": 1, "noOfSeats": 5, "memberCount": "2", "pickupPoint": "14th Floor", "dropPoint": "Room 1021", "pickupTime": "5:28 AM"
  },
  {
    "id": 2, "tripId": 2, "noOfSeats": 5, "memberCount": "1", "pickupPoint": "PO Box 65568", "dropPoint": "Apt 1379", "pickupTime": "11:56 AM"
  },
];

const TripEditor = (props) => {
  const { edit, selectedDate, shiftId } = props;
  const [data, setData] = useState([]);
  const [tripCount, setTripCount] = useState(0);
  const [tripsMemberCount, setTripsMemberCount] = useState(0);
  const [memberTable, setMemberTable] = useState([]);
  const [tripData, setTripData] = useState([]);
  const [tripMemberData, setTripMemberData] = useState([]);
  const columns = useMemo(() => [
    {
      header: "Trip Id",
      accessorKey: 'tripId',
      enableColumnPinning: false,
      footer: "Trip Id",
      enableEditing: false,
    },
    {
      header: "Number of Seats",
      accessorKey: 'noOfSeats',
      footer: "Number of Seats",
      enableEditing: false,
    },
    {
      header: "Member Count",
      accessorKey: 'memberCount',
      footer: "Member Count",
      enableEditing: false,
    },
    {
      header: "Pickup point",
      accessorKey: 'pickupPoint',
      footer: "Pickup point"
    },
    {
      header: "Drop Point",
      accessorKey: 'dropPoint',
      footer: "Drop Point"
    },
    {
      header: "Pickup Time",
      accessorKey: 'pickupTime',
      footer: "Pickup Time"
    },
  ]);
  const [columnOrder, setColumnOrder] = useState(() => columns.map((c) => c.accessorKey))
  const [rowSelection, setRowSelection] = useState({});
  const table = useMaterialReactTable({
    autoResetPageIndex: false,
    data,
    columns,
    enableColumnActions: false,
    enableColumnFilters: false,
    enableColumnFilterModes: false,
    enableColumnOrdering: true,
    onColumnOrderChange: setColumnOrder,
    enableRowOrdering: true,
    enableSorting: false,
    enableRowPinning: (row) => row.id,
    enablePagination: false,
    enableTableFooter: false,
    rowPinningDisplayMode: 'top',
    enableColumnPinning: true,
    layoutMode: 'grid-no-grow',
    initialState: {
      columnPinning: { left: ['mrt-row-drag'] },
    },
    muiRowDragHandleProps: ({ table }) => ({
      onDragEnd: () => {
        const { draggingRow, hoveredRow } = table.getState();
        if (hoveredRow && draggingRow) {
          data.splice(
            hoveredRow.index,
            0,
            data.splice(draggingRow.index, 1)[0],
          );
          setData([...data]);
        }
      },
    }),
    muiTableContainerProps: {
      sx: {
        maxHeight: '400px',
      },
    },
    enableRowSelection: true,
    getRowId: (row) => row.tripId,
    onRowSelectionChange: setRowSelection,
    displayColumnDefOptions: {
      'mrt-row-pin': {
        muiTableBodyCellProps: {
          align: 'right',
        },
      },
    },
    state: { columnOrder, rowSelection },
    enableExpandAll: false, //hide expand all double arrow in column header
    enableExpanding: true,
    muiDetailPanelProps: () => ({
      sx: (theme) => ({
        backgroundColor:
          theme.palette.mode === 'dark'
            ? 'rgba(255,210,244,0.1)'
            : 'rgba(0,0,0,0.1)',
      }),
    }),
    muiTableBodyRowProps: ({ row }) => ({
      //conditional styling based on row depth
      sx: (theme) => ({
        backgroundColor:
          row.depth * (theme.palette.mode === 'dark' ? 0.2 : 0.1)
      }),
    }),
    enableSubRowSelection: true,
    enableEditing: true,
    editDisplayMode: 'cell',
  });

  const memberData = [
    {
      "id": 1,
      "tripId": "TRIP-19",
      "employeeName": "Person 1",
      "gender": "MALE",
      "pickupPoint": "NOIDA - Sector 45",
      "dropPoint": "HCLND0001",
      "pickupTime": "09:45",
      "empEmail": "person1@gmail.com"
    },
    {
      "id": 2,
      "tripId": "TRIP-19",
      "employeeName": "Person 2",
      "gender": "MALE",
      "pickupPoint": "NOIDA - Sector 37",
      "dropPoint": "HCLND0001",
      "pickupTime": "09:45",
      "empEmail": "person2@gmail.com"
    }
  ]

  const memberTableRef = useMaterialReactTable({
    enableTableFooter: false,
    enablePagination: false,
    autoResetPageIndex: false,
    enableFilters: false,
    enableColumnActions: false,
    enableTopToolbar: false,
    enableBottomToolbar: false,
    enableRowDragging: true,
    enableRowOrdering: true,
    data: memberData,
    columns,
    muiTableContainerProps: {
      sx: {
        padding: '0px',
        margin: '0px',
        maxHeight: '400px',
      },
    },
  })
  // useEffect(() => {
  //   if (tripMemberData.length > 0) {
  //     let tempMemberTable;
  //     tripMemberData.map((val, index) => {
  //       const data = val;
  //       const tempTable = useMaterialReactTable({
  //         autoResetPageIndex: false,
  //         data,
  //         columns,
  //       });
  //       tempMemberTable.push(tempTable);
  //     })
  //     setMemberTable(tempMemberTable);
  //   }
  // }, [tripMemberData]);

  useEffect(() => {
    console.log(rowSelection);
    console.log(columnOrder);
  }, [rowSelection, columnOrder])

  const getAllTrips = async () => {
    try {
      const queryParams = {
        shiftId: shiftId,
        tripDate: selectedDate,
      };
      const params = new URLSearchParams(queryParams);
      const response = await DispatchService.getTripByShiftIdAndTripDate(
        params
      );
      console.log(response.data);
      // setTripData(response.data);
      await getTripsMember(response.data);
    } catch (er) {
      console.log(er);
    }
  }

  const getTripsMember = async (trips) => {
    try {
      let tripData = [];
      let tripMember = [];
      let data = [];
      let members = [];
      let count = 0;
      const memberPromises = trips.map(async (val, index) => {
        const response = await DispatchService.tripMembers(val.id);
        let tempTripMember = [];
        // console.log(response.data);
        count += response.data.length;
        response.data.map((item, idx) => {
          const row = {
            id: null,
            editable: true,
            tripId: item.name,
            noOfSeats: item.gender,
            employeeName: item.name,
            gender: item.gender,
            pickupPoint:
              val.shiftType === "LOGIN" ? item?.areaName || "" : val.officeId,
            dropPoint:
              val.shiftType === "LOGIN" ? val.officeId : item?.areaName || "",
            pickupTime: val.pickupTime,
            empEmail: item.email,
          };
          // data.push(row);
          tempTripMember.push(row);
        });
        const row =
        {
          id: val.id,
          editable: false,
          tripId: val.tripIdForUI,
          noOfSeats: `${val.noOfSeats}S`,
          memberCount: response.data.length,
          pickupPoint: val.shiftType === "LOGIN" ? response.data[0]?.areaName || "" : val.officeId,
          dropPoint: val.shiftType === "LOGIN" ? val.officeId || "" : response.data[0]?.areaName || "",
          shiftTime: val.shiftTime,
          pickupTime: val.pickupTime,
          subRows: tempTripMember,
        }
        // data.push(row);
        tripData.push(row);
        tripMember.push(tempTripMember);
        return response.data;
      });
      members = await Promise.all(memberPromises);
      console.log(tripMember);
      console.log(tripData);
      setTripData(tripData);
      setTripMemberData(tripMember);
      console.log("Trip Members>>>>>", data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllTrips();
  }, [])

  useEffect(() => {
    setData(tripData)
  }, [tripData])

  return (
    <div style={{ marginTop: 20 }}>
      <div
        style={{
          borderRadius: 10,
          padding: "20px 30px",
          backgroundColor: "#E0E0E0",
        }}
      >
        <div style={{ backgroundColor: "#FFF", display: "flex", padding: 20 }}>
          <div
            style={{ margin: "0 7px", display: "flex", alignItems: "center" }}
          >
            <p className="tripEditorText">Users</p>
            <div
              style={{
                border: "2px solid #E0E0E0",
                padding: "2px 10px",
                margin: "0 7px",
                borderRadius: 5,
                width: "50px",
              }}
            >
              <p>{tripsMemberCount}</p>
            </div>
          </div>
          <div
            style={{ margin: "0 7px", display: "flex", alignItems: "center" }}
          >
            <p className="tripEditorText">Special</p>
            <div
              style={{
                border: "2px solid #E0E0E0",
                padding: "2px 10px",
                margin: "0 7px",
                borderRadius: 5,
                width: "50px",
              }}
            >
              <p>0</p>
            </div>
          </div>
          <div
            style={{ margin: "0 7px", display: "flex", alignItems: "center" }}
          >
            <p className="tripEditorText">Female</p>
            <div
              style={{
                border: "2px solid #E0E0E0",
                padding: "2px 10px",
                margin: "0 7px",
                borderRadius: 5,
                width: "50px",
              }}
            >
              <p>0</p>
            </div>
          </div>
          <div
            style={{ margin: "0 7px", display: "flex", alignItems: "center" }}
          >
            <p className="tripEditorText">Trips</p>
            <div
              style={{
                border: "2px solid #E0E0E0",
                padding: "2px 10px",
                margin: "0 7px",
                borderRadius: 5,
                width: "50px",
              }}
            >
              <p>{tripCount}</p>
            </div>
          </div>
          <div
            style={{ margin: "0 7px", display: "flex", alignItems: "center" }}
          >
            <p className="tripEditorText">Escort Trip</p>
            <div
              style={{
                border: "2px solid #E0E0E0",
                padding: "2px 10px",
                margin: "0 7px",
                borderRadius: 5,
                width: "50px",
              }}
            >
              <p>0</p>
            </div>
          </div>
          <div
            style={{ margin: "0 7px", display: "flex", alignItems: "center" }}
          >
            <p className="tripEditorText">Fleet Mix</p>
            <div
              style={{
                border: "2px solid #E0E0E0",
                padding: "2px 10px",
                margin: "0 7px",
                borderRadius: 5,
                width: "auto",
              }}
            >
              <p>4S : -</p>
            </div>
            <div
              style={{
                border: "2px solid #E0E0E0",
                padding: "2px 10px",
                margin: "0 7px",
                borderRadius: 5,
                width: "auto",
              }}
            >
              <p>6S : -</p>
            </div>
            <div
              style={{
                border: "2px solid #E0E0E0",
                padding: "2px 10px",
                margin: "0 7px",
                borderRadius: 5,
                width: "auto",
              }}
            >
              <p>7S : -</p>
            </div>
            <div
              style={{
                border: "2px solid #E0E0E0",
                padding: "2px 10px",
                margin: "0 7px",
                borderRadius: 5,
                width: "auto",
              }}
            >
              <p>12S : -</p>
            </div>
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: 10,
          backgroundColor: "#E0E0E0",
          borderRadius: 5,
          padding: 10,
          marginBottom: 10,
        }}
      >
        <div className="d-flex" style={{ marginBottom: 15 }}>
          <div
            className="d-flex"
            style={{
              marign: "0 10px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 7px",
              cursor: "pointer",
            }}
          >
            <OpenInFullIcon
              fontSize="12"
              htmlColor="#0054B6"
              style={{ margin: "0 5px" }}
            />
            <p className="tripEditorText">Expand</p>
          </div>
          <div
            className="d-flex"
            style={{
              marign: "0 10px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 7px",
              cursor: "pointer",
            }}
          >
            <CloseFullscreenOutlinedIcon
              fontSize="12"
              htmlColor="#0054B6"
              style={{ margin: "0 5px" }}
            />
            <p className="tripEditorText">Collapse</p>
          </div>
          <div
            className="d-flex"
            style={{
              marign: "0 10px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 7px",
              cursor: "pointer",
            }}
          >
            <ContentCutOutlinedIcon
              fontSize="12"
              htmlColor="#0054B6"
              style={{ margin: "0 5px" }}
            />
            <p className="tripEditorText">Cut</p>
          </div>
          <div
            className="d-flex"
            style={{
              marign: "0 10px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 7px",
              cursor: "pointer",
            }}
          >
            <ContentPasteOutlinedIcon
              fontSize="12"
              htmlColor="#0054B6"
              style={{ margin: "0 5px" }}
            />
            <p className="tripEditorText">Paste</p>
          </div>
          <div
            className="d-flex"
            style={{
              marign: "0 10px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 7px",
              cursor: "pointer",
            }}
          >
            <MergeOutlinedIcon
              fontSize="12"
              htmlColor="#0054B6"
              style={{ margin: "0 5px" }}
            />
            <p className="tripEditorText">Merge</p>
          </div>
          <div
            className="d-flex"
            style={{
              marign: "0 10px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 7px",
              cursor: "pointer",
            }}
          >
            <SwapVertOutlinedIcon
              fontSize="12"
              htmlColor="#0054B6"
              style={{ margin: "0 5px" }}
            />
            <p className="tripEditorText">Sort By</p>
          </div>
          <div
            className="d-flex"
            style={{
              marign: "0 10px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 7px",
              cursor: "pointer",
            }}
          >
            <AddBoxOutlinedIcon
              fontSize="12"
              htmlColor="#0054B6"
              style={{ margin: "0 5px" }}
            />
            <p className="tripEditorText">Create New Trip</p>
          </div>
          <div
            className="d-flex"
            style={{
              marign: "0 10px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 7px",
              cursor: "pointer",
            }}
          >
            <Diversity2OutlinedIcon
              fontSize="12"
              htmlColor="#0054B6"
              style={{ margin: "0 5px" }}
            />
            <p className="tripEditorText">Recalculate</p>
          </div>
          <div
            className="d-flex"
            style={{
              marign: "0 10px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 7px",
              cursor: "pointer",
            }}
          >
            <AccessTimeOutlinedIcon
              fontSize="12"
              htmlColor="#0054B6"
              style={{ margin: "0 5px" }}
            />
            <p className="tripEditorText">Edit Pickup Time</p>
          </div>
          <div
            className="d-flex"
            style={{
              marign: "0 10px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 7px",
              cursor: "pointer",
            }}
          >
            <EditOutlinedIcon
              fontSize="12"
              htmlColor="#0054B6"
              style={{ margin: "0 5px" }}
            />
            <p className="tripEditorText">Auto Update pickup/drop timing</p>
          </div>
          <div
            className="d-flex"
            style={{
              marign: "0 10px",
              justifyContent: "center",
              alignItems: "center",
              margin: "0 7px",
              cursor: "pointer",
            }}
          >
            <AutoModeOutlinedIcon
              fontSize="12"
              htmlColor="#0054B6"
              style={{ margin: "0 5px" }}
            />
            <p className="tripEditorText">Customize Columns</p>
          </div>
        </div>
        <div className="container">
          <MaterialReactTable table={table} />
        </div>
      </div>
      <div className="d-flex" style={{ justifyContent: 'flex-end', marginTop: 20 }}>
        <div className="d-flex">
          <button
            type="submit"
            className="btn btn-secondary filterApplyBtn"
            onClick={() => edit(false)}
          >Back</button>
          <button type="submit" style={{ margin: '0 10px' }}
            className="btn btn-primary filterApplyBtn">Save</button>
        </div>
      </div>
    </div>

  );
};

export default TripEditor;
