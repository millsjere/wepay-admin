import { makeStyles } from '@material-ui/styles'
import React from 'react'
import { Navigate, useLocation, useParams } from 'react-router-dom'
import TopBar from '../components/TopBar'
import AddCard from './cards/AddCard'
import AllCards from './cards/AllCards'
import Overview from './Overview'
import CreateProduct from './product/CreateProduct'
import Products from './product/Products'
import AllUsers from './users/AllUsers'
import CreateUser from './users/CreateUser'
import { connect } from 'react-redux'
import LoanRequest from './loans/LoanRequest'
import Settings from './Settings'
import Profile from './Profile'
import Activities from './Activities'
import AllAdmins from './users/AllAdmins'
import Approvals from './Approvals'
import UserEdit from './users/UserEdit'
import { getAllUsers, getAllCards, getAllLoans, getAllPayments } from '../actions/actions'
import LoanDetail from './loans/LoanDetail'
import AllLoans from './loans/AllLoans'
import Messaging from './Messaging'


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    width: '100%',
    height: '100vh'
  },
  toolbarHeight: theme.mixins.toolbar,
  content: {
    minHeight: 'fit-content',
    maxHeight: '100vh',
    [theme.breakpoints.up('sm')]: {
      width: 'calc(100% - 260px)'
    },
    flexGrow: 1,
    backgroundColor: theme.contentBackground,
    padding: theme.spacing(4),
    borderRadius: '10px',
  },
}))



const Account = (props) => {
  const classes = useStyles()
  const pathname = useLocation().pathname
  const { id, loanId } = useParams()
  const { getAllUsers, getAllCards, getAllLoans, getAllPayments } = props

  React.useEffect(() => {
    getAllUsers()
    getAllLoans()
    getAllCards()
    getAllPayments()
  }, [getAllUsers, getAllCards, getAllLoans, getAllPayments])

  const renderPage = () => {

    if (props.currentUser && !props.currentUser.verificationCode) {
      return (
        <div className={classes.root}>
          <TopBar />
          <main className={classes.content}>
            <div className={classes.toolbarHeight} />

            {pathname === '/account/dashboard' ? <Overview /> : null}
            {pathname === '/account/products' ? <Products /> : null}
            {pathname === '/account/products/new' ? <CreateProduct /> : null}
            {pathname === '/account/cards' ? <AllCards /> : null}
            {pathname === '/account/cards/new' ? <AddCard /> : null}
            {pathname === '/account/users' ? <AllUsers /> : null}
            {pathname === '/account/users/new' ? <CreateUser /> : null}
            {pathname === `/account/users/${id}/edit` ? <UserEdit /> : null}
            {pathname === '/account/admins' ? <AllAdmins /> : null}
            {pathname === '/account/loans' ? <AllLoans /> : null}
            {pathname === '/account/loan-requests' ? <LoanRequest /> : null}
            {pathname === `/account/loans/${id}/${loanId}/details` ? <LoanDetail /> : null}
            {pathname === '/account/settings' ? <Settings /> : null}
            {pathname === '/account/sms' ? <Messaging /> : null}
            {pathname === '/account/profile' ? <Profile /> : null}
            {pathname === '/account/audit' ? <Activities /> : null}
            {pathname === '/account/approvals' ? <Approvals /> : null}

          </main>
        </div>
      )
    }
    if (props.currentUser && props.currentUser.verificationCode) {
      return <Navigate to={'/account/verify'} />
    }
    return <> <Navigate to={'/'} /> </>
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

export default connect(mapStateToProps, { getAllPayments, getAllUsers, getAllCards, getAllLoans })(Account)