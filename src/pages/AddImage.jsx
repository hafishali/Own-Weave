import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Container, Grid, Paper, Snackbar, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function AddImagePage() {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [images, setImages] = useState([]);
  const [isEditing, setIsEditing] = useState(false); // To track if we're editing
  const [selectedImage, setSelectedImage] = useState(null); // To track selected image for editing
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // State for delete confirmation dialog

  // Dummy data for images
  useEffect(() => {
    // Simulate loading images
    setImages([
      { id: 1, title: 'Image 1', image: 'https://via.placeholder.com/150' },
      { id: 2, title: 'Image 2', image: 'https://via.placeholder.com/150' },
      { id: 3, title: 'Image 3', image: 'https://via.placeholder.com/150' }
    ]);
  }, []);

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(''); // Clear previous error messages

    // Ensure required fields are filled
    if (!title || !image) {
      setError('Title and image are required.');
      return;
    }

    // Simulate image upload or update success
    console.log(isEditing ? 'Image updated successfully' : 'Image uploaded successfully');
    setOpenSnackbar(true);
    resetForm(); // Reset the form upon successful operation
  };

  // Function to reset the form
  const resetForm = () => {
    setImage(null);
    setTitle('');
    setIsEditing(false);
    setSelectedImage(null);
  };

  const handleOpenDeleteDialog = (image) => {
    setSelectedImage(image);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedImage(null);
  };

  const handleEdit = (image) => {
    setSelectedImage(image);
    setTitle(image.title);
    setImage(null); // Clear the image state to avoid displaying the file input image
    setIsEditing(true);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          {isEditing ? 'Edit Image' : 'Add Carousel'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Title"
            name="title"
            autoFocus
            value={title}
            onChange={handleTitleChange}
            error={!!error && !title}
            helperText={!!error && !title ? 'Title is required' : ''}
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mt: 2, mb: 2 }}
          >
            {isEditing ? 'Change Image' : 'Upload Image'}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>
          {isEditing && selectedImage ? (
            <Grid container justifyContent="center" sx={{ mb: 2 }}>
              <img
                src={selectedImage.image} // Assuming this is the URL to the existing image
                alt={selectedImage.title}
                style={{ maxWidth: '100%', maxHeight: 200 }}
              />
            </Grid>
          ) : image && (
            <Grid container justifyContent="center" sx={{ mb: 2 }}>
              <img
                src={URL.createObjectURL(image)}
                alt="Selected"
                style={{ maxWidth: '100%', maxHeight: 200 }}
              />
            </Grid>
          )}
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            {isEditing ? 'Update' : 'Submit'}
          </Button>
        </Box>
      </Paper>

      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "lightblue" }}>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Image</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {images.map((img) => (
              <TableRow key={img.id}>
                <TableCell>{img.title}</TableCell>
                <TableCell>
                  <img src={img.image} alt={img.title} style={{ height: "50px", width: "60px" }} />
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEdit(img)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleOpenDeleteDialog(img)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this image?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => {}} color="error"> {/* No operation on delete */}
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {isEditing ? 'Image updated successfully!' : 'Image uploaded successfully!'}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AddImagePage;
