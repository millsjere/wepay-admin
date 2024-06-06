import React, { useState } from 'react'
import { Avatar, Box, Button, Card, CardContent, CardHeader, Checkbox, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControlLabel, Grid, IconButton, InputAdornment, MenuItem, Popover, TextField, Typography } from '@material-ui/core'
import { MoreVert, Payment, Search } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles'
import { DataGrid } from '@material-ui/data-grid'
import { connect, useDispatch } from 'react-redux'
import { useLocation, useParams } from 'react-router-dom'
import Loader from '../../components/Loader'
import PageHeader from '../../components/PageHeader'
import { makeLoanPayment, successModal, createNewCard, updateUserCard, errorModal, denyLoanRequest } from '../../actions/actions'
import Modal from '../../components/Modal';
import { useReducer } from 'react'



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
    field: {
        '&:not(:last-child)': {
            marginBottom: '1.5rem',
        },
        '& label.Mui-focused': {
            color: theme.backgroundPrimary
        },

    },
    caption: {
        '& span': {
            fontSize: '1.1rem',
            fontWeight: 500,
            padding: '.5rem'
        }
    },
    wrapper: {
        padding: '2.5rem !important',
    },
}))


const LoanDetail = (props) => {
    const classes = useStyles()
    const { loanId } = useParams()
    const modalDispatch = useDispatch()
    const userID = useLocation().pathname.split('/')[3]
    const [pageSize, setPageSize] = useState(10)
    const [activeLoan, setActiveLoan] = useState(loanId)
    const [id, setId] = useState()
    const [open, setOpen] = useState(false)
    const [reject, setReject] = useState(false)
    const [disable, setDisable] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const [del, setDel] = useState(false);
    const [reason, setReason] = useState('')
    const options = Boolean(anchorEl);

    // console.log(loanId)
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12']
    const years = ['2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030', '2031', '2032']

    const filteredUser = props.allUsers?.filter(user => user._id === `${userID}`)[0]
    const currentLoan = filteredUser?.loan[0]?.loans?.filter(el => el._id === activeLoan)[0]

    const handleClose = () => {
        setAnchorEl(null);
    }

    const clickHandle = (e, id) => {
        setAnchorEl(e.currentTarget)
        setId(id)
        setActiveLoan(id)
    }

    const columns = [

        {
            field: 'userID', headerName: 'Customer Name', flex: 1, renderCell: (params) => {
                const user = props.allUsers && props.allUsers.filter(el => el.id === params.value)
                return (
                    <>
                        <Typography variant='body2' style={{ marginLeft: '20px' }} >{user[0].fullname}</Typography>
                    </>
                )
            }
        },
        { field: 'amount', headerName: 'Loan Amount', flex: 1, renderCell: (params) => { return `GH¢ ${params.value}.00` } },
        { field: 'createdAt', headerName: 'Date & Time', flex: 1, renderCell: (params) => `${new Date(params.value).toDateString()} at ${new Date(params.value).toLocaleTimeString()}` },
        { field: 'status', headerName: ' Status', flex: 1, renderCell: (params) => { return <Chip disabled label={params.value} /> } },
    ]

    const loanColumns = [
        { field: 'amount', headerName: 'Loan Amount', flex: 1, renderCell: (params) => `GH¢ ${params.value}.00` },
        { field: 'date', headerName: 'Date/Time', flex: 1.5, renderCell: (params) => `${new Date(params.value).toDateString()} at ${new Date(params.value).toLocaleTimeString()}` },
        // {field: 'perMonth', headerName: 'Monthly Pay', flex: 1, renderCell: (params) => `GH¢ ${params.value}.00` },
        { field: 'duration', headerName: 'Duration', flex: 1, renderCell: (params) => { return `${params.value} Months` } },
        { field: 'interest', headerName: 'Interest', flex: 1, renderCell: (params) => { return `${params.value}%` } },
        {
            field: 'status', headerName: ' Status', flex: 1, renderCell: (params) => {
                return (
                    <Chip label={params.row.isDenied ? 'Denied' : params.value} />
                )
            }
        },
        {
            field: '_id', headerName: ' Action', flex: .5, renderCell: (params) => {
                return (
                    <>
                        <IconButton onClick={(e) => clickHandle(e, params.value)}>
                            <MoreVert fontSize='small' />
                        </IconButton>
                    </>
                )
            }
        }
    ]


    const initState = { user: '', number: '', month: '', year: '' }

    const reducerFn = (state, action) => {
        switch (action.type) {
            case "USER":
                return { ...state, user: action.payload }
            case "NUMBER":
                return { ...state, number: action.payload }
            case "MONTH":
                return { ...state, month: action.payload }
            case "YEAR":
                return { ...state, year: action.payload }
            case "RESET":
                return initState
            default:
                return initState;
        }
    }

    const [formInput, dispatch] = useReducer(reducerFn, initState)


    const approveLoan = () => {
        if (filteredUser?.card.length > 0) {
            setDisable(true)
            props.successModal('Sending approval request, please wait...')
            const data = {
                user: userID,
                amount: currentLoan?.amount,
                loanId: currentLoan?._id
            }
            setTimeout(async () => {
                await props.updateUserCard(data)
                setOpen(false)
                setDisable(false)
            }, 500);
        }
        else {
            if (formInput.number === '' || formInput.month === '' || formInput.year === '') {
                props.errorModal('Invalid. Please input card fields')
                return
            }
            setDisable(true)
            props.successModal('Sending approval request, please wait...')
            const data = {
                user: userID,
                loanId: currentLoan?._id,
                amount: currentLoan?.amount,
                number: formInput.number,
                month: formInput.month,
                year: formInput.year
            }
            setTimeout(async () => {
                await props.createNewCard(data)
                setOpen(false)
                setDisable(false)
            }, 500);
        }

    }

    const denyLoanHandle = () => {
        if (reason === '') {
            props.errorModal('Please provide a reason for denial of loan')
            return
        }
        setDisable(true)
        props.successModal('Sending denial request, please wait...')
        const data = {
            user: userID,
            amount: currentLoan?.amount,
            loanId: currentLoan?._id,
            reason: reason,
            deleteLoan: del
        }
        setTimeout(async () => {
            await props.denyLoanRequest(data)
            setReject(false)
            setDisable(false)
        }, 500);
    }

    const showApproval = () => {
        const ln = filteredUser?.loan[0]?.loans?.filter(el => el._id === id)[0]
        if (ln.status === 'Processing' || ln.status === 'Approved') {
            modalDispatch(errorModal('Sorry, this loan facility has already been submitted'))
            setAnchorEl(null)
            return
        }
        setActiveLoan(id)
        setOpen(true)
        handleClose()
    }

    const showReject = () => {
        const ln = filteredUser?.loan[0]?.loans?.filter(el => el._id === id)[0]
        if (ln.status === 'Processing' || ln.status === 'Approved') {
            modalDispatch(errorModal('Sorry, this loan facility has already been submitted'))
            setAnchorEl(null)
            return
        }
        setActiveLoan(id)
        setReject(true)
        handleClose()
    }




    const renderPage = () => {
        if (props.allUsers.length > 0) {
            return <>
                <Box display='flex' justifyContent={'space-between'} alignItems='center'>
                    <PageHeader title='Loans & Payment' link1='Loans' link2='Details' />
                    {
                        <Button disabled={currentLoan?.status === 'Approved' || currentLoan?.status === 'Processing' ? true : false} variant='contained' style={{ textTransform: 'none' }} disableElevation onClick={() => setOpen(true)} color='secondary'>Approve Loan</Button>
                    }
                </Box>
                <Grid container spacing={3}>

                    <Grid item xs={12} md={12} lg={7}>
                        <Card elevation={0} variant='outlined' style={{ borderColor: '#f6a200' }}>
                            <Box display='flex' justifyContent={'space-between'} alignItems='center'>
                                <CardHeader title='Selected Loan' className={classes.caption} />
                                <Chip color='primary' style={{ borderRadius: '50px', marginRight: '2rem', color: '#fff' }} label={`${currentLoan?.status}`} />
                            </Box>
                            <Divider />
                            <CardContent className={classes.wrapper}>
                                <Grid container spacing={3}>
                                    <Grid item sm={6}>
                                        <TextField variant='outlined' label='Amount' value={`GH¢ ${currentLoan?.amount}`} fullWidth />
                                    </Grid>
                                    <Grid item sm={6}>
                                        <TextField variant='outlined' label='Duration' value={`${currentLoan?.duration} Months`} fullWidth />
                                    </Grid>
                                    <Grid item sm={6}>
                                        <TextField variant='outlined' label='Interest' value={`${currentLoan?.interest} %`} fullWidth />
                                    </Grid>
                                    <Grid item sm={6}>
                                        <TextField variant='outlined' label='Monthly Payment' value={`GH¢ ${currentLoan?.perMonth}`} fullWidth />
                                    </Grid>
                                    <Grid item sm={6}>
                                        <TextField variant='outlined' label='Total Loan' value={`GH¢ ${(currentLoan?.perMonth * currentLoan?.duration).toLocaleString()}`} fullWidth />
                                    </Grid>
                                    <Grid item sm={6}>
                                        <TextField variant='outlined' label='Credit Limit' value={`GH¢ ${filteredUser.loan[0]?.limit?.toLocaleString()}`} fullWidth />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={12} lg={5}>
                        <Card elevation={0} variant='outlined'>
                            <Box display='flex' justifyContent={'space-between'} alignItems='center'>
                                <CardHeader title='User Details' className={classes.caption} />
                                <Button href={`/account/users/${userID}/edit`} variant='contained' color='primary' style={{ color: '#fff', borderRadius: '50px', marginRight: '2rem', textTransform: 'none' }} disableElevation >View</Button>
                            </Box>

                            <Divider />
                            <CardContent className={classes.wrapper}>
                                <TextField variant='outlined' label='Fullname' value={filteredUser.fullname} fullWidth className={classes.field} />
                                <TextField variant='outlined' label='Email' value={filteredUser.email} fullWidth className={classes.field} />
                                <TextField variant='outlined' label='Phone' value={filteredUser.phone} fullWidth className={classes.field} />
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>

                {/* LOANS */}
                <Card variant='outlined' style={{ borderRadius: '10px', width: '100%', marginTop: '2rem' }} className={classes.root}>
                    <CardContent style={{ padding: '30px' }}>
                        <Box marginBottom={'1rem'} sx={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center', '& > span': {
                                display: 'flex', justifyContent: 'space-between', gap: '.7rem', alignItems: 'center'
                            }
                        }}>
                            <Typography variant='h6'>All Loans</Typography>
                            <span>
                                <Typography>Credit Limit</Typography>
                                <Button size='large' variant='contained' disableElevation color='secondary'>GH¢ {filteredUser?.loan[0]?.limit?.toLocaleString()}</Button>
                            </span>
                        </Box>
                        <TextField variant='outlined' style={{ marginBottom: '20px' }}
                            placeholder='Search for loan/date' fullWidth
                            InputProps={{
                                startAdornment: <InputAdornment position='start'><Search fontSize='small' /> </InputAdornment>
                            }} />
                        <DataGrid autoHeight disableSelectionOnClick
                            pagination rows={filteredUser?.loan[0]?.loans} rowsPerPageOptions={[5, 10, 15, 20]}
                            rowHeight={80} columns={loanColumns} getRowId={(row) => row._id}
                            pageSize={pageSize} checkboxSelection
                            onPageSizeChange={(newSize) => setPageSize(newSize)}
                        />

                    </CardContent>
                </Card>



                {/* PAYMENT */}

                <Card variant='outlined' style={{ borderRadius: '10px', width: '100%', marginTop: '2rem' }}>
                    <CardContent style={{ padding: '30px' }}>
                        <Typography variant='h6'>Payments</Typography>
                        <TextField variant='outlined' style={{ marginBottom: '20px', marginTop: '1rem' }}
                            placeholder='Find a Payment' fullWidth
                            InputProps={{
                                startAdornment: <InputAdornment position='start'><Search fontSize='small' /> </InputAdornment>,
                                endAdornment: <InputAdornment position='end'>
                                    <Box>
                                        <Chip label='Total Payment' style={{ marginRight: '1rem' }} />
                                        GHc {filteredUser.payment.map(payment => payment.amount).reduce((prev, curr) => (parseInt(prev) + parseInt(curr)), 0).toLocaleString()}
                                    </Box>
                                </InputAdornment>
                            }} />

                        <DataGrid autoHeight
                            pagination rows={filteredUser.payment} rowsPerPageOptions={[5, 10, 20]}
                            rowHeight={70} columns={columns}
                            pageSize={pageSize} checkboxSelection
                            onPageSizeChange={(newSize) => setPageSize(newSize)}
                        />

                    </CardContent>
                </Card>

                {/* LOAN APPROVAL */}
                <Dialog open={open} maxWidth='xs'>
                    <DialogTitle>Approve Selected Loan</DialogTitle>
                    <DialogContent dividers style={{ padding: '1.5rem' }}>
                        <Box style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-start', background: 'orange', padding: '15px 15px', borderRadius: '8px', marginBottom: '2rem' }}>
                            <Avatar style={{ width: '2rem', height: '2rem', background: '#3f5176' }}><Payment fontSize='small' /></Avatar>
                            {filteredUser?.card?.length > 0 ?
                                <Typography variant='body2'>There is a card on this account. This action will update the credit balance on the user card.</Typography>
                                :
                                <Typography variant='body2'>There is no card on this account. This action will create a card on this account before the loan is approved.</Typography>
                            }
                        </Box>
                        <TextField style={{ marginBottom: '1rem' }} variant='outlined' label='Amount' value={`GH¢ ${currentLoan?.amount}`} fullWidth />
                        <TextField style={{ marginBottom: '1rem' }} variant='outlined' label='Duration' value={`${currentLoan?.duration} Months`} fullWidth />
                        <TextField fullWidth label={'Card Number'} disabled={filteredUser?.card?.length > 0} type={'number'} value={filteredUser?.card?.length > 0 ? filteredUser?.card[0]?.number : formInput.number} onChange={(e) => dispatch({ type: "NUMBER", payload: e.target.value })} variant='outlined' className={classes.field} />
                        {
                            filteredUser?.card?.length > 0 ? null :
                                <>
                                    <TextField fullWidth label='Card Expiry Month' select value={formInput.month} onChange={(e) => dispatch({ type: "MONTH", payload: e.target.value })} variant='outlined' className={classes.field} >
                                        {months.map(el => {
                                            return (
                                                <MenuItem key={el} value={el} >{el}</MenuItem>
                                            )
                                        })}
                                    </TextField>
                                    <TextField fullWidth label='Card Expiry Year' select value={formInput.year} onChange={(e) => dispatch({ type: "YEAR", payload: e.target.value })} variant='outlined' className={classes.field} >
                                        {years.map(el => {
                                            return (
                                                <MenuItem key={el} value={el} >{el}</MenuItem>
                                            )
                                        })}
                                    </TextField>

                                </>
                        }
                    </DialogContent>
                    <DialogActions style={{ padding: '1rem 1.5rem' }}>
                        <Button disabled={disable} variant='outlined' onClick={() => setOpen(false)} >Cancel</Button>
                        <Button disabled={disable} variant='contained' color='secondary' disableElevation onClick={() => approveLoan(currentLoan?.amount)}>Approve</Button>
                    </DialogActions>
                </Dialog>

                { /* LOAN REJECTION */}
                <Dialog open={reject} maxWidth='xs'>
                    <DialogTitle>Reject Selected Loan</DialogTitle>
                    <DialogContent dividers style={{ padding: '1.5rem' }}>
                        <TextField style={{ marginBottom: '1rem' }} variant='outlined' label='Amount' value={`GH¢ ${currentLoan?.amount}`} fullWidth />
                        <TextField style={{ marginBottom: '1rem' }} variant='outlined' label='Duration' value={`${currentLoan?.duration} Months`} fullWidth />
                        <TextField value={reason} onChange={(e) => setReason(e.target.value)} fullWidth variant='outlined' multiline minRows={6} placeholder='State reasons for denial of loan' />
                        <FormControlLabel onChange={() => setDel(!del)} control={<Checkbox color='primary' checked={del} />} label={'Delete this loan request after denial'} />
                    </DialogContent>
                    <DialogActions style={{ padding: '1rem 1.5rem' }}>
                        <Button disabled={disable} variant='outlined' onClick={() => setReject(false)} >Cancel</Button>
                        <Button disabled={disable} variant='contained' color='secondary' disableElevation onClick={denyLoanHandle}>Reject</Button>
                    </DialogActions>
                </Dialog>

                {/* ACTIONS */}
                <Popover open={options} onClose={handleClose} anchorEl={anchorEl} transformOrigin={{ vertical: 'top', horizontal: 'right' }} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                    <Card>
                        <CardContent style={{ padding: '10px' }}>
                            <MenuItem onClick={() => {
                                setActiveLoan(id)
                                handleClose()
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }} >View</MenuItem>

                            <MenuItem disabled={currentLoan?.isDenied ? true : false} onClick={() => showApproval()}>Approve</MenuItem>
                            <MenuItem disabled={currentLoan?.isDenied ? true : false} onClick={() => showReject()}>Reject</MenuItem>
                        </CardContent>
                    </Card>
                </Popover>

            </>
        }

        return <Loader />
    }

    return (
        <div className={classes.root}>
            {props.modal && <Modal status={props.modal.status} />}
            {renderPage()}
        </div>
    )
}

const mapStateToProps = (state) => {
    return state
}

export default connect(mapStateToProps, { makeLoanPayment, createNewCard, updateUserCard, successModal, errorModal, denyLoanRequest })(LoanDetail)