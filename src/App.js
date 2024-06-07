import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { makeStyles } from '@material-ui/styles'
import Login from './Pages/Login'
import { useEffect } from 'react'
import { connect } from 'react-redux'
import Account from './Pages/Account'
import Verify from './Pages/Verify'
import Loader from './components/Loader'
import { getAuth } from './actions/actions'
import Errorpage from './Pages/ErrorPage'
// import UserEdit from './Pages/users/UserEdit'
import './App.css'


const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  toolbarHeight: theme.mixins.toolbar,
  content: {
    [theme.breakpoints.up('sm')]: {
      width: 'calc(100% - 260px)'
    },
    flexGrow: 1,
    backgroundColor: theme.contentBackground,
    padding: theme.spacing(4),
    borderRadius: '10px',
    height: '100vh'
  },
}))

const App = (props) => {
  const { getAuth, currentUser } = props
  const classes = useStyles()
  // const [login, setLoginWait] = useState(false)

  useEffect(() => {
    getAuth()
  }, [getAuth])

  // useEffect(()=>{
  //   const timer = setTimeout(() => {
  //     setLoginWait(true)
  //   }, 1500);
  //   return clearTimeout(timer)
  // })



  return (
    <div className={classes.root}>
      {!props.loader ?
        <Routes>
          {/* HOME */}
          <Route exact path='/' element={currentUser && currentUser.verificationCode ? <Verify /> : <Login />} />
          <Route path='/account/verify' element={currentUser && currentUser.verificationCode ? <Verify /> : <Navigate to={'/'} />} />

          <Route path='/account/dashboard' element={<Account />} />

          {/* PRODUCTS */}
          <Route path='/account/products' element={<Account />} />
          <Route path='/account/products/new' element={<Account />} />

          {/* USERS */}
          <Route path='/account/users' element={<Account />} />
          <Route path='/account/users/new' element={<Account />} />
          <Route path='/account/users/:id/edit' element={<Account />} />
          <Route path='/account/admins' element={<Account />} />

          {/* CARDS */}
          <Route path='/account/cards' element={<Account />} />
          <Route path='/account/cards/new' element={<Account />} />

          {/* ORDERS */}
          <Route path='/account/loans' element={<Account />} />
          <Route path='/account/loan-requests' element={<Account />} />
          <Route path='/account/loans/:id/:loanId/details' element={<Account />} />

          <Route path='/account/settings' element={<Account />} />
          <Route path='/account/sms' element={<Account />} />
          <Route path='/account/profile' element={<Account />} />
          <Route path='/account/audit' element={<Account />} />
          <Route path='/account/approvals' element={<Account />} />

          <Route path='*' element={<Errorpage />} />

        </Routes>
        : <Loader />

      }

    </div>

  );
}

const mapStateToProps = (state) => {
  // console.log(state)
  return state
}

export default connect(mapStateToProps, { getAuth })(App);
