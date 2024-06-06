import { Box, Button, Container, Divider, Grid, TextField, Typography } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/styles';
import React, { useState } from 'react';
import Logo from '../assets/images/logo.png'
import Modal from '../components/Modal';
import { connect, useDispatch } from 'react-redux';
import { errorModal, verifyAdmin } from '../actions/actions';
import 'animate.css'



const useStyles = makeStyles(theme => ({
  root: {
    marginTop: '2rem',
    '& .MuiDivider-root': {
      flexGrow: 1
    }
  },
  wrapper: {
    [theme.breakpoints.up('sm')]: {
      margin: '0'
    },
    display: 'flex',
    flexDirection: 'column',
    padding: '3.2rem',
    borderRadius: '16px',
    boxShadow: '-24px 24px 72px 8px rgb(145 158 171 / 24%)',
    '& a': {
      color: theme.backgroundPrimary,
      fontWeight: 400

    }
  },
  image: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    marginBottom: '.5rem',
    fontWeight: 500
  },
  field: {
    marginBottom: '1.5rem',
    borderRadius: '1.6rem',
    '& *': {
      borderRadius: '8px'
    },
    '& label.Mui-focused': {
      color: theme.backgroundPrimary
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        border: `1px solid ${theme.backgroundPrimary}`
      }
    }
  },
  btn: {
    background: theme.backgroundPrimary,
    padding: '1rem 0',
    color: '#fff',
    borderRadius: '8px',
    marginBottom: '2rem',
    '&:hover': {
      background: theme.backgroundSecondary
    }
  },
  btnGoogle: {
    padding: '1rem 0',
    background: grey[300],
    borderRadius: '8px'
  },
  flex: {
    marginBottom: '2rem',
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    alignItems: 'center'
  },
  fieldIcon: {
    color: grey[400],
    cursor: 'pointer',
  },

}))



const Verify = (props) => {
  const dispatch = useDispatch()
  const classes = useStyles()
  const [code, setCode] = useState('')
  //const path= useLocation();
  //console.log(path)


  const onFormSubmit = async () => {
    if (code === '') {
      dispatch(errorModal('Invalid. Please provide verification code'))
      return
    }
    await props.verifyAdmin({ code: code })
  }


  return (
    <>
      <Container className={classes.root}>

        {/* MODAL  */}
        {props.modal && <Modal status={props.modal.status} />}
        <Grid container style={{ justifyContent: 'center', height: '100vh', alignItems: 'center' }}>
          <Grid item xs={12} sm={5} >
            <Box style={{ width: '14rem', margin: '0 auto 1rem auto' }} className={`animate__animated animate__fadeIn`} >
              <img src={Logo} alt='logo' width={'100%'} />
            </Box>
            <div className={`${classes.wrapper} animate__animated animate__zoomIn`}>
              <Typography className={classes.title} variant='h5'>Verify It's You</Typography>
              <Typography style={{ marginBottom: '2.5rem' }} paragraph color='textSecondary'>Please check your email ({props.currentUser && props.currentUser.email}) to verify your account  </Typography>

              <TextField className={classes.field} variant='outlined' placeholder='Enter verification code' inputProps={{ maxLength: '6' }} value={code} onChange={(e) => setCode(e.target.value)} fullWidth />
              <Button className={classes.btn} disableElevation onClick={onFormSubmit} fullWidth>Verify Code</Button>

              <Box className={classes.flex} >
                <Divider />
                <Typography color='textSecondary' variant='body2' >Didn't get code? Resend code</Typography>
                <Divider />
              </Box>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>

  )
};


const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps, { verifyAdmin })(Verify);
