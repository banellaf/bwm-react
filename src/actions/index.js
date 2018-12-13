import axios from 'axios';
import * as types from './types';

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

export const fetchRentals = () => {
    return dispatch => {
        axios.get(`/api/v1/rentals/`)
        .then(res => res.data )
        .then (rentals => dispatch(fetchRentalsSuccess(rentals)));
    }
}

export const fetchRentalById = (rentalId) => {
    return function(dispatch){
        dispatch(fetchRentalByIdInit());

        axios.get(`/api/v1/rentals/${rentalId}`)
        .then (res => res.data)
        .then (rental => dispatch(fetchRentalByIdSuccess(rental)));
        // // find the rental corresponding to the rental id 
        // setTimeout( () => {
        //     const rental = rentals.find((rental)=> rental.id === rentalId);
        //     dispatch(fetchRentalByIdSuccess(rental));
        // },1000);
    }
}