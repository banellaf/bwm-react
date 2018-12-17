import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { BwmInput } from '../../components/shared/form/BwmInput';
import { BwmResError} from '../shared/form/BwmResError';

const RegisterForm = props => {
  const { handleSubmit, pristine, submitting, submitCb, valid, errors } = props
  return (
    <form onSubmit={handleSubmit(submitCb)}>
        <Field
        name='username'
        label='Username'
        type='text'
        className='form-control'
        component={BwmInput}
        />
        <Field
        name='email'
        label='Email'
        type='email'
        className='form-control'
        component={BwmInput}
        />
        <Field
        name='password'
        label='Password'
        type='password'
        className='form-control'
        component={BwmInput}
        />
        <Field
        name='passwordConfirmation'
        label='Password Confirmation'
        type='password'
        className='form-control'
        component={BwmInput}
        />
    <button className='btn btn-bwm btn-form' type="submit" disabled={!valid || pristine || submitting}>
        Register
    </button>
    <BwmResError errors={errors} />
    </form>
  )
}

const validate = values => {
    const errors = {}
    
    if (values.username && values.username.length < 4){
        errors.username = 'Username min length is 4 char minimum';
    }

    if (!values.email ){
        errors.email = 'email is required';
    }

    if (!values.passwordConfirmation ){
        errors.passwordConfirmation = 'password confirmation is required';
    }

    if (values.password !== values.passwordConfirmation ){
        errors.passwordConfirmation = 'password confirmation does not match password';
    }  
    return errors
  }

export default reduxForm({
  form: 'registerForm', // a unique identifier for this form
  validate
})(RegisterForm)