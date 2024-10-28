import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Container, Grid, Paper, Snackbar, Alert,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function AddPoster() {
  const [posterHeading, setPosterHeading] = useState('');
  const [posterTitle, setPosterTitle] = useState('');
  const [posterSubTitle, setPosterSubTitle] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [posters, setPosters] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImageURL, setSelectedImageURL] = useState(''); // State for selected image URL
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [posterToDelete, setPosterToDelete] = useState(null);

  // useEffect to load posters if needed, can be removed for design-only purpose
  useEffect(() => {
    // loadPosters(); // Uncomment if you want to load posters
  }, []);

  const handleHeadingChange = (event) => {
    setPosterHeading(event.target.value);
  };

  const handleTitleChange = (event) => {
    setPosterTitle(event.target.value);
  };

  const handleSubTitleChange = (event) => {
    setPosterSubTitle(event.target.value);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
    setSelectedImageURL(URL.createObjectURL(event.target.files[0])); // Update image URL when a new file is selected
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (!posterHeading || !posterTitle || !posterSubTitle || !image) {
      setError('All fields are required.');
      return;
    }

    // Simulate success and reset form (remove this if you plan to add functionality later)
    setOpenSnackbar(true);
    setPosterHeading('');
    setPosterTitle('');
    setPosterSubTitle('');
    setImage(null);
    setIsEditing(false);
    setSelectedImageURL('');
  };

  const handleDelete = () => {
    // Simulate delete action
    setOpenDeleteDialog(false);
    setPosterToDelete(null);
  };

  const handleOpenDeleteDialog = (poster) => {
    setPosterToDelete(poster);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setPosterToDelete(null);
  };

  const handleEdit = (poster) => {
    // Set state for editing poster (implementation can be added later)
    setSelectedImageURL(poster.poster_image); // Set the image URL for editing
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          {isEditing ? 'Edit Poster' : 'Add Poster'}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="posterHeading"
            label="Poster Heading"
            name="posterHeading"
            value={posterHeading}
            onChange={handleHeadingChange}
            error={!!error && !posterHeading}
            helperText={!!error && !posterHeading ? 'Poster heading is required' : ''}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="posterTitle"
            label="Poster Title"
            name="posterTitle"
            value={posterTitle}
            onChange={handleTitleChange}
            error={!!error && !posterTitle}
            helperText={!!error && !posterTitle ? 'Poster title is required' : ''}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="posterSubTitle"
            label="Poster Subtitle"
            name="posterSubTitle"
            value={posterSubTitle}
            onChange={handleSubTitleChange}
            error={!!error && !posterSubTitle}
            helperText={!!error && !posterSubTitle ? 'Poster subtitle is required' : ''}
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
          {selectedImageURL && ( // Show the current image when editing
            <Grid container justifyContent="center" sx={{ mb: 2 }}>
              <img
                src={selectedImageURL}
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
              <TableCell>Heading</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Subtitle</TableCell>
              <TableCell>Image</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(posters) && posters.map((poster) => (
              <TableRow key={poster.id}>
                <TableCell>{poster.poster_heading}</TableCell>
                <TableCell>{poster.poster_title}</TableCell>
                <TableCell>{poster.poster_sub_title}</TableCell>
                <TableCell>
                  <img src={poster.poster_image} alt={poster.poster_title} style={{ height: "50px", width: "60px" }} />
                </TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEdit(poster)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleOpenDeleteDialog(poster)}>
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
            Are you sure you want to delete this poster?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
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
          {isEditing ? 'Poster updated successfully!' : 'Poster uploaded successfully!'}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AddPoster;
