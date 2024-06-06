import { Button, Card, CardContent, CardHeader, Divider, Grid, InputAdornment, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React, { useEffect } from 'react';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import { connect } from 'react-redux';
import { updateInterest, getInterestRates } from '../actions/actions';



const useStyles = makeStyles(theme => ({
  root: {
    '& *': {
      borderRadius: '8px'
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        border: `1px solid ${theme.backgroundPrimary}`
      }
    }

  },
  caption: {
    '& span': {
      fontSize: '1.1rem',
      padding: '.5rem'
    }
  },
  wrapper: {
    padding: '2.5rem'
  },
  field: {
    marginBottom: '1.5rem',
    '& label.Mui-focused': {
      color: theme.backgroundPrimary
    },

  },
  btn: {
    width: '12rem',
    background: theme.backgroundPrimary,
    padding: '.8rem 0',
    color: '#fff',
    borderRadius: '8px',
    marginBottom: '2rem',
    '&:hover': {
      background: theme.backgroundSecondary
    }
  },
  card: {
    '&:hover': {
      boxShadow: 'rgb(32 40 45 / 8%) 0px 2px 14px 0px'
    }
  }
}))


const Settings = (props) => {
  const classes = useStyles()
  const { getInterestRates } = props
  const [rate, setRate] = React.useState('')

  useEffect(() => {
    getInterestRates()
  }, [getInterestRates])

  const updateRates = () => {
    const data = { rate }
    props.updateInterest(data)
  }
  return (
    <>
      <PageHeader title='Settings' link1='Settings' link2='Security' />
      {/* Modal */}
      {props.modal ? <Modal status={props.modal.status} /> : null}
      <Grid container className={classes.root} spacing={4}>
        <Grid item sm={8}>
          <Card variant='outlined' elevation={0} className={classes.card}>
            <CardHeader title='Password & Security' className={classes.caption} />
            <Divider />
            <CardContent className={classes.wrapper}>
              <form >
                <TextField variant='outlined' label='Email address' disabled value={props.currentUser.email} fullWidth className={classes.field} />
                <TextField variant='outlined' label='Current Password' fullWidth className={classes.field} />
                <TextField variant='outlined' label='New Password' fullWidth className={classes.field} />
                <Button className={classes.btn} disableElevation type='submit' >Update Settings</Button>
              </form>

            </CardContent>
          </Card>
        </Grid>

        <Grid item sm={4}>
          <Grid container spacing={2}>

            {
              props.currentUser.role === 'superadmin' &&
              <Grid item sm={12}>
                <Card elevation={0} variant='outlined' className={classes.card}>
                  <CardHeader title={`Interest Rate (${props.interest && props.interest.rate}%)`} className={classes.caption} />
                  <Divider />
                  <CardContent >
                    <TextField variant='outlined' type={'number'} inputProps={{ min: 0 }} value={rate} label='Rate %' InputProps={{
                      endAdornment: <InputAdornment position='end'>
                        <Button variant='contained' disableElevation color='primary' style={{ color: '#fff' }} onClick={updateRates}>Update</Button>
                      </InputAdornment>
                    }}
                      onChange={(e) => setRate(e.target.value)} fullWidth />

                  </CardContent>
                </Card>
              </Grid>
            }

          </Grid>


        </Grid>



      </Grid>
    </>
  )
};

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps, { updateInterest, getInterestRates })(Settings)
