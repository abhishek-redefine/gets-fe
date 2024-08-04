import DispatchService from "@/services/dispatch.service";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import $, { widget } from 'jquery';
import 'jquery-ui-dist/jquery-ui'

const { useState, useMemo, useEffect, memo } = require("react")

const TripEditorManual = ({ shiftId, date }) => {
    const [data, setData] = useState([]);
    const [widget, setWidget] = useState(null);
    const columns = useMemo(() => [
        {
            header: "",
            accessorKey: 'checkbox'
        },
        {
            header: "Trip Id",
            accessorKey: 'tripId',
            enableColumnPinning: false,
            enableEditing: false,
        },
        {
            header: "Number of Seats",
            accessorKey: 'noOfSeats',
            enableEditing: false,
        },
        {
            header: "Member Count",
            accessorKey: 'memberCount',
            enableEditing: false,
        },
        {
            header: "Vip Trip",
            accessorKey: 'isVip',
            enableEditing: false,
        },
        {
            header: "Escort Trip",
            accessorKey: 'isEscort',
            enableEditing: false,
        },
        {
            header: "Pickup Point",
            accessorKey: 'pickupPoint',
        },
        {
            header: "Drop Point",
            accessorKey: 'dropPoint',
        },
        {
            header: "Pickup Time",
            accessorKey: 'pickupTime',
        },
    ]);

    const getAllTrips = async () => {
        try {
            const queryParams = {
                shiftId: 11,
                tripDate: '2024-07-24',
            };
            const params = new URLSearchParams(queryParams);
            const response = await DispatchService.getTripByShiftIdAndTripDate(params);
            console.log(response.data);
            var tripDetails = response.data;
            let tempTripData = [];
            await Promise.all(tripDetails);
            const memberPromises = tripDetails.map(async (trip) => {
                const memberCount = trip.bookingIds?.split(",")?.length || 0;
                let rowObject = {
                    tripId: trip.id,
                    noOfSeats: trip.noOfSeats,
                    memberCount: memberCount,
                    isVip: false,
                    isEscort: false,
                    pickupPoint: "",
                    dropPoint: "",
                    pickupTime: "",
                    subRows: []
                }
                const tripMemberResponse = await DispatchService.tripMembers(trip.id);
                await Promise.all(tripMemberResponse.data);
                // tempTripData.push(trip);
                tripMemberResponse.data.map((member, index) => {
                    if (index === 0) {
                        rowObject.pickupPoint = trip.shiftType === 'LOGIN' ? member.areaName : trip.officeId;
                    }
                    const memberObject = {
                        empId: member.empId,
                        name: member.name,
                        memberCount: 1,
                        isVip: false,
                        gender: member.gender,
                        pickupPoint: trip.shiftType === 'LOGIN' ? member.areaName : trip.officeId,
                        dropPoint: trip.shiftType === 'LOGIN' ? trip.officeId : member.areaName,
                        pickupTime: "",
                    }
                    rowObject.subRows.push(memberObject);
                    console.log("last member>>>>>", tripMemberResponse)
                    if (index === tripMemberResponse.data.length - 1) {
                        console.log("last member")
                        rowObject.dropPoint = trip.shiftType === 'LOGIN' ? trip.officeId : member.areaName;
                    }
                });
                tempTripData.push(rowObject);
                return tripMemberResponse.data;
            })
            await Promise.all(memberPromises);
            setData(tempTripData);
            console.log("Trip details>>>>", tempTripData);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getAllTrips();
    }, []);

    useEffect(() => {
        console.log(data);
    }, [data])

    useEffect(() => {
        $("#sortable").sortable({
            axis: "y",
            cursor: "move",
            items: '.subRows',
            opacity: 0.5
        });
        
        $( "#sortable" ).on( "sortactivate", function( event, ui ) {
            console.log("onChange",ui);
            var sortedIDs = $( ".subRows" );
            console.log(sortedIDs);
        } );
    }, [])

    return (
        <table className="table-router" style={{ marginTop: 40 }}>
            <thead>
                <tr>
                    {columns.map((val, index) => {
                        return (
                            <td key={val.accessorKey} style={{ fontWeight: 'bold' }}>
                                {val.header}
                            </td>
                        )
                    })}
                </tr>
            </thead>
            <tbody id="sortable">
                {
                    data && data.length > 0 &&
                    data.map((item, index) => {
                        return (
                            <>
                                <tr key={item.id} style={{ backgroundColor: '#f7cd486e' }} className="mainRow">
                                    <tr className="d-flex" style={{ borderBottom: 'none', alignItems: 'center' }}>
                                        <td>
                                            <Checkbox />
                                        </td>
                                        <td>
                                            <KeyboardArrowUpIcon />
                                        </td>
                                    </tr>
                                    {
                                        columns.map((key, idx) => {
                                            if (key.accessorKey !== "subRows" && key.accessorKey !== "checkbox") {
                                                return (
                                                    <td style={{ textAlign: 'left', fontWeight: 'bold' }}>{key.accessorKey === 'tripId' && 'TRIP-'}{item[key.accessorKey].toString() || 1}</td>
                                                )
                                            }
                                        })
                                    }
                                </tr>
                                {
                                    item?.subRows && item?.subRows.length > 0 &&
                                    item.subRows.map((member, idx) => {
                                        return (
                                            <tr key={idx} className="subRows">
                                                <tr className="d-flex" style={{ padding: 0, borderBottom: 'none', alignItems: 'center' }}>
                                                    <td style={{ borderBottom: 'none' }}>
                                                        <DragIndicatorIcon className="dragBtn"/>
                                                    </td>
                                                    <td style={{ borderBottom: 'none' }}>
                                                    <Checkbox />
                                                    </td>
                                                </tr>
                                                {
                                                    Object.keys(member).map((key) => {
                                                        if (key === 'pickupTime') {
                                                            return (
                                                                <td className="d-flex" style={{ alignItems: 'flex-start', borderBottom: 'none' }}>
                                                                    <TextField id="outlined-basic" variant="outlined" />
                                                                </td>
                                                            )
                                                        }
                                                        else {
                                                            return (
                                                                <td key={key} style={{ textAlign: 'left' }}>{member[key]}</td>
                                                            )
                                                        }
                                                    })
                                                }
                                            </tr>
                                        )
                                    })
                                }
                            </>

                        )
                    })
                }
            </tbody>
        </table>
    )
}

export default TripEditorManual;