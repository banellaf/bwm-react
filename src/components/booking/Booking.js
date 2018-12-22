import React from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import {getRangeOfDates} from '../../helpers';
import {BookingModal} from './BookingModal';
import * as moment from 'moment';
import * as actions from '../../actions';
import { ToastContainer, toast } from 'react-toastify';

export class Booking extends React.Component {

    constructor(){
        super();
        this.bookedOutDates = [];
        this.dateRef = React.createRef();

        this.state = {
            proposedBooking : {
                startAt:'',
                endAt:'',
                guests:''
            },
            modal : {
                open : false
            },
            errors:[]
 
        }

        this.checkInvalidDates = this.checkInvalidDates.bind(this);
        this.handleApply = this.handleApply.bind(this);
        this.cancelConfirmation = this.cancelConfirmation.bind(this);
        this.reserveRental = this.reserveRental.bind(this);
    }

    componentWillMount(){
        this.getBookedOutDates();
    }

    getBookedOutDates(){
        const {bookings} = this.props.rental;

        if (bookings && bookings.length > 0){
            bookings.forEach(booking => {
                const dateRange = getRangeOfDates(booking.startAt, booking.endAt, 'Y/MM/DD');
                this.bookedOutDates.push(...dateRange);
            })
        }
    }

    checkInvalidDates(date){
        return this.bookedOutDates.includes(date.format('Y/MM/DD')) || date.diff(moment(),'days') < 0;
    }

    handleApply(event, picker){
        const startAt = picker.startDate.format('Y/MM/DD');
        const endAt = picker.endDate.format('Y/MM/DD');

        this.dateRef.current.value = startAt + ' to ' + endAt;

        this.setState({
            proposedBooking :{
                ...this.state.proposedBooking,
                startAt,
                endAt
            }
        });
    }

    selectGuests(event){
        this.setState({
            proposedBooking : {
                ...this.state.proposedBooking,
                guests : parseInt(event.target.value)
            }
        })
    }

cancelConfirmation() {
    this.setState({
        modal:{
            open:false
        }
    })
}

addNewBookedOutDates(booking){
    debugger;
    const dateRange = getRangeOfDates(booking.startAt, booking.endAt);
    this.bookedOutDates.push(...dateRange);
}

resetData(){
    this.dateRef.current.value = '';
    this.setState({proposedBooking:{ startAt:'',
                                     endAt:'',
                                    guests:''}})
}

confirmProposedData(){
    const {startAt, endAt} = this.state.proposedBooking;
    const days = getRangeOfDates(startAt, endAt).length - 1;
    const {rental} = this.props;

        this.setState({
            proposedBooking : {
              ...this.state.proposedBooking,
              days,
              totalPrice: days * rental.dailyRate,
              rental
            },
            modal: {
                open:true
            }
        });

        console.log (this.state);
    }

reserveRental() {
    actions.createBooking(this.state.proposedBooking)
        .then( (booking) => {
            this.addNewBookedOutDates(booking);
            this.cancelConfirmation();
            this.resetData();
            toast.success('Booking has been successfully create!');
        },
        (errors) => {
            this.setState({errors})
            debugger;
        });
}

  render() {

    const {rental} = this.props;
    const {startAt, endAt, guests} = this.state.proposedBooking;

    return (
      <div className='booking'>
      <ToastContainer />
        <h3 className='booking-price'>€ {rental.dailyRate}  <span className='booking-per-night'>per night</span></h3>
        <hr></hr>
        <div className='form-group'>
        <label htmlFor='dates'>Dates</label>
            <DateRangePicker onApply={this.handleApply} 
                             isInvalidDate={this.checkInvalidDates} 
                             opens='left' 
                             containerStyles={{display:'block'}}>
                  <input ref={this.dateRef} id='dates' type='text' className='form-control'></input>
            </DateRangePicker>
        </div>
        <div className='form-group'>
          <label htmlFor='guests'>Guests</label>
          <input id='guests' 
                value={guests}
                 onChange={(event) => {this.selectGuests(event)}}
                 type='number' 
                 className='form-control' 
                aria-describedby='emailHelp' placeholder=''>
           </input>
        </div>
        <button disabled={!startAt || !endAt || !guests} onClick={ () => {this.confirmProposedData()}} className='btn btn-bwm btn-confirm btn-block'>Reserve place now</button>
        <hr></hr>
        <p className='booking-note-title'>People are interested into this house</p>
        <p className='booking-note-text'>
          More than 500 people checked this rental in last month.
        </p>
        <BookingModal open={this.state.modal.open} 
                      closeModal={this.cancelConfirmation}
                      confirmModal={this.reserveRental}
                      booking={this.state.proposedBooking}
                      errors={this.state.errors}
                      rentalPrice={rental.dailyRate}
                      />
      </div>
    )
  }
}
