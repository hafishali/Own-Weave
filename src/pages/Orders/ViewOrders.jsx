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
  TextField, Grid, MenuItem, Select, FormControl, InputLabel

} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import DescriptionIcon from '@mui/icons-material/Description';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';
import { editOrder, ViewallOrder } from '../../services/allApi';
import { Label } from 'recharts';
import { toast, ToastContainer } from 'react-toastify';



const ViewOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openCustomer, setOpenCustomer] = useState(false)
  const [open, setOpen] = useState(false);
  const [trackmodal, setTrackmodal] = useState(false)
  const [addOrderModal, setAddOrderModal] = useState(false)
  const [addressModal, setAddressModal] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null); // State for the order to delete
  const [orderStatuses, setOrderStatuses] = useState({}); // Object to hold statuses of individual orders
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [updatedCustomer, setUpdatedCustomer] = useState({
    payment_status: "",
    status: "",
    Track_id: ""
  })
  const [isEnabled, setIsEnabled] = useState(false)
  // State to manage date pickers
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
 


  // const downloadPDF = () => {
  //   const doc = new jsPDF();
  //   doc.text('Orders Report', 14, 16);

  //   const columns = ['Order ID', 'Customer', 'Date', 'Time', 'Payment Method', 'Status'];
  //   const rows = ['test']
  //   doc.autoTable({
  //     head: [columns],
  //     body: rows,
  //   });

  //   doc.save('orders_report.pdf');
  // };
  const downloadExcel = () => {
    // Prepare the worksheet data dynamically
    const worksheetData = [
      [
        'Order ID',
        'Customer Name',
        'Customer Email',
        'Customer Mobile',
        'Shipping Address',
        'Product Name',
        'Product Code',
        'Product Color',
        'Product Size',
        'Product Sleeve',
        'Quantity',
        'Price',
        'Total Price',
        'Payment Option',
        'Payment Status',
        'Track id',
        'Order Status',
        'Order Date',
        'Order Time',
      ], // Header row
      ...orders.flatMap((order) => {
        const {
          id,
          user,
          shipping_address,
          items,
          total_price,
          payment_option,
          payment_status,
          Track_id,
          status,
          created_at,
        } = order || {}; // Ensure `order` exists
  
        // Format shipping address as a single string, using optional chaining
        const formattedAddress = shipping_address
          ? `${shipping_address?.address || 'N/A'}, ${shipping_address?.block || 'N/A'}, ${shipping_address?.district || 'N/A'}, ${shipping_address?.state || 'N/A'}, ${shipping_address?.country || 'N/A'} - ${shipping_address?.pincode || 'N/A'}`
          : 'N/A';
  
        // Map each product in the items array to a row
        return items?.map((item) => [
          id || 'N/A', // Order ID
          user?.name || 'N/A', // Customer Name
          user?.email || 'N/A', // Customer Email
          user?.mobile_number || 'N/A', // Customer Mobile
          formattedAddress, // Shipping Address
          item?.product?.name || 'N/A', // Product Name
          item?.product_code || 'N/A', // Product Code
          item?.product_color || 'N/A', // Product Color
          item?.size || 'N/A', // Product Size
          item?.sleeve || 'N/A', // Product Sleeve
          item?.quantity || 0, // Quantity
          item?.price || 0, // Price per item
          total_price || 0, // Total Price
          payment_option || 'N/A', // Payment Option

          payment_status || 'N/A', // Payment Status
          Track_id || 'N/A',
          status || 'N/A', // Order Status
          created_at?.split('T')?.[0] || 'N/A', // Order Date
          created_at?.split('T')?.[1]?.split('.')?.[0] || 'N/A', // Order Time
        ]) || []; // Ensure `items` exists
      }),
    ];
  
    // Create a new workbook and add the worksheet data
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders Report');
  
    // Trigger download
    XLSX.writeFile(workbook, 'orders_report.xlsx');
  };
  
  
  const handleGetallorders = async () => {
    try {
      const response = await ViewallOrder()
      if (response.status === 200) {
        setOrders(response.data);
        setFilteredOrders(response.data);
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    handleGetallorders()
  }, [])
  console.log(orders)
  const handleopenorder = (item) => {
    setSelectedOrder(item)
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };
  const openConfirmDialog = () => {
    setConfirmDialogOpen(true);
  };
  const handleCustomerOpen = (item) => {
    setOpenCustomer(true)
    setSelectedOrder(item)

  }
  const handleaddressOpen = (item) => {
    setSelectedOrder(item)
    setAddressModal(true)
  }
  const handleEdit = (order) => {
    setTrackmodal(true)
    setSelectedOrder(order)
    setUpdatedCustomer({
      payment_status: order.payment_status || "", // Initialize with existing values
      status: order.status || "",  // Existing status value
      Track_id: order.Track_id || "",

    });
    if (order?.payment_option === 'Razorpay') {
      setIsEnabled(true);
    } else {
      setIsEnabled(false); // Reset to default if not Razorpay
    }

  }
  const handleCloseEdit = () => {
    setTrackmodal(false)
    setUpdatedCustomer({
      payment_status: "",
      status: "",
      Track_id: ""
    })
    setIsEnabled(false)
  }
  const handleStatusChange = (event) => {
    setUpdatedCustomer(prevState => ({
      ...prevState,
      status: event.target.value // Update the status in the updatedCustomer state
    }));
  };
  const handlePaymentStatusChange = (event) => {
    setUpdatedCustomer(prevState => ({
      ...prevState,
      payment_status: event.target.value // Update the status in the updatedCustomer state
    }));
  };

  const handleEditorders = async (id) => {
    console.log(id)
    console.log(updatedCustomer)
    try {
      const response = await editOrder(id, updatedCustomer)
      if (response.status === 200) {
        toast.success("order has been edited successfully")
        handleCloseEdit()
        handleGetallorders()
      }
    } catch (error) {
      console.log(error)
      toast.error("something went wrong at editing")

    }
    finally {
      setUpdatedCustomer({
        payment_status: "",
        status: "",
        Track_id: ""
      })

    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'green';
      case 'pending':
        return 'orange';
      case 'Accept':
        return 'blue';
      case 'Reject':
        return 'red';
      case 'Return':
        return 'blue';
      default:
        return 'black';
    }
  };
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          View Orders
        </Typography>
        <Button variant="contained" color="primary" onClick={downloadExcel}>
          Export as excel <DescriptionIcon sx={{ ml: 1 }} />
        </Button>
      </Box>

      {/* Date filters */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', mb: 2, gap: 2 }}>
          {/* <FormControl fullWidth>
          <InputLabel id="status-select-label">Status</InputLabel>
          <Select
            labelId="status-select-label"
            label="Choose Status"
            value={status}
            onChange={handleStatusChange}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Accept">Accepted</MenuItem>
            <MenuItem value="Reject">Rejected</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="Return">Returned</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl> */}

        </Box>
        

      </Box>


      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: 'lightblue' }}>
            <TableRow>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Order ID</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Customer</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Date</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Time</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Shipping Address</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Payment Method</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Payment Status</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Track id</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b> Order Status</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {filteredOrders && filteredOrders.length > 0 ? filteredOrders.map((item, index) => (
              <TableRow key={index}>
                {/* Order ID Column */}
                <TableCell
                  style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                  sx={{ color: "blue", cursor: "pointer" }}
                  onClick={() => handleopenorder(item)}
                >
                  <u>{item.id}</u>
                </TableCell>

                {/* Customer Name Column */}
                <TableCell
                  style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                  sx={{ color: "blue", cursor: "pointer" }}
                  onClick={() => handleCustomerOpen(item)}
                >
                  <u>{item.user?.name}</u>
                </TableCell>

                {/* Additional Empty Columns */}
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{item.created_at.split("T")[0]}</TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{item.created_at.split("T")[1].split(".")[0]}</TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center', color: "blue", cursor: "pointer" }} onClick={() => handleaddressOpen(item)}><u>View</u></TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{item.payment_option}</TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{item.payment_status}</TableCell>


                {/* Track ID Column */}
                <TableCell
                  style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                  sx={{ color: "blue", cursor: "pointer" }}

                >
                  {item.Track_id}
                </TableCell>


                <TableCell style={{ textAlign: 'center' }}>
                  <Button style={{ color: getStatusColor(item.status) }}>{item.status}</Button>

                </TableCell>


                {/* Action Buttons Based on Status */}
                <TableCell><IconButton aria-label="Edit" onClick={() => handleEdit(item)}>
                  <EditIcon />
                </IconButton>

                  {/* <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton> */}
                </TableCell>
              </TableRow>
            )) : (
              // Fallback Message when there are no orders
              <TableRow>
                <TableCell colSpan={8} style={{ textAlign: 'center' }}>
                  No Orders Available
                </TableCell>
              </TableRow>
            )}



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

          <Typography variant="h6" gutterBottom>
            Order Details
          </Typography>

          {/* Order Information */}
          <Typography><b>Order ID:</b> {selectedOrder?.id}</Typography>
          <Typography><b>Customer:</b> {selectedOrder?.user?.name}</Typography>
          <Typography><b>Status:</b> {selectedOrder?.status}</Typography>
          <Typography><b>Total Price:</b> RS. {selectedOrder?.total_price}</Typography>
          <Typography><b>Order Time:</b> {new Date(selectedOrder?.created_at).toLocaleString()}</Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Products:
          </Typography>

          {/* Product Table */}
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><b>Product Id</b></TableCell>
                <TableCell><b>Product Code</b></TableCell>
                <TableCell><b>Product Name</b></TableCell>
                <TableCell><b>Product Color</b></TableCell>
                <TableCell><b>Quantity</b></TableCell>
                <TableCell><b>Size</b></TableCell>
                <TableCell><b>Sleeve</b></TableCell>
                <TableCell><b>Price</b></TableCell>
                <TableCell><b> Offer Price</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedOrder?.items && selectedOrder?.items.length > 0 ? (
                selectedOrder.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.product?.id}</TableCell>
                    <TableCell>{item.product?.product_code}</TableCell>
                    <TableCell>{item.product?.name}</TableCell>
                    <TableCell>{item.product?.color}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.size}</TableCell>
                    <TableCell>{item.sleeve}</TableCell>
                    <TableCell>RS. {item.price}</TableCell>
                    <TableCell>RS. {item.product?.offer_price_per_meter}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">No products for this order</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      </Modal>

      {/* modal for customer details */}
      <Modal open={openCustomer} onClose={() => setOpenCustomer(false)}>
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
            onClick={() => setOpenCustomer(false)}
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
            <Typography sx={{ display: "flex", justifyContent: "center" }} variant="h6" gutterBottom>
              Customer Details
            </Typography>

            <Typography>
              <b>Customer Name:</b>{selectedOrder?.user?.name}
            </Typography>
            <Typography>
              <b>Email:</b>{selectedOrder?.user?.email}
            </Typography>
            <Typography>
              <b>Phone:</b>{selectedOrder?.user?.mobile_number}
            </Typography>
          </>

        </Box>
      </Modal>
      {/* modal for view address */}
      <Modal open={addressModal} onClose={() => setAddressModal(false)}>
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
            onClick={() => setAddressModal(false)}
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
            <Typography sx={{ display: "flex", justifyContent: "center" }} variant="h6" gutterBottom>
              Shipping Address:
            </Typography>

            <Typography>
            <b>Name:</b> {selectedOrder?.shipping_address?.name || selectedOrder?.user?.name}
            </Typography>
          
            <Typography>
              <b>Phone:</b>{selectedOrder?.shipping_address?.mobile_number || selectedOrder?.user?.mobile_number}
            </Typography>
            <Typography>
              <b>Address:</b>{selectedOrder?.shipping_address?.address}
            </Typography>
            <Typography>
              <b>pincode:</b>{selectedOrder?.shipping_address?.pincode}
            </Typography>
            <Typography>
              <b>Post office:</b>{selectedOrder?.shipping_address?.post_office}
            </Typography>
            <Typography>
              <b>Block:</b>{selectedOrder?.shipping_address?.block}
            </Typography>
            <Typography>
              <b>District:</b>{selectedOrder?.shipping_address?.district}
            </Typography>
            <Typography>
              <b>State:</b>{selectedOrder?.shipping_address?.state}
            </Typography>
            <Typography>
              <b>Country:</b>{selectedOrder?.shipping_address?.country}
            </Typography>
            <Typography>
              <b>Home Address:</b>{selectedOrder?.shipping_address?.is_home === true ? 'yes' : 'No'}
            </Typography>
            <Typography>
              <b>Office Address:</b>{selectedOrder?.shipping_address?.is_office === true ? 'yes' : 'No'}
            </Typography>
            <Typography>
              <b>Other Address:</b>{selectedOrder?.shipping_address?.is_other === true ? 'yes' : 'No'}
            </Typography>
            <Typography>
              <b>Defualt Address:</b>{selectedOrder?.shipping_address?.is_default === true ? 'yes' : 'No'}
            </Typography>

          </>

        </Box>
      </Modal>
      {/* modal for track id */}
      <Modal open={trackmodal} onClose={handleCloseEdit}>
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
            onClick={handleCloseEdit}
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
            <Typography sx={{ display: "flex", justifyContent: "center" }} variant="h6" gutterBottom>
              Edit Orders
            </Typography>

            <Grid container mt={2} >
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Track Id"
                  variant="outlined"
                  placeholder='paste track id here'
                  value={updatedCustomer.Track_id}
                  onChange={(e) => setUpdatedCustomer({ ...updatedCustomer, Track_id: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} mt={3}>
                <Label>Order status</Label>
                <FormControl fullWidth>
                  <InputLabel id="status-select-label"> Order Status</InputLabel>
                  <Select
                    labelId="status-select-label"
                    label="Choose Status"
                    value={updatedCustomer.status} // Dynamically set the value
                    onChange={handleStatusChange} // Update state on change
                  >
                    <MenuItem value="Accept">Accept</MenuItem>
                    <MenuItem value="Reject">Reject</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Return">Return</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} mt={3} sx={{ "marginLeft": "5px" }}>
                <Label>Payment status</Label>
                <FormControl fullWidth>
                  <InputLabel id="status-select-label"> Payment Status</InputLabel>
                  <Select
                    labelId="status-select-label"
                    label="Choose Status"
                    disabled={isEnabled}
                    value={updatedCustomer.payment_status} // Dynamically set the value
                    onChange={handlePaymentStatusChange}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Paid">Paid</MenuItem>
                    <MenuItem value="Failed">Failed</MenuItem>



                  </Select>
                </FormControl>
              </Grid>
            </Grid>



            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='success' sx={{ backgroundColor: "green", marginTop: '5px' }} onClick={() => handleEditorders(selectedOrder.id)}  > save Changes</Button>
            </Box>




          </>

        </Box>
      </Modal>
    


      {/* Delete Confirmation Dialog */}
      {/* <Dialog
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
      </Dialog> */}
      <ToastContainer />
    </Box>
  );
};

export default ViewOrders;
