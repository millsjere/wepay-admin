import React from 'react';
import { alpha, AppBar, Avatar, Badge, Box, Button, Divider, Hidden, IconButton, InputBase, MenuItem, Popover, Toolbar, Typography } from '@material-ui/core';
import { Mail, Search, Notifications, Menu } from '@material-ui/icons'
import { makeStyles } from '@material-ui/styles';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import SideBar from './SideBar';
import { connect } from 'react-redux'
import NotificationItem from './NotificationItem';
import { logoutUser } from '../actions/actions';

const drawerWidth = 260;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& .MuiBadge-colorSecondary': {
      background: theme.backgroundPrimary
    }
  },
  appbar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`
    }
  },
  toolbar: {
    display: 'flex',
    background: '#fff'
  },
  drawerIcon: {
    color: alpha(theme.backgroundSecondary, 0.8)
  },
  search: {
    display: 'flex',
    gap: theme.spacing(1),
    justifyContent: 'center',
    alignItems: 'center',
    background: alpha(theme.contentBackground, 0.08),
    padding: '4px 8px',
    borderRadius: '8px'
  },
  searchInput: {
    color: theme.backgroundSecondary,
  },
  searchIcon: {
    color: alpha(theme.backgroundSecondary, 0.5),
  },
  notify: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto'

  },
  badgeIcon: {
    color: '#c2c2c2',
    '&:hover': {
      color: theme.backgroundPrimary
    }
  },
  menu: {
    padding: '1rem',
    '& li': {
      borderRadius: '.3rem'
    },
    '& h6': {
      fontSize: '1rem'
    }
  },
  // necessary for content to be below app bar
  toolbarHeight: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.contentBackground,
    padding: theme.spacing(4),
    borderRadius: '10px',
  },

})
)

const TopBar = (props) => {
  const classes = useStyles()
  const pathname = useLocation().pathname
  const [openState, setOpenState] = useState(false)
  const [filter, setFilter] = useState()
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // console.log(pathname.split('/')[3])
  const openDrawerHandle = () => {
    setOpenState(!openState)
  }

  const handleClose = () => {
    setAnchorEl(null);
  }
  const onhandleClick = (e, val) => {
    setAnchorEl(e.currentTarget);
    setFilter(val)

  }

  return (
    <div className={classes.root}>
      {/* APPBAR */}
      <AppBar elevation={0} position='fixed' className={classes.appbar}>
        <Toolbar className={classes.toolbar}>
          <Hidden smUp>
            <IconButton onClick={openDrawerHandle}>
              <Menu className={classes.drawerIcon} />
            </IconButton>
          </Hidden>
          <div className={classes.search}>
            <div className={classes.searchIcon}> <Search fontSize='small' /> </div>
            <InputBase className={classes.searchInput} placeholder='Search...' />
          </div>

          <div className={classes.notify}>
            <Hidden xsDown>
              <IconButton>
                <Badge badgeContent={2} color='secondary'>
                  <Notifications fontSize='medium' className={classes.badgeIcon} />
                </Badge>
              </IconButton>
            </Hidden>
            <IconButton onClick={(e) => onhandleClick(e, 'profile')}>
              <Avatar />
            </IconButton>

            {/* POPOVER */}
            <Popover open={open} onClose={handleClose} anchorEl={anchorEl} transformOrigin={{ vertical: 'top', horizontal: 'right' }} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
              {filter === 'notification' &&
                <Box width={'20rem'}>
                  <div className={classes.menu}>
                    <Typography variant='h6'>Notifications ({props.notifications.length})</Typography>
                  </div>
                  <Divider />
                  <div className={classes.menu}>
                    {props.notifications.length > 0 ? props.notifications.filter(el => el.status === 'unread').map(item => {
                      return (
                        <NotificationItem key={item._id}
                          title={item.title} body={item.body}
                          date={new Date(item.createdAt).toDateString()}
                        />
                      )
                    })
                      :
                      <Typography color='textSecondary'>You have no unread notifications</Typography>
                    }
                  </div>

                  <div className={classes.menu}>
                    <Button size='small' href='/u/account/notifications' style={{ textTransform: 'none', fontSize: '.8rem' }}>View all</Button>
                  </div>
                </Box>
              }

              {filter === 'profile' &&

                <Box width={'12rem'}>
                  <div className={classes.menu}>
                    <Typography variant='h6'>{props.currentUser.name}</Typography>
                    <Typography variant='body2' color='textSecondary' noWrap>{props.currentUser.email}</Typography>
                  </div>
                  <Divider />
                  <div className={classes.menu}>
                    <MenuItem dense onClick={() => window.location.assign('/account/settings')}>Settings</MenuItem>
                    <MenuItem dense onClick={() => window.location.assign('/account/approvals')}>Approvals</MenuItem>

                  </div>
                  <Divider />

                  <div className={classes.menu}>
                    <MenuItem dense onClick={() => props.logoutUser()}>Logout</MenuItem>
                  </div>
                </Box>

              }
            </Popover>


          </div>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR DRAWER */}
      <Hidden xsDown >
        <SideBar drawerWidth={drawerWidth} variant='permanent' open={true} />
      </Hidden>

      <Hidden smUp >
        <SideBar drawerWidth={drawerWidth} variant='temporary' open={openState} close={openDrawerHandle} />
      </Hidden>
    </div>
  )
};

const mapStateToProps = (state) => {
  // console.log(state)
  return state
}


export default connect(mapStateToProps, { logoutUser })(TopBar);
