import React, { useEffect, useState } from 'react';
import { Avatar, Button, Card, CardContent, Chip, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';
import { Add, Create, Search } from '@material-ui/icons';
import { DataGrid } from '@material-ui/data-grid'
import { makeStyles } from '@material-ui/styles';
import PageHeader from '../../components/PageHeader';
import { connect } from 'react-redux'
import { getAllAdmins } from '../../actions/actions';
import Modal from '../../components/Modal';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  root: {
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
    '&:hover': {
      background: theme.backgroundSecondary
    }
  }
}))



const AllAdmins = (props) => {
  const classes = useStyles()
  const [pageSize, setPageSize] = useState(10)
  const { getAllAdmins } = props
  //console.log(props)

  useEffect(() => {
    getAllAdmins()
  }, [getAllAdmins])

  const onView = (id) => {
    props.view(id)
  }

  const columns = [
    { field: 'name', headerName: 'FullName', flex: 1, renderCell: (params) => { return (<><Avatar variant='rounded' sizes='large' /> <Typography variant='body2' style={{ marginLeft: '20px' }} >{params.value}</Typography></>) } },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: .5 },
    { field: 'role', headerName: ' Role', flex: .5, renderCell: (params) => { return <Chip disabled label={params.value} /> } },
    {
      field: 'id', headerName: ' Action', flex: .5, renderCell: (params) => {
        return (
          <>
            <IconButton onClick={() => onView(params.value)}><Create fontSize='small' /></IconButton>
          </>
        )
      }
    }
  ]

  return (
    <div className={classes.root}>
      {/* MODAL */}
      {props.modal && <Modal status={props.modal.status} />}

      <div style={{ display: 'flex' }}>
        <PageHeader title='All Administrators' link1='Admins' link2='Adminstrators' />
        {props.currentUser.role === 'superadmin' && <Button startIcon={<Add />} size='small' className={classes.addBtn} href='/account/users/new'> Add User</Button>}
      </div>

      <Card variant='outlined' style={{ borderRadius: '10px', width: '100%' }}>
        <CardContent style={{ padding: '30px' }}>
          <TextField variant='outlined' style={{ marginBottom: '20px' }}
            placeholder='Find admin' fullWidth
            InputProps={{
              startAdornment: <InputAdornment position='start'><Search fontSize='small' /> </InputAdornment>
            }} />
          <DataGrid autoHeight
            pagination rows={props.admins} rowsPerPageOptions={[5, 10, 20]}
            rowHeight={70} columns={columns}
            pageSize={pageSize} checkboxSelection
            onPageSizeChange={(newSize) => setPageSize(newSize)}
          />

        </CardContent>
      </Card>

    </div>

  )
};

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps, { getAllAdmins })(AllAdmins);
