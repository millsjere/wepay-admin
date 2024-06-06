import React from 'react'
import { Avatar, Divider, Grid, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'


const useStyles = makeStyles(theme => ({
    title: {
        '& h6': {
            fontSize: '.8rem'
        }
    },
    avatar: {
        background: theme.primaryColorOrange,
        color: '#fff'
    }
}))

const NotificationItem = ({ title, date, body }) => {
    const classes = useStyles()


    return (
        <div>
            <Grid container style={{ marginTop: '1rem' }} spacing={1}>
                <Grid item sm={2}>
                    <Avatar className={classes.avatar} color='primary' >{title.charAt(0)}</Avatar>
                </Grid>

                <Grid item sm={10}>
                    <Typography className={classes.title} variant='h6' noWrap>{title}</Typography>
                    <Typography variant='body2' color='textSecondary' style={{ marginBottom: '.2rem' }} noWrap>{body}</Typography>
                    <Typography paragraph variant='body2' color='textSecondary'>
                        {date}
                    </Typography>
                </Grid>
            </Grid>
            <Divider />
        </div>
    )
}

export default NotificationItem