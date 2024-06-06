import { Box, Button, Container, Grid, InputAdornment, TextField, Typography } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import React, { useReducer } from 'react';
import Logo from '../assets/images/logo.png'
import Modal from '../components/Modal';
import { connect } from 'react-redux';
import { errorModal, loginUser, successModal } from '../actions/actions';
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



const Login = (props) => {
  const { errorModal, loginUser } = props
  const classes = useStyles()
  const [show, setShow] = React.useState(false)


  const reducerFn = (state, action) => {
    switch (action.type) {
      case "EMAIL":
        return { ...state, email: action.payload }
      case "PASSWORD":
        return { ...state, password: action.payload }
      case "RESET":
        return { email: '', password: '' }
      default:
        return state
    }
  }
  const [formInput, dispatch] = useReducer(reducerFn, { email: '', password: '' })

  const onFormSubmit = async () => {
    if (formInput.email === '' || !formInput.email.includes('@') || !formInput.email.includes('.com')) {
      dispatch(errorModal('Invalid email address'))
      return
    }
    if (formInput.password === '') {
      dispatch(errorModal('Invalid password'))
      return
    }

    await loginUser(formInput)
  }

  return (
    <>
      <Container className={classes.root}>

        {/* MODAL  */}
        {props.modal && <Modal status={props.modal.status} />}
        <Grid container style={{ justifyContent: 'center', height: '100vh', alignItems: 'center' }}>
          <Grid item xs={12} sm={5} className={`animate__animated animate__fadeIn`} >
            <Box style={{ width: '13rem', margin: '0 auto 1rem auto' }}>
              <img src={Logo} alt='logo' width={'100%'} />
            </Box>
            <div className={`${classes.wrapper} animate__animated animate__zoomIn`}>
              <Typography className={classes.title} variant='h5'>Admin Account</Typography>
              <Typography style={{ marginBottom: '2.5rem' }} paragraph color='textSecondary'>Provide your login credentials to access your account </Typography>

              <Box>
                <TextField className={classes.field} variant='outlined' label='Email' helperText='' value={formInput.email} onChange={(e) => dispatch({ type: "EMAIL", payload: e.target.value })} fullWidth />
                <TextField className={classes.field} variant='outlined' label='Password'
                  helperText='' fullWidth type={show ? 'text' : 'password'} value={formInput.password} onChange={(e) => dispatch({ type: "PASSWORD", payload: e.target.value })}
                  InputProps={{ endAdornment: <InputAdornment position='start'>{show ? <Visibility onClick={() => setShow(!show)} className={classes.fieldIcon} /> : <VisibilityOff onClick={() => setShow(!show)} className={classes.fieldIcon} />}</InputAdornment> }}
                />

                <Button className={classes.btn} disableElevation onClick={onFormSubmit} fullWidth>Login</Button>
              </Box>


            </div>
          </Grid>
        </Grid>
      </Container>
    </>

  )
};


const mapStateToProps = (state) => {
  //console.log(state)
  return state
}

export default connect(mapStateToProps, { loginUser, errorModal, successModal })(Login);
