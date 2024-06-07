import React, { useEffect, useState } from 'react';
import { Link, Avatar, Button, Card, CardContent, Chip, IconButton, InputAdornment, TextField, Typography, Popover, MenuItem, Hidden, Box, Tooltip, Dialog, DialogContent, DialogActions } from '@material-ui/core';
import { Add, Create, Delete, Search, Tune } from '@material-ui/icons';
import { DataGrid } from '@material-ui/data-grid'
import { makeStyles } from '@material-ui/styles';
import PageHeader from '../../components/PageHeader';
import { connect } from 'react-redux'
import { getAllUsers, successModal, fetchVerifiedUsers, axiosInstance } from '../../actions/actions';
import Modal from '../../components/Modal';
import swal from 'sweetalert'


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
    height: '2.5rem',
    color: '#fff',
    padding: '0 15px',
    borderRadius: '6px',
  }
}))



const AllUsers = (props) => {
  const classes = useStyles()
  const [pageSize, setPageSize] = useState(10)
  const { allUsers } = props
  const [anchorEl, setAnchorEl] = useState(null);
  const [disable, setDisable] = useState(false);
  const [filter, setFilter] = useState(allUsers)
  const open = Boolean(anchorEl);

  useEffect(() => {
    const getUsers = () => {
      setFilter(allUsers)
    }
    getUsers()
  }, [allUsers])

  const handleClose = () => {
    setAnchorEl(null);
  }

  const filterUsers = (val) => {
    if (val === 'All') {
      setFilter(allUsers)
      handleClose()
    }
    if (val === 'Inactive') {
      const users = allUsers.filter(user => !user.accountNo)
      setFilter(users)
      handleClose()
      return
    } if (val === 'Active') {
      const users = allUsers.filter(user => user.accountNo)
      setFilter(users)
      handleClose()
    } else {
      const users = allUsers.filter(user => user.status === val)
      setFilter(users)
      handleClose()
    }
  }

  const searchUsers = (val) => {
    const result = allUsers.filter(user => user.fullname.toLowerCase().includes(val) || user.email.toLowerCase().includes(val))
    setFilter(result)
  }

  const fetchDataFromRevPlus = async () => {
    setDisable(true)
    props.successModal('Updating users from RevPlus. Please wait...')
    const res = await props.fetchVerifiedUsers()
    if (res.status === 'success') {
      props.successModal('Users data updated from RevPlus')
      setDisable(false)
    } else {
      setDisable(false)
    }
  }

  const onUserDelete = (id) => {
    swal({
      title: 'Are You Sure',
      text: 'This action will delete all records of this user',
      icon: 'info',
      buttons: ['Cancel', 'Delete'],
      dangerMode: true
    }).then(async (del) => {
      if (del) {
        try {
          const { data: res } = await axiosInstance.post('/admin/user/delete', { id })
          if (res?.status === 'success') {
            swal({
              title: 'Success',
              text: 'User deleted successfully',
              icon: 'success'
            }).then(() => window.location.reload())
          }
        } catch (error) {
          swal({
            title: 'Error',
            text: 'Sorry, could not delete user',
            icon: 'error'
          })
        }
      }
    })
  }


  const columns = [
    {
      field: 'fullname', headerName: 'FullName', flex: 1, renderCell: (params) => {
        return (<>
          <Avatar variant='rounded' sizes='large' src={params.row?.photo} />
          <Box style={{ display: 'flex', flexDirection: 'column' }}>
            <Typography variant='body2' style={{ marginLeft: '20px' }} >{params.value}</Typography>
            {params.row?.accountNo ? null : <Typography variant='body2' style={{ marginLeft: '20px', fontSize: '.6rem', background: '#f6a200', width: '6rem' }}>No account number</Typography>}
          </Box>
        </>
        )
      }
    },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'phone', headerName: 'Phone', flex: .5 },
    { field: 'status', headerName: ' Status', flex: .5, renderCell: (params) => { return <Chip size='small' color={params.value === 'Approved' ? 'secondary' : params.value === 'Verified' ? 'primary' : 'default'} label={params.value} /> } },
    {
      field: 'id', headerName: ' Action', flex: .5, renderCell: (params) => {
        return (
          <>
            <Tooltip title='Edit'><Link href={`/account/users/${params.value}/edit`} ><IconButton ><Create fontSize='small' /></IconButton></Link></Tooltip>
            <Tooltip title='Delete'><IconButton onClick={() => { onUserDelete(params?.value) }}><Delete fontSize='small' /></IconButton></Tooltip>
          </>
        )
      }
    }
  ]

  const smcolumns = [
    { field: 'fullname', headerName: 'FullName', flex: 1, renderCell: (params) => { return (<><Avatar variant='rounded' sizes='large' /> <Typography variant='body2' style={{ marginLeft: '20px' }} >{params.value}</Typography></>) } },
    { field: 'status', headerName: ' Status', flex: .5, renderCell: (params) => { return <Chip disabled label={params.value} /> } },
    {
      field: 'id', headerName: ' Action', flex: .5, renderCell: (params) => {
        return (
          <>
            <Link href={`/account/users/${params.value}/edit`} ><IconButton ><Create fontSize='small' /></IconButton></Link>
            <IconButton onClick={() => { }}><Delete fontSize='small' /></IconButton>
          </>
        )
      }
    }
  ]

  return (
    <div className={classes.root}>
      {/* MODAL */}
      {props.modal && <Modal status={props.modal.status} />}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <PageHeader title='All Users' link1='Users' link2='Users List' />
        <Box style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
          {props.currentUser.role === 'superadmin' && <Button variant='contained' color='primary' disableElevation startIcon={<Add />} size='small' className={classes.addBtn} href='/account/users/new'> Add User</Button>}
          <Button size='small' disabled={disable} variant='contained' color='secondary' disableElevation className={classes.addBtn} onClick={fetchDataFromRevPlus}>RevPlus Connect</Button>
        </Box>
      </div>

      <Card variant='outlined' style={{ borderRadius: '10px', width: '100%' }}>
        <CardContent style={{ padding: '30px' }}>
          <TextField variant='outlined' style={{ marginBottom: '20px' }}
            placeholder='Find user' fullWidth onChange={(e) => searchUsers(e.target.value.toLowerCase())}
            InputProps={{
              startAdornment: <InputAdornment position='start'><Search fontSize='small' /> </InputAdornment>,
              endAdornment: <InputAdornment position='end'> <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}><Tune fontSize='medium' /></IconButton>  </InputAdornment>
            }} />

          <Hidden smDown>
            <DataGrid autoHeight
              pagination rows={allUsers ? filter : []} rowsPerPageOptions={[5, 10, 20]}
              rowHeight={70} columns={columns}
              pageSize={pageSize} checkboxSelection disableSelectionOnClick
              onPageSizeChange={(newSize) => setPageSize(newSize)}
            />
          </Hidden>

          <Hidden mdUp>
            <DataGrid autoHeight
              pagination rows={allUsers ? filter : []} rowsPerPageOptions={[5, 10, 20]}
              rowHeight={70} columns={smcolumns}
              pageSize={pageSize} checkboxSelection
              onPageSizeChange={(newSize) => setPageSize(newSize)}
            />
          </Hidden>

        </CardContent>
      </Card>

      <Popover open={open} onClose={handleClose} anchorEl={anchorEl} transformOrigin={{ vertical: 'top', horizontal: 'right' }} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Card>
          <CardContent style={{ padding: '10px' }}>
            <MenuItem onClick={() => filterUsers('All')} >All</MenuItem>
            <MenuItem onClick={() => filterUsers('Pending')} >Pending</MenuItem>
            <MenuItem onClick={() => filterUsers('Verified')} >Verified</MenuItem>
            <MenuItem onClick={() => filterUsers('Approved')} >Approved</MenuItem>
            <MenuItem onClick={() => filterUsers('Active')} >Active</MenuItem>
            <MenuItem onClick={() => filterUsers('Inactive')} >Inactive</MenuItem>
          </CardContent>
        </Card>
      </Popover>

    </div>

  )
};

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps, { getAllUsers, fetchVerifiedUsers, successModal })(AllUsers);
