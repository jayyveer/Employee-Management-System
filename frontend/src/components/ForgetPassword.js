import React, { useState } from 'react'
import { Button, Container, Form } from 'react-bootstrap'
import FormContainer from './FormContainer'
import axios from 'axios'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import 'antd/dist/antd.css';
import { message } from 'antd'
import { Link, useNavigate } from 'react-router-dom'

const ForgetPassword = () => {
    const [email, setEmail] = useState()
    const navigate = useNavigate()
    const token = localStorage.getItem("userToken")
    const config = {
        headers: {
            'Authorization': token
        }
    };
    //Set Initial Values
    const initialValues = {
        email: ''
    };
    //Validation Schema using Yup
    const loginSchema = Yup.object().shape({
        email: Yup.string()
            .email('Email is invalid')
            .required('Email is required')
            .matches(/^([a-zA-Z0-9.]+)(|([+])([0-9])+)@([a-zA-Z]+)\.([a-zA_Z])/, 'Email is invalid'),
            // .matches(/^([a-zA-Z0-9]+)@([a-zA-Z]+)\.([a-zA_Z])/, 'Email is invalid')
    });
    //Intialise and destructure useFormik hook
    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: loginSchema,
        onSubmit: (values) => {console.log(values.email);
            sendOtp(values);
        }

    });

    const sendOtp = (values) => {
        axios.get(`http://localhost:5000/users`, config)
            .then((posRes) => {
                let flag = 0;
                for (let i = 0; i < posRes.data.data.length; i++) {
                    // console.log(values.email);
                    // console.log(posRes.data.data[i].email)
                    if (values.email === posRes.data.data[i].email) {
                        flag = 1;
                    }
                }
                if (flag == 1) {
                    console.log("Email Exists");
                    setEmail(values.email)
                    // setCheck(1)
                    //forgetPassword()
                    axios.post('http://localhost:5000/users/forgot-password', values, config)
                        .then((posRes) => {
                            message.success("Otp sent on Email")
                            console.log("Successfully generated otp");
                        }, (errRes) => {
                            console.log('error', errRes)
                            message.error("Please check Email again")
                        })
                        // navigate('/verify-otp')
                    navigate('/verify-otp', { state: {email: values.email} })
                }
                else {
                    message.error('Email does not exist')
                }
            }, (errRes) => {
                console.log("Error", errRes);
            })
    }
    const forgotPassword = () => {//Already used above  
        axios.post('http://localhost:5000/users/forgot-password', values, config)
            .then((posRes) => {
                message.success("Email sent on registered Email address!!")
                console.log("Successfully generated otp");
            }, (errRes) => {
                console.log('error', errRes)
                message.error("Please check Email again")
            })
    }

    return (
        <div>
         <Container className='p-5'>
                <div className="card-bg w-100 border d-flex flex-column p-5" >
                    <h2 className='text-center pb-3'>Forgot Password</h2>
                    <FormContainer>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId='email' className='py-3'>
                                <Form.Label>Enter Email to reset password</Form.Label>
                                <Form.Control
                                    type='email'
                                    name='email'
                                    placeholder='Enter email'
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                ></Form.Control>
                                {errors.email && touched.email ? <h6 className='py-1 text-danger'>{errors.email}</h6> : null}
                            </Form.Group>
                            <center>
                                <Button type='submit' variant='primary' className='py-3 btn-sm pl-5 pr-5 rounded-4'>
                                    Send Otp
                                </Button>
                            </center>
                        </Form>
                    </FormContainer >
                </div>
            </Container>
        </div>
    )
}

export default ForgetPassword
