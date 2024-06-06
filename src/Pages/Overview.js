import { Box, Button, Card, CardContent, CardHeader, Chip, Divider, Grid, IconButton, Typography } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid'
import { Delete, Payment, People, Receipt, Store, Visibility } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { getAllLoans, getAllUsers } from '../actions/actions';

const useStyles = makeStyles(theme => ({
  root: {
    '& *': {
      borderRadius: '8px',
    },
    '& .MuiOutlinedInput-root': {
      "&.Mui-focused fieldset": {
        border: `1px solid ${theme.backgroundPrimary}`
      }
    }
  },
  card: {
    padding: '1rem',
    borderRadius: '15px',
    boxShadow: '0 4px 20px 1px rgb(0 0 0 / 6%), 0 1px 4px rgb(0 0 0 / 8%)',
    textAlign: 'center',
    background: '#24324d',
    '& p, h5': {
      color: '#fff'
    }
  },
  cardIcon: {
    fontSize: '2rem',
    marginBottom: '.5rem',
    padding: '1rem',
    background: theme.backgroundPrimary,
    color: '#fff'
  },
  caption: {
    '& span': {
      fontSize: '1.1rem',
      padding: '.5rem',
      textAlign: 'left'
    }
  },
  viewBtn: {
    color: '#fff',
    marginRight: '1rem',
    padding: '.3rem .8rem',
    fontSize: '.8rem'
  }
}))

const Overview = (props) => {
  const { getAllLoans, getAllUsers } = props
  const classes = useStyles()
  const [pageSize, setPageSize] = useState(5)

  useEffect(() => {
    getAllUsers()
    getAllLoans()
  }, [getAllUsers, getAllLoans])

  const columns = [
    { field: 'name', headerName: 'Transaction ID', flex: 1 },
    { field: 'email', headerName: 'Card Name', flex: 1 },
    { field: 'phone', headerName: 'Card number', flex: 1 },
    { field: 'action', headerName: ' Action', flex: 1, renderCell: (params) => { return <><IconButton ><Visibility fontSize='small' /></IconButton> <IconButton> <Delete fontSize='small' /></IconButton></> } }
  ]

  const verifyColumns = [
    { field: 'fullname', headerName: 'Full name', flex: .8 },
    { field: 'email', headerName: 'Email address', flex: 1 },
    {
      field: 'status', headerName: ' Status', flex: 1, renderCell: (params) => {
        return <Chip disabled label={params.value} />
      }
    },
    { field: 'id', headerName: ' Action', flex: .5, renderCell: (params) => { return <><IconButton href={`/account/users/${params.value}/edit`}><Visibility fontSize='small' /></IconButton></> } }
  ]

  const getLoanReq = (loans) => {
    const reqLoans = []
    loans.map(el => {
      if (el.loans?.length > 0) {
        reqLoans.push(...el.loans)
        return
      }
    })

    return reqLoans
  }
  const loanRequests = getLoanReq(props.loans)?.filter(el => el.status === 'Pending' && el.isDenied !== true)

  return (
    <div className={classes.root}>
      <Typography style={{ marginBottom: '1rem' }} variant='h5'> Welcome back, {props.currentUser.name.split(' ')[0]} </Typography>
      <Divider style={{ marginBottom: '3rem' }} />

      <Grid container spacing={1}>

        <Grid item lg={12}>
          <Grid container spacing={3}>

            <Grid item sm={3}>
              <Card variant='outlined' className={classes.card}>
                <CardContent>
                  <People className={classes.cardIcon} />
                  <Typography variant='body1' color='textSecondary'>Active Users</Typography>
                  <Typography variant='h5' color='textSecondary'>{props.allUsers ? props.allUsers.length : '0'}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item sm={3}>
              <Card variant='outlined' className={classes.card}>
                <CardContent>
                  <Store className={classes.cardIcon} />
                  <Typography variant='body1' color='textSecondary'>All Loans</Typography>
                  <Typography variant='h5' color='textSecondary'>{props.loans ? props.loans.filter(loan => loan.loans?.length > 0).filter(el => el.status === 'Approved').length : '0'}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item sm={3}>
              <Card variant='outlined' className={classes.card}>
                <CardContent>
                  <Receipt className={classes.cardIcon} />
                  <Typography variant='body1' color='textSecondary'>Loan Requests</Typography>
                  <Typography variant='h5' color='textSecondary'>{props.loans ? loanRequests.length : '0'}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item sm={3}>
              <Card variant='outlined' className={classes.card}>
                <CardContent>
                  <Payment className={classes.cardIcon} />
                  <Typography variant='body1' color='textSecondary'>Cards</Typography>
                  <Typography variant='h5' color='textSecondary'>{props.cards ? props.cards.length : '0'}</Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item sm={12}>
              <Card variant='outlined' style={{ marginBottom: '1.6rem', padding: '1rem' }}>
                <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CardHeader title={`User Account Verification(${props.allUsers && props.allUsers.filter(el => el.completion === 100 && el.status === 'Pending').length})`} className={classes.caption} />
                  <Button className={classes.viewBtn} color='secondary' variant='contained'>View All</Button>
                </Box>
                <CardContent>

                  <DataGrid autoHeight
                    pagination rows={props.allUsers ? props.allUsers.filter(el => el.completion === 100 && el.status === 'Pending') : []} rowsPerPageOptions={[5, 10, 20]}
                    rowHeight={50} columns={verifyColumns}
                    pageSize={pageSize} checkboxSelection
                    onPageSizeChange={(newSize) => setPageSize(newSize)}
                  />

                </CardContent>
              </Card>
            </Grid>


          </Grid>
        </Grid>

        <Grid item sm={12}>
          <Card variant='outlined' style={{ marginBottom: '1.6rem', padding: '1rem' }}>
            <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <CardHeader title='Loans & Payment' className={classes.caption} />
              <Button className={classes.viewBtn} href={'/account/loan-requests'} variant='contained' color='secondary'>View All</Button>
            </Box>
            <CardContent>

              <DataGrid autoHeight
                pagination rows={[]} rowsPerPageOptions={[5, 10, 20]}
                rowHeight={50} columns={columns}
                pageSize={pageSize} checkboxSelection
                onPageSizeChange={(newSize) => setPageSize(newSize)}
              />

            </CardContent>
          </Card>

        </Grid>
      </Grid>

    </div>
  )
};

const mapStateToProps = (state) => {
  console.log(state)
  return state
}

export default connect(mapStateToProps, { getAllLoans, getAllUsers })(Overview);
