import { Box, Button, Card, CardContent, Chip, FormControlLabel, Grid, IconButton, InputAdornment, MenuItem, Switch, TextField, Typography } from '@material-ui/core';
import { PermMedia } from '@material-ui/icons';
import { Autocomplete, Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import React, { useReducer, useRef, useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { connect } from 'react-redux'
import { createNewProduct } from '../../actions/actions';
import Modal from '../../components/Modal';


const useStyles = makeStyles((theme) => ({
  root : {
    borderRadius: '10px',
    padding: '10px',
    '& .MuiCircularProgress-colorPrimary':{
      color: '#fff'
    },
    '& *': {
      borderRadius: '8px'
    },
    '& label.Mui-focused':{
      color: theme.backgroundPrimary
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        border: `1px solid ${theme.backgroundPrimary}`
      }
    }
  },
  field : {
    marginTop: '25px',
  }, 
  imageField : {
    border: '1px dashed rgba(145, 158, 171, 0.62)', 
    padding: '50px 0', 
    textAlign: 'center',
    '&:hover' : {
      background: '#fff0f0',
      cursor: 'pointer',
    }
  },
  btn : {
    height: '55px',
    marginTop: '25px',
    background: theme.backgroundPrimary,
    color: '#fff',
    '&:hover' : {
      background: theme.backgroundSecondary
    }
  },
  chip: {
    margin: '1rem .5rem 0 0',
    borderRadius: '5rem'
  }
}))

const CreateProduct = (props) => {
  const classes = useStyles()
  const [checked, setChecked] = useState(false)
  const [error, setError] = useState({status: false, message: ''})
  const [upload, setUpload] = useState([])
  const ref = useRef()
  const category = ['Furniture', 'Electronics', 'Mobile & Tablets', 'Home & Living', 'Kitchen']

  /// initial state ///
  const initialState = {
    name: '',
    description: '',
    sku: '',
    category: '',
    tags: [],
    price: '',
    salePrice: '',
    instock: checked
  }

  /// reducer Function ///
  const reducerFn = (state, action) => {
      switch (action.type) {
        case "NAME":
          return {...state, name: action.payload}
        case "DESCRIPTION":
          return {...state, description: action.payload}
        case "SKU":
          return {...state, sku: action.payload}
        case "CATEGORY":
          return {...state, category: action.payload}
        case "TAGS":
          return {...state, tags: action.payload}
        case "REGULAR":
          return {...state, price: action.payload}
        case "SALE":
          return {...state, salePrice: action.payload}
        case "INSTOCK":
          return {...state, instock: !state.instock}
        case "RESET":
          setChecked(false)
          return { name: '', description: '', sku: '', category: '', tags: [], price: '', salePrice: '', instock: checked }
        default:
          return state;
      }
  }

  const [formInput, dispatch] = useReducer(reducerFn, initialState)

  const toggleChecked = () => {
    setChecked(!checked)
    dispatch({type: "INSTOCK", payload: checked})
  }

  // image select function
  const onImageSelect = (e) => {

    for (let i = 0; i < e.target.files.length; i++){
        if(e.target.files[i].size >= 500000){
            setError({status: true, message: `Invalid file size: Image is too large` })
            return;
        }
        let duplicate = upload.find(file => file.name === e.target.files[i].name);
        if(duplicate !== undefined){
          setError({ status: true, message: `Invalid: '${e.target.files[i].name}' is already selected`} )
            return;
        }
        setUpload(prev => [...prev, e.target.files[i]])
        
    }
    
}
  // image delete function
  const onImageDelete = (name) => {
      const update = upload.filter(file => file.name !== name);
      setUpload(update);
  }
  /// submit the form ///
  const onFormSubmit = (e) => {
   e.preventDefault()

   const formData = new FormData()
   formData.append('name', formInput.name)
   formData.append('description', formInput.description)
   formData.append('sku', formInput.sku)
   formData.append('category', formInput.category)
   formData.append('tags', formInput.tags)
   formData.append('price', formInput.price)
   formData.append('salePrice', formInput.salePrice)
   formData.append('instock', formInput.instock)

   if(upload.length > 0){
    for (let index = 0; index < upload.length; index++) {
        formData.append('gallery[]', upload[index])
      }
    }
   // call action creator
    props.createNewProduct(formData)

   // reset form fields
    // dispatch({type: "RESET"})
  }

  return (
    <div>
      <PageHeader title='Create a new product' link1='Products' link2='New Product'/>

      {/* MODAL ALERT */}
      { props.modal && <Modal status={props.modal.status} message={props.modal.message} /> }

      <form onSubmit={onFormSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card variant='outlined' className={classes.root}>
              <CardContent>
                <TextField label='Product Name' variant='outlined' fullWidth value={formInput.name} onChange={(e)=> dispatch({type: "NAME", payload: e.target.value})}/>
                <div className={classes.field}>
                  <Typography variant='body1' color='textSecondary' gutterBottom >Description</Typography>
                  <TextField variant='outlined' fullWidth value={formInput.description} onChange={(e)=> dispatch({type: "DESCRIPTION", payload: e.target.value})}
                  multiline rows={10} placeholder='Write the description of the product' error={false} helperText=""/>
                </div>
                <div className={classes.field}>
                  <Typography variant='body1' color='textSecondary' gutterBottom >Images</Typography>

                  {/* ERROR ALERT */}
                  { error.status && <Alert style={{marginBottom: '1rem'}} severity="error" variant="filled" onClose={()=> setError({status: false, message: ''})}>{error.message}</Alert> }
                  
                  <Box className={classes.imageField} onClick={()=>ref.current.click()} >
                    <IconButton disabled>  
                      <PermMedia fontSize='large' />
                    </IconButton>
                    
                    <input type='file' multiple accept='.png, .jpg' style={{display: 'none'}} ref={ref} onChange={(e)=> onImageSelect(e)} />
                    <Typography variant='body1' gutterBottom>File Upload</Typography>
                    <Typography variant='body2' color='textSecondary' >Drag your files here or Browse</Typography>
                    <Typography variant='body2' color='textSecondary' >Max File Size: 0.5MB</Typography>

                  </Box>
                      { upload.map(file => {
                                return (
                                      <Chip variant='outlined' key={file.name} 
                                      label={file.name} onDelete={() => onImageDelete(file.name)} 
                                      className={classes.chip} 

                                      />
                                )
                            })
                        }
                </div>

              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
          <Card variant='outlined' className={classes.root}>
              <CardContent>
              <FormControlLabel label='In Stock' control={<Switch checked={checked} onChange={toggleChecked} />} style={{ marginBottom: '20px' }} /> 
              <TextField label='Product SKU' variant='outlined' fullWidth value={formInput.sku}
                InputProps={{ startAdornment : <InputAdornment position='start'>WPG-PRD</InputAdornment> }}  
               onChange={(e)=> dispatch({type: "SKU", payload: e.target.value})}/>
              <TextField select label='Category' variant='outlined' 
              fullWidth helperText='' value={formInput.category} onChange={(e)=> dispatch({type: "CATEGORY", payload: e.target.value})}
              className={classes.field} defaultValue={category[0]}>
                { category.map((option) => {
                  return(
                    <MenuItem key={option} value={option} >{option}</MenuItem>
                  )
                })
                }
              </TextField>
                <Autocomplete multiple options={category} getOptionLabel={(option)=> option} 
                value={formInput.tags} onChange={(e, values) => dispatch({ type: "TAGS", payload: values }) }
                renderInput={(lists) => (
                  <TextField {...lists} className={classes.field} label='Tags' variant='outlined' fullWidth/>
                 )}/>
                
              </CardContent>
            </Card>

            <Card variant='outlined' className={classes.root} style={{marginTop: '30px'}}>
              <CardContent>
              <TextField label='Price' fullWidth style={{marginTop: '10px'}}
                  placeholder='0.00' variant='outlined' value={formInput.price} onChange={(e)=> dispatch({type: "REGULAR", payload: e.target.value})}
                  InputProps={{ 
                    startAdornment : <InputAdornment position='start'>¢</InputAdornment> }}  
                />
              <TextField
                  label="Sale Price" className={classes.field}
                  placeholder='0.00' variant='outlined' fullWidth value={formInput.salePrice} onChange={(e)=> dispatch({type: "SALE", payload: e.target.value})}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">¢</InputAdornment>,
                  }}
                />
              <Button type='submit' className={classes.btn} fullWidth> Create Product </Button>
                
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </div>
  ) 
};


const mapStateToProps = (state) => {
  //console.log(state)
  return state
}

export default connect(mapStateToProps,{createNewProduct})(CreateProduct);
