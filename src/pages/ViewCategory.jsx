import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


function ViewCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [categoryImage, setCategoryImage] = useState(null);
  const [enableCategory, setEnableCategory] = useState(true);
  const [filter, setFilter] = useState('all');  // State for filter (all, enabled, disabled)





 

 

  const cancelDelete = () => {
    setOpenDialog(false);
    setSelectedCategoryId(null);
  };

 

  const handleImageUpload = (event) => {
    setCategoryImage(event.target.files[0]);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  // Filter categories based on the selected filter
 

  // if (loading) {
  //   return (
  //     <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
  //       <CircularProgress />
  //     </Box>
  //   );
  // }

  return (
    <Box sx={{ maxWidth: '100%', margin: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          View Categories
        </Typography>

        {/* Filter Dropdown on Right Side */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Filter</InputLabel>
          <Select  >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="enabled">Enabled</MenuItem>
            <MenuItem value="disabled">Disabled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{backgroundColor:"lightblue"}}>
            <TableRow>
              <TableCell><b>Image</b></TableCell>
              <TableCell><b>Category Name</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            
              <TableRow >
                <TableCell>
                  {/* <img
                    src=''
                    alt=''
                    style={{ width: 50, height: 50, objectFit: 'cover' }}
                  /> */}
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => setOpenEditDialog(true)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={() =>setOpenDialog(true)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDialog} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this category? This action cannot be undone.
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

      {/* Edit Category Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="normal"
            label="Category Name"
            variant="outlined"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <Button
            variant="contained"
            component="label"
          >
            Upload New Image
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
            />
          </Button>
          {categoryImage && (
            <Box mt={2}>
              <img
                src={URL.createObjectURL(categoryImage)}
                alt="Selected Category"
                style={{ maxHeight: 200, objectFit: 'contain' }}
              />
            </Box>
          )} <br />
          <FormControlLabel
            control={
              <Checkbox
                checked={enableCategory}
                onChange={(e) => setEnableCategory(e.target.checked)}
                color="primary"
              />
            }
            label="Enable Category"
          />
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

export default ViewCategory;
