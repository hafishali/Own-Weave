import React, { useState } from 'react'
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

function ViewCustomeOrders() {
    const [addOrderModal, setAddOrderModal] = useState(false)
    const [open, setOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);


    const [formData, setFormData] = useState({
        name: '',
        phoneNumber: '',
        address: '',
        state: '',
        pincode: '',
        city: '',
        district: '',
        productCode: '',
        size: '',
        customSize: '',
        quantity: '',
        sleeveType: '',
        paymentMethod: '',
        paymentStatus: '',
        
      });
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
      console.log(formData)
  return (
    <>
      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          View Orders
        </Typography>
        <Button variant="contained" color="primary" onClick={downloadExcel}>
          Export as excel <DescriptionIcon sx={{ ml: 1 }} />
        </Button>
      </Box> */}

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
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Name</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Product</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Custom Size</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Date</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Shipping Address</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Payment Method</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Payment Status</b></TableCell>
              {/* <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Track id</b></TableCell> */}
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b> Offer</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>

           
              <TableRow >
                {/* Order ID Column */}
               

                {/* Customer Name Column */}
                <TableCell
                  style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                  sx={{ color: "blue", cursor: "pointer" }}
                 /*  onClick={() => handleCustomerOpen(item)} */
                >
                  <u></u>
                </TableCell>
                <TableCell
                  style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                  sx={{ color: "blue", cursor: "pointer" }}
                  onClick={() => handleopenorder()}
                >
                  <u>Product</u>
                </TableCell>

                {/* Additional Empty Columns */}
               
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}></TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center', color: "blue", cursor: "pointer" }}/*  onClick={() => handleaddressOpen(item)} */><u>View</u></TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}></TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}></TableCell>


                {/* Track ID Column */}
                <TableCell
                  style={{ whiteSpace: 'nowrap', textAlign: 'center' }}
                  sx={{ color: "blue", cursor: "pointer" }}

                >
                 
                </TableCell>


                <TableCell style={{ textAlign: 'center' }}>
                  <Button ></Button>

                </TableCell>


                {/* Action Buttons Based on Status */}
                <TableCell><IconButton aria-label="Edit" >
                  <EditIcon />
                </IconButton>

                  {/* <IconButton aria-label="Delete">
              <DeleteIcon />
            </IconButton> */}
                </TableCell>
              </TableRow>
           



          </TableBody>
        </Table>
      </TableContainer>

        {/* modal for add orders */}
        <Modal open={addOrderModal} onClose={() => setAddOrderModal(false)}>
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
            onClick={() => setAddOrderModal(false)}
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
                      name='productCode'
                      label="Product code"
                      variant="outlined"
                      type="text"
                      value={formData.productCode}
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
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
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
                      name='customSize'
                      label="Custome Size"
                      variant="outlined"
                      type="number"
                      value={formData.customSize}
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
                        name='sleeveType'
                        defaultValue=""
                        value={formData.sleeveType}
                        onChange={(e) => setFormData({ ...formData, sleeveType: e.target.value })}
                      >
                        <MenuItem value="Full Sleeve">Full Sleeve</MenuItem>
                        <MenuItem value="Half Sleeve">Half Sleeve</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Payment Method</InputLabel>
                      <Select
                        label="Sleeve Type"
                        name='paymentMethod'
                        defaultValue=""
                        value={formData.paymentMethod}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      >
                        <MenuItem value="COD">COD</MenuItem>
                        <MenuItem value="UPI">UPI</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={4}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Payment Status</InputLabel>
                      <Select
                        label="Sleeve Type"
                        name='paymentStatus'
                        defaultValue=""
                        value={formData.paymentStatus}
                        onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                      >
                        <MenuItem value="Pending">Pending</MenuItem>
                        <MenuItem value="Paid">Paid</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {/* <Grid item xs={4}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel>Offers</InputLabel>
                      <Select
                        label="Sleeve Type"
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
              <Button variant='success' sx={{ backgroundColor: "green", marginTop: '5px' }}  > save</Button>
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

          <Typography variant="h6" gutterBottom>
            Order Details
          </Typography>

          {/* Order Information */}
          
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
                <TableCell><b> Total Price</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
             
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>RS.</TableCell>
                    <TableCell>RS.</TableCell>
                  </TableRow>
               
            </TableBody>
          </Table>
        </Box>
      </Modal>
      
    </>
  )
}

export default ViewCustomeOrders
