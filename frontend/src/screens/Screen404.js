import React from 'react'
import { Button, Col, Container, Image, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useNavigate } from "react-router-dom";

const Screen404 = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1)
  }
  return (
    <Container className='p-5'>
      <div className="card-bg w-100 border d-flex flex-column p-5" >
        {/* <h1 className='text-center pb-3'>Attendance Portal</h1> */}
        <Row>
          <Col md={4} className='m-auto'>
          <center>
            <h3>OOPs</h3>  
            <h5>Something went wrong</h5>
              <Button onClick={goBack} type='submit' variant='primary' className='py-3 btn-sm m-2 pl-5 pr-5 rounded-4'>
                Go back
              </Button>
          </center>
          </Col>
          <Col>
            <Image
              src="/notfound.svg"
              fluid
            />
          </Col>
        </Row>
      </div>

    </Container>
  )
}

export default Screen404