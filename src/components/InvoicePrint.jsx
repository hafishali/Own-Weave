import React, { useRef } from 'react';
import { Button } from '@mui/material';
import { useReactToPrint } from 'react-to-print';
import CustomInvoice from './CustomInvoice';  // Adjust the path as needed

const InvoicePrint = ({ orderDetails }) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <CustomInvoice ref={componentRef} orderDetails={orderDetails} />
      <Button variant="contained" onClick={handlePrint}>
        Generate PDF
      </Button>
    </div>
  );
};

export default InvoicePrint;
