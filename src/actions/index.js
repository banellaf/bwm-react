import axios from 'axios';
import authService from '../services/auth-service';
import axiosService from '../services/axios-service';
import * as types from './types';


const axiosIntance = axiosService.getInstance();

////////////////////
// RENTAL ACTIONS //
////////////////////
const fetchRentalByIdInit = () => {
    return {
        type:types.FETCH_RENTAL_BY_ID_INIT
    }
}

const fetchRentalByIdSuccess = (rental) => {
    return {
        type:types.FETCH_RENTAL_BY_ID_SUCCESS,
        rental
    }
}

const fetchRentalsSuccess = (rentals) => {
    return {
        type:types.FETCH_RENTALS_SUCCESS,
        rentals
    }
}

const fetchRentalsInit = () => {
    return {
        type:types.FETCH_RENTALS_INIT
    }
}

const fetchRentalsFail = (errors) => {
    return {
        type:types.FETCH_RENTALS_FAIL,
        errors
    }
}

export const fetchRentals = (city) => {
    const url = city ? `/rentals?city=${city}` : '/rentals';

    return dispatch => {
        dispatch(fetchRentalsInit());
        axiosIntance.get(url)
        .then(res => res.data )
        .then (rentals => dispatch(fetchRentalsSuccess(rentals)))
        .catch(({response}) => {
            dispatch(fetchRentalsFail(response.data.errors));
        });
    }
}

export const fetchRentalById = (rentalId) => {
    return function(dispatch){
        dispatch(fetchRentalByIdInit());

        axios.get(`/api/v1/rentals/${rentalId}`)
        .then (res => res.data)
        .then (rental => dispatch(fetchRentalByIdSuccess(rental)));
    }
}

export const createRental = (rentalData) => {
    return axiosIntance.post('/rentals', rentalData)
          .then( res => res.data,
                 err => Promise.reject(err.response.data.errors));
}

//////////////////
// AUTH ACTIONS //
//////////////////
const loginSuccess = () => {
    const username = authService.getUsername();
    return {
        type:types.LOGIN_SUCCESS,
        username

    }
}

const loginFailure = (errors) => {
    return {
        type:types.LOGIN_FAILURE,
        errors
    }
}

export const register = (userData) => {
    return axios.post('/api/v1/users/register', userData)
          .then( res => res.data,
                 err => Promise.reject(err.response.data.errors));
}

export const checkAuthState = () => {
    return dispatch => {
        if (authService.isAuthenticated()) {
            dispatch(loginSuccess());
        }
    }
}

export const login = (userData) => {
    return dispatch => {
        return axios.post('api/v1/users/auth', userData)
              .then (res => res.data)
              .then(token => {
                  authService.saveToken(token);
                  dispatch(loginSuccess());
              })
              .catch( ({response}) => {
                  dispatch(loginFailure(response.data.errors));
              })
    }
}

export const logout = () => {
    authService.invalidateToken();
    
    return {
        type :types.LOGOUT
    }
}

export const createBooking = (booking)  => {
   return axiosIntance.post('/bookings', booking)
        .then(res => res.data)
        .catch(({response}) => Promise.reject(response.data.errors))

}