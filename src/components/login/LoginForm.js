import React from 'react';
import { Field, reduxForm } from 'redux-form';

import { BwmInput } from '../../components/shared/form/BwmInput';
import { BwmResError} from '../shared/form/BwmResError';
import { required, minLength4} from '../../components/shared/form/Validators';


const LoginForm = props => {
    const { handleSubmit, pristine, submitting, submitCb, valid, errors } = props
    return (
      <form onSubmit={handleSubmit(submitCb)}>
          <Field
          name='email'
          label='Email'
          type='email'
          className='form-control'
          component={BwmInput}
          validate={[required, minLength4]}
          />
          <Field
          name='password'
          label='Password'
          type='password'
          className='form-control'
          component={BwmInput}
          validate={[required]}
          />
      <button className='btn btn-bwm btn-form' type="submit" disabled={!valid || pristine || submitting}>
          Login
      </button>
      <BwmResError errors={errors} />
      </form>
    )
  }
  
  export default reduxForm({
    form: 'loginForm' // a unique identifier for this form
  //  validate
  })(LoginForm)