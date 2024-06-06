import React from 'react'
import { Box, LinearProgress } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import Logo from '../assets/images/logo.png'


const useStyles = makeStyles(theme => ({
    wrap: {
        width: '100%',
        height: '100vh',
        background: '#fff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center'
    },
    imgBox: {
        width: '14rem',
        marginBottom: '1rem'
    }
}))
const Loader = () => {
    const classes = useStyles()

    return (
        <div className={classes.wrap}>
            <Box>
                <Box className={classes.imgBox}> <img src={Logo} alt='logo' width={'100%'} /> </Box>
                <LinearProgress variant='indeterminate' />
            </Box>

        </div>
    )
}

export default Loader