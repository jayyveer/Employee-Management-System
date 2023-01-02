import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col, Container, Image } from 'react-bootstrap'
import FormContainer from '../components/FormContainer'
import axios from 'axios'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import 'antd/dist/antd.css';
import { message } from 'antd'
// import "public/image.svg"


const LoginScreen = () => {
    const checkuser = localStorage.getItem('userName')
    const navigate = useNavigate()

    useEffect(() => {
        if (checkuser == null) {

        }
        else {
            navigate('dashboard/')
        }
    },)
    //Set Initial Values
    const initialValues = {
        email: '',
        password: ''
    };
    //Validation Schema using Yup
    const loginSchema = Yup.object().shape({
        email: Yup.string()
            
            .required('Email is required')
            .matches(/^([a-zA-Z0-9.]+)(|([+])([0-9])+)@([a-zA-Z]+)\.([a-zA_Z])/, 'Email is invalid'),
            // .matches(/^([a-zA-Z0-9]+)@([a-zA-Z]+)\.([a-zA_Z])/, 'Email is invalid'),
        //Email will start from number or alphabet have @ then gmail type letters then . and lastly com type letters,
        password: Yup.string()
            .required('Password is required')
    });
    //Intialise and destructure useFormik hook
    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useFormik({
        initialValues: initialValues,
        validationSchema: loginSchema,
        onSubmit: (values) => {
            console.log(values, "Form Values");
            loginUser(values)
        }

    });

const loginUser = (values) => {
    // axios.post('http://localhost:5000/users/login', values)
    //     .then((posRes) => {
    //         console.log(posRes.data, "data");

    //         // localStorage.setItem("user", JSON.stringify(posRes.data))
    //         // localStorage.setItem("userId", posRes.data.user_id)
    //         // localStorage.setItem("token", posRes.data.token)
    //         // //navigate('/')
    //         // if (!productId) {
    //         //     navigate('/')
    //         // }
    //         // else {
    //         //     navigate(`/product/${productId}`)
    //         // }
    //         // window.location.reload(true);
    //         // message.success('Successfully Logged in');
    //         // //navigation ? navigate('/') : null
    //     }, (errRes) => {
    //         console.log('error', errRes)
    //         message.error("Please check Email or Password again")
    //     })
    axios.post('http://localhost:5000/users/login', values)
    .then((posRes) => {
        console.log("API inside",posRes.data);
        localStorage.setItem('userRole', posRes.data.userRole)
        localStorage.setItem('userName', posRes.data.userName)
        localStorage.setItem('userToken', posRes.data.userToken)
        localStorage.setItem('userId', posRes.data.userId)
        navigate('/dashboard')
        message.success('Successfully Logged in')
    }, (errRes) => {
        console.log("----------Error---------", errRes);
        message.error("Please check Email or Password again")
    })
}

  return (
      checkuser == null ?
          (
            <Container className='p-5'>
                  <div className="card-bg w-100 border d-flex flex-column p-5" >
                      <h1 className='text-center pb-3'>Attendance Portal</h1>
                      <Row>
                          <Col md={5}>
                              <Image
                                  src="/image.svg"
                                  fluid
                              />
                              <Image></Image>
                          </Col>
                          <Col>
                              <FormContainer>
                                  <Form onSubmit={handleSubmit}>
                                      <Form.Group controlId='email' className='py-3'>
                                          <Form.Label>Email Address</Form.Label>
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

                                      <Form.Group controlId='password' className='py-3'>
                                          <Form.Label>Password</Form.Label>
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
                                      {/* <Form.Group controlId='remember' className='pb-3 '>
                                          <Form.Check
                                              type='checkbox'
                                              name="rememeber"
                                              defaultChecked={true}
                                              label={" Remember Me"}
                                          />
                                      </Form.Group> */}
                                      <center>
                                          <Button type='submit' variant='primary' className='py-3 btn-sm pl-5 pr-5 rounded-4'>
                                              Log In
                                          </Button>
                                      </center>
                                      
                                  </Form>
                                  <Row className='py-3'>
                                      <Col>
                                      <center>
                                              <Link to={'/forgot-password'} className="">
                                                  <small>Forgot Password</small>
                                              </Link>
                                      </center>
                                          
                                      </Col>
                                  </Row>

                              </FormContainer >
                          </Col>
                      </Row>
                  </div>
                
            </Container>
          

          ) : (
              <div>
                  <h1>You are already logged in</h1>
              </div>
          )
  )
}

export default LoginScreen
