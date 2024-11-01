import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
  DialogContentText
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EmojiPicker from 'emoji-picker-react';


const defaultAvatar = 'https://i.postimg.cc/mZ3Yr8JV/user-avatar-male-5.png';

function ViewCustomers() {
  const [customers, setCustomers] = useState([]);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openNotificationDialog, setOpenNotificationDialog] = useState(false);
  const [openOrdersDialog, setOpenOrdersDialog] = useState(false); // Orders dialog state
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '', email: '', mobile_number: '', address_line1: '', address_line2: '', pincode: ''
  });
  const [message, setMessage] = useState('');
  const [orders, setOrders] = useState([]); // State to hold fetched orders
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Page number state
  const [totalPages, setTotalPages] = useState(1);   // Total pages from API
  const [count, setCount] = useState(0);             // Total number of customers
  const [startCustomerIndex, setStartCustomerIndex] = useState(1);
  const [endCustomerIndex, setEndCustomerIndex] = useState(10);



  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


 


  const handleEditChange = () => {
    setOpenEditDialog(true)
  };



  const handleDelete = () => {
   
    setOpenDeleteDialog(true);
  };



  const cancelDelete = () => {
    setOpenDeleteDialog(false);
    
  };

  const handleSendNotification = (customer) => {
    setCurrentCustomer(customer);
    setMessage('');
    setOpenNotificationDialog(true);
  };

  const handleMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const handleEmojiClick = (emojiObject) => {
    
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
  };
  

  
  

  


  

  return (
    <Box sx={{ maxWidth: '100%', margin: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" gutterBottom>View Customers</Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: "lightblue" }}>
            <TableRow>
              <TableCell><b>Photo</b></TableCell>
              <TableCell><b>Name</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Mobile Number</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Road Name</b></TableCell>
              <TableCell><b>Address</b></TableCell>
              <TableCell><b>City</b></TableCell>
              <TableCell><b>State</b></TableCell>
              <TableCell><b>Pincode</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>View Orders</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            
              <TableRow>
                <TableCell>
                  {/* <img
                    src=''
                    alt=''
                    style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }}
                  /> */}
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }} >
                  
                </TableCell>

                <TableCell>
                  
                </TableCell>
                <TableCell></TableCell> {/* Added City */}
                <TableCell></TableCell> {/* Added State */}
                <TableCell></TableCell> {/* Added Pincode */}
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  <IconButton color="info" onClick={()=>setOpenOrdersDialog(true)} >
                    <VisibilityIcon /> {/* View Orders button */}
                  </IconButton>
                </TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  <IconButton color="primary" onClick={handleEditChange} >
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={handleDelete}  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton color="default" onClick={()=>setOpenNotificationDialog(true)} >
                    <SendIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            
          </TableBody>
        </Table>
      </TableContainer>


      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
        <Button
          variant="contained"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
        >
          Previous
        </Button>

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
          <Typography sx={{ mr: 2 }}>
            {`Showing ${startCustomerIndex} to ${endCustomerIndex} of ${count}`}
          </Typography>
          <Button
            variant="contained"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </Box>
      </Box>

      {/* Orders Dialog */}
      <Dialog
        open={openOrdersDialog}
        onClose={() => setOpenOrdersDialog(false)}
        fullWidth // Ensures the dialog takes up the full available width
        maxWidth="lg" // You can use 'sm', 'md', 'lg', 'xl' based on your need
      >
        <DialogTitle>
          {currentCustomer
            ? `Orders for ${currentCustomer.name} (${orders.length} Total Orders)`
            : `Orders (${orders.length} Total Orders)`
          }



        </DialogTitle>

        <DialogContent>
          
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><b>Order ID</b></TableCell>
                  <TableCell><b>Status</b></TableCell>
                  <TableCell><b>Payment Method</b></TableCell>
                  <TableCell><b>Total Price</b></TableCell>
                  <TableCell><b>Order Time</b></TableCell>
                  <TableCell><b>Products</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              
                  <TableRow >
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <ul>
                       
                          <li >
                            
                          </li>
                        
                      </ul>
                    </TableCell>
                  </TableRow>
                
              </TableBody>
            </Table>
          
            <Typography>No orders found for this customer.</Typography>
         
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenOrdersDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>




      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this customer? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button  color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="name"
            label="Name"
            fullWidth
            variant="standard"
            
           
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            fullWidth
            variant="standard"
           
          />
          <TextField
            margin="dense"
            name="mobile_number"
            label="Mobile Number"
            fullWidth
            variant="standard"
           
          />
          <TextField
            margin="dense"
            name="address"
            label="Address"
            fullWidth
            variant="standard"
            
          />
          <TextField
            margin="dense"
            name="city"
            label="City"
            fullWidth
            variant="standard"
            
          />
          <TextField
            margin="dense"
            name="state"
            label="State"
            fullWidth
            variant="standard"
            
          />
          <TextField
            margin="dense"
            name="pincode"
            label="Pincode"
            fullWidth
            variant="standard"
            
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenEditDialog(false)} >Cancel</Button>
          <Button >Save</Button>
        </DialogActions>
      </Dialog>

      {/* Send Notification Dialog */}
      <Dialog open={openNotificationDialog} onClose={() => setOpenNotificationDialog(false)}>
        <DialogTitle>Send Notification</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Message"
            fullWidth
            value={message}
            variant="standard"
            onClick={(e)=>setMessage(e.target.value)}
          />
          <Button >
             Show Emoji Picker
          </Button>
           <EmojiPicker onEmojiClick={handleEmojiClick} />
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpenNotificationDialog(false)} >Cancel</Button>
          <Button >Send</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ViewCustomers;
