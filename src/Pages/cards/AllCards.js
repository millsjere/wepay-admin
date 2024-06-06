import React, { useState } from 'react'
import PageHeader from '../../components/PageHeader'
import { Card, CardContent, InputAdornment, TextField, Button, IconButton, Typography, Chip, MenuItem, Popover, Hidden } from '@material-ui/core'
import { Add, MoreVert, Payment, Search, Visibility } from '@material-ui/icons'
import { DataGrid } from '@material-ui/data-grid'
import { makeStyles } from '@material-ui/styles'
import { connect } from 'react-redux'
import { getAllCards, getAllUsers } from '../../actions/actions'
import Loader from '../../components/Loader'

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
    height: '40px',
    color: '#fff',
    padding: '0 15px',
    borderRadius: '10px',
    '&:hover': {
      background: theme.backgroundSecondary
    }
  }
}))

const AllCards = (props) => {
  const classes = useStyles()
  const [status, setStatus] = useState();
  const [userID, setUserID] = useState();
  const [loanID, setLoanID] = useState();
  const [pageSize, setPageSize] = useState(10)
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  }

  const editCard = (e, val, id, loan_id) => {
    setAnchorEl(e.currentTarget)
    setStatus(val)
    setUserID(id)
    setLoanID(loan_id)
  }

  const columns = [
    {
      field: 'user', headerName: 'Name on Card', flex: 1, renderCell: (params) => {
        const user = props.allUsers && props.allUsers.filter(el => el.id === params.value)
        //console.log(params.value)
        return (
          <>
            <Payment />
            <Typography variant='body2' style={{ marginLeft: '20px' }} >{user[0]?.fullname}</Typography>
          </>
        )
      }
    },
    {
      field: 'number', headerName: 'Card Number', flex: .5, renderCell: (params) => {
        const str = params.value.replace(/\d(?=\d{4})/g, "*");
        return str
      }
    },
    { field: 'amount', headerName: 'Card Amount', flex: .5, renderCell: (params) => { return (`Gh¢ ${params.value.toLocaleString()}`) } },
    { field: 'expiry', headerName: 'Card Expiry', flex: .5, renderCell: (params) => { return (`${params.value.month}/${params.value.year}`) } },
    { field: 'status', headerName: ' Status', flex: .5, renderCell: (params) => { return <Chip disabled label={params.value} /> } },
    // {field: '_id', headerName:' Action', flex: .5, renderCell: (params) => { 
    //   return <>
    //     <IconButton onClick={(e)=>editCard(e, params.row.status, params.row.user, params.value)}>
    //     <MoreVert fontSize='small' />
    //     </IconButton> 
    //   </>
    //   }}
  ]

  const smcolumns = [
    {
      field: 'user', headerName: 'Name on Card', flex: 1, renderCell: (params) => {
        const user = props.allUsers && props.allUsers.filter(el => el.id === params.value)
        //console.log(params.value)
        return (
          <>
            <Payment />
            <Typography variant='body2' style={{ marginLeft: '20px' }} >{user[0].fullname}</Typography>
          </>
        )
      }
    },
    { field: 'amount', headerName: 'Card Amount', flex: .5, renderCell: (params) => { return (`Gh¢ ${params.value.toLocaleString()}`) } },
    { field: 'status', headerName: ' Status', flex: .5, renderCell: (params) => { return <Chip disabled label={params.value} /> } },
    // {field: '_id', headerName:' Action', flex: .5, renderCell: (params) => { 
    //   return <>
    //   <IconButton onClick={(e)=>setAnchorEl(e.currentTarget)}>
    //   <MoreVert fontSize='small' />
    //   </IconButton> 
    //   </>
    //   }}
  ]

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <PageHeader title='All Cards' link1='Cards' link2='Card List' />
      </div>


      {props.allUsers && props.cards ?
        <Card variant='outlined' style={{ borderRadius: '10px', width: '100%' }}>
          <CardContent style={{ padding: '30px' }}>
            <TextField variant='outlined' style={{ marginBottom: '20px' }}
              placeholder='Find a card' fullWidth
              InputProps={{
                startAdornment: <InputAdornment position='start'><Search fontSize='small' /> </InputAdornment>
              }}

            />
            <Hidden smDown>
              <DataGrid autoHeight
                pagination rows={props.cards ? props.cards : []} rowsPerPageOptions={[5, 10, 20]}
                rowHeight={70} columns={columns}
                pageSize={pageSize} checkboxSelection disableSelectionOnClick
                onPageSizeChange={(newSize) => setPageSize(newSize)}
              />
            </Hidden>
            <Hidden mdUp>
              {
                props.cards ?
                  <DataGrid autoHeight
                    pagination rows={props.cards} rowsPerPageOptions={[5, 10, 20]}
                    rowHeight={70} columns={smcolumns} getRowId={row => row._id}
                    pageSize={pageSize} checkboxSelection
                    onPageSizeChange={(newSize) => setPageSize(newSize)}
                  /> : null

              }
            </Hidden>

          </CardContent>
        </Card>
        :
        <Loader />}

      <Popover open={open} onClose={handleClose} anchorEl={anchorEl} transformOrigin={{ vertical: 'top', horizontal: 'right' }} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Card>
          <CardContent style={{ padding: '10px' }}>
            <MenuItem disabled={status === 'inactive' ? true : false} onClick={() => window.location.assign(`/account/loans/${userID}/${loanID}/details`)} >View Loan</MenuItem>
            <MenuItem disabled={status === 'active' ? false : true}>Deactivate</MenuItem>
          </CardContent>
        </Card>
      </Popover>

    </div>
  )
}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps, { getAllCards, getAllUsers })(AllCards)