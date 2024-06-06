import React from 'react';
import { alpha, Avatar, Collapse, Container, Divider, Chip, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { Dashboard, KeyboardArrowDown, LocalMall, Payment, People, PowerSettingsNew, Receipt, Settings, EventNote, VerifiedUser, PermPhoneMsg } from '@material-ui/icons';
import { useState } from 'react';
import { connect } from 'react-redux';
import { logoutUser } from '../actions/actions';


const useStyles = makeStyles((theme) => ({
  logo: {
    fontSize: '25px',
    fontWeight: 100,
    textAlign: 'center',
    color: '#fff',
    padding: '5px 0',
    margin: '10px 0',
    '& span': {
      fontWeight: 600,
      color: theme.backgroundPrimary
    }
  },
  drawer: (props) => ({
    width: props.drawerWidth
  }),
  drawerPaper: (props) => ({
    width: props.drawerWidth,
    background: '#000'
  }),
  activeMenu: {
    background: alpha(theme.backgroundSecondary, 0.6)
  },
  divide: {
    background: alpha('#fff', 0.2)
  },
  menuTitle: {
    color: 'rgb(107, 114, 128)',
  },
  menuList: {
    margin: '8px 0',
  },
  menuItem: {
    borderRadius: '8px',
    gap: 15,
    margin: '5px 0',
    '&:hover': {
      background: alpha(theme.backgroundSecondary, 0.6)
    },
  },
  menuIcon: {
    fontSize: '13px',
    color: '#9ca3af',
    minWidth: 'auto'
  },
  subMenuIcon: {
    fontSize: '20px',
    color: '#9ca3af',
    minWidth: 'auto'
  },
  menuText: {
    '& p': {
      color: "#9ca3af"
    }
  },
  subMenuText: {
    '& p': {
      color: "#9ca3af",
      fontSize: '14px',
      marginLeft: '30px'
    }
  },
  userProfile: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '30px 0'
  },
  userImage: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    marginBottom: '10px',
  },
  userName: {
    color: '#fff'
  },
  userTitle: {
    color: 'rgb(107, 114, 128)'
  },
  chip: {
    height: '20px',
    '& .MuiChip-label': {
      padding: '2px 7px',
      fontSize: '10px'
    }
  },
  // necessary for content to be below app bar
  toolbarHeight: theme.mixins.toolbar,
}))


const SideBar = (props) => {

  const [openMenu1, setOpenMenu1] = useState(false)
  const [openMenu2, setOpenMenu2] = useState(false)
  const [openCard, setOpenCard] = useState(false)

  const pathname = useLocation().pathname
  const classes = useStyles(props)
  const navigate = useNavigate()

  const menuItemsGeneral = [
    { name: 'Overview', icon: <Dashboard fontSize='small' />, path: '/account/dashboard' },
    { name: 'Loan Request', icon: <Payment fontSize='small' />, path: '/account/loan-requests' },
    { name: 'Transactions', icon: <Receipt fontSize='small' />, path: '#' },
  ]

  const menuItemsManagement = () => {
    if (props.currentUser.role === 'superadmin') {
      return [
        {
          name: 'Users', icon: <People fontSize='small' />, path: '/account/users',
          sub: [{ name: 'Customers', path: '/account/users' }, { name: 'Administrators', path: '/account/admins' }, { name: 'Add Users', path: '/account/users/new' }]
        },
        { name: 'Loans & Payment', icon: <LocalMall fontSize='small' />, path: '/account/loans' },
        {
          name: 'Cards', icon: <Payment fontSize='small' />, path: '/account/cards',
          // sub: [ { name: 'All Cards', path: '/account/cards' }, { name: 'Add Card', path: '/account/cards/new'} ] 
        },
        { name: 'Approvals', icon: <VerifiedUser fontSize='small' />, path: '/account/approvals' },
        { name: 'Activities', icon: <EventNote fontSize='small' />, path: '/account/audit' },
        { name: 'Settings', icon: <Settings fontSize='small' />, path: '/account/settings' },
        { name: 'SMS Messages', icon: <PermPhoneMsg fontSize='small' />, path: '/account/sms' },
      ]
    }
    if (props.currentUser.role === 'admin') {
      return [
        { name: 'Users', icon: <People fontSize='small' />, path: '/account/users' },
        { name: 'Loans & Payment', icon: <LocalMall fontSize='small' />, path: '/account/loans' },
        {
          name: 'Cards', icon: <Payment fontSize='small' />, path: '/account/cards',
          // sub: [ { name: 'All Cards', path: '/account/cards' }, { name: 'Add Card', path: '/account/cards/new'} ] 
        },
        { name: 'Settings', icon: <Settings fontSize='small' />, path: '/account/settings' },
        { name: 'SMS Messages', icon: <PermPhoneMsg fontSize='small' />, path: '/account/sms' },
      ]
    }
    if (props.currentUser.role === 'credit officer') {
      return [
        { name: 'Users', icon: <People fontSize='small' />, path: '/account/users' },
        { name: 'Loans & Payment', icon: <LocalMall fontSize='small' />, path: '/account/loans' },
        { name: 'Cards', icon: <Payment fontSize='small' />, path: '/account/cards' },
        { name: 'Settings', icon: <Settings fontSize='small' />, path: '/account/settings' },
        { name: 'SMS Messages', icon: <PermPhoneMsg fontSize='small' />, path: '/account/sms' },
      ]
    }
  }

  const menuItemsSupport = [
    { name: 'Logout', icon: <PowerSettingsNew fontSize='small' />, path: '/logout' },
  ]

  const menuDropDown = (item) => {
    if (item.sub && item.name === 'Store') {
      setOpenMenu2(!openMenu2)
      return
    }
    if (item.sub && item.name === 'Users') {
      setOpenMenu1(!openMenu1)
      return
    }
    if (item.sub && item.name === 'Cards') {
      setOpenCard(!openCard)
      return
    }
    else {
      navigate(item.path)
    }
  }

  const getLoanReq = (loans) => {
    const reqLoans = []
    loans.map(el => {
      if (el.loans?.length > 0) {
        reqLoans.push(...el.loans)
        return null
      }

      return null
    })

    return reqLoans
  }


  const loanRequest = getLoanReq(props.loans)?.filter(el => el.status === 'Pending' && el.isDenied !== true)
  const inactiveCards = getLoanReq(props.loans)?.filter(el => el.status === 'Processing');
  const deniedLoans = getLoanReq(props.loans)?.filter(el => el.isDenied === true && el.status === 'Pending');
  const pendingPayments = props.payments.filter(payment => payment.status === 'pending')



  return (
    <Drawer variant={props.variant}
      open={props.open} className={classes.drawer}
      classes={{ paper: classes.drawerPaper }}
      onClose={props.close} ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
    >
      {/* <div className={classes.toolbarHeight} /> */}
      <Typography className={classes.logo} variant='h4'>wepay<span>gh</span></Typography>
      <Divider className={classes.divide} />
      <Container>
        <div className={classes.userProfile}>
          <Avatar className={classes.userImage} />
          <Typography variant='h6' className={classes.userName}>{props.currentUser.name}</Typography>
          <Typography variant='body2' color='textSecondary' className={classes.userTitle}>{props.currentUser.email}</Typography>
          <Typography variant='body2' color='textSecondary' className={classes.userTitle}>{props.currentUser.role}</Typography>
        </div>
      </Container>
      <Divider className={classes.divide} />
      <Container>
        <List className={classes.menuList}>
          <Typography className={classes.menuTitle} variant='body2'>GENERAL</Typography>
          {menuItemsGeneral.map((item, index) => {
            return (
              <ListItem onClick={() => navigate(item.path)} key={item.name} button className={`${classes.menuItem} ${pathname === item.path ? classes.activeMenu : null}`} alignItems='center'>
                <ListItemIcon className={classes.menuIcon}>{item.icon}</ListItemIcon>
                <ListItemText className={classes.menuText} secondary={item.name} />
                {index === 2 && <Chip label='new' color='primary' className={classes.chip} />}
                {index === 1 && loanRequest.length > 0 ? <Chip label={loanRequest?.length} style={{ width: '20px', borderRadius: '50px' }} color='primary' className={classes.chip} /> : null}
              </ListItem>
            )
          })
          }
        </List>
        <List className={classes.menuList} component='div'>
          <Typography className={classes.menuTitle} variant='body2'>MANAGEMENT</Typography>
          {menuItemsManagement().map((item) => {
            return (
              <div key={item.name}>
                <ListItem onClick={() => menuDropDown(item)} button className={`${classes.menuItem} ${pathname === item.path ? classes.activeMenu : null} ${item.sub && pathname.startsWith(item.path) ? classes.activeMenu : null}`} alignItems='center'>
                  <ListItemIcon className={classes.menuIcon}>{item.icon}</ListItemIcon>
                  <ListItemText className={classes.menuText} secondary={item.name} />
                  {item.name === 'SMS Messages' && <Chip label='new' color='primary' className={classes.chip} />}
                  {(item.name === 'Approvals' && inactiveCards.length > 0) || (item.name === 'Approvals' && deniedLoans.length > 0) || (item.name === 'Approvals' && pendingPayments.length > 0) ? <Chip label={inactiveCards.length + pendingPayments.length + deniedLoans.length} style={{ width: '20px', borderRadius: '50px' }} color='primary' className={classes.chip} /> : null}
                  {item.sub ? <KeyboardArrowDown className={classes.subMenuIcon} /> : null}
                </ListItem>
                {item.sub && item.sub.map((sub) => {
                  if (item.name === 'Users') {
                    return (
                      <Collapse component='div' in={openMenu1} timeout="auto" key={sub.name}>
                        <List disablePadding>
                          <ListItem onClick={() => navigate(sub.path)} button className={classes.menuItem}>
                            <ListItemText className={classes.subMenuText} secondary={sub.name} />
                          </ListItem>
                        </List>
                      </Collapse>
                    )
                  } if (item.name === 'Store') {
                    return (
                      <Collapse component='div' in={openMenu2} timeout="auto" key={sub.name}>
                        <List disablePadding>
                          <ListItem onClick={() => navigate(sub.path)} button className={classes.menuItem}>
                            <ListItemText className={classes.subMenuText} secondary={sub.name} />
                          </ListItem>
                        </List>
                      </Collapse>
                    )
                  }
                  else {
                    return (
                      <Collapse component='div' in={openCard} timeout="auto" key={sub.name}>
                        <List disablePadding>
                          <ListItem onClick={() => navigate(sub.path)} button className={classes.menuItem}>
                            <ListItemText className={classes.subMenuText} secondary={sub.name} />
                          </ListItem>
                        </List>
                      </Collapse>
                    )
                  }
                })

                }
              </div>
            )
          })
          }
        </List>
        <List className={classes.menuList}>
          <Typography className={classes.menuTitle} variant='body2'>SUPPORT</Typography>
          {menuItemsSupport.map((item) => {
            return (
              <ListItem onClick={(item.name === 'Logout' ? () => props.logoutUser() : () => navigate(item.path))} key={item.name} button className={`${classes.menuItem} ${pathname === item.path ? classes.activeMenu : null}`} alignItems='center'>
                <ListItemIcon className={classes.menuIcon}>{item.icon}</ListItemIcon>
                <ListItemText className={classes.menuText} secondary={item.name} />
              </ListItem>
            )
          })
          }
        </List>
      </Container>
    </Drawer>
  )
};

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps, { logoutUser })(SideBar);
