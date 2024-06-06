import React, { useEffect, useState } from 'react';
import { Card, CardContent, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';
import { Search, Visibility } from '@material-ui/icons';
import { DataGrid } from '@material-ui/data-grid'
import { makeStyles } from '@material-ui/styles';
import PageHeader from '../../components/PageHeader';
import { connect } from 'react-redux'
import { getAllLoans } from '../../actions/actions';

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





const AllLoans = (props) => {
  const classes = useStyles()
  const [pageSize, setPageSize] = useState(10)
  const { loans } = props
  const [filter, setFilter] = useState(loans)

  const getLoanReq = (loans) => {
    const reqLoans = []
    loans.map(el => {
      if (el.loans?.length > 0) {
        reqLoans.push(...el.loans)
        return null
      }

      return null
    })

    return reqLoans?.filter(el => el.status === 'Approved')
  }

  useEffect(() => {
    const approvedLoans = getLoanReq(loans)
    setFilter(approvedLoans)
  }, [loans])

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
    { field: 'amount', headerName: 'Loan Amount', flex: 1, renderCell: (params) => { return `GH¢ ${params.value}.00` } },
    { field: 'interest', headerName: 'Interest(%)', flex: 1, renderCell: (params) => `${params.value}%` },
    { field: 'duration', headerName: 'Duration', flex: 1, renderCell: (params) => { return `${params.value} Months` } },
    { field: 'perMonth', headerName: 'Monthly Payment', flex: 1, renderCell: (params) => { return `GH¢ ${params.value}` } },
    { field: 'status', headerName: ' Total', flex: 1, renderCell: (params) => { return `${params.value}` } },
    {
      field: '_id', headerName: ' Action', flex: .5, renderCell: (params) => {
        return <>
          <IconButton href={`/account/loans/${params.row.user}/${params.value}/details`} ><Visibility fontSize='small' /></IconButton>
        </>
      }
    }
  ]

  const searchLoan = (val) => {
    const result = loans.filter(loan => loan.user[0].fullname.toLowerCase().includes(val) && loan.status === 'Approved')
    setFilter(result)
  }

  return (
    <div className={classes.root}>

      <div style={{ display: 'flex', justifyContent: 'bottom' }}>
        <PageHeader title='All Loans' link1='Loans' link2='Approved Loans' />
        {/* <Button startIcon={<Add/>} size='small' variant='contained' color='secondary' disableElevation className={classes.addBtn} href='/account/loans/new'> New Loan</Button> */}
      </div>

      <Card variant='outlined' style={{ borderRadius: '10px', width: '100%' }}>
        <CardContent style={{ padding: '30px' }}>
          <TextField variant='outlined' style={{ marginBottom: '20px' }}
            placeholder='Find a loan' fullWidth onChange={(e) => searchLoan(e.target.value.toLowerCase())}
            InputProps={{
              startAdornment: <InputAdornment position='start'><Search fontSize='small' /> </InputAdornment>
            }} />
          <DataGrid autoHeight
            pagination rows={loans ? filter : []} rowsPerPageOptions={[5, 10, 20]}
            rowHeight={70} columns={columns} getRowId={row => row._id}
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

export default connect(mapStateToProps, { getAllLoans })(AllLoans);
