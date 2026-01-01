import React, { useState } from 'react';
import API from '../api/index';
import { Button } from './ui/Button';

const UploadReport = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      console.log('Uploading file with token present?', !!token);
      console.log('Uploading file info:', file && { name: file.name, size: file.size, type: file.type });
      await API.post('/reports/upload', formData);
      alert('Upload Successful');
      setFile(null);
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      console.error(error);
      const message = error?.response?.data?.message || 'Upload Failed';
      alert(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-6 shadow rounded-lg mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Medical Report</h3>
      <div className="flex items-center gap-4">
        <input 
            type="file" 
            onChange={handleFileChange} 
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-sky-50 file:text-primary
              hover:file:bg-sky-100"
        />
        <Button onClick={handleUpload} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
    </div>
  );
};

export default UploadReport;
