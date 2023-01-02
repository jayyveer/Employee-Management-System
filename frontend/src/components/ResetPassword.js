import React, { useEffect, useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import FormContainer from './FormContainer'
import axios from 'axios'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import 'antd/dist/antd.css';
import { message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useLocation } from 'react-router-dom';

const ResetPassword = () => {
    const location = useLocation();
    const [email, setEmail] = useState()
    const navigate = useNavigate()
    const token = localStorage.getItem("userToken")
    const config = {
        headers: {
            'Authorization': token
        }
    };

    useEffect(() => {
        setEmail(location?.state?.email)
    }, email)
    //Set Initial Values
    const initialValues = {
        password: '',
        confirmpassword: ''
    };
    //Validation Schema using Yup
    const resetSchema = Yup.object().shape({
        password: Yup.string()
            .required('Please Enter your password')
            .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%&])(?=.{8,})/,
                "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
            ),
        confirmpassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required')

    });
    //Intialise and destructure useFormik hook
    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: resetSchema,
        onSubmit: (values) => {
            changePassword(values);
        }

    });
    const changePassword = (values) => {
        axios.post(`http://localhost:5000/users/reset-password/${email}`, values, config)
            .then((posRes) => {console.log(posRes);
                message.success("Password Successfully changed.")
                console.log("Password Changed Successfully");
                navigate('/')
            }, (errRes) => {
                console.log('error', errRes)
                message.error("Cannot Change Password")
            })
    }
  return (
    <div>

          <Container className='p-5'>
              <div className="card-bg w-100 border d-flex flex-column p-5" >
                  <h2 className='text-center pb-3'>Reset Password</h2>
                  <FormContainer>
                      <Form onSubmit={handleSubmit}>
                          <Form.Group controlId='password' className='py-3'>
                              <Form.Label>Enter password</Form.Label>
                              <Form.Control
                                  type='password'
                                  name='password'
                                  placeholder='Enter password'
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              ></Form.Control>
                              {errors.password && touched.password ? <h6 className='py-1 text-danger'>{errors.password}</h6> : null}
                          </Form.Group>
                          <Form.Group controlId='confirmpassword' className='py-3'>
                              <Form.Label>Confirm Password</Form.Label>
                              <Form.Control
                                  type='password'
                                  name='confirmpassword'
                                  placeholder='Confirm password'
                              value={values.confirmpassword}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              ></Form.Control>
                              {errors.confirmpassword && touched.confirmpassword ? <h6 className='py-1 text-danger'>{errors.confirmpassword}</h6> : null}
                          </Form.Group>
                          <center>
                              <Button type='submit' variant='primary' className='py-3 btn-sm pl-5 pr-5 rounded-4'>
                                  Change Password
                              </Button>
                          </center>
                      </Form>
                  </FormContainer >
              </div>
          </Container>
    </div>
  )
}

export default ResetPassword
