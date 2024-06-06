import React, { useEffect, useState } from 'react';
import { Avatar, Box, Button, Card, CardContent, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, IconButton, LinearProgress, MenuItem, Popover, TextField, Typography } from '@material-ui/core';
import { Info, MoreVert, } from '@material-ui/icons';
import { DataGrid } from '@material-ui/data-grid'
import { makeStyles } from '@material-ui/styles';
import { connect } from 'react-redux'
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import { approveUser, confirmUserPayment, deleteUserPayment, reverseLoanDenial, approveLoanDenial } from '../actions/actions';

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



const Approvals = (props) => {
  const classes = useStyles()
  const [pageSize, setPageSize] = useState(10)
  const { allUsers, cards, payments } = props
  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const [pay, setPay] = useState(false);
  const [id, setId] = useState();
  const [loanId, setLoanId] = useState();
  const [filteredUser, setfilteredUser] = useState();
  const [loader, setLoader] = useState(false);
  const [disable, setDisable] = useState(false)
  const [reject, setReject] = useState(false)
  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorEl2);

  useEffect(() => {
    if (id) {
      setfilteredUser(prev => {
        const res = allUsers?.filter(user => user._id === `${id}`)[0]
        return res
      })
    }
  }, [id])

  const currentLoan = filteredUser?.loan[0]?.loans?.filter(el => el._id === loanId)[0]
  const [del, setDel] = useState(false)

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorEl2(null);
    // setPay(false)
  }

  const clickHandle = (e, id, loan_id) => {
    setAnchorEl(e.currentTarget)
    setId(id)
    setLoanId(loan_id)
    setPay(true)
  }

  const click2Handle = (e, id, loan_id) => {
    setAnchorEl2(e.currentTarget)
    setId(id)
    setLoanId(loan_id)
  }

  const onApproval = async (id, loan) => {
    setLoader(true)
    const data = { id: id, loanId: loan }
    await props.approveUser(data)
    handleClose()
    setLoader(false)
  }

  const onLoanReversal = async () => {
    setLoader(true)
    const data = {
      user: filteredUser?.id,
      loanId
    }
    await props.reverseLoanDenial(data)
    handleClose()
    setLoader(false)
  }

  const onLoanDenial = async () => {
    setLoader(true)
    const data = {
      user: filteredUser?.id,
      loanId,
      deleteLoan: del
    }
    await props.approveLoanDenial(data)
    setReject(false)
    setLoader(false)
  }

  const confirmPayment = (id) => {
    const data = { id: id }
    //console.log(data)
    props.confirmUserPayment(data)
  }

  const deletePayment = (id) => {
    // const data =  {id: id}
    // console.log(data)
    props.deleteUserPayment(id)
  }


  const columns = [
    {
      field: 'user', headerName: 'Fullname', flex: 1.5, renderCell: (params) => {
        const user = allUsers?.filter(el => el._id === params.value)[0]
        return (
          <>
            <Avatar src={user?.photo ? user?.photo : null} variant='rounded' sizes='large' />
            <Typography variant='body2' style={{ marginLeft: '20px' }} >{user?.fullname}</Typography>
          </>
        )
      }
    },
    { field: 'amount', headerName: 'Loan Amount', flex: 1, renderCell: (params) => `GHc ${params.value}` },
    { field: 'date', headerName: ' Date & Time', flex: 1.2, renderCell: (params) => { return `${new Date(params.value).toDateString()} at ${new Date(params.value).toLocaleTimeString()}` } },
    {
      field: 'status', headerName: 'Status', flex: .8, renderCell: (params) => { return <Chip size='small' label={params.value} /> }
    },
    {
      field: '_id', headerName: ' Action', flex: .5, renderCell: (params) => {
        return (
          <>
            <IconButton onClick={(e) => clickHandle(e, params.row.user, params.value)}>
              <MoreVert fontSize='small' />
            </IconButton>
          </>
        )
      }
    }
  ]

  const deniedColumns = [
    {
      field: 'user', headerName: 'Fullname', flex: 1.5, renderCell: (params) => {
        const user = allUsers?.filter(el => el._id === params.value)[0]
        return (
          <>
            <Avatar src={user?.photo ? user?.photo : null} variant='rounded' sizes='large' />
            <Typography variant='body2' style={{ marginLeft: '20px' }} >{user?.fullname}</Typography>
          </>
        )
      }
    },
    { field: 'amount', headerName: 'Loan Amount', flex: 1, renderCell: (params) => `GHc ${params.value}` },
    { field: 'updatedAt', headerName: ' Date & Time', flex: 1.2, renderCell: (params) => { return `${new Date(params.value).toDateString()} at ${new Date(params.value).toLocaleTimeString()}` } },
    {
      field: 'isDenied', headerName: 'Status', flex: .8, renderCell: (params) => {
        return (
          <Chip size='small' label={'Denied'} />
        )
      }
    },
    {
      field: '_id', headerName: ' Action', flex: .5, renderCell: (params) => {
        return (
          <>
            <IconButton onClick={(e) => click2Handle(e, params.row.user, params.value)}>
              <MoreVert fontSize='small' />
            </IconButton>
          </>
        )
      }
    }
  ]

  const payColumns = [
    {
      field: 'userID', headerName: 'Fullname', flex: 1.5, renderCell: (params) => {
        const user = allUsers.filter(el => el._id === params.value)[0]
        return (
          <>
            <Avatar src={user.photo ? user.photo : null} variant='rounded' sizes='large' />
            <Typography variant='body2' style={{ marginLeft: '20px' }} >{user.fullname}</Typography>
          </>
        )
      }
    },
    { field: 'amount', headerName: 'Monthly Payment', flex: 1, renderCell: (params) => `GHc ${params.value}` },
    { field: 'updatedAt', headerName: ' Date & Time', flex: 1.5, renderCell: (params) => { return `${new Date(params.value).toDateString()} at ${new Date(params.value).toLocaleTimeString()}` } },
    {
      field: 'status', headerName: ' Action', flex: .5, renderCell: (params) => {
        return (
          <>
            <IconButton onClick={(e) => clickHandle(e, params.row._id)}>
              <MoreVert fontSize='small' />
            </IconButton>
          </>
        )
      }
    }
  ]

  const getLoanReq = (loans) => {
    const reqLoans = []
    loans.map(el => {
      if (el.loans?.length > 0) {
        reqLoans.push(...el.loans)
        return null
      }
      return null
    })

    return reqLoans
  }

  const submittedLoans = getLoanReq(props.loans)
  const inactive = submittedLoans?.filter(el => el.status === 'Processing');
  const denied = submittedLoans?.filter(el => el.isDenied === true && el.status === 'Pending');
  const pendingPayments = props.payments.filter(payment => payment.status === 'pending')

  return (
    <div className={classes.root}>
      {/* MODAL */}
      {props.modal && <Modal status={props.modal.status} />}

      <div style={{ display: 'flex' }}>
        <PageHeader title='Approvals' link1='Approvals' link2='User Accounts' />
      </div>


      { /* LOANS APPROVED */}
      <Card variant='outlined' style={{ borderRadius: '10px', width: '100%' }}>
        <CardContent style={{ padding: '30px' }}>

          <Typography variant='h6' gutterBottom >Loans Approval</Typography>
          <DataGrid autoHeight
            pagination rows={cards ? inactive : []} rowsPerPageOptions={[5, 10, 20]}
            rowHeight={70} columns={columns} getRowId={(row) => row._id}
            pageSize={pageSize} checkboxSelection disableSelectionOnClick
            onPageSizeChange={(newSize) => setPageSize(newSize)}
          />

        </CardContent>
      </Card>

      { /* LOANS DENIAL */}
      <Card variant='outlined' style={{ borderRadius: '10px', width: '100%', marginTop: '2rem' }}>
        <CardContent style={{ padding: '30px' }}>

          <Typography variant='h6' gutterBottom >Loans Denial</Typography>
          <DataGrid autoHeight
            pagination rows={cards ? denied : []} rowsPerPageOptions={[5, 10, 20]}
            rowHeight={70} columns={deniedColumns} getRowId={(row) => row._id}
            pageSize={pageSize} checkboxSelection disableSelectionOnClick
            onPageSizeChange={(newSize) => setPageSize(newSize)}
          />

        </CardContent>
      </Card>

      <Card variant='outlined' style={{ borderRadius: '10px', width: '100%', marginTop: '2rem' }}>
        <CardContent style={{ padding: '30px' }}>
          <Typography variant='h6' gutterBottom >Payments</Typography>
          <DataGrid autoHeight
            pagination rows={payments ? pendingPayments : []} rowsPerPageOptions={[5, 10, 20]}
            rowHeight={70} columns={payColumns}
            pageSize={pageSize} checkboxSelection disableSelectionOnClick
            onPageSizeChange={(newSize) => setPageSize(newSize)}
          />

        </CardContent>
      </Card>

      {/* Approved Actions */}
      <Popover open={open} onClose={handleClose} anchorEl={anchorEl} transformOrigin={{ vertical: 'top', horizontal: 'right' }} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Card>
          <CardContent style={{ padding: '10px' }}>
            <MenuItem onClick={() => onApproval(id, loanId)} >Approve</MenuItem>
            <MenuItem disabled >Decline</MenuItem>
          </CardContent>
        </Card>
      </Popover>

      {/* Denied Actions */}
      <Popover open={open2} onClose={handleClose} anchorEl={anchorEl2} transformOrigin={{ vertical: 'top', horizontal: 'right' }} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Card>
          <CardContent style={{ padding: '10px' }}>
            <MenuItem onClick={() => { setAnchorEl2(null); setReject(true); }} >Deny Loan</MenuItem>
            <MenuItem onClick={onLoanReversal} >Reverse Loan</MenuItem>
          </CardContent>
        </Card>
      </Popover>

      {/* Loader */}
      <Dialog open={loader} maxWidth='sm'>
        <DialogContent style={{ padding: '2rem' }}>
          <Typography paragraph gutterBottom>Loading. Please wait...</Typography>
          <LinearProgress variant='indeterminate' />
        </DialogContent>
      </Dialog>

      {/* PAYMENTS */}
      {/* <Popover open={pay} onClose={handleClose} anchorEl={anchorEl} transformOrigin={{vertical: 'top', horizontal: 'right'}} anchorOrigin={{ vertical: 'bottom', horizontal: 'right'}}>
        <Card>
          <CardContent style={{padding: '10px'}}>
            <MenuItem onClick={()=>confirmPayment(id)} >Approve</MenuItem>
            <MenuItem  onClick={()=>deletePayment(id)} >Delete</MenuItem>
          </CardContent>
        </Card>
    </Popover> */}

      { /* VIEW LOAN REJECTED */}
      <Dialog open={reject} maxWidth='xs'>
        <DialogTitle>Denied Loan</DialogTitle>
        <DialogContent dividers style={{ padding: '1.5rem' }}>
          {currentLoan?.delete &&
            <Box style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start', background: 'orange', padding: '15px 15px', borderRadius: '8px', marginBottom: '2rem' }}>
              <Avatar style={{ width: '2rem', height: '2rem', background: '#3f5176' }}><Info fontSize='small' /></Avatar>
              <Typography variant='body2'>Admin requests that this loan be deleted. Use the checkbox below to confirm the deletion of this loan</Typography>
            </Box>
          }
          <TextField style={{ marginBottom: '1rem' }} variant='outlined' label='Amount' value={`GH¢ ${currentLoan?.amount}`} fullWidth />
          <TextField style={{ marginBottom: '1rem' }} variant='outlined' label='Duration' value={`${currentLoan?.duration} Months`} fullWidth />
          <TextField label='Reason for denial' value={currentLoan?.reason} fullWidth variant='outlined' multiline minRows={6} placeholder='State reasons for denial of loan' />
          <FormControlLabel onChange={() => setDel(!del)} control={<Checkbox color='primary' checked={del} />} label={'Delete this loan request after denial'} />
        </DialogContent>
        <DialogActions style={{ padding: '1rem 1.5rem' }}>
          <Button disabled={disable} variant='outlined' onClick={() => setReject(false)} >Cancel</Button>
          <Button disabled={disable} variant='contained' color='secondary' disableElevation onClick={onLoanDenial} > {del ? 'Confirm & Delete' : 'Confrim'}</Button>
        </DialogActions>
      </Dialog>

    </div>

  )
};

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps, { approveUser, confirmUserPayment, deleteUserPayment, reverseLoanDenial, approveLoanDenial })(Approvals);
