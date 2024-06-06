import React, { useReducer, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import { connect } from 'react-redux'
import { Box, Button, Card, CardContent, CardHeader, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, InputAdornment, MenuItem, TextField } from '@material-ui/core'
import { Add, Payment } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { grey } from '@material-ui/core/colors'
import Modal from '../../components/Modal'
import { axiosInstance, createNewCard, errorModal } from '../../actions/actions'
import { Navigate } from 'react-router-dom'


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
    '&:hover': {
      boxShadow: 'rgb(32 40 45 / 8%) 0px 2px 14px 0px'
    }
  },
  field: {
    marginBottom: '1.5rem',
    '& label.Mui-focused': {
      color: theme.backgroundPrimary
    },

  },
  caption: {
    '& span': {
      fontSize: '1.1rem',
      padding: '.5rem'
    }
  },
  editIcon: {
    fontSize: '.9rem',
    marginRight: '2rem',
    padding: '1.2rem .5rem',
    background: theme.backgroundPrimary,
    color: '#fff'
  },
  fieldIcon: {
    color: grey[600],
    background: grey[200],
    cursor: 'pointer',
  },
  userImage: {
    width: theme.spacing(14),
    height: theme.spacing(14),
    margin: '0 auto',
    marginBottom: '1.5rem',
    borderRadius: '50%',

  }
}))


const AddCard = (props) => {
  const classes = useStyles()
  const [selectUser, setSelectUser] = useState()
  const [verify, setVerify] = useState(false)
  const [error, setError] = useState(false)
  const [passCheck, setPassCheck] = useState()
  const [password, setPassword] = useState('')

  //console.log(props.allUsers)

  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
  const years = ['2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032']

  const getUser = (id) => {
    const user = props.allUsers && props.allUsers.filter(usr => usr._id === id)[0];
    setSelectUser(user)
    console.log(selectUser)
  }

  const reducerFn = (state, action) => {
    switch (action.type) {
      case "USER":
        getUser(action.payload)
        return { ...state, user: action.payload }
      case "NUMBER":
        return { ...state, number: action.payload }
      case "MONTH":
        return { ...state, month: action.payload }
      case "YEAR":
        return { ...state, year: action.payload }
      case "CVV":
        return { ...state, cvv: action.payload }
      case "RESET":
        return { user: '', number: '', month: '', year: '', cvv: '' }
      default:
        return { user: '', number: '', month: '', year: '' };
    }
  }

  const [formInput, dispatch] = useReducer(reducerFn, { user: '', number: '', month: '', year: '', cvv: '' })

  // Check Password
  const checkPassword = async () => {
    try {
      const res = await axiosInstance.post('/admin/password-check', { password })
      if (res.data.status === 'success') {
        setPassCheck(true)
        setError(false)
      }
    } catch (error) {
      setError(true)
      setPassCheck(false)
    }
  }


  // select role
  const onFormSubmit = () => {
    if (formInput.user === '' || formInput.number === '' || formInput.month === '' || formInput.year === '' || formInput.cvv === '') {
      props.errorModal('Sorry, all fields are required')
      return
    }
    const data = {
      ...formInput,
      amount: selectUser.loan[0].amount
    }
    //console.log(data)
    setVerify(false)
    props.createNewCard(data)
    dispatch({ type: "RESET" })
  }

  const generateDigits = () => {
    var digits = Math.floor(Math.random() * 900000000000) + 100000000000;
    dispatch({ type: "NUMBER", payload: '4010' + digits })
  }



  return (
    <>
      {props.currentUser.role === 'superadmin' || props.currentUser.role === 'admin' ?
        <div>
          <PageHeader title='Add Card' link1='Cards' link2='New Card' />
          {props.modal && <Modal status={props.modal.status} />}

          <Grid container spacing={4} className={classes.root}>
            <Grid item sm={12} xs={12}>
              <Card variant='outlined' className={classes.card}>
                <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CardHeader title='New Card Details' className={classes.caption} />
                  <Chip label="Create Card" icon={<Add fontSize='small' style={{ color: '#fff' }} />} className={classes.editIcon} onClick={() => setVerify(true)} />
                </Box>
                <Divider />
                <CardContent style={{ padding: '2rem' }} >
                  <TextField select label='Users' required variant='outlined' value={formInput.user} fullWidth className={classes.field}
                    onChange={(e) => dispatch({ type: "USER", payload: e.target.value })}
                  >
                    {props.allUsers && props.allUsers.filter(user => (user?.card?.length === 0 && user?.loan?.length > 0)).map((option) => {
                      return (<MenuItem key={option.id} value={option.id} >{option.fullname}</MenuItem>)
                    })
                    }
                  </TextField>


                  <Grid container spacing={3}>
                    {/* ADMIN & OTHERS */}
                    <Grid item sm={6} xs={12}>
                      <TextField fullWidth label='Card Number' type={'number'} value={formInput.number} onChange={(e) => dispatch({ type: "NUMBER", payload: e.target.value })} InputProps={{ endAdornment: <InputAdornment position='end'> <Button icon={<Payment />} className={classes.fieldIcon} onClick={generateDigits}>Generate</Button> </InputAdornment> }} variant='outlined' className={classes.field} />
                      <TextField fullWidth label='Approved Loan Amount' value={selectUser ? selectUser.loan[0].amount.toString() : ''} variant='outlined' className={classes.field} InputProps={{ startAdornment: <InputAdornment position='start'>Gh¢</InputAdornment> }} />
                      <TextField fullWidth label='CVV' type={'number'} inputProps={{ min: 0 }} value={formInput.cvv} onChange={(e) => dispatch({ type: "CVV", payload: e.target.value })} variant='outlined' className={classes.field} />
                    </Grid>
                    <Grid item sm={6} xs={12}>
                      <TextField fullWidth label='Expiry Month' select value={formInput.month} onChange={(e) => dispatch({ type: "MONTH", payload: e.target.value })} variant='outlined' className={classes.field} >
                        {months.map(el => {
                          return (
                            <MenuItem key={el} value={el} >{el}</MenuItem>
                          )
                        })}
                      </TextField>
                      <TextField fullWidth label='Expiry Year' select value={formInput.year} onChange={(e) => dispatch({ type: "YEAR", payload: e.target.value })} variant='outlined' className={classes.field} >
                        {years.map(el => {
                          return (
                            <MenuItem key={el} value={el} >{el}</MenuItem>
                          )
                        })}
                      </TextField>

                    </Grid>
                  </Grid>



                </CardContent>
              </Card>
            </Grid>

          </Grid>
        </div>
        :
        <Navigate to='/account/cards' />

      }

      {/* VERIFY USER EMAIL */}
      <Dialog open={verify}>
        <DialogTitle>Password Security</DialogTitle>
        <DialogContent dividers style={{ width: '350px' }}>
          <TextField fullWidth type={'password'} label='Enter your password' value={password} helperText={error && 'Sorry, invalid password'} error={error ? true : false} onChange={(e) => setPassword(e.target.value)} InputProps={{
            endAdornment: <InputAdornment position='end'> <Button disabled={passCheck ? true : false} variant='contained' onClick={() => checkPassword(password)} disableElevation color='secondary' style={{ textTransform: 'none' }}>Confirm</Button> </InputAdornment>
          }} variant='outlined' />
        </DialogContent>
        <DialogActions>
          <Button disabled={passCheck ? false : true} disableElevation color='secondary' variant='contained' onClick={() => onFormSubmit()}>New Card</Button>
          <Button onClick={() => setVerify(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps, { createNewCard, errorModal })(AddCard)