import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, CardContent, Chip, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';
import { Add, Create, Delete, LocalMall, Search } from '@material-ui/icons';
import { DataGrid } from '@material-ui/data-grid'
import { makeStyles } from '@material-ui/styles';
import PageHeader from '../../components/PageHeader';
import {connect} from 'react-redux'
import { getAllProducts } from '../../actions/actions';

const useStyles = makeStyles( theme => ({
  root : {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      "&.Mui-focused fieldset": {
        border: `1px solid ${theme.backgroundPrimary}`
      }
    }
  },
  addBtn: {
    marginLeft: 'auto',
    height: '45px',
    color: '#fff',
    background: theme.backgroundPrimary,
    padding: '0 15px',
    borderRadius: '10px',
    '&:hover' : {
      background: theme.backgroundSecondary
    }
  }
}))





const Products = (props) => {
  const classes = useStyles()
  const [pageSize, setPageSize] = useState(10)
  const { getAllProducts, products } = props

  useEffect(()=> {
    getAllProducts()
  },[getAllProducts])

  const columns = [
    {field: 'name', headerName: 'Product Name', flex: 1, resizeable: true, renderCell: (params) => { return ( <><Avatar variant='rounded' sizes='large'><LocalMall /></Avatar> <Typography variant='body2' style={{marginLeft: '20px'}} >{params.value}</Typography></> )} }, 
    {field: 'category', headerName: 'Created', flex: .5 },
    {field: 'price', headerName: 'Price', flex: .5, renderCell: (params) => { return `GH¢${params.value.oneMonth.toLocaleString()} - GH¢${(params.value.sixMonths * 6).toLocaleString()}`} },
    {field: 'instock', headerName:' Status', flex: .3, renderCell: (params) => { if(params.value){return <Chip disabled label={'In-Stock'} /> }else{return <Chip disabled label={'Out-of-Stock'} /> } } },
    {field: 'action', headerName:' Action', flex: .3, renderCell: (params) => { return <><IconButton><Create fontSize='small' /></IconButton> <IconButton> <Delete fontSize='small' /></IconButton></>}}
  ]


  return (
    <div className={classes.root}>

      <div style={{ display: 'flex', justifyContent: 'bottom' }}>
        <PageHeader title='All Products' link1='Products' link2='Product List'/>
        <Button startIcon={<Add/>} size='small' className={classes.addBtn} href='/account/products/new'> New Product</Button>
      </div>

      <Card variant='outlined' style={{ borderRadius: '10px', width: '100%'}}>
        <CardContent style={{ padding:'30px' }}>
            <TextField  variant='outlined' style={{ marginBottom: '20px'}}
            placeholder='Find product' fullWidth
            InputProps={{ 
              startAdornment: <InputAdornment position='start'><Search fontSize='small' /> </InputAdornment>
              }}/>
            <DataGrid autoHeight 
              pagination rows={products ? products : []} rowsPerPageOptions={[5, 10, 20]}
              rowHeight={70} columns={columns} 
              pageSize={pageSize} checkboxSelection 
              onPageSizeChange={(newSize)=> setPageSize(newSize)}
              />

        </CardContent>
      </Card>
      
    </div>
  ) 
};

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps, {getAllProducts})(Products);
