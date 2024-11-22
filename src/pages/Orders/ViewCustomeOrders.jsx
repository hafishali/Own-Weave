import React, { useEffect, useState } from 'react'
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
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast, ToastContainer } from 'react-toastify';
import { addCustomeOrders, editCustomOrders, viewCustomOrders } from '../../services/allApi';
import DescriptionIcon from '@mui/icons-material/Description';
import * as XLSX from 'xlsx';


function ViewCustomeOrders() {
  const [addOrderModal, setAddOrderModal] = useState(false)
  const [customOrder, setCustomOrder] = useState([])
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openCustomer, setOpenCustomer] = useState(false)
  const [addressModal, setAddressModal] = useState(false)
  const [trackmodal, setTrackmodal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    state: '',
    pincode: '',
    city: '',
    district: '',
    product_code: '',
    size: '',
    custom_length: '',
    quantity: '',
    sleeve: '',
    paymentMethod: '',
    paymentStatus: '',

  });
  const [updatedCustom, setUpdatedCustom] = useState({
    paymentStatus: ""
  })
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleopenorder = (item) => {
    setSelectedOrder(item)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
  };

  const handleCustomerOpen = (item) => {
    setOpenCustomer(true)
    setSelectedOrder(item)

  }
  const handleaddressOpen = (item) => {
    setSelectedOrder(item)
    setAddressModal(true)
  }
  const handleaddModalClose = () => {
    setAddOrderModal(false)
    setFormData({
      name: '',
    phoneNumber: '',
    address: '',
    state: '',
    pincode: '',
    city: '',
    district: '',
    product_code: '',
    size: '',
    customSize: '',
    quantity: '',
    sleeveType: '',
    paymentMethod: '',
    paymentStatus: '',
    })
  }

  const handleEdit = (order) => {
    setTrackmodal(true)
    setSelectedOrder(order)
  }
  const handleCloseEdit = () => {
    setTrackmodal(false)
    setSelectedOrder(null)
  }
  console.log(formData)
  const handleGetCustom = async () => {
    try {
      const response = await viewCustomOrders()
      if (response.status === 200) {
        setCustomOrder(response.data)
      }
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    handleGetCustom()
  }, [])
  const handleAddCustomeorder = async () => {
    const { name, phoneNumber, address, state, pincode, city, district, product_code, size, custom_length, quantity, sleeve, paymentMethod, paymentStatus } = formData
    try {
      if (!name || !phoneNumber || !address || !state || !pincode || !city || !district || !product_code || !quantity || !sleeve || !paymentMethod || !paymentStatus) {
        toast.error("All fields are required")
      }
      else if (!size && !custom_length) {
        toast.error("Please select either Size or Custom Size.")
      }
      else {
        const response = await addCustomeOrders(formData)
        if (response.status === 201) {
          toast.success("order created successfully")
          handleClose()
          setFormData({
            name: '',
            phoneNumber: '',
            address: '',
            state: '',
            pincode: '',
            city: '',
            district: '',
            product_code: '',
            size: '',
            custom_length: '',
            quantity: '',
            sleeve: '',
            paymentMethod: '',
            paymentStatus: '',
            
          })
        }
        handleGetCustom()
      }
    } catch (error) {
      console.log(error)
      toast.error("some thing went wrong")
    }
  }

  const handleEditCustomer = async (id) => {
    try {
      const response = await editCustomOrders(id, updatedCustom)
      if(response.status===200){
        toast.success("payment status updated successfully ")
        handleGetCustom()
        handleCloseEdit()
        setUpdatedCustom({
          paymentStatus: ""
        })
      }
    } catch (error) {
console.log(error)
toast.error("Something went wrong at editing status")
    }
  }

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
      ...customOrder.flatMap((order) => {
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
  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          View Custome Orders
        </Typography>
        <Button variant="contained" color="primary" /* onClick={downloadExcel} */>
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
        <Box sx={{ display: 'flex', mb: 2, gap: 2 }} >
          <Button variant="contained" sx={{ marginTop: '10px' }} color="success" onClick={() => setAddOrderModal(true)} >
            Add custom order
          </Button>
        </Box>

      </Box>


      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: 'lightblue' }}>
            <TableRow>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>SI</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Name</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Mobile Number</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Orders</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Custom Size</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Date</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Address</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Payment Method</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Payment Status</b></TableCell>
              {/* <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Track id</b></TableCell> */}
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b> Offer</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

            {customOrder && customOrder.length > 0 ? customOrder.map((item, index) => (<TableRow >
              <TableCell
                style={{ whiteSpace: 'nowrap', textAlign: 'center' }}

              >
                {index + 1}
              </TableCell>
              <TableCell
                style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
              /*  sx={{ color: "blue", cursor: "pointer" }} */
              /*  onClick={() => handleCustomerOpen()} */
              >
                {item.name}
              </TableCell>
              <TableCell
                style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
              /*  sx={{ color: "blue", cursor: "pointer" }} */
              /*  onClick={() => handleCustomerOpen()} */
              >
                {item.phoneNumber}
              </TableCell>
              <TableCell
                style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                sx={{ color: "blue", cursor: "pointer" }}
                onClick={() => handleopenorder(item)}
              >
                <u>Product</u>
              </TableCell>

              {/* Additional Empty Columns */}

              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}> {item.customSize}</TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{new Date(item?.created_at).toLocaleString()}</TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center', color: "blue", cursor: "pointer" }} onClick={() => handleaddressOpen(item)}><u>View</u></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>{item.paymentMethod}</TableCell>


              {/* Track ID Column */}
              <TableCell
                style={{ whiteSpace: 'nowrap', textAlign: 'center' }}

              >
                {item.paymentStatus}
              </TableCell>


              <TableCell style={{ textAlign: 'center' }}>
                <Button ></Button>

              </TableCell>


              {/* Action Buttons Based on Status */}
              <TableCell><IconButton aria-label="Edit" onClick={() => handleEdit(item)}>
                <EditIcon />
              </IconButton>

                {/* <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton> */}
              </TableCell>
            </TableRow>)) : (<TableRow>No Custom Orders</TableRow>)}





          </TableBody>
        </Table>
      </TableContainer>

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

      {/* modal for add orders */}
      <Modal open={addOrderModal} onClose={ handleaddModalClose}>
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
            onClick={ handleaddModalClose}
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
              Add Orders
            </Typography>
            <Grid item xs={12}>
              <Box mt={2}>
                <Typography variant="h6">User Details:</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Name"
                      name='name'
                      variant="outlined"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name='phoneNumber'
                      label="Phone Number"
                      variant="outlined"
                      type="text"
                      value={formData.phoneNumber}
                      onChange={handleChange}

                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      name='address'
                      label="Address"
                      variant="outlined"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name='state'
                      label="state"
                      variant="outlined"
                      type="text"
                      value={formData.state}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name='pincode'
                      label="Pincode"
                      variant="outlined"
                      type="text"
                      value={formData.pincode}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name='city'
                      label="City"
                      variant="outlined"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name='district'
                      label="District"
                      variant="outlined"
                      type="text"
                      value={formData.district}
                      onChange={handleChange}
                    />

                  </Grid>
                </Grid>
              </Box>
              <Box mt={2}>
                <Typography variant="h6">Product Details:</Typography>
                <Grid container spacing={2}>

                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      name='product_code'
                      label="Product code"
                      variant="outlined"
                      type="text"
                      value={formData.product_code}
                      onChange={handleChange}


                    />
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Size</InputLabel>
                      <Select
                        name='size'
                        label="Size"
                        defaultValue=""
                        value={formData.size}
                        onChange={handleChange}
                      >
                        <MenuItem value="L">L</MenuItem>
                        <MenuItem value="XL">XL</MenuItem>
                        <MenuItem value="XXL">XXL</MenuItem>
                        <MenuItem value="XXXL">XXXL</MenuItem>
                        <MenuItem value="4XL">4XL</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>


                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      name='custom_length'
                      label="Custome Size"
                      variant="outlined"
                      type="number"
                      value={formData.custom_length}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextField
                      fullWidth
                      name='quantity'
                      label="Quantity"
                      variant="outlined"
                      type="number"
                      value={formData.quantity}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Sleeve Type</InputLabel>
                      <Select
                        label="Sleeve Type"
                        name='sleeve'
                        defaultValue=""
                        value={formData.sleeve}
                        onChange={(e) => setFormData({ ...formData, sleeve: e.target.value })}
                      >
                        <MenuItem value="full">Full Sleeve</MenuItem>
                        <MenuItem value="half">Half Sleeve</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Payment Method</InputLabel>
                      <Select
                        label="Payment Method"
                        name='paymentMethod'
                        defaultValue=""
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      >
                        <MenuItem value="COD">COD</MenuItem>
                        <MenuItem value="Online">UPI</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Payment Status</InputLabel>
                      <Select
                        label="Payment Status"
                        name='paymentStatus'
                        defaultValue=""
                        value={formData.paymentStatus}
                        onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Completed">Paid</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {/* <Grid item xs={4}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Offers</InputLabel>
                      <Select
                        label="Offers"
                        defaultValue=""
                        value={formData.offer}
                        onChange={(e) => setFormData({ ...formData, offer: e.target.value })}
                      >

                        <MenuItem value="BOGO">Buy One Get One</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid> */}
                </Grid>
              </Box>
            </Grid>




            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='success' sx={{ backgroundColor: "green", marginTop: '5px' }} onClick={handleAddCustomeorder} > save</Button>
            </Box>
          </>

        </Box>
      </Modal>

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

          <Typography variant="h4" gutterBottom>
            Order Details
          </Typography>

          {/* Order Information */}
          <Typography><b>Order ID:</b> {selectedOrder?.id}</Typography>
          <Typography><b>size:</b> {selectedOrder?.size}</Typography>
          <Typography><b>customSize:</b> {selectedOrder?.customSize}</Typography>
          <Typography><b>Sleeve Type:</b> {selectedOrder?.sleeveType}</Typography>
          <Typography><b>Total Price:</b> RS. {selectedOrder?.total_price}</Typography>
          <Typography><b>Order Time:</b> {new Date(selectedOrder?.created_at).toLocaleString()}</Typography>

          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Products:
          </Typography>

          {/* Product Table */}
          <Table>
            <TableHead>
              <TableRow>

                <TableCell><b>Product Code</b></TableCell>
                <TableCell><b>Product Name</b></TableCell>
                <TableCell><b>Product Color</b></TableCell>
                <TableCell><b>Quantity</b></TableCell>
                <TableCell><b>Category</b></TableCell>
                <TableCell><b>Price</b></TableCell>
                <TableCell><b> Offer Price</b></TableCell>
                <TableCell><b> Total Price</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

              <TableRow>

                <TableCell>{selectedOrder?.product_code}</TableCell>
                <TableCell>{selectedOrder?.product_details?.name}</TableCell>
                <TableCell>{selectedOrder?.product_details?.color}</TableCell>
                <TableCell>{selectedOrder?.quantity}</TableCell>
                <TableCell>{selectedOrder?.product_details?.category}</TableCell>
                <TableCell>RS.{selectedOrder?.product_details?.price_per_meter}</TableCell>
                <TableCell>RS.{selectedOrder?.product_details?.offer_price_per_meter}</TableCell>
                <TableCell>RS.{selectedOrder?.total_price}</TableCell>
              </TableRow>

            </TableBody>
          </Table>
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
              <b> Name:</b>{selectedOrder?.name}
            </Typography>

            <Typography>
              <b>Phone:</b>{selectedOrder?.phoneNumber}
            </Typography>
            <Typography>
              <b>Address:</b>{selectedOrder?.address}
            </Typography>
            <Typography>
              <b>pincode:</b>{selectedOrder?.pincode}
            </Typography>
            <Typography>
              <b>City:</b>{selectedOrder?.city}
            </Typography>

            <Typography>
              <b>District:</b>{selectedOrder?.district}
            </Typography>
            <Typography>
              <b>State:</b>{selectedOrder?.state}
            </Typography>
          </>

        </Box>
      </Modal>
      {/* modal for edit*/}
      <Modal open={trackmodal} onClose={() => setTrackmodal(false)}>
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
              Edit Return Orders
            </Typography>
            <Grid container mt={2} >
              <Grid item xs={12} mt={3} sx={{ "marginLeft": "5px" }}>
                <FormControl fullWidth>
                  <InputLabel id="status-select-label">Payment Status</InputLabel>
                  <Select
                    labelId="status-select-label"
                    label="Choose Payment Status"
                    value={updatedCustom.paymentStatus}
                    onChange={(e) => setUpdatedCustom({ ...updatedCustom, paymentStatus: e.target.value })}
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Completed">Paid</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant='success' sx={{ backgroundColor: "green", marginTop: '5px' }} onClick={()=>handleEditCustomer(selectedOrder.id)}   > save Changes</Button>
            </Box>
          </>

        </Box>
      </Modal>
      <ToastContainer />
    </>
  )
}

export default ViewCustomeOrders
