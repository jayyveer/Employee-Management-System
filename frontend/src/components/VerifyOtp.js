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

const VerifyOtp = () => {

    const location = useLocation();
    const [email, setEmail] = useState()  
    const navigate = useNavigate()
    useEffect(() => {
        setEmail(location?.state?.email)
    },email)

    const token = localStorage.getItem("userToken")
    const config = {
        headers: {
            'Authorization': token
        }
    };

    //Set Initial Values
    const initialValues = {
        otp: ''
    };
    //Validation Schema using Yup
    const loginSchema = Yup.object().shape({
        otp: Yup.number()
            .required('Otp is required')
    });
    //Intialise and destructure useFormik hook
    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: loginSchema,
        onSubmit: (values) => {
            console.log("Recieved email" ,email);
            verifyOtp(values)
        }

    });

    const verifyOtp = (values) => {
        console.log(values.otp);
        axios.post(`http://localhost:5000/users/verify-otp/${email}`, values, config)
            .then((posRes) => {
                console.log("otp----------", values.otp, posRes.data.data);
                if(values.otp === posRes.data.data){
                    console.log("Correct otp");
                    
                    axios.delete(`http://localhost:5000/users/delete-otp/${email}`,config)
                        .then(() => {
                            console.log("Delete succesfull");
                        }, (errRes) => {
                            console.log("Error", errRes);
                        });
                    navigate('/reset-password', { state: { email: email } })
                    message.success("Otp confimerd")
                }   
                else{
                    message.info("Wrong Otp")
                }
            }, (errRes) => {
                console.log('error', errRes)
                message.error("Wrong Otp")
            })
        // navigate('/verify-otp')
        navigate('/verify-otp', { state: { email: values.email } })
    }

  return (
    <>
        <Container className='p-5'>
            <div className="card-bg w-100 border d-flex flex-column p-5" >
                <h2 className='text-center pb-3'>Check OTP</h2>
                <FormContainer>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId='otp' className='py-3'>
                            {/* <Form.Label>Enter OTP</Form.Label> */}
                            <Form.Control
                            type='number'
                            name='otp'
                            placeholder='Enter otp'
                            value={values.otp}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            ></Form.Control>
                        </Form.Group>
                        <center>
                            <Button type='submit' variant='primary' className='py-3 btn-sm pl-5 pr-5 rounded-4'>
                                Verify
                            </Button>
                        </center>
                    </Form>
                </FormContainer >
            </div>
        </Container>
    </>
      
  )
}

export default VerifyOtp
