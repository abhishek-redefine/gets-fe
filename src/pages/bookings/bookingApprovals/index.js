import React, { useState } from 'react';
import styles from '../../../styles/bookingApprovals.module.css'; // External CSS file
import BookingsPage from '..';

const BookingApprovals = () => {
  // Sample booking approvals data
  const initialBookingApprovals = [
    { id: 1, employeeName: 'John Doe', employeeTeam: 'Team A', shiftType: 'Day', shiftTime: '9:00 AM - 5:00 PM', travelDate: '2024-02-05', reportingManager: 'Jane Smith', status: 'Pending', gender: 'Male', address: '123 Main St, City', transportType: 'Car' },
    { id: 2, employeeName: 'Alice Johnson', employeeTeam: 'Team B', shiftType: 'Night', shiftTime: '7:00 PM - 3:00 AM', travelDate: '2024-02-06', reportingManager: 'Bob Brown', status: 'Approved', gender: 'Female', address: '456 Elm St, Town', transportType: 'Bus' },
    
    // Add more sample data as needed
  ];

  const pageSizeOptions = [1, 3, 5]; // Options for rows per page
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingApprovals, setBookingApprovals] = useState(initialBookingApprovals);

  // Function to handle checkbox state
  const handleCheckboxChange = (e, id) => {
    const updatedApprovals = bookingApprovals.map(item =>
      item.id === id ? { ...item, selected: e.target.checked } : item
    );
    setBookingApprovals(updatedApprovals);
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * pageSize;
  const indexOfFirstRecord = indexOfLastRecord - pageSize;
  const currentRecords = bookingApprovals.slice(indexOfFirstRecord, indexOfLastRecord);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <>
    <BookingsPage/>
    <div className={styles.container}>
      <div className={styles.header}>
        <h6 className={styles.heading}>Booking Approvals</h6>
        <div className={styles.buttons}>
          <button className={styles.outlinedButton}>Accept</button>
          <button className={styles.containedButton}>Reject</button>
        </div>
      </div>
      <table className={styles.bookingTable}>
        <thead>
          <tr>
            <th></th>
            <th>Employee Name</th>
            <th>Employee Team</th>
            <th>Shift Type</th>
            <th>Shift Time</th>
            <th>Travel Date</th>
            <th>Reporting Manager</th>
            <th>Status</th>
            <th>Gender</th>
            <th>Address</th>
            <th>Transport Type</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map(approval => (
            <tr key={approval.id}>
              <td>
                <input
                  type="checkbox"
                  onChange={e => handleCheckboxChange(e, approval.id)}
                  checked={approval.selected || false}
                />
              </td>
              <td>{approval.employeeName}</td>
              <td>{approval.employeeTeam}</td>
              <td>{approval.shiftType}</td>
              <td>{approval.shiftTime}</td>
              <td>{approval.travelDate}</td>
              <td>{approval.reportingManager}</td>
              <td>{approval.status}</td>
              <td>{approval.gender}</td>
              <td>{approval.address}</td>
              <td>{approval.transportType}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.tableControls}>
        <div className={styles.leftControls}>
          <div className={styles.pageSizer}>
            <span>Show</span>
            <select value={pageSize} onChange={e => setPageSize(parseInt(e.target.value))}>
              {pageSizeOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            <span>entries</span>
          </div>
        </div>
        <div className={styles.rightControls}>
          {/* Pagination */}
          <div className={styles.pagination}>
            <button disabled={currentPage === 1} onClick={() => paginate(currentPage - 1)}>&lt;</button>
            <span>{`Page ${currentPage} of ${Math.ceil(bookingApprovals.length / pageSize)}`}</span>
            <button disabled={currentPage === Math.ceil(bookingApprovals.length / pageSize)} onClick={() => paginate(currentPage + 1)}>&gt;</button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default BookingApprovals;
