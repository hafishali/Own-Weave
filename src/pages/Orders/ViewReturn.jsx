import React from 'react'
import { useState } from 'react';
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
    TextField,Grid,MenuItem,Select,FormControl,InputLabel
  } from '@mui/material';
  import CloseIcon from '@mui/icons-material/Close';
import DoneIcon from '@mui/icons-material/Done';
import CancelIcon from '@mui/icons-material/Cancel';
import DescriptionIcon from '@mui/icons-material/Description';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import dayjs from 'dayjs'

function ViewReturn() {
    const [openCustomer,setOpenCustomer]=useState(false)
    const [open, setOpen] = useState(false);
    const [trackmodal,setTrackmodal]=useState(false)
    const [addOrderModal,setAddOrderModal]=useState(false)
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [status, setStatus] = useState('');

    const handleClose = () => {
        setOpen(false);
       
      };
      const openConfirmDialog = () => {
        setConfirmDialogOpen(true); 
      };
      const downloadExcel = () => {
        const worksheetData = [
          ['Order ID', 'Customer', 'Date', 'Time', 'Payment Method', 'Status'],
          ['1234', 'John Doe', '2024-10-30', '10:00 AM', 'Credit Card', 'Completed'],
          // Add more rows here
        ];
      
        // Create a new workbook and add the worksheet data
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Orders Report');
      
        // Trigger download
        XLSX.writeFile(workbook, 'orders_report.xlsx');
      };
      const handleStatusChange = (event) => {
        setStatus(event.target.value);
      };
    
     
     
  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          View Return Orders
        </Typography>
        <Button variant="contained" color="primary" onClick={downloadExcel}>
          Export as excel <DescriptionIcon sx={{ ml: 1 }} />
        </Button>
      </Box>

      {/* Date filters */}
      <Box sx={{display:'flex',justifyContent:'space-between'}}>
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
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Track id</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Status</b></TableCell>
              <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
           
              <TableRow >
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }} sx={{color:"blue",cursor:"pointer"}} onClick={()=>setOpen(true)} ><u>586555</u></TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }} sx={{color:"blue",cursor:"pointer"}} onClick={()=>setOpenCustomer(true)}> <u>name</u> </TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}></TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}></TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}></TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}  sx={{color:"blue",cursor:"pointer"}} onClick={()=>setTrackmodal(true)} > <u>Set TrackId </u></TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                {status}
                  </TableCell>
                <TableCell style={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                
                <FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">status</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    label={status===''?'choose status':status}
    value={status}
    onChange={handleStatusChange}
    
  >
    
        <MenuItem value="Reject">Return Initiated</MenuItem>
        <MenuItem value="Pending">Pending</MenuItem>
        
        <MenuItem value="Completed">Completed</MenuItem>
  </Select>
</FormControl>
                 
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
              <Typography>
                <b>product_Name:</b> 
              </Typography>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Products:
              </Typography>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><b>Product code</b></TableCell>
                    <TableCell><b>Size</b></TableCell>
                    <TableCell><b>length</b></TableCell>
                    <TableCell><b>Color</b></TableCell>
                    <TableCell><b>Price</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  
                    <TableRow >
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  
                </TableBody>
              </Table>
            </>
          
        </Box>
      </Modal>
      {/* modal for customer details */}
      <Modal open={openCustomer} onClose={()=>setOpenCustomer(false)}>
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
            onClick={()=>setOpenCustomer(false)}
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
              <Typography sx={{display:"flex",justifyContent:"center"}} variant="h6" gutterBottom>
                Customer Details
              </Typography>
              <Typography>
                <b>Customer ID:</b> 
              </Typography>
              <Typography>
                <b>Customer Name:</b> 
              </Typography>
              <Typography>
                <b>Email:</b> 
              </Typography>
              <Typography>
                <b>Phone:</b> 
              </Typography>
              <Typography>
                <b>Adress:</b> RS.
              </Typography>
              <Typography>
                <b>Adress Type:</b> 
              </Typography>
              <Typography>
                <b>state:</b> 
              </Typography>
              <Typography>
                <b>city:</b>
              </Typography>
              <Typography>
                <b>pincode:</b> 
              </Typography>
              

              
            </>
          
        </Box>
      </Modal>
      {/* modal for track id */}
      <Modal open={trackmodal} onClose={()=>setTrackmodal(false)}>
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
            onClick={()=>setTrackmodal(false)}
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
              <Typography sx={{display:"flex",justifyContent:"center"}} variant="h6" gutterBottom>
                Track Id
              </Typography>
              
              <Grid item xs={12}>
          <TextField
            fullWidth
            label="Track Id"
            variant="standard"
            placeholder='paste track id here'
           
          />
        </Grid>

<Box sx={{display:'flex',justifyContent:'center'}}>
<Button  variant='success'sx={{backgroundColor:"green",marginTop:'5px'}}  > save</Button>
</Box>

       

              
            </>
          
        </Box>
      </Modal>
      {/* modal for add orders */}
      <Modal open={addOrderModal} onClose={()=>setAddOrderModal(false)}>
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
            onClick={()=>setAddOrderModal(false)}
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
              <Typography sx={{display:"flex",justifyContent:"center"}} variant="h6" gutterBottom>
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
                  variant="outlined"

                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  variant="outlined"
                  type="text"


                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  variant="outlined"
                  type="text"
                />
              </Grid>
             
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="state"
                    variant="outlined"
                    type="text"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Pincode"
                    variant="outlined"
                    type="text"
                  />
              </Grid>
              <Grid item xs={6}>
              <TextField
                    fullWidth
                    label="City"
                    variant="outlined"
                    type="text"
                  />
                
              </Grid>
              <Grid item xs={6}>
              <TextField
                    fullWidth
                    label="Area/Locality"
                    variant="outlined"
                    type="text"
                  />
                
              </Grid>
              <Grid item xs={12}>
              <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    type="mail"
                  />
                
              </Grid>
              
              
              
            </Grid>
          </Box>
          <Box mt={2}>
            <Typography variant="h6">Product Details:</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label=" Product Name"
                  variant="outlined"

                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Product code"
                  variant="outlined"
                  type="text"


                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Size"
                  variant="outlined"
                  type="text"
                />
              </Grid>
             
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Length"
                    variant="outlined"
                    type="text"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Color"
                    variant="outlined"
                    type="text"
                  />
              </Grid>
              <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Price"
                    variant="outlined"
                    type="number"
                  />
              </Grid>
            
              
              
              
            </Grid>
          </Box>
        </Grid>
              
             
       
        
<Box sx={{display:'flex',justifyContent:'center'}}>
<Button  variant='success'sx={{backgroundColor:"green",marginTop:'5px'}}  > save</Button>
</Box>   
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
  )
}

export default ViewReturn
