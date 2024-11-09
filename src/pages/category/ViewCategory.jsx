import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, TextField, Checkbox, FormControlLabel, Select, MenuItem, InputLabel, FormControl,Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteCategories, viewAllCategories } from '../../services/allApi';
import EditCategoryModel from '../../components/EditCategoryModel';
import { toast } from 'react-toastify';


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
  const [descModal,setDescModal]=useState(false)
  const [sizeModal,setSizeModal]=useState(false)
  const [selectedCategory,setSelectedCategory]=useState(null)

// get accesories
const handleGetAllcategories=async()=>{
  try {
    const response=await viewAllCategories()
    console.log(response)
    if(response.status===200){
      setCategories(response.data)
    }
  } catch (error) {
    console.log(error)
  }
}
useEffect(()=>{
handleGetAllcategories()
},[])
console.log(categories)

const filteredCategories = categories.filter((category) => {
  if (filter === 'In Stock') return category.status === true;
  if (filter === 'Out of Stock') return category.status === false;
  return true;
});
const opencategoryDesc=(item)=>{
setDescModal(true)
setSelectedCategory(item)
}
const closeCategoryDesc=()=>{
  setDescModal(false)
  setSelectedCategory(null)
}


 const openCategorySize=(item)=>{
  setSizeModal(true)
  setSelectedCategory(item)
 }
 const closeCategorySize=()=>{
  setSizeModal(false)
  setSelectedCategory(null)
}

const handleEditCategory = (category) => {
  setSelectedCategory(category); 
  setOpenEditDialog(true); 
};
 
const handleDelete=(id)=>{
  setOpenDialog(true);
  setSelectedCategory(id)
}
const handleConfirmDelete=async()=>{
  const {id}=selectedCategory
  try {
    const response=await deleteCategories(id)
    if(response.status===204){
      toast.success("category has been deleted successfully")
      handleGetAllcategories()
      cancelDelete()
    }
  } catch (error) {
    console.log(error)
    toast.error("something went wrong at category deletion")
  }
  finally{
    setSelectedCategory(null)
  }
}
 

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
console.log(selectedCategory)
  return (
    <Box sx={{ maxWidth: '100%', margin: 'auto', p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          View Categories
        </Typography>

        {/* Filter Dropdown on Right Side */}
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Filter</InputLabel>
          <Select value={filter} onChange={handleFilterChange}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="In Stock">In Stock</MenuItem>
            <MenuItem value="Out of Stock">Out of Stock</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{backgroundColor:"lightblue"}}>
            <TableRow>
            <TableCell><b>SI</b></TableCell>
              <TableCell><b>Image</b></TableCell>
              <TableCell><b>Category Name</b></TableCell>
              <TableCell><b>Heading</b></TableCell>
              <TableCell><b>Description</b></TableCell>
              <TableCell><b>Size(All)</b></TableCell>
              <TableCell><b>offers</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {filteredCategories.length > 0 ? filteredCategories.map((item,index)=>(<TableRow key={index} >
              
                <TableCell>
                 {index+1}
                </TableCell>
                <TableCell><img
                    src={item.image}
                    alt='category image'
                    style={{ width: 50, height: 50, objectFit: 'cover' }}
                  />
</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.heading}</TableCell>
                <TableCell sx={{color:"blue"}}  onClick={() => opencategoryDesc(item)} > <u>View</u> </TableCell>
                <TableCell sx={{color:"blue"}}  onClick={() => openCategorySize(item)} > <u>View</u> </TableCell>
                <TableCell>
  {item.offer ? `${item.offer.name}: ${item.offer.offer_type}` : 'No Offer'}
</TableCell>
                <TableCell>{item.status===true?'In Stock':'Out of Stock'}</TableCell>
                <TableCell>
                  <IconButton color="primary" onClick={() => handleEditCategory(item)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" onClick={()=>handleDelete(item
                    
                  )}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>)):<TableRow>No Categories to show</TableRow>}
            
              
            
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
          <Button  color="secondary" onClick={handleConfirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* edit modal */}
      <EditCategoryModel
        openEditDialog={openEditDialog}
        setOpenEditDialog={setOpenEditDialog}
        selectedCategory={selectedCategory} 
        setSelectedCategory={setSelectedCategory}
        handleGetAllcategories={handleGetAllcategories}
      />
      

      {/* description modal */}
      <Dialog open={descModal} onClose={closeCategoryDesc}>
  <DialogTitle>Description</DialogTitle>
  <DialogContent>
    {/* Display the selected category description */}
    <Typography variant="body1">
      {selectedCategory ? selectedCategory.description : 'No description available'}
    </Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={closeCategoryDesc} color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>
      {/* size modal */}
      <Dialog open={sizeModal} onClose={closeCategorySize}>
        <DialogTitle>Size </DialogTitle>
        <DialogContent>
        <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><b>S</b></TableCell>
                    <TableCell><b>M</b></TableCell>
                    <TableCell><b>L</b></TableCell>
                    <TableCell><b>XL</b></TableCell>
                    <TableCell><b>XXL</b></TableCell>
                    <TableCell><b>XXXL</b></TableCell>
                    <TableCell><b>4XL</b></TableCell>
                    <TableCell><b>Full Sleeve</b></TableCell>
                    <TableCell><b>Half Sleeve</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedCategory?(<TableRow >
                      <TableCell>{selectedCategory.size_S_length}</TableCell>
                      <TableCell>{selectedCategory.size_M_length}</TableCell>
                      <TableCell>{selectedCategory.size_L_length}</TableCell>
                      <TableCell>{selectedCategory.size_XL_length}</TableCell>
                      <TableCell>{selectedCategory.size_XXL_length}</TableCell>
                      <TableCell>{selectedCategory.size_XXL_length}</TableCell>
                      <TableCell>{selectedCategory.size_4XL_length}</TableCell>
                      <TableCell>{selectedCategory.sleeve_full_length}</TableCell>
                      <TableCell>{selectedCategory.sleeve_half_length}</TableCell>
                    </TableRow>) :(<TableRow>No sizes for this Category</TableRow>) }
                   
                  
                </TableBody>
              </Table>
          
                 
        </DialogContent>
        <DialogActions>
          <Button onClick={ closeCategorySize} color="primary">
            Cancel
          </Button>
          
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ViewCategory;
