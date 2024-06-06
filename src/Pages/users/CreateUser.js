import React from 'react'
import { Box, Button, Card, CardContent, CardHeader, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, InputAdornment, MenuItem, TextField } from '@material-ui/core'
import { Add, Visibility, VisibilityOff } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import Modal from '../../components/Modal'
import { connect } from 'react-redux'
import PageHeader from '../../components/PageHeader'
import { grey } from '@material-ui/core/colors'
import { useReducer, useState } from 'react'
import { newUserAccount, newAdminAccount, errorModal, axiosInstance } from '../../actions/actions'
import { Navigate } from 'react-router-dom'
import axios from 'axios'


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
    color: grey[400],
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


const CreateUser = (props) => {
  const classes = useStyles()
  const [role, setRole] = useState('')
  const [verify, setVerify] = useState(false)
  const [error, setError] = useState(false)
  const [passCheck, setPassCheck] = useState()
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [id, setID] = useState('')
  const roles = ['Admin', 'Credit Officer', 'User']
  const identity = ['Voters', 'Passport', 'License', 'Ghana Card']
  const { newUserAccount, newAdminAccount } = props

  const adminReduceFn = (state, action) => {
    switch (action.type) {
      case "ROLE":
        return { ...state, role: action.payload }
      case "NAME":
        return { ...state, name: action.payload }
      case "EMAIL":
        return { ...state, email: action.payload }
      case "PHONE":
        return { ...state, phone: action.payload }
      case "PASSWORD":
        return { ...state, password: action.payload }
      case "RESET":
        return { role: '', name: '', email: '', phone: '', password: '' }
      default:
        return { role: '', name: '', email: '', phone: '', password: '' };
    }
  }

  // initialState //
  const initialState = {
    role: '',
    fname: '',
    lname: '',
    other: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    occupation: '',
    company: '',
    companyAddress: '',
    dob: '',
    nationalID: '',
    monthlySalary: ''
  }
  //reducer Function //
  const userReducerFn = (state, action) => {
    switch (action.type) {
      case "ROLE":
        return { ...state, role: action.payload }
      case "FIRSTNAME":
        return { ...state, fname: action.payload.toUpperCase() }
      case "LASTNAME":
        return { ...state, lname: action.payload.toUpperCase() }
      case "EMAIL":
        return { ...state, email: action.payload.toUpperCase() }
      case "PHONE":
        return { ...state, phone: action.payload }
      case "PASSWORD":
        return { ...state, password: action.payload }
      case "ADDRESS":
        return { ...state, address: action.payload.toUpperCase() }
      case "DOB":
        return { ...state, dob: action.payload }
      case "OCCUPATION":
        return { ...state, occupation: action.payload.toUpperCase() }
      case "COMPANY":
        return { ...state, company: action.payload.toUpperCase() }
      case "COMPANY_ADDRESS":
        return { ...state, companyAddress: action.payload.toUpperCase() }
      case "MONTHLY_SALARY":
        return { ...state, monthlySalary: action.payload }
      case "NATIONAL_ID":
        return { ...state, nationalID: action.payload }
      case "RESET_USER":
        return initialState
      default:
        return state;
    }
  }

  const [userInput, userDispatch] = useReducer(userReducerFn, initialState)
  const [adminInput, dispatch] = useReducer(adminReduceFn, { role: role, name: '', email: '', phone: '', password: '' })



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
  const onRoleSelect = (e) => {
    setRole(e.target.value)
    if (e.target.value === 'User') {
      userDispatch({ type: "ROLE", payload: e.target.value.toLowerCase() })
      return
    }
    if (e.target.value === 'Admin') {
      dispatch({ type: "ROLE", payload: e.target.value.toLowerCase() })
      return
    }
  }

  const selectNationalID = (e) => {
    setID(e.target.value)
  }

  const onFormSubmit = (role) => {
    if (role === '') {
      props.errorModal('Please select a role')
      return
    }

    if (role === 'User') {
      if (userInput.fname === '' || userInput.lname === '' || userInput.email === '' || !userInput.email.includes('@') || userInput.password === '' || userInput.phone === '' || userInput.address === '' || userInput.occupation === '' || userInput.company === '' || userInput.companyAddress === '' || userInput.monthlySalary === '' || userInput.dob === '' || userInput.nationalID === '') {
        props.errorModal('Sorry, all fields are required')
        return
      }
      const data = {
        ...userInput,
        IDType: id,
        IDNumber: userInput.nationalID
      }
      newUserAccount(data)
      dispatch({ type: "RESET_USER" })
    } else {
      console.log(role)
      console.log(adminInput)
      newAdminAccount(adminInput)
      dispatch({ type: "RESET" })
      window.location.reload()
    }
  }


  return (
    <>
      {props.currentUser.role === 'superadmin' ?
        <div className={classes.root}>
          {/* MODAL */}
          {props.modal && <Modal status={props.modal.status} />}

          <div style={{ display: 'flex', justifyContent: 'bottom' }}>
            <PageHeader title='Add User' link1='Users' link2='New User' />
          </div>

          <Grid container spacing={4}>
            <Grid item sm={12} xs={12}>
              <Card variant='outlined' className={classes.card}>
                <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <CardHeader title='User Details' className={classes.caption} />
                  <Chip label="Create User" icon={<Add fontSize='small' style={{ color: '#fff' }} />} className={classes.editIcon} onClick={() => setVerify(true)} />
                </Box>
                <Divider />
                <CardContent style={{ padding: '2rem' }} >
                  <TextField select label='Role' required variant='outlined' value={role} fullWidth className={classes.field} onChange={(e) => onRoleSelect(e)} >
                    {roles.map((option) => {
                      return (<MenuItem key={option} value={option} >{option}</MenuItem>)
                    })
                    }
                  </TextField>

                  {/* USER ROLE */}
                  {role === 'User' ?
                    <Grid container spacing={3} >
                      <Grid item sm={6} xs={12}>
                        <TextField fullWidth label='Firstname' variant='outlined' className={classes.field} value={userInput.fname} onChange={(e) => userDispatch({ type: "FIRSTNAME", payload: e.target.value })} />
                        <TextField fullWidth label='Lastname' variant='outlined' className={classes.field} value={userInput.lname} onChange={(e) => userDispatch({ type: "LASTNAME", payload: e.target.value })} />
                        <TextField fullWidth label='Email' type={'email'} variant='outlined' className={classes.field} value={userInput.email} onChange={(e) => userDispatch({ type: "EMAIL", payload: e.target.value })} />
                        <TextField fullWidth label='Phone' type={'number'} variant='outlined' className={classes.field} value={userInput.phone} onChange={(e) => userDispatch({ type: "PHONE", payload: e.target.value })} />
                        <TextField fullWidth label='Password' variant='outlined' type={show ? 'text' : 'password'} value={userInput.password} onChange={(e) => userDispatch({ type: "PASSWORD", payload: e.target.value })}
                          InputProps={{ endAdornment: <InputAdornment position='start'>{show ? <Visibility onClick={() => setShow(false)} className={classes.fieldIcon} /> : <VisibilityOff onClick={() => setShow(true)} className={classes.fieldIcon} />}  </InputAdornment> }}
                          className={classes.field
                          }
                        />
                        <TextField className={classes.field} variant='outlined' value={userInput.dob}
                          onChange={(e) => userDispatch({ type: "DOB", payload: e.target.value })} required
                          label='Date of Birth' type={'date'} fullWidth
                          InputProps={{ startAdornment: <InputAdornment position='start'>DOB</InputAdornment> }}

                        />
                        <TextField fullWidth label='Monthly Salary' type={'number'} value={userInput.monthlySalary} onChange={(e) => userDispatch({ type: "MONTHLY_SALARY", payload: e.target.value })}
                          InputProps={{ startAdornment: <InputAdornment position='start'>GH¢</InputAdornment> }}
                          variant='outlined' className={classes.field} />


                      </Grid>
                      <Grid item sm={6} xs={12}>
                        <TextField fullWidth label='Residence' variant='outlined' className={classes.field} value={userInput.address} onChange={(e) => userDispatch({ type: "ADDRESS", payload: e.target.value })} />
                        <TextField fullWidth label='Occupation' variant='outlined' className={classes.field} value={userInput.occupation} onChange={(e) => userDispatch({ type: "OCCUPATION", payload: e.target.value })} />
                        <TextField fullWidth label='Company name' variant='outlined' className={classes.field} value={userInput.company} onChange={(e) => userDispatch({ type: "COMPANY", payload: e.target.value })} />
                        <TextField fullWidth label="Company's Address" variant='outlined' className={classes.field} value={userInput.companyAddress} onChange={(e) => userDispatch({ type: "COMPANY_ADDRESS", payload: e.target.value })} />

                        <TextField select label='National ID' variant='outlined'
                          fullWidth helperText='' value={id} onChange={(e) => selectNationalID(e)}
                          className={classes.field} >
                          {identity.map((option) => {
                            return (
                              <MenuItem key={option} value={option} >{option}</MenuItem>
                            )
                          })
                          }
                        </TextField>
                        {id === 'Voters' && <TextField className={classes.field} variant='outlined' label='Voters ID' fullWidth value={userInput.nationalID} onChange={(e) => userDispatch({ type: "NATIONAL_ID", payload: e.target.value })} />}
                        {id === 'Passport' && <TextField className={classes.field} variant='outlined' label='Passport No.' fullWidth value={userInput.nationalID} onChange={(e) => userDispatch({ type: "NATIONAL_ID", payload: e.target.value })} />}
                        {id === 'License' && <TextField className={classes.field} variant='outlined' label='Driver License' fullWidth value={userInput.nationalID} onChange={(e) => userDispatch({ type: "NATIONAL_ID", payload: e.target.value })} />}
                        {id === 'Ghana Card' && <TextField className={classes.field} variant='outlined' label='Ghana Card Number' helperText='' value={userInput.nationalID} onChange={(e) => userDispatch({ type: "NATIONAL_ID", payload: e.target.value })} fullWidth />}

                      </Grid>
                    </Grid> :

                    <Grid container spacing={3}>
                      {/* ADMIN & OTHERS */}
                      <Grid item sm={6} xs={12}>
                        <TextField fullWidth label='Fullname' variant='outlined' className={classes.field} value={adminInput.name} onChange={(e) => dispatch({ type: "NAME", payload: e.target.value })} />
                        <TextField fullWidth label='Phone' variant='outlined' type={'number'} className={classes.field} value={adminInput.phone} onChange={(e) => dispatch({ type: "PHONE", payload: e.target.value })} />
                      </Grid>
                      <Grid item sm={6} xs={12}>
                        <TextField fullWidth label='Email' variant='outlined' type={'email'} className={classes.field} value={adminInput.email} onChange={(e) => dispatch({ type: "EMAIL", payload: e.target.value })} />
                        <TextField fullWidth label='Password' type={show ? 'text' : 'password'} InputProps={{ endAdornment: <InputAdornment position='start'>{show ? <Visibility onClick={() => setShow(false)} className={classes.fieldIcon} /> : <VisibilityOff onClick={() => setShow(true)} className={classes.fieldIcon} />}  </InputAdornment> }}
                          variant='outlined' className={classes.field} value={adminInput.password} onChange={(e) => dispatch({ type: "PASSWORD", payload: e.target.value })} />
                      </Grid>
                    </Grid>}



                </CardContent>
              </Card>
            </Grid>

          </Grid>


        </div>
        :
        <Navigate to='/account/users' />

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
          <Button disabled={passCheck ? false : true} disableElevation color='secondary' variant='contained' onClick={() => onFormSubmit(role)}>Create User</Button>
          <Button onClick={() => setVerify(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}


const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps, { newUserAccount, newAdminAccount, errorModal })(CreateUser)