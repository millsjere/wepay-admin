import React, { useEffect, useState } from 'react'
import PageHeader from '../components/PageHeader'
import { connect } from 'react-redux'
import { Card, CardContent, InputAdornment, TextField, Typography, Chip, Box } from '@material-ui/core'
import { Search } from '@material-ui/icons'
import { DataGrid } from '@material-ui/data-grid'
import { makeStyles } from '@material-ui/styles'
import { getAllActivities } from '../actions/actions'
import Modal from '../components/Modal'

const useStyles = makeStyles(theme => ({
  root: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      "&.Mui-focused fieldset": {
        border: `1px solid ${theme.backgroundPrimary}`
      }
    }
  },
  addBtn: {
    marginLeft: 'auto',
    height: '45px',
    color: '#fff',
    background: theme.backgroundPrimary,
    padding: '0 15px',
    borderRadius: '10px',
    '&:hover': {
      background: theme.backgroundSecondary
    }
  },
  card: {
    '&:hover': {
      boxShadow: 'rgb(32 40 45 / 8%) 0px 2px 14px 0px'
    }
  }
}))

const Activities = (props) => {
  const { getAllActivities } = props
  const classes = useStyles()
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    getAllActivities()
  }, [getAllActivities])

  const columns = [

    {
      field: 'createdAt', headerName: 'Date & Time', flex: .5, renderCell: (params) => {
        return (
          <Box style={{ disple: 'flex', flexDirection: 'column' }}>
            <Typography variant='body2'>{new Date(params.value).toDateString()}</Typography>
            <Typography variant='body2' color='textSecondary'>{new Date(params.value).toLocaleTimeString()}</Typography>
          </Box>
        )
      }
    },
    { field: 'title', headerName: ' Action Title', flex: 1 },
    { field: 'name', headerName: 'Full Name', flex: .5 },
    { field: 'email', headerName: ' Email Address', flex: 1 },
    { field: 'role', headerName: 'Role', flex: .5, renderCell: (params) => { return <Chip disabled label={params.value} /> } },
  ]

  return (
    <div>
      <div style={{ display: 'flex' }}>
        <PageHeader title='Audit Trail' link1='Activities' link2='Audit Trail' />
      </div>

      {/* Modal */}
      {props.modal && <Modal status={props.modal.status} />}

      <Card variant='outlined' style={{ borderRadius: '10px', width: '100%' }} className={classes.card}>
        <CardContent style={{ padding: '30px' }}>
          <TextField variant='outlined' style={{ marginBottom: '20px' }}
            placeholder='Filter Audits' fullWidth
            InputProps={{
              startAdornment: <InputAdornment position='start'><Search fontSize='small' /> </InputAdornment>
            }}

          />

          <DataGrid autoHeight
            pagination rows={props.audits} rowsPerPageOptions={[5, 10, 20]}
            rowHeight={70} columns={columns}
            pageSize={pageSize} checkboxSelection
            onPageSizeChange={(newSize) => setPageSize(newSize)}
          />

        </CardContent>
      </Card>

    </div>
  )
}

const mapStateToProps = (state) => {
  return state
}

export default connect(mapStateToProps, { getAllActivities })(Activities)