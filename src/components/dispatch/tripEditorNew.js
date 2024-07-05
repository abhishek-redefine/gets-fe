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
import { HotTable } from '@handsontable/react';
import { registerAllModules } from 'handsontable/registry';
import 'handsontable/dist/handsontable.full.min.css';

const TripEditorNew = (props) => {
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

  useEffect(() => {
    console.log(rowSelection);
    console.log(columnOrder);
  }, [rowSelection, columnOrder])
  useEffect(() => {
    // register Handsontable's modules
    registerAllModules();
  }, [])

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
      let tripDatas = [];
      let tripMember = [];
      let members = [];
      let count = 0;
      const memberPromises = trips.map(async (val, index) => {
        const response = await DispatchService.tripMembers(val.id);
        let tempTripMember = [];
        // console.log(response.data);
        count += response.data.length;
        response.data.map((item, idx) => {
          const row = {
            // tripId: val.tripIdForUI,
            noOfSeats: item.name,
            memberCount: item.email,
            // employeeName: item.name,
            // gender: item.gender,
            pickupPoint:
              val.shiftType === "LOGIN" ? item?.areaName || "" : val.officeId,
            dropPoint:
              val.shiftType === "LOGIN" ? val.officeId : item?.areaName || "",
            pickupTime: val.pickupTime,
            // empEmail: item.email,
          };
          // data.push(row);
          tempTripMember.push(row);
        });
        const row =
        {
          // id: val.id,
          tripId: val.tripIdForUI,
          noOfSeats: `${val.noOfSeats}S`,
          memberCount: response.data.length,
          pickupPoint: val.shiftType === "LOGIN" ? response.data[0]?.areaName || "" : val.officeId,
          dropPoint: val.shiftType === "LOGIN" ? val.officeId || "" : response.data[0]?.areaName || "",
          // shiftTime: val.shiftTime,
          pickupTime: val.pickupTime,
          __children: tempTripMember,
        }
        // data.push(row);
        tripDatas.push(row);
        tripMember.push(tempTripMember);
        return response.data;
      });
      members = await Promise.all(memberPromises);
      console.log(tripMember);
      console.log(tripDatas);
      setTripData(tripDatas);
      setTripMemberData(tripMember);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllTrips();
    setData(tripData);
  }, [])

  useEffect(() => {
    setData(tripData);
  }, [tripData])

  const sourceDataObject = [
    {
      category: 'Best Rock Performance',
      artist: null,
      title: null,
      label: null,
      __children: [
        {
          title: "Don't Wanna Fight",
          artist: 'Alabama Shakes',
          label: 'ATO Records',
        },
        {
          title: 'What Kind Of Man',
          artist: 'Florence & The Machine',
          label: 'Republic',
        },
        {
          title: 'Something From Nothing',
          artist: 'Foo Fighters',
          label: 'RCA Records',
        },
        {
          title: "Ex's & Oh's",
          artist: 'Elle King',
          label: 'RCA Records',
        },
        {
          title: 'Moaning Lisa Smile',
          artist: 'Wolf Alice',
          label: 'RCA Records/Dirty Hit',
        },
      ],
    },
    {
      category: 'Best Metal Performance',
      __children: [
        {
          title: 'Cirice',
          artist: 'Ghost',
          label: 'Loma Vista Recordings',
        },
        {
          title: 'Identity',
          artist: 'August Burns Red',
          label: 'Fearless Records',
        },
        {
          title: '512',
          artist: 'Lamb Of God',
          label: 'Epic Records',
        },
        {
          title: 'Thank You',
          artist: 'Sevendust',
          label: '7Bros Records',
        },
        {
          title: 'Custer',
          artist: 'Slipknot',
          label: 'Roadrunner Records',
        },
      ],
    },
    {
      category: 'Best Rock Song',
      __children: [
        {
          title: "Don't Wanna Fight",
          artist: 'Alabama Shakes',
          label: 'ATO Records',
        },
        {
          title: "Ex's & Oh's",
          artist: 'Elle King',
          label: 'RCA Records',
        },
        {
          title: 'Hold Back The River',
          artist: 'James Bay',
          label: 'Republic',
        },
        {
          title: 'Lydia',
          artist: 'Highly Suspect',
          label: '300 Entertainment',
        },
        {
          title: 'What Kind Of Man',
          artist: 'Florence & The Machine',
          label: 'Republic',
        },
      ],
    },
    {
      category: 'Best Rock Album',
      __children: [
        {
          title: 'Drones',
          artist: 'Muse',
          label: 'Warner Bros. Records',
        },
        {
          title: 'Chaos And The Calm',
          artist: 'James Bay',
          label: 'Republic',
        },
        {
          title: 'Kintsugi',
          artist: 'Death Cab For Cutie',
          label: 'Atlantic',
        },
        {
          title: 'Mister Asylum',
          artist: 'Highly Suspect',
          label: '300 Entertainment',
        },
        {
          title: '.5: The Gray Chapter',
          artist: 'Slipknot',
          label: 'Roadrunner Records',
        },
      ],
    },
  ];

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
        <div id="tripEditor" className="hot">
          {
            data.length > 0 &&
            <HotTable
              data={data}
              columns={[
                {
                  title: "Trip Id",
                  data: "tripId",
                },
                {
                  title: "Number of seats",
                  data: "noOfSeats",
                },
                {
                  title: "Member Count",
                  data: "memberCount",
                },
                {
                  title: "Pickup Point",
                  data: "pickupPoint",
                },
                {
                  title: "Drop Point",
                  data: "dropPoint",
                },
                {
                  title: "Pickup Time",
                  data: "pickupTime",
                },
              ]}
              modifyColWidth={(100, 0)}
              width="100%"
              height="auto"
              colWidths={"260px"}
              columnSorting={true}
              rowHeaders={true}
              manualColumnMove={true}
              autoWrapRow={true}
              autoWrapCol={true}
              licenseKey="non-commercial-and-evaluation"
              nestedRows={true}
              contextMenu={true}
              bindRowsWithHeaders={true}
              manualRowMove={true}
              rowHeights={50}
              manualRowResize={true}
              
            />
          }

          {/* <HotTable
            data={sourceDataObject}
            preventOverflow="horizontal"
            rowHeaders={true}
            colHeaders={['Category', 'Artist', 'Title', 'Album', 'Label']}
            nestedRows={true}
            contextMenu={true}
            colWidths={"250px"}
            bindRowsWithHeaders={true}
            autoWrapRow={true}
            autoWrapCol={true}
            height="auto"
            licenseKey="non-commercial-and-evaluation"
          /> */}
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

export default TripEditorNew;
