import { useState } from 'react';
import styles from '../../styles/uploadHistory.module.css'; // External CSS file

const UploadHistory = () => {
  // Sample upload history data
  const initialUploadHistory = [
    { id: 1, fileName: 'example1.pdf', category: 'Documents', uploadedBy: 'John Doe', uploadedAt: '2024-02-01', uploadStatus: 'Success' },
    { id: 2, fileName: 'example2.png', category: 'Images', uploadedBy: 'Jane Smith', uploadedAt: '2024-01-31', uploadStatus: 'Success' },
    { id: 3, fileName: 'example1.pdf', category: 'Documents', uploadedBy: 'John Doe', uploadedAt: '2024-02-01', uploadStatus: 'Success' },
    { id: 4, fileName: 'example2.png', category: 'Images', uploadedBy: 'Jane Smith', uploadedAt: '2024-01-31', uploadStatus: 'Success' },
    { id: 5, fileName: 'example1.pdf', category: 'Documents', uploadedBy: 'John Doe', uploadedAt: '2024-02-01', uploadStatus: 'Success' },
    { id: 6, fileName: 'example2.png', category: 'Images', uploadedBy: 'Jane Smith', uploadedAt: '2024-01-31', uploadStatus: 'Success' },
  ];

  const pageSizeOptions = [1, 3, 5]; // Options for rows per page
  const [pageSize, setPageSize] = useState(pageSizeOptions[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadHistory, setUploadHistory] = useState(initialUploadHistory);

  // Function to handle checkbox state
  const handleCheckboxChange = (e, id) => {
    const updatedHistory = uploadHistory.map(item =>
      item.id === id ? { ...item, selected: e.target.checked } : item
    );
    setUploadHistory(updatedHistory);
  };

  // Pagination logic
  const indexOfLastRecord = currentPage * pageSize;
  const indexOfFirstRecord = indexOfLastRecord - pageSize;
  const currentRecords = uploadHistory.slice(indexOfFirstRecord, indexOfLastRecord);

  // Change page
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <div className={styles.container}>
      <button className={styles.uploadBtn}>Upload</button>
      <h5 className={styles.heading}>Upload History</h5>
      <table className={styles.uploadTable}>
        <thead>
          <tr>
            <th></th>
            <th>File Name</th>
            <th>Upload Category</th>
            <th>Uploaded By</th>
            <th>Uploaded At</th>
            <th>Upload Status</th>
          </tr>
        </thead>
        <tbody>
          {currentRecords.map(upload => (
            <tr key={upload.id}>
              <td>
                <input
                  type="checkbox"
                  onChange={e => handleCheckboxChange(e, upload.id)}
                  checked={upload.selected || false}
                />
              </td>
              <td>{upload.fileName}</td>
              <td>{upload.category}</td>
              <td>{upload.uploadedBy}</td>
              <td>{upload.uploadedAt}</td>
              <td>{upload.uploadStatus}</td>
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
            <span>{`Page ${currentPage} of ${Math.ceil(uploadHistory.length / pageSize)}`}</span>
            <button disabled={currentPage === Math.ceil(uploadHistory.length / pageSize)} onClick={() => paginate(currentPage + 1)}>&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadHistory;
