import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Button, TextField, FormControlLabel, Checkbox, Select, MenuItem, InputLabel,
  FormControl
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function ViewSubcategory() {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [subcategoryName, setSubcategoryName] = useState('');
  const [subcategoryImage, setSubcategoryImage] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [enableSubcategory, setEnableSubcategory] = useState(true);



  const handleEdit = () => {
   
    setOpenEditDialog(true);
  };

  const handleDelete = () => {
   
    setOpenDialog(true);
  };

  const confirmDelete = async () => {
   
      setOpenDialog(false);
   
  };

  const cancelDelete = () => {
    setOpenDialog(false);
    
  };

 

 

  // if (loading) {
  //   return (
  //     <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  return (
    <Box sx={{ maxWidth: '100%', margin: 'auto', p: 3 }}>
      <Typography variant="h4" gutterBottom>
        View Subcategories
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{backgroundColor:"lightblue"}}>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Subcategory Name</TableCell>
              <TableCell>Main Category</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Length</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>offers</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
           
                <TableRow >
                  <TableCell>
                    {/* <img
                      src={subcategory.Sub_category_image || 'https://via.placeholder.com/50'}
                      alt={subcategory.name}
                      style={{ width: 50, height: 50, objectFit: 'cover' }}
                    /> */}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit()}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDelete()}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              
           
              <TableRow>
                <TableCell colSpan={5}>No subcategories available</TableCell>
              </TableRow>
           
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this subcategory? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Subcategory Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Subcategory</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Subcategory Name"
            variant="outlined"
            value={subcategoryName}
            
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Main Category</InputLabel>
            <Select
              value={selectedCategoryId}
              
              label="Main Category"
            >
            
                <MenuItem >
                 
                </MenuItem>
             
            </Select>
          </FormControl>
          <TextField
            fullWidth
            margin="normal"
            label="Size"
            variant="outlined"
          
            
          />
           <TextField
            fullWidth
            margin="normal"
            label="Length"
            variant="outlined"
           
            
          />
          <FormControl fullWidth sx={{marginBottom:"5px"}}>
              <InputLabel>Select Offer</InputLabel>
              <Select
                label="Select offer"
                required
              >
                
                  <MenuItem >
                    hot sails
                  </MenuItem>
                
              </Select>
            </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                checked={enableSubcategory}
               
              />
            }
            label="Enable Subcategory"
          />
          <Button variant="contained" component="label">
            Upload New Image
            <input
              type="file"
              hidden
              accept="image/*"
              
            />
          </Button>
          
            <Box mt={2}>
              {/* <img
                src={URL.createObjectURL(subcategoryImage)}
                alt="Selected Subcategory"
                style={{ maxHeight: 200, objectFit: 'contain' }}
              /> */}
            </Box>
         
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancel
          </Button>
          <Button  color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ViewSubcategory;
