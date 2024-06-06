import { Button, Card, CardContent, CardHeader, Dialog, DialogContent, Divider, Grid, InputAdornment, LinearProgress, MenuItem, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import Modal from '../components/Modal';
import PageHeader from '../components/PageHeader';
import { connect, useDispatch } from 'react-redux';
import { axiosInstance, errorModal, sendMessageSMS } from '../actions/actions';
import { Autocomplete } from '@material-ui/lab';



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
    width: '10rem',
    background: theme.backgroundSecondary,
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


const Messaging = (props) => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const [selectUser, setSelectUser] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [credit, setCredit] = React.useState('')
  const [loader, setLoader] = React.useState(false)


  const sendMessage = async () => {
    if (phone === '' || message === '') {
      dispatch(errorModal('Please provide phone number and message'))
      return
    }
    const data = { message, phone }
    setLoader(true)
    await props.sendMessageSMS(data)
    setLoader(false)
  }

  const checkSMSCredit = async () => {
    setLoader(true)
    const res = await axiosInstance.get(`/admin/user/sms-credit`)
    if (res?.data?.status === 503 || res?.data?.status === 404) {
      dispatch(errorModal('Sorry, could not fetch SMS credit data.'))
      return
    }
    setCredit(res?.data.data)
    setLoader(false)
  }

  const getUser = (id) => {
    const user = props.allUsers && props.allUsers.filter(usr => usr._id === id)[0];
    setPhone(user?.phone)
    setSelectUser(user?.id)
  }

  return (
    <>
      <PageHeader title='SMS Messaging' link1='SMS' />
      {/* Modal */}
      {props.modal ? <Modal status={props.modal.status} /> : null}
      <Grid container className={classes.root} spacing={4}>
        <Grid item sm={8}>
          <Card variant='outlined' elevation={0} className={classes.card}>
            <CardHeader title='SMS Messaging' className={classes.caption} />
            <Divider />
            <CardContent className={classes.wrapper}>
              <Autocomplete
                options={props.allUsers || []} onChange={(e, val) => {
                  console.log(val)
                  getUser(val?.id)
                }}
                getOptionLabel={(option) => option.fullname} className={classes.field}
                renderInput={(params) => <TextField {...params} label="Find A User" variant="outlined" />}
              />
              {/* <TextField select label='Select a User' required variant='outlined' value={selectUser} fullWidth className={classes.field}
                onChange={(e) => {
                  getUser(e.target.value)
                }}
              >
                {props.allUsers && props.allUsers?.map((user) => {
                  return (<MenuItem key={user.id} value={user.id} >{user.fullname}</MenuItem>)
                })
                }
              </TextField> */}
              <TextField variant='outlined' label='Phone Number' inputProps={{ maxLength: 10 }} value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth className={classes.field} />
              <TextField variant='outlined' label='Message' value={message} onChange={(e) => setMessage(e.target.value)} fullWidth multiline minRows={6} className={classes.field} />
              <Button className={classes.btn} disableElevation onClick={sendMessage} >Send SMS</Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item sm={4}>
          <Grid container spacing={2}>
            <Grid item sm={12}>
              <Card elevation={0} variant='outlined' className={classes.card}>
                <CardHeader title={`Check SMS Credit`} className={classes.caption} />
                <Divider />
                <CardContent >
                  <TextField variant='outlined' value={credit} label='SMS Credit' InputProps={{
                    endAdornment: <InputAdornment position='end'>
                      <Button variant='contained' disableElevation color='secondary' style={{ color: '#fff' }} onClick={checkSMSCredit}>Check SMS</Button>
                    </InputAdornment>
                  }} fullWidth />

                </CardContent>
              </Card>
            </Grid>

          </Grid>


        </Grid>



      </Grid>

      {/* Loader */}
      <Dialog open={loader} maxWidth='sm'>
        <DialogContent style={{ padding: '2rem' }}>
          <Typography paragraph gutterBottom>Sending SMS. Please wait...</Typography>
          <LinearProgress variant='indeterminate' />
        </DialogContent>
      </Dialog>
    </>
  )
};

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps, { sendMessageSMS })(Messaging)
