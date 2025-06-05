import React from 'react';

const SimplePdfViewer = ({ 
  fileUrl = "https://www.rd.usda.gov/sites/default/files/pdf-sample_0.pdf", 
  title = "PDF Viewer", 
  width = "100%", 
  height = "600px" 
}) => {

  return (
    <div style={{ maxWidth: '100%', margin: '20px auto' }}>
      <h2>{title}</h2>
      
      <iframe
        src={fileUrl}
        width={width}
        height={height}
        title={title}
        style={{ border: '1px solid #ccc', borderRadius: '8px' }}
      />

      
    </div>
  );
};

const btnStyle = {
  padding: '8px 16px',
  backgroundColor: '#007BFF',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

export default SimplePdfViewer;
