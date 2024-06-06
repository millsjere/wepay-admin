import React, { useReducer, useRef, useState } from 'react';
import { Avatar, Box, Button, Card, CardContent, CardHeader, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, Grid, IconButton, InputAdornment, LinearProgress, Link, Step, StepLabel, Stepper, TextField, Typography } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { Edit, Schedule, CheckCircle, Visibility, CameraAlt } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import PageHeader from '../../components/PageHeader'
import Modal from '../../components/Modal'
import { connect, useDispatch } from 'react-redux'
import { verifyUserEmail, approvalRequest, errorModal, updateUserPhoto, updateUserGhCard, updateUserPayslip, updateUserSDO, updateUserDocuments, updateUserDetails, successModal, fetchUserAccount, axiosInstance } from '../../actions/actions';
import Loader from '../../components/Loader';
import { useLocation } from 'react-router-dom';
import UploadFile from '../../assets/images/file-upload.png';
import PDF from '../../assets/images/pdf.png'
import Template from '../../components/Template';
import { PDFDownloadLink } from '@react-pdf/renderer';




const useStyles = makeStyles(theme => ({
  root: {
    '& *': {

    },
    "& .MuiOutlinedInput-root": {
      borderRadius: '8px',
      "&.Mui-focused fieldset": {
        border: `1px solid ${theme.backgroundPrimary}`,
        borderRadius: '8px'
      }
    }

  },
  caption: {
    '& span': {
      fontSize: '1.1rem',
      padding: '.5rem',
      fontWeight: 500,
    }
  },
  wrapper: {
    padding: '2.5rem'
  },
  field: {
    marginBottom: '1rem',
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
  userImage: {
    width: theme.spacing(14),
    height: theme.spacing(14),
    margin: '0 auto',
    marginBottom: '1.5rem',
    borderRadius: '50%',
    border: `1px solid ${theme.backgroundPrimary}`
  },
  card: {
    '&:hover': {
      boxShadow: 'rgb(32 40 45 / 8%) 0px 2px 14px 0px'
    }
  },
  upload: {
    minWidth: '350px',
    padding: '.7rem',
    textAlign: 'center',
    border: `1px solid ${grey[300]}`,
    borderRadius: '8px',
    marginBottom: '1.5rem',
    cursor: 'pointer',
    '&:hover': {
      background: grey[100]
    }
  },
  editIcon: {
    fontSize: '.9rem',
    padding: '0 .5rem',
    borderRadius: '50px',
    color: '#fff'
  },
  documents: {
    height: '10rem',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    border: `1px solid ${grey[300]}`,
    borderRadius: '8px',
    marginBottom: '1rem',
  }
}))

const UserEdit = (props) => {
  const { updateUserPhoto, updateUserGhCard, updateUserPayslip, updateUserSDO } = props
  const classes = useStyles()
  const userId = useLocation().pathname.split('/')[3]
  const dispatch = useDispatch()
  const [disable, setDisable] = useState(false)
  const [error, setError] = useState(false)
  const [passCheck, setPassCheck] = useState()
  const [password, setPassword] = useState('')
  const [verify, setVerify] = useState(false)
  const [open, setOpen] = useState(false)
  const [openBank, setOpenBank] = useState(false)
  const [openDocument, setOpenDocument] = useState(false)
  const [approve, setApprove] = useState(false)
  const [decline, setDecline] = useState(false)
  const [check, setCheck] = useState(false)
  const [loader, setLoader] = useState(false)
  const [reasons, setReasons] = useState('')
  const [limit, setLimit] = useState(0)
  const [notify, setNotify] = useState(false)

  const ref1 = useRef()
  const ref2 = useRef()
  const ref3 = useRef()
  const pix = useRef()

  const personalState = { fname: '', lname: '', other: '', address: '', dob: '', phone: '', occupation: '', company: '', companyAddress: '', monthlySalary: '', nationalID: '', id_issue_date: '', id_expiry_date: '' }

  //reducer Function //
  const personalReducerFn = (state, action) => {
    switch (action.type) {
      case "FNAME":
        return { ...state, fname: action.payload.toUpperCase() }
      case "LNAME":
        return { ...state, lname: action.payload.toUpperCase() }
      case "OTHER":
        return { ...state, other: action.payload.toUpperCase() }
      case "ADDRESS":
        return { ...state, address: action.payload.toUpperCase() }
      case "PHONE":
        return { ...state, phone: action.payload }
      case "DOB":
        return { ...state, dob: action.payload }
      case "MONTHLY_SALARY":
        return { ...state, monthlySalary: action.payload }
      case "NATIONAL_ID":
        return { ...state, nationalID: action.payload }
      case "OCCUPATION":
        return { ...state, occupation: action.payload.toUpperCase() }
      case "COMPANY":
        return { ...state, company: action.payload.toUpperCase() }
      case "COMPANY_ADDRESS":
        return { ...state, companyAddress: action.payload.toUpperCase() }
      case "ISSUE_DATE":
        return { ...state, id_issue_date: action.payload }
      case "EXPIRY_DATE":
        return { ...state, id_expiry_date: action.payload }
      case "RESET":
        return personalState
      default:
        return state;
    }
  }

  const bankReducerFn = (state, action) => {
    switch (action.type) {
      case "BANK":
        return { ...state, bank: action.payload }
      case "ACC_NUMBER":
        return { ...state, accNumber: action.payload }
      case "BRANCH":
        return { ...state, bankBranch: action.payload }
      case "MANAGER":
        return { ...state, bankManager: action.payload }
      case "SECURITY":
        return { ...state, security: action.payload }
      case "RESET":
        return { bank: '', accNumber: '', bankBranch: '', security: '' }
      default:
        return state;
    }
  }

  const uploadReducerFn = (state, action) => {
    switch (action.type) {
      case "PAYSLIP":
        return { ...state, payslip: action.payload }
      case "SDO":
        return { ...state, sdo: action.payload }
      case "GHCARD":
        return { ...state, ghCard: action.payload }
      case "RESET":
        return { payslip: '', sdo: '', ghCard: '' }
      default:
        return state;
    }
  }
  const [personalInput, dispatchPersonal] = useReducer(personalReducerFn, personalState)
  const [bankInput, dispatchBank] = useReducer(bankReducerFn, { bank: '', accNumber: '', bankBranch: '', bankManager: '', security: '' })
  const [uploadInput, dispatchUpload] = useReducer(uploadReducerFn, { payslip: '', sdo: '', ghCard: '' })


  const closeDialog = (val) => {
    if (val === 'personal') {
      setOpen(false)
      dispatchPersonal({ type: "RESET" })
    }
    if (val === 'bank') {
      setOpenBank(false)
      dispatchBank({ type: "RESET" })
    }
    if (val === 'doc') {
      setOpenDocument(false)
      dispatchUpload({ type: "RESET" })
    }
  }

  const onSelectHandle = () => {
    setCheck(!check)
  }
  const onApprovalCancel = () => {
    setApprove(false)
    setCheck(false)
  }

  const approvalRequest = (id) => {
    //..call action creator
    const data = { id, limit }
    props.approvalRequest(data)
    setApprove(false)
  }

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

  const verifyUserEmail = (email) => {
    const data = { email: email }
    props.verifyUserEmail(data)
  }

  const onFormSubmit = (e, field) => {
    e.preventDefault()
    if (field === 'Personal') {
      if (personalInput.fname === '' && personalInput.lname === '' && personalInput.other === '' && personalInput.address === '' && personalInput.phone === '' && personalInput.occupation === '' && personalInput.company === '' && personalInput.companyAddress === '' && personalInput.monthlySalary === '' && personalInput.nationalID === '' && personalInput.dob === '') {
        props.errorModal('Sorry, please provide a field to update')
        return
      }
      if (personalInput.phone.includes('+') || personalInput.phone.includes('-')) {
        props.errorModal('Invalid. Phone number must contain only numbers')
        return
      }
      personalInput.notify = notify
      props.successModal('Updating user account. Please wait..')
      props.updateUserDetails(personalInput, field, userId)
      setOpen(false)
      dispatchPersonal({ type: "RESET" })
      return
    }
    if (field === 'Bank') {
      if (bankInput.bank === '' || bankInput.accNumber === '' || bankInput.bankBranch === '' || bankInput.security === '') {
        props.errorModal('Sorry, please provide required fields')
        return
      }
      props.updateUserDetails(bankInput, field, userId)
      setOpenBank(false)
      dispatchBank({ type: "RESET" })
      return
    }
    if (field === 'Documents') {
      if (uploadInput.payslip === '' || uploadInput.sdo === '' || uploadInput.ghCard === '') {
        props.errorModal('Sorry, please upload all document fields to sumbit')
        return
      }
      const formData = new FormData()
      formData.append('gallery[]', uploadInput.payslip)
      formData.append('gallery[]', uploadInput.sdo)
      formData.append('gallery[]', uploadInput.ghCard)

      props.updateUserDocuments(formData, field, userId)
      setOpenDocument(false)
      dispatchUpload({ type: "RESET" })
    }
    if (field === 'Photo') {
      const formData = new FormData()
      formData.append('gallery[]', e.target.files[0])

      props.uploadDocuments(formData, field)
    }

  }

  const uploadPhoto = async (e, id) => {
    const file = e.target?.files[0]
    if (file?.type !== 'image/png' || file?.type !== 'image/jpg' || file?.type !== 'image/jpeg') {
      props.errorModal('Invalid file type. Please select png, jpg, jpeg files only')
      return
    }
    if (file.size > 500000) {
      props.errorModal('Invalid. File size is too large. Max size is 500KB')
      return
    }
    else {
      const data = new FormData()
      data.append('photo', e.target.files[0])
      setLoader(true)
      await updateUserPhoto(data, id)
      setLoader(false)
    }
  }

  const uploadGhCard = async (e, id) => {
    const file = e.target?.files[0]
    if (file?.type !== 'image/png' || file?.type !== 'image/jpg' || file?.type !== 'image/jpeg') {
      props.errorModal('Invalid file type. Please select png, jpg, jpeg files only')
      return
    }
    if (file.size > 500000) {
      props.errorModal('Invalid. File size is too large. Max size is 500KB')
      return
    }
    else {
      const data = new FormData()
      data.append('ghcard', e.target.files[0])
      setLoader(true)
      await updateUserGhCard(data, id)
      setLoader(false)
    }
  }

  const uploadPaySlip = async (e, id) => {
    const file = e.target?.files[0]
    if (file?.size > 5000000) {
      props.errorModal('Invalid. File size is too large. Max size is 5MB')
      return
    }
    if (file?.type === 'image/png' || file?.type === 'image/jpg' || file?.type === 'image/jpeg' || file?.type === 'application/pdf') {
      const data = new FormData()
      data.append('payslip', e.target.files[0])
      setLoader(true)
      await updateUserPayslip(data, id)
      setLoader(false)
    }
    else {
      props.errorModal('Invalid file type. Please select png, jpg, jpeg, pdf files only')
      return
    }
  }

  const uploadSDO = async (e, id) => {
    const file = e.target?.files[0]
    console.log(file?.type)
    if (file?.size > 5000000) {
      props.errorModal('Invalid. File size is too large. Max size is 5MB')
      return
    }
    if (file?.type === 'image/png' || file?.type === 'image/jpg' || file?.type === 'image/jpeg' || file?.type === 'application/pdf') {
      const data = new FormData()
      data.append('sdo', e.target.files[0])
      setLoader(true)
      await updateUserSDO(data, id)
      setLoader(false)
    }
    else {
      props.errorModal('Invalid file type. Please select png, jpg, jpeg, pdf files only')
      return
    }
  }


  const fetchAccount = async () => {
    dispatch(successModal('Sending user data to RevPlus. Please wait'))
    setDisable(true)
    await props.fetchUserAccount()
    dispatch(successModal('Success. User data submitted to RevPlus'))
    setDisable(false)
    window.location.reload()
  }

  const renderPage = () => {
    if (props.allUsers.length > 0) {
      const filteredUser = props.allUsers && props.allUsers.filter(user => user._id === `${userId}`)[0]
      //  console.log(filteredUser?.documents.sdo?.split('/')?.slice('-1')[0]?.split('.')[1])

      return <>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <PageHeader title='Edit User' link1='Users' link2='Edit User' />
          <span>
            {filteredUser?.bankStatus === 0 && filteredUser?.accountNo === null ? null :
              filteredUser?.bankStatus > 0 && filteredUser?.accountNo === null ?
                <Button disabled={disable} style={{ marginTop: '1rem', marginRight: '10px' }} onClick={fetchAccount}
                  size='medium' variant='contained' color='secondary' disableElevation >Push To RevPlus</Button> : null
            }
            {
              filteredUser?.loan?.length > 0 &&
              <Button disabled={disable} style={{ marginTop: '1rem' }} href={`/account/loans/${filteredUser?._id}/${filteredUser?.loan[0]?.loans[0]?._id}/details`}
                size='medium' variant='contained' color='secondary' disableElevation >View Loans</Button>
            }
          </span>
        </div>
        {/* MODAL */}
        {props.modal && <Modal status={props.modal.satus} />}


        <Box mb={5} sx={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid #e8e8e8' }}>
          <Stepper orientation='horizontal' alternativeLabel >
            <Step completed={filteredUser.bioStatus > 0 ? true : false}>
              <StepLabel>Registration</StepLabel>
            </Step>
            <Step completed={filteredUser.emailStatus > 0 ? true : false}>
              <StepLabel>Account Activation</StepLabel>
            </Step>
            <Step completed={filteredUser.bankStatus > 0 ? true : false}>
              <StepLabel>Bank Details</StepLabel>
            </Step>
            <Step active={filteredUser.bioStatus > 0 && filteredUser.emailStatus > 0 && filteredUser.bankStatus > 0 ? true : false} completed={filteredUser.status === 'Verified' || filteredUser.status === 'Approved' ? true : false}>
              <StepLabel>Verfication</StepLabel>
            </Step>
            <Step active={filteredUser?.loan?.length > 0 ? true : false} completed={filteredUser?.loan[0]?.loans?.length > 0 ? true : false} >
              <StepLabel>Loan Request</StepLabel>
            </Step>

          </Stepper>
        </Box>

        <Grid container className={classes.root} spacing={4}>
          <Grid item sm={8}>
            <Card variant='outlined' elevation={0} className={classes.card} style={{ marginBottom: '1.5rem' }}>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: grey[200] }}>
                <CardHeader title='Personal Details' className={classes.caption} />
                <Box marginRight={'2rem'} display='flex' gridGap='.6rem'>
                  <Chip label={<Typography variant='body2'>Edit</Typography>} color='secondary' icon={<Edit fontSize='small' style={{ color: '#fff' }} />} className={classes.editIcon} onClick={() => { setOpen(true) }} />
                </Box>
              </Box>
              <Divider />
              <CardContent className={classes.wrapper}>
                <Box style={{ position: 'relative', width: 'fit-content' }}>
                  <input type='file' accept='.png, .jpg' style={{ display: 'none' }} ref={pix} onChange={(e) => uploadPhoto(e, filteredUser?.id)} />
                  <Avatar src={filteredUser?.photo} style={{ width: '9rem', height: '9rem', border: '2px solid #f6a200', marginBottom: '2rem', marginTop: '-1rem', borderRadius: '50%' }} />
                  <IconButton onClick={() => pix.current.click()} style={{
                    borderRadius: '50px', boxShadow: '0 2px 10px rgba(0,0,0, 20%)',
                    background: '#fff', position: 'absolute', bottom: '2%', right: '5%',
                  }}><CameraAlt fontSize='small' /></IconButton>
                </Box>

                <Grid container spacing={3}>
                  <Grid item sm={6} xs={12}>
                    <TextField variant='outlined' label='Fullname' value={filteredUser.fullname} fullWidth className={classes.field} />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField variant='outlined' label='Residence Address' value={filteredUser.address} fullWidth className={classes.field} />
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item sm={6} xs={12}>
                    <TextField variant='outlined' label='Phone' value={filteredUser.phone} fullWidth className={classes.field} />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField variant='outlined' label='Occupation' value={filteredUser.occupation} fullWidth className={classes.field} />
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item sm={6} xs={12}>
                    <TextField variant='outlined' label='Company' value={filteredUser.company} fullWidth className={classes.field} />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField variant='outlined' label='Company Address' value={filteredUser.companyAddress} fullWidth className={classes.field} />
                  </Grid>
                </Grid>
                <Grid container spacing={3}>
                  <Grid item sm={6} xs={12}>
                    <TextField variant='outlined' label='Date of Birth' value={`${filteredUser.dob}`} fullWidth className={classes.field} />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField variant='outlined' label='Monthly Salary' value={`Ghc ${filteredUser.monthlySalary}`} fullWidth className={classes.field} />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField variant='outlined' label='National ID' value={`${filteredUser.nationalID.idNumber}`}
                      fullWidth className={classes.field} />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField variant='outlined' label='Issue Date' value={`${filteredUser.nationalID?.id_issue_date}`}
                      fullWidth className={classes.field} />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField variant='outlined' label='Expiry Date' value={`${filteredUser.nationalID?.id_expiry_date}`}
                      fullWidth className={classes.field} />
                  </Grid>
                  <Grid item sm={6} xs={12}>
                    <TextField variant='outlined' label='Account No.' value={filteredUser.accountNo ? filteredUser.accountNo : ''}
                      fullWidth className={classes.field} />
                  </Grid>

                </Grid>

              </CardContent>
            </Card>

            {/* BANK DETAILS */}
            <Card variant='outlined' elevation={0} className={classes.card}>
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: grey[200] }}>
                <CardHeader title='Bank Details' className={classes.caption} />
                <Box marginRight={'2rem'} display='flex' gridGap='.6rem'>
                  <Chip label={<Typography variant='body2'>Edit</Typography>} color='secondary' icon={<Edit fontSize='small' style={{ color: '#fff' }} />} className={classes.editIcon} onClick={() => { setOpenBank(true) }} />
                  {/* <Chip label={ filteredUser.bankStatus > 0 ? <Typography variant='body2'>Submitted</Typography> : <Typography variant='body2'>Pending</Typography> } color='primary'  className={classes.editIcon}/>  */}
                </Box>
              </Box>
              <Divider />
              <CardContent className={classes.wrapper}>
                {filteredUser.bankStatus === 0 ? null :
                  <>
                    <Grid container spacing={2}>
                      <Grid item sm={6} xs={12}>
                        <TextField variant='outlined' label='Name of Bank' value={filteredUser.bank} fullWidth className={classes.field} InputProps={{
                          endAdornment: filteredUser.bankStatus > 0 && filteredUser.status === 'Verified' ?
                            <InputAdornment position='end'><CheckCircle fontSize='small' style={{ color: '#f6a200' }} /></InputAdornment> : <InputAdornment position='end'><Schedule fontSize='small' style={{ color: '#f6a200' }} /></InputAdornment>
                        }} />
                      </Grid>
                      <Grid item sm={6} xs={12}>
                        <TextField variant='outlined' label='Account Number' value={filteredUser.accNumber} fullWidth className={classes.field} InputProps={{
                          endAdornment: filteredUser.bankStatus > 0 && filteredUser.status === 'Verified' ?
                            <InputAdornment position='end'><CheckCircle fontSize='small' style={{ color: '#f6a200' }} /></InputAdornment> : <InputAdornment position='end'><Schedule fontSize='small' style={{ color: '#f6a200' }} /></InputAdornment>
                        }} />
                      </Grid>

                      <Grid item sm={6} xs={12}>
                        <TextField variant='outlined' label='Account Branch' value={filteredUser.bankBranch} fullWidth className={classes.field} InputProps={{
                          endAdornment: filteredUser.bankStatus > 0 && filteredUser.status === 'Verified' ?
                            <InputAdornment position='end'><CheckCircle fontSize='small' style={{ color: '#f6a200' }} /></InputAdornment> : <InputAdornment position='end'><Schedule fontSize='small' style={{ color: '#f6a200' }} /></InputAdornment>
                        }} />
                      </Grid>
                      <Grid item sm={6} xs={12}>
                        <TextField variant='outlined' label='Relation Manager' value={filteredUser.bankManager} fullWidth className={classes.field} InputProps={{
                          endAdornment: filteredUser.bankStatus > 0 && filteredUser.status === 'Verified' ?
                            <InputAdornment position='end'><CheckCircle fontSize='small' style={{ color: '#f6a200' }} /></InputAdornment> : <InputAdornment position='end'><Schedule fontSize='small' style={{ color: '#f6a200' }} /></InputAdornment>
                        }} />
                      </Grid>
                      <Grid item sm={6} xs={12}>
                        <TextField variant='outlined' label='Security Question' value={filteredUser.security} fullWidth className={classes.field} InputProps={{
                          endAdornment: filteredUser.bankStatus > 0 && filteredUser.status === 'Verified' ?
                            <InputAdornment position='end'><CheckCircle fontSize='small' style={{ color: '#f6a200' }} /></InputAdornment> : <InputAdornment position='end'><Schedule fontSize='small' style={{ color: '#f6a200' }} /></InputAdornment>
                        }} />
                      </Grid>
                    </Grid>
                  </>
                }

              </CardContent>
            </Card>
          </Grid>


          <Grid item sm={4} xs={12}>
            {/* EMAIL STATUS */}
            <Card elevation={0} variant='outlined' className={classes.card} style={{ marginBottom: '1.5rem' }} >
              <Box display='flex' justifyContent='space-between' alignItems='center' paddingRight='2rem' style={{ backgroundColor: grey[200] }}>
                <CardHeader title='Email Address' className={classes.caption} />
                <Chip label={filteredUser.emailStatus > 0 ? <Typography variant='body2'>Verified</Typography> : <Typography variant='body2'>Pending</Typography>} color='primary' className={classes.editIcon} />
              </Box>
              <Divider />
              <CardContent className={classes.wrapper}>
                <TextField variant='outlined' label='Email' value={filteredUser.email} fullWidth className={classes.field} InputProps={{
                  endAdornment: filteredUser.emailStatus > 0 ?
                    <InputAdornment position='end'><CheckCircle style={{ color: '#f6a200' }} /></InputAdornment> : <InputAdornment position='end'><Schedule style={{ color: '#f6a200' }} /></InputAdornment>
                }} />
                <Button variant='contained' size='large' disableElevation color='secondary' onClick={() => setVerify(true)} disabled={filteredUser.emailStatus > 0 && true} >Verify Email </Button>
              </CardContent>
            </Card>

            { /* DOCUMENTS */}
            <Card elevation={0} variant='outlined' className={classes.card} style={{ marginBottom: '1.5rem' }} >
              <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: grey[200] }}>
                <CardHeader title='Documents' className={classes.caption} />
              </Box>
              <Divider />
              <CardContent className={classes.wrapper}>
                <input type='file' accept='.png, .jpg, .jpeg' style={{ display: 'none' }} ref={ref1} onChange={(e) => uploadPaySlip(e, filteredUser?.id)} />
                <input type='file' accept='.png, .jpg, .jpeg' style={{ display: 'none' }} ref={ref2} onChange={(e) => uploadGhCard(e, filteredUser?.id)} />
                <input type='file' id='file' accept='.png, .jpg, .jpeg, .pdf' style={{ display: 'none' }} ref={ref3} onChange={(e) => uploadSDO(e, filteredUser?.id)} />
                {
                  filteredUser.documents.payslip ?
                    <Box className={classes.documents} style={{ position: 'relative', backgroundImage: `url('${filteredUser.documents.payslip}')`, }}>
                      <Box style={{ position: 'absolute', bottom: '10%', left: '5%', display: 'flex', gap: '.5rem' }}>
                        <Link underline='none' href={filteredUser.documents.payslip} target={'_blank'} > <Chip label='Payslip' icon={<Visibility fontSize='small' />} style={{ background: '#fff', borderRadius: '50px', padding: '7px', cursor: 'pointer' }} /> </Link>
                        <Chip label='Edit' onClick={() => ref1.current.click()} icon={<Edit fontSize='small' />} style={{ cursor: 'pointer', background: '#fff', borderRadius: '50px', padding: '7px' }} />
                      </Box>
                    </Box>
                    :
                    <Box onClick={() => ref1.current.click()} sx={{ cursor: 'pointer', mb: '1rem', padding: '2rem', borderRadius: '10px', border: `1px dashed ${grey[300]}` }}>
                      <img src={UploadFile} style={{ width: '15%', margin: '0 auto', display: 'block' }} alt='ghcard' />
                      <Typography style={{ textAlign: 'center' }}>Upload PaySlip</Typography>
                      <Typography style={{ textAlign: 'center' }} variant='body2' color={'textSecondary'}>Max File Size: 1MB</Typography>
                    </Box>

                }

                {
                  filteredUser.documents.ghcard ?
                    <Box className={classes.documents} style={{ position: 'relative', backgroundImage: `url('${filteredUser.documents.ghcard}')`, }}>
                      <Box style={{ position: 'absolute', bottom: '10%', left: '5%', display: 'flex', gap: '.5rem' }}>
                        <Link underline='none' href={filteredUser.documents.ghcard} target={'_blank'} >
                          <Chip label='Ghana Card' icon={<Visibility fontSize='small' />} style={{ cursor: 'pointer', background: '#fff', borderRadius: '50px', padding: '7px' }} />
                        </Link>
                        <Chip label='Edit' onClick={() => ref2.current.click()} icon={<Edit fontSize='small' />} style={{ background: '#fff', borderRadius: '50px', padding: '7px', cursor: 'pointer' }} />
                      </Box>
                    </Box>
                    :
                    <Box onClick={() => ref2.current.click()} sx={{ cursor: 'pointer', mb: '1rem', padding: '2rem', borderRadius: '10px', border: `1px dashed ${grey[300]}` }}>
                      <img src={UploadFile} style={{ width: '15%', margin: '0 auto', display: 'block' }} alt='ghcard' />
                      <Typography style={{ textAlign: 'center' }}>Upload GhanaCard</Typography>
                      <Typography style={{ textAlign: 'center' }} variant='body2' color={'textSecondary'}>Max File Size: 1MB</Typography>
                    </Box>
                }

                {
                  filteredUser?.documents.sdo?.split('/')?.slice('-1')[0]?.split('.')[1] === 'jpg' ?

                    <Box className={classes.documents} style={{ position: 'relative', backgroundImage: `url('${filteredUser.documents.sdo}')`, }}>
                      <Box style={{ position: 'absolute', bottom: '10%', left: '5%', display: 'flex', gap: '.5rem' }}>
                        <Link underline='none' style={{ cursor: 'pointer' }} href={filteredUser.documents.sdo} target={'_blank'} >
                          <Chip label='Standing Order' icon={<Visibility fontSize='small' />} style={{ background: '#fff', borderRadius: '50px', padding: '7px', cursor: 'pointer' }} />
                        </Link>
                        <Chip label='Edit' onClick={() => ref3.current.click()} icon={<Edit fontSize='small' />} style={{ background: '#fff', borderRadius: '50px', padding: '7px', cursor: 'pointer' }} />
                      </Box>
                    </Box>
                    :

                    filteredUser?.documents.sdo?.split('/')?.slice('-1')[0]?.split('.')[1] === 'pdf' ?

                      <Box className={classes.documents} style={{ position: 'relative', border: `1px dashed ${grey[300]}` }}>

                        <img src={PDF} alt='standingorder' style={{ width: '30%', margin: '0 auto', display: 'block', marginTop: '15px' }} />
                        <Box style={{ position: 'absolute', bottom: '10%', left: '5%', display: 'flex', gap: '.5rem' }}>
                          <Link underline='none' style={{ cursor: 'pointer' }} href={filteredUser.documents.sdo} target={'_blank'} >
                            <Chip label='Standing Order' icon={<Visibility fontSize='small' />} style={{ background: '#fff', borderRadius: '50px', padding: '7px', cursor: 'pointer' }} />
                          </Link>
                          <Chip label='Edit' onClick={() => ref3.current.click()} icon={<Edit fontSize='small' />} style={{ background: '#fff', borderRadius: '50px', padding: '7px', cursor: 'pointer' }} />
                        </Box>
                      </Box>
                      :
                      <Box onClick={() => ref3.current.click()} sx={{ cursor: 'pointer', mb: '1rem', padding: '2rem', borderRadius: '10px', border: `1px dashed ${grey[300]}` }}>
                        <img src={UploadFile} style={{ width: '15%', margin: '0 auto', display: 'block' }} alt='ghcard' />
                        <Typography style={{ textAlign: 'center' }}>Upload Standing Order</Typography>
                        <Typography style={{ textAlign: 'center' }} variant='body2' color={'textSecondary'}>Max File Size: 1MB</Typography>
                      </Box>
                }

              </CardContent>
            </Card>

            {/* DEBIT FORM */}
            <Card elevation={0} variant='outlined' className={classes.card} >
              <CardHeader title='Direct Debit Form' className={classes.caption} style={{ backgroundColor: grey[200] }} />
              <Divider />
              <CardContent style={{ padding: '1.5rem' }}>
                <Typography paragraph variant='body2' color='textSecondary' >
                  Click to download the Direct Debit Form for this user account.
                </Typography>
                <Box>
                  <PDFDownloadLink document={<Template currentUser={filteredUser} />} fileName={`${filteredUser?.fullname}_direct_debit_form.pdf`}>
                    {({ blob, url, loading, error }) =>
                      loading ? 'Upload profile photo to download' : <Button variant='contained' disableElevation color='secondary'>Download</Button>
                    }
                  </PDFDownloadLink>
                </Box>
              </CardContent>
            </Card>

          </Grid>


        </Grid>

        {/* PERSONAL EDIT BOX */}
        <Dialog open={open} className={classes.root}>
          <DialogTitle>Edit Personal Details</DialogTitle>
          <DialogContent dividers style={{ padding: '2.5rem' }}>

            <Grid container spacing={2}>
              <Grid item sm={6}>
                <TextField variant='outlined' placeholder={filteredUser?.name?.firstname} label='Firstname' value={personalInput.fname} fullWidth onChange={(e) => dispatchPersonal({ type: "FNAME", payload: e.target.value })} className={classes.field} />
              </Grid>
              <Grid item sm={6}>
                <TextField variant='outlined' placeholder={filteredUser?.name?.lastname} label='Lastname' value={personalInput.lname} fullWidth onChange={(e) => dispatchPersonal({ type: "LNAME", payload: e.target.value })} className={classes.field} />
              </Grid>
              <Grid item sm={6}>
                <TextField variant='outlined' placeholder={filteredUser?.name?.other} label='Other Names' value={personalInput.other} fullWidth onChange={(e) => dispatchPersonal({ type: "OTHER", payload: e.target.value })} className={classes.field} />
              </Grid>
              <Grid item sm={6}>
                <TextField variant='outlined' placeholder={filteredUser?.address} label='Residence Address' value={personalInput.address} fullWidth onChange={(e) => dispatchPersonal({ type: "ADDRESS", payload: e.target.value })} className={classes.field} />
              </Grid>
              <Grid item sm={6}>
                <TextField variant='outlined' type={'number'} inputProps={{ min: 0 }} placeholder={filteredUser?.phone} label='Phone' value={personalInput.phone} fullWidth onChange={(e) => dispatchPersonal({ type: "PHONE", payload: e.target.value })} className={classes.field} />
              </Grid>
              <Grid item sm={6}>
                <TextField variant='outlined' placeholder={filteredUser?.occupation} label='Occupation' value={personalInput.occupation} fullWidth onChange={(e) => dispatchPersonal({ type: "OCCUPATION", payload: e.target.value })} className={classes.field} />
              </Grid>
              <Grid item sm={6}>
                <TextField variant='outlined' placeholder={filteredUser?.company} label='Company' value={personalInput.company} fullWidth onChange={(e) => dispatchPersonal({ type: "COMPANY", payload: e.target.value })} className={classes.field} />
              </Grid>
              <Grid item sm={6}>
                <TextField variant='outlined' placeholder={filteredUser?.companyAddress} label='Company Address' value={personalInput.companyAddress} fullWidth onChange={(e) => dispatchPersonal({ type: "COMPANY_ADDRESS", payload: e.target.value })} className={classes.field} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField variant='outlined' type='date'
                  placeholder={personalInput.id_issue_date}
                  label="Date of Birth"
                  value={personalInput.dob} fullWidth
                  onChange={(e) => dispatchPersonal({ type: "DOB", payload: e.target?.value })} className={classes.field}
                />
              </Grid>
              <Grid item sm={6}>
                <TextField variant='outlined' placeholder={filteredUser?.monthlySalary} label='Monthly Salary' value={personalInput.monthlySalary} fullWidth onChange={(e) => dispatchPersonal({ type: "MONTHLY_SALARY", payload: e.target.value })} className={classes.field} />
              </Grid>
              <Grid item sm={6}>
                <TextField variant='outlined' placeholder={filteredUser?.nationalID?.idNumber} label='National ID' value={personalInput.nationalID} fullWidth onChange={(e) => dispatchPersonal({ type: "NATIONAL_ID", payload: e.target.value })} className={classes.field} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField variant='outlined' type='date'
                  placeholder={personalInput.id_issue_date}
                  label='ID Issue Date' value={personalInput.id_issue_date} fullWidth
                  onChange={(e) => dispatchPersonal({ type: "ISSUE_DATE", payload: e.target?.value })} className={classes.field}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField variant='outlined' type='date'
                  placeholder={personalInput.id_issue_date}
                  label="ID Expiry Date"
                  value={personalInput.id_expiry_date} fullWidth
                  onChange={(e) => dispatchPersonal({ type: "EXPIRY_DATE", payload: e?.target?.value })} className={classes.field}
                />
              </Grid>
            </Grid>
            <FormControlLabel style={{ marginTop: '1rem' }} label={'Notify this user via SMS after saving'} control={<Checkbox checked={notify} color='primary' onClick={() => setNotify(!notify)} />} />

          </DialogContent>
          <DialogActions style={{ padding: '1rem 2rem' }}>
            <Button onClick={() => closeDialog('personal')} color="secondary" >
              Cancel
            </Button>
            <Button variant='contained' disableElevation onClick={(e) => { onFormSubmit(e, 'Personal') }} color="secondary" >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* BANK EDIT BOX */}
        <Dialog open={openBank} className={classes.root}>
          <DialogTitle>Edit Bank Details</DialogTitle>
          <DialogContent dividers style={{ padding: '2.5rem' }}>

            <TextField variant='outlined' label='Name of Bank' required value={bankInput.bank} fullWidth onChange={(e) => dispatchBank({ type: "BANK", payload: e.target.value })} className={classes.field} />
            <TextField variant='outlined' label='Account Number' required value={bankInput.accNumber} fullWidth onChange={(e) => dispatchBank({ type: "ACC_NUMBER", payload: e.target.value })} className={classes.field} />
            <TextField variant='outlined' label='Account Branch' required value={bankInput.bankBranch} fullWidth onChange={(e) => dispatchBank({ type: "BRANCH", payload: e.target.value })} className={classes.field} />
            <TextField variant='outlined' label='Relationship Manager' value={bankInput.bankManager} fullWidth onChange={(e) => dispatchBank({ type: "MANAGER", payload: e.target.value })} className={classes.field} />
            <TextField variant='outlined' label="What is your mother's name" required value={bankInput.occupation} fullWidth onChange={(e) => dispatchBank({ type: "SECURITY", payload: e.target.value })} className={classes.field} />

          </DialogContent>
          <DialogActions style={{ padding: '1rem 2rem' }}>
            <Button onClick={() => closeDialog('bank')} color="secondary" >
              Cancel
            </Button>
            <Button variant='contained' disableElevation onClick={(e) => { onFormSubmit(e, 'Bank') }} color="secondary" >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>


        {/* DOCUMENTS BOX */}
        <Dialog open={openDocument} className={classes.root}>
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogContent dividers style={{ padding: '2.5rem' }}>
            <input type='file' accept='.png, .jpg' style={{ display: 'none' }} ref={ref1} onChange={(e) => dispatchUpload({ type: "PAYSLIP", payload: e.target.files[0] })} />
            <input type='file' accept='.png, .jpg' style={{ display: 'none' }} ref={ref2} onChange={(e) => dispatchUpload({ type: "SDO", payload: e.target.files[0] })} />
            <input type='file' accept='.png, .jpg' style={{ display: 'none' }} ref={ref3} onChange={(e) => dispatchUpload({ type: "GHCARD", payload: e.target.files[0] })} />

            <Box className={classes.upload} onClick={() => ref1.current.click()}>
              <Typography color='textSecondary'>{uploadInput.payslip === '' ? 'Upload Payslip' : `Uploaded: ${uploadInput.payslip.name}`}</Typography>
              <Typography variant='body2' color='textSecondary'>Max File Size: 0.5MB</Typography>
            </Box>

            <Box className={classes.upload} onClick={() => ref2.current.click()}>
              <Typography color='textSecondary'>{uploadInput.sdo === '' ? 'Upload Standing Order' : `Uploaded: ${uploadInput.sdo.name}`}</Typography>
              <Typography variant='body2' color='textSecondary'>Max File Size: 0.5MB</Typography>
            </Box>

            <Box className={classes.upload} onClick={() => ref3.current.click()}>
              <Typography color='textSecondary'>{uploadInput.ghCard === '' ? 'Upload Ghana Card' : `Uploaded: ${uploadInput.ghCard.name}`}</Typography>
              <Typography variant='body2' color='textSecondary'>Max File Size: 0.5MB</Typography>
            </Box>

          </DialogContent>
          <DialogActions style={{ padding: '1rem 2rem' }}>
            <Button onClick={() => closeDialog('doc')} color="secondary" >
              Cancel
            </Button>
            <Button variant='contained' disableElevation onClick={(e) => { onFormSubmit(e, 'Documents') }} color="secondary" >
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* VERIFY USER EMAIL */}
        <Dialog open={verify}>
          <DialogTitle>Password Security</DialogTitle>
          <DialogContent dividers style={{ width: '350px' }}>
            <TextField fullWidth type={'password'} label='Enter your password' value={password} helperText={error && 'Sorry, invalid password'} error={error ? true : false} onChange={(e) => setPassword(e.target.value)} InputProps={{
              endAdornment: <InputAdornment position='end'> <Button disabled={passCheck ? true : false} variant='contained' onClick={() => checkPassword(password)} disableElevation color='secondary' style={{ textTransform: 'none' }}>Confirm</Button> </InputAdornment>
            }} variant='outlined' />
          </DialogContent>
          <DialogActions>
            <Button disabled={passCheck ? false : true} disableElevation color='secondary' variant='contained' onClick={() => verifyUserEmail(filteredUser.email)}>Verify Email</Button>
            <Button onClick={() => setVerify(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* APPROVE USER */}
        <Dialog open={approve}>
          <DialogTitle>Verify User Account</DialogTitle>
          <DialogContent dividers>
            <TextField fullWidth type={'number'} label='Credit Limit' value={limit} onChange={(e) => setLimit(e.target.value)} variant='outlined' />
            <FormControlLabel control={<Checkbox checked={check} color='primary' onChange={onSelectHandle} />}
              label={'I hereby consent, that this user account has been verified.'}
            />

          </DialogContent>
          <DialogActions>
            <Button disabled={check ? false : true} onClick={() => approvalRequest(userId)}>Verify User</Button>
            <Button onClick={() => onApprovalCancel()}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* DECLINE USER */}
        <Dialog open={decline}>
          <DialogTitle>Decline User Account</DialogTitle>
          <DialogContent dividers>
            <TextField variant='outlined' fullWidth style={{ marginBottom: '1rem' }} value={reasons} onChange={(e) => setReasons(e.target.value)} placeholder='Subject Title' />
            <TextField variant='outlined' fullWidth value={reasons} onChange={(e) => setReasons(e.target.value)} multiline minRows={5} placeholder='Reasons for account disapproval' />

          </DialogContent>
          <DialogActions>
            <Button disabled={reasons === '' ? true : false} onClick={() => { }}>Decline User</Button>
            <Button onClick={() => setDecline(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        {/* LOADER */}
        <Dialog open={loader} >
          <Box padding={'2.5rem'} textAlign={'center'}>
            <Typography paragraph>Updating user account. Please wait...</Typography>
            <LinearProgress variant='indeterminate' />
          </Box>
        </Dialog>
      </>
    }

    return <Loader />
  }




  return (
    <>
      {renderPage()}
    </>
  )
}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps, { verifyUserEmail, fetchUserAccount, approvalRequest, errorModal, successModal, updateUserDetails, updateUserDocuments, updateUserPhoto, updateUserGhCard, updateUserPayslip, updateUserSDO })(UserEdit)