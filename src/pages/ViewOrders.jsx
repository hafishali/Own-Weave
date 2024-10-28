import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Typography,
  Modal,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs'; 

const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null); // State for the order to delete

  // State to manage date pickers
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

 



  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Orders Report', 14, 16);

    const columns = ['Order ID', 'Customer', 'Date', 'Time', 'Payment Method', 'Status'];
    const rows = ['test']
    doc.autoTable({
      head: [columns],
      body: rows,
    });

    doc.save('orders_report.pdf');
  };

 

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  // const handleFilterOrders = () => {
  //   const formattedFromDate = fromDate ? dayjs(fromDate).format('YYYY-MM-DD') : null;
  //   const formattedToDate = toDate ? dayjs(toDate).format('YYYY-MM-DD') : null;

  //   loadOrders(formattedFromDate, formattedToDate); // Filter orders with selected dates
  // };

 

  const openConfirmDialog = () => {
    setConfirmDialogOpen(true); 
  };

 
  

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          View Orders
        </Typography>
        <Button variant="contained" color="primary" onClick={downloadPDF}>
          Export as PDF <PictureAsPdfIcon sx={{ ml: 1 }} />
        </Button>
      </Box>

      {/* Date filters */}
      <Box sx={{ display: 'flex', mb: 2, gap: 2 }}>
      <Typography gutterBottom>
         From
        </Typography>
        <input
          type="date"
          value={fromDate}
          
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <Typography gutterBottom>
        To
        </Typography>
        <input
          type="date"
          value={toDate}
         
          style={{ padding: '10px', fontSize: '16px' }}
        />
        <Button variant="contained" color="secondary" >
          Filter Orders
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: 'lightblue' }}>
            <TableRow>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Order ID</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Customer</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Date</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Time</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Payment Method</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Status</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
           
              <TableRow >
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}></TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}></TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}></TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}></TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}></TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}></TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  <Button variant="contained" color="primary" size="small" >
                    View
                  </Button>
                  <Button variant="contained" color="secondary" size="small" style={{ marginLeft: '10px' }} >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
           
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal to display order details */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            bgcolor: 'background.paper',
            p: 4,
            boxShadow: 24,
            position: 'relative',
            maxHeight: '80vh', // Limit height of modal
            overflowY: 'auto',  // Enable vertical scrolling
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'grey.500',
            }}
          >
            <CloseIcon />
          </IconButton>

          
            <>
              <Typography variant="h6" gutterBottom>
                Order Details
              </Typography>
              <Typography>
                <b>Order ID:</b> 
              </Typography>
              <Typography>
                <b>Customer:</b> 
              </Typography>
              <Typography>
                <b>Status:</b> 
              </Typography>
              <Typography>
                <b>Payment Method:</b> 
              </Typography>
              <Typography>
                <b>Total Price:</b> RS.
              </Typography>
              <Typography>
                <b>Order Time:</b> 
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Products:
              </Typography>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Product Name</b></TableCell>
                    <TableCell><b>Quantity</b></TableCell>
                    <TableCell><b>Weight</b></TableCell>
                    <TableCell><b>Price</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  
                    <TableRow >
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>RS.</TableCell>
                    </TableRow>
                  
                </TableBody>
              </Table>
            </>
          
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this order?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ViewOrders;
