import { combineReducers } from 'redux'

export const loaderReducer = (loader = true, action) => {
    switch (action.type) {
        case "LOADING":
            return true
        case "EXIT_LOADING":
            return false
        default:
            return loader;
    }
}

const userReducer = (user = null, action) => {
    switch (action.type) {
        case "NEW_USER":
            return { ...action.payload }
        case "LOGIN_USER":
            return { ...action.payload }
        case "NO_USER":
            return user
        case "LOGOUT_USER":
            return user
        default:
            return user
    }
}

const cardReducer = (card = [], action) => {
    switch (action.type) {
        case "ALL_CARDS":
            return [...action.payload]
        default:
            return card
    }
}

const allUsersReducer = (allUsers = [], action) => {
    switch (action.type) {
        case "ALL_USERS":
            return [...action.payload]
        default:
            return allUsers
    }
}

const allAdminsReducer = (admins = [], action) => {
    switch (action.type) {
        case "ALL_ADMINS":
            return [...action.payload]
        default:
            return admins
    }
}

const allLoansReducer = (loans = [], action) => {
    switch (action.type) {
        case "ALL_LOANS":
            return [...action.payload]
        default:
            return loans
    }
}

const allPaymentReducer = (payments = [], action) => {
    switch (action.type) {
        case "ALL_PAYMENTS":
            return [...action.payload]
        default:
            return payments
    }
}

const interestReducer = (interest = null, action) => {
    switch (action.type) {
        case "INTEREST":
            return action.payload
        default:
            return interest
    }
}

const auditReducer = (audit = [], action) => {
    switch (action.type) {
        case "ALL_AUDITS":
            return action.payload
        default:
            return audit
    }
}

const modalReducer = (modal = null, action) => {
    switch (action.type) {
        case "SUCCESS":
            return { status: 'success', message: action.payload }
        case "ERROR":
            return { status: 'error', message: action.payload }
        case "RESET":
            return modal = null
        default:
            return modal = null
    }
}

export default combineReducers({
    loader: loaderReducer,
    currentUser: userReducer,
    allUsers: allUsersReducer,
    admins: allAdminsReducer,
    cards: cardReducer,
    audits: auditReducer,
    modal: modalReducer,
    loans: allLoansReducer,
    payments: allPaymentReducer,
    interest: interestReducer
});