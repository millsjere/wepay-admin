import axios from 'axios'


export const axiosInstance = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
})

// axiosInstance.interceptors.response.use(
// 	(config) => {
// 		return config;
// 	},
// 	(error) => {
//         const { message } = error?.response;
// 		if( message === 'You are not logged in. Please login to gain access' ){
//             window.location.assign('/')
//             errorModal('Session expired. Please login again')
//         }

//         return Promise.reject(error);
// 	}
// );

// AUTH REQUEST
export const getAuth = () => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.get('/admin/request');
            //console.log(res.data)
            if (res.data.status === 'user found') {
                dispatch({ type: "NEW_USER", payload: res.data.data })
                dispatch({ type: "EXIT_LOADING" })
            }
            if (res.data.status === 'no user found') {
                dispatch({ type: "NO_USER" });
                dispatch({ type: "EXIT_LOADING" })
            }
        } catch (error) {
            //console.log(error.response)
            dispatch(errorModal('Sorry, could not authorize user.'))
        }
    }
}

// PRODUCTS

export const createNewProduct = (data) => {
    return async (dispatch) => {
        try {
            await axiosInstance.post('/api/v1/product/new', data, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
            // console.log(res.data)
            dispatch(successModal('Product upload successful'))
            setTimeout(() => {
                window.location.reload()
            }, 1500)

        } catch (error) {
            dispatch(errorModal('Sorry, product upload failed.'))
            //console.log(error)
        }
    }
}

export const getAllProducts = () => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.get('/api/v1/product')
            //console.log(res.data)
            dispatch({ type: "ALL_PRODUCTS", payload: res.data.data })
        } catch (error) {
            dispatch(errorModal('Sorry, could not fetch products'))
            //console.log(error)
        }
    }
}

// USERS ACTION CREATORS


export const fetchUserAccount = () => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.get('/admin/users-account/fetch');
            dispatch({ type: "ALL_USERS", payload: res.data.data })

        } catch (error) {
            dispatch(errorModal('Sorry, could not send user data'))
        }
    }
}

export const getAllUsers = () => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.get('/api/v1/users');
            //console.log(res)
            dispatch({ type: "ALL_USERS", payload: res.data.data })
        } catch (error) {
            dispatch(errorModal('Sorry, could not fetch users'))
            console.log(error)
        }
    }
}

export const newUserAccount = (data) => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.post('/auth/register', data)
            if (res.data.status === 'success') {
                dispatch(successModal('User Account created successfully'))
                setTimeout(() => {
                    window.location.assign('/account/users')
                }, 1000)
            }
        } catch (error) {
            dispatch(errorModal('Sorry, could not create user account. Try again'))
            //console.log(error)
        }
    }
}

export const newAdminAccount = (data) => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.post('/admin/register', data)
            if (res.data.status === 'success') {
                dispatch(successModal('Account creation successful'))
            }
        } catch (error) {
            dispatch(errorModal('Sorry, could not create admin account. Try again'))
            //console.log(error)
        }
    }
}

//EDIT USER ACCOUNT //
export const updateUserDocuments = (data, field, id) => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.patch(`/admin/user/${id}/${field}`, data, {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            })
            if (res.data.status === 'success') {
                dispatch(successModal(`${field} updated successfully`))
                // dispatch({type:"LOGIN_USER", payload: res.data.data})
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            }
        } catch (error) {
            // console.log(error);
            // console.log(error.response.data.message)
            if (error.response.data.status === 'failed') {
                dispatch(errorModal(`Sorry, could not upload ${field}. Try again`))
            }
        }
    }
}

export const updateUserDetails = (data, field, id) => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.patch(`/admin/user/${id}/edit/${field}`, data)
            // console.log(res.data)
            if (res.data.status === 'success') {
                dispatch(successModal(`${field} details updated successfully`))
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            }
        } catch (error) {
            if (error.response.data.status === 'failed') {
                dispatch(errorModal(`Sorry, could not upload ${field}. Try again`))
            }
        }
    }
}

export const updateUserPhoto = (data, id) => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.patch(`/admin/user/${id}/photo`, data)
            // console.log(res.data)
            if (res.data.status === 'success') {
                dispatch(successModal(`User photo updated successfully`))
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            }
        } catch (error) {
            if (error.response.data.status === 'failed') {
                dispatch(errorModal(`Sorry, could not upload user photo. Try again`))
            }
        }
    }
}
export const updateUserPayslip = (data, id) => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.patch(`/admin/user/${id}/payslip`, data)
            // console.log(res.data)
            if (res.data.status === 'success') {
                dispatch(successModal(`User Payslip updated successfully`))
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            }
        } catch (error) {
            if (error.response.data.status === 'failed') {
                dispatch(errorModal(`Sorry, could not upload user payslip. Try again`))
            }
        }
    }
}
export const updateUserGhCard = (data, id) => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.patch(`/admin/user/${id}/ghcard`, data)
            // console.log(res.data)
            if (res.data.status === 'success') {
                dispatch(successModal(`User Ghana Card updated successfully`))
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            }
        } catch (error) {
            if (error.response.data.status === 'failed') {
                dispatch(errorModal(`Sorry, could not upload Ghana Card. Try again`))
            }
        }
    }
}

export const updateUserSDO = (data, id) => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.patch(`/admin/user/${id}/sdo`, data)
            // console.log(res.data)
            if (res.data.status === 'success') {
                dispatch(successModal(`User Standing Order updated successfully`))
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            }
        } catch (error) {
            if (error.response.data.status === 'failed') {
                dispatch(errorModal(`Sorry, could not upload Standing Order. Try again`))
            }
        }
    }
}



export const verifyUserEmail = (data) => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.post('/admin/user/verify-email', data);
            if (res.data.status === 'success') {
                dispatch(successModal('Success. User email verified'))
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            }
        } catch (error) {
            dispatch(errorModal('Sorry, email verification failed'))
        }
    }
}

export const fetchVerifiedUsers = () => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.get('/admin/users/revplus');
            if (res.data.status === 'success') {
                dispatch({ type: "ALL_USERS", payload: res.data.data })
                return res.data
            }
        } catch (error) {
            dispatch(errorModal('Sorry, could not reach RevPlus server. Try again'))
        }
    }
}

// ADMIN AUTH

export const loginUser = (data) => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.post('/admin/login', data)

            if (res.data.status === 'success') {
                dispatch(successModal('Login successful'))
                dispatch({ type: "LOGIN_USER", payload: res.data.data })

                setTimeout(() => {
                    window.location.assign('/account/verify')
                }, 1000);
            }

        } catch (error) {
            if (error.response?.data?.message.startsWith('Operation')) {
                dispatch(errorModal('Something went wrong. Please check your internet connection'))
            }
            dispatch(errorModal(error.response?.data.message))
            return
        }
    }
}

export const verifyAdmin = (code) => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.post('/admin/verify', code)
            if (res?.data?.status === 'success') {
                dispatch(successModal('Verification successful...'))
                setTimeout(() => {
                    dispatch({ type: "LOGIN_USER", payload: res.data.data })
                    window.location.assign('/account/dashboard')
                }, 1500)
            }

        } catch (error) {
            //console.log(error.response.message)
            dispatch(errorModal(error?.response?.data?.message))
        }
    }
}

export const logoutUser = () => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.get('/admin/logout')
            if (res.data.status === 'success') {
                dispatch({ type: "LOGOUT_USER" })
                window.location.assign('/');
            }

        } catch (error) {
            //console.log(error.response)
        }
    }
}

export const getAllAdmins = () => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.get('/api/v1/admin');
            //console.log(res.data)
            dispatch({ type: "ALL_ADMINS", payload: res.data.data })
        } catch (error) {
            dispatch(errorModal('Sorry, could not fetch administrators'))
            //console.log(error)
        }
    }
}

export const approvalRequest = (data) => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.post('/admin/user/request', data)
            //console.log(res.data)
            if (res.data.status === 'success') {
                dispatch(successModal('User account verified successfully'))
                setTimeout(() => {
                    window.location.assign('/account/users')
                }, 1000)
            }
        } catch (error) {
            dispatch(errorModal('Sorry, could not send approval request. Try again'))
            //console.log(error)
        }
    }
}

export const approveUser = (id) => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.post('/admin/user/approval', id)
            if (res.data.status === 'success') {
                dispatch(successModal('User account approved successfully'))
                setTimeout(() => {
                    window.location.reload()
                }, 1000)
            }
        } catch (error) {
            dispatch(errorModal('Sorry, could not approve user account. Try again'))
            //console.log(error)
        }
    }
}

// CARD ACTION CREATORS

export const createNewCard = (data) => {
    return async (dispatch) => {
        try {
            await axiosInstance.post('/api/v1/cards', data);
            //console.log(res)
            dispatch(successModal('Card created successfully'))
            dispatch(successModal('Loan request submitted'))
            setTimeout(() => {
                window.location.assign('/account/cards')
            }, 1000)
        } catch (error) {
            dispatch(errorModal('Sorry, could not create card'))
            //console.log(error)
        }
    }
}

export const updateUserCard = (data) => {
    return async (dispatch) => {
        try {
            await axiosInstance.patch('/api/v1/cards', data);
            //console.log(res)
            dispatch(successModal('Loan request submitted'))
            setTimeout(() => {
                window.location.assign('/account/cards')
            }, 1000)
        } catch (error) {
            dispatch(errorModal(error.response.data.message))
            //console.log(error)
        }
    }
}

export const getAllCards = () => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.get('/api/v1/cards');
            //console.log(res)
            dispatch({ type: "ALL_CARDS", payload: res.data.data })
        } catch (error) {
            dispatch(errorModal('Sorry, could not fetch cards'))
            console.log(error)
        }
    }
}


// ACTIVITIES ACTIONS

export const getAllActivities = () => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.get('/api/v1/audit')
            //console.log(res.data)
            dispatch({ type: "ALL_AUDITS", payload: res.data.data })
        } catch (error) {
            dispatch(errorModal('Sorry, could not fetch activities'))
            // console.log(error)
        }

    }
}

// INTEREST ACTIONS
export const getInterestRates = () => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.get('/api/v1/settings/interest');
            // console.log(res.data.data)
            dispatch({ type: "INTEREST", payload: res.data.data })

        } catch (error) {
            dispatch(errorModal('Could not fetch interest rates. Please check your connection'))
        }
    }
}

export const updateInterest = (data) => {
    return async (dispatch) => {
        try {
            await axiosInstance.patch('/api/v1/settings/interest', data)
            //console.log(res.data)
            dispatch(successModal('Interest rate updated successfully'))
            setTimeout(() => {
                window.location.reload()
            }, 1000);
        } catch (error) {
            dispatch(errorModal('Sorry, could not update interest rate'))
            //console.log(error)
        }

    }
}

// LOANS ACTIONS

export const getAllLoans = () => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.get('/api/v1/loans')
            //console.log(res.data)
            dispatch({ type: "ALL_LOANS", payload: res.data.data })
        } catch (error) {
            dispatch(errorModal('Sorry, could not fetch all loans'))
            //console.log(error)
        }

    }
}

export const getAllPayments = () => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.get('/api/v1/allpayments')
            //console.log(res.data)
            dispatch({ type: "ALL_PAYMENTS", payload: res.data.data })
        } catch (error) {
            dispatch(errorModal('Sorry, could not fetch payments'))
            //console.log(error)
        }

    }
}


export const confirmUserPayment = (data) => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.patch('/api/v1/user-payment', data)
            //console.log(res.data)
            if (res.data.status === 'success') {
                dispatch(successModal('User payment approved successfully'))
                setTimeout(() => {
                    window.location.reload()
                }, 1000)

            }
        } catch (error) {
            dispatch(errorModal('Sorry, could not approve payments'))
            //console.log(error)
        }

    }
}

export const deleteUserPayment = (id) => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.delete(`/api/v1/user-payment/${id}`)
            //console.log(res.data)
            if (res.data.status === 'success') {
                dispatch(successModal('User payment deleted successfully'))
                setTimeout(() => {
                    window.location.reload()
                }, 1000)

            }
        } catch (error) {
            dispatch(errorModal('Sorry, could not delete payments'))
            //console.log(error)
        }

    }
}

export const makeLoanPayment = (data) => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.post('/api/v1/loan/payment', data)
            //console.log(res.data)
            if (res.data.status === 'success') {
                dispatch(successModal('Loan payment confirmed successfully'))
                setTimeout(() => {
                    window.location.reload()
                }, 1500)
            }
        } catch (error) {
            dispatch(errorModal('Sorry, could not confirm loan payment. Try again'))
            //console.log(error)
        }

    }
}

export const denyLoanRequest = (data) => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.patch('/api/v1/loan/deny', data)
            //console.log(res.data)
            if (res.data.status === 'success') {
                dispatch(successModal('Loan request denied successfully'))
                setTimeout(() => {
                    window.location.reload()
                }, 1500)
            }
        } catch (error) {
            dispatch(errorModal('Sorry, could not deny loan request. Try again'))
            //console.log(error)
        }

    }
}

export const reverseLoanDenial = (data) => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.patch('/api/v1/loan/reverse', data)
            //console.log(res.data)
            if (res.data.status === 'success') {
                dispatch(successModal('Loan request reversed successfully'))
                setTimeout(() => {
                    window.location.reload()
                }, 1500)
            }
        } catch (error) {
            dispatch(errorModal('Sorry, could not reverse loan request. Try again'))
            //console.log(error)
        }

    }
}

export const approveLoanDenial = (data) => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.patch('/api/v1/loan/reject', data)
            //console.log(res.data)
            if (res.data.status === 'success') {
                dispatch(successModal('Loan request denied successfully'))
                setTimeout(() => {
                    window.location.reload()
                }, 1500)
            }
        } catch (error) {
            dispatch(errorModal('Sorry, could not deny loan request. Try again'))
            //console.log(error)
        }

    }
}

export const sendMessageSMS = (data) => {
    return async (dispatch) => {
        try {
            const res = await axiosInstance.post('/admin/user/sms', data)
            //console.log(res.data)
            if (res.data.status === 'success') {
                dispatch(successModal('SMS message delivered successfully'))
                setTimeout(() => {
                    window.location.reload()
                }, 1500)
            }
        } catch (error) {
            dispatch(errorModal('Sorry, could not send SMS. Try again'))
            //console.log(error)
        }

    }
}




// MODAL ACTIONS

export const successModal = (message) => {
    return {
        type: "SUCCESS",
        payload: message
    }
}
export const errorModal = (message) => {
    return {
        type: "ERROR",
        payload: message
    }
}

export const resetModal = () => {
    return {
        type: "RESET"
    }
}