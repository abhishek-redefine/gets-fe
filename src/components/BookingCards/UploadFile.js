import React, { useState } from 'react';
import UploadHistory from './UploadHistory'; // Assuming UploadHistory component is in the same directory

import styles from '../../styles/upload.module.css';

const UploadFile = () => {
  const [showUploadHistory, setShowUploadHistory] = useState(false);

  const handleViewHistoryClick = () => {
    setShowUploadHistory(true);
  };

  return (
    <div className={styles.uploadContainer}>
      <div className={styles.uploadHeader}>
        <h5>Upload File</h5>
        <button className={styles.viewHistoryBtn} onClick={handleViewHistoryClick}>View Upload History</button>
      </div>
      <div className={styles.uploadContent}>
        {showUploadHistory ? (
          <UploadHistory />
        ) : (
          <>
            <div className={styles.dragDropArea}>
              <p>Drag & Drop files here</p>
            </div>
            <div className={styles.uploadOptions}>
              <div className={styles.leftOptions}>
                <button className={styles.importBtn}>Import from Computer</button>
                <a href="#" download="template.xlsx" className={styles.downloadTemplateBtn}>Download Template</a>
              </div>
              <div className={styles.rightOptions}>
                <button className={styles.uploadBtn}>Upload</button>
                <button className={styles.cancelBtn}>Cancel</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default UploadFile;
