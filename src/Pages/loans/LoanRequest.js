import React, { useEffect, useState } from 'react';
import { Card, CardContent, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';
import { Search, Visibility } from '@material-ui/icons';
import { DataGrid } from '@material-ui/data-grid'
import { makeStyles } from '@material-ui/styles';
import PageHeader from '../../components/PageHeader';
import { connect } from 'react-redux'
import Modal from '../../components/Modal';
import { getAllUsers, getAllLoans } from '../../actions/actions';


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



const LoanRequest = (props) => {
  const classes = useStyles()
  const { getAllUsers, getAllLoans } = props
  const [pageSize, setPageSize] = useState(10)
  // console.log(props)


  useEffect(() => {
    getAllUsers()
    getAllLoans()
  }, [getAllUsers, getAllLoans])

  const columns = [

    {
      field: 'user', headerName: 'Customer Name', flex: 1.5, renderCell: (params) => {
        const user = props.allUsers?.filter(el => el.id === params.value)[0]
        return (
          <>
            <Typography variant='body2' style={{ marginLeft: '20px' }} >{user?.fullname}</Typography>
          </>
        )
      }
    },
    {
      field: 'amount', headerName: 'Loan Amount', flex: 1, renderCell: (params) => {

        return `GH¢ ${params.value}.00`
      }
    },
    { field: 'interest', headerName: 'Interest(%)', flex: 1, renderCell: (params) => `${params.value}%` },
    { field: 'duration', headerName: 'Duration', flex: 1, renderCell: (params) => { return `${params.value} Months` } },
    { field: 'status', headerName: 'Status', flex: 1, renderCell: (params) => { return `${params.value}` } },
    {
      field: '_id', headerName: ' Action', flex: .5, renderCell: (params) => {
        return <>
          <IconButton href={`/account/loans/${params.row.user}/${params.value}/details`} ><Visibility fontSize='small' /></IconButton>
        </>
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

  const pendingLoans = getLoanReq(props.loans)?.filter(el => el.status !== 'Processing' && el.status !== 'Approved' && el.isDenied !== true)


  return (
    <div className={classes.root}>
      {/* MODAL */}
      {props.modal && <Modal status={props.modal.status} />}

      <div style={{ display: 'flex' }}>
        <PageHeader title='Loans Request' link1='Loans' link2='Loans & Payment' />
      </div>

      <Card variant='outlined' style={{ borderRadius: '10px', width: '100%' }}>
        <CardContent style={{ padding: '30px' }}>
          <TextField variant='outlined' style={{ marginBottom: '20px' }}
            placeholder='Find a Loan' fullWidth
            InputProps={{
              startAdornment: <InputAdornment position='start'><Search fontSize='small' /> </InputAdornment>
            }} />

          <DataGrid autoHeight
            pagination rows={pendingLoans ? pendingLoans : []} rowsPerPageOptions={[5, 10, 20]}
            rowHeight={70} columns={columns} getRowId={(row) => row._id + row.duration}
            pageSize={pageSize} checkboxSelection disableSelectionOnClick
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

export default connect(mapStateToProps, { getAllUsers, getAllLoans })(LoanRequest)
