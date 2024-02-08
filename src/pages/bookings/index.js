// pages/bookings.js
import React from 'react';
import Link from 'next/link'; // Import Link from Next.js
import Navbar from '../../components/Navbar';
import Button from '@mui/material/Button';

const BookingsPage = () => {
  return (
    <div>
      <Navbar />
      
      {/* Buttons */}
      <div style={{ display: 'flex', justifyContent: 'left', marginTop: '20px', marginLeft: '16px', fontSize:"12px" }}>
        <Link href="/bookings/searchBooking" passHref>
          <Button 
            variant="contained" 
            color="primary" 
            size="small"
            style={{ 
              marginRight: '10px',
              backgroundColor: 'white',
              color: 'black',
            }}
          >
            Search Booking
          </Button>
        </Link>
        <Link href="/bookings/createBooking" passHref>
          <Button 
            variant="contained" 
            color="primary" 
            size="small"
            style={{ 
              marginRight: '10px',
              backgroundColor: 'white',
              color: 'black',
            }}
          >
            Create Booking
          </Button>
        </Link>
        <Link href="/bookings/uploadBookings" passHref>
          <Button 
            variant="contained" 
            color="primary" 
            size="small"
            style={{ 
              marginRight: '10px',
              backgroundColor: 'white',
              color: 'black',
            }}
          >
            Upload Bookings
          </Button>
        </Link>
        <Link href="/bookings/bookingApprovals" passHref>
          <Button 
            variant="contained" 
            color="primary"
            size="small"
            style={{ 
              backgroundColor: 'white',
              color: 'black',
            }}
          >
            Booking Approvals
          </Button>
        </Link>
      </div>
      
      {/* Add your content here */}
    </div>
  );
};

export default BookingsPage;
