import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'

const AdminSection = () => {

    const date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${day}-${month}-${year}`;
    const [present, setPresent] = useState(1)
    const [absent, setabsent] = useState(1)

    const token = localStorage.getItem("userToken")
    const config = {
        headers: {
            'Authorization': token
        }
    };
    
    useEffect(() => {
        axios.get('http://localhost:5000/sheet/userstatus/present', config)
            .then((posRes) => {
                // console.log("API inside", posRes.data.data);
                setPresent(posRes.data.data.length)
                axios.get('http://localhost:5000/users/employee', config)
                    .then((pos) => {
                        // console.log("API inside", pos.data.data);
                        setabsent((pos.data.data.length - posRes.data.data.length))
                        // setPresent(posRes.data.data.length)
                    }, (errRes) => {
                        console.log("----------Error---------", errRes);
                    })

            }, (errRes) => {
                console.log("----------Error---------", errRes);
            })
    },)
    return (
        <div>
            <div className="card-bg w-100 border d-flex flex-column">
                <div className="p-4 d-flex flex-column h-100">
                    <div className="d-flex align-items-center justify-content-between">
                        <h4 className="m-0 h5 font-weight-bold text-dark">Admin Dashboard</h4>
                        <div className="py-1 px-2 bg-grey rounded-circle"><i className="fas fa-suitcase"></i></div>
                    </div>
                    <div className="card-bg w-100 border d-flex flex-column p-4" style={{ gridRow: "span 2" }}>
                        <Row>
                            <Col md={4} className='p-lg-5'>
                                <div className="card-bg w-100 border d-flex flex-column">
                                    <div className="p-4 d-flex flex-column h-100">
                                        <h4 className="m-0 h5 text-center font-weight-bold text-dark">Today's Date </h4>
                                        <h4 className="my-4 text-center text-dark h2 font-weight-bold">{currentDate}</h4>
                                    </div>
                                </div>
                            </Col>
                            <Col md={4} className='p-lg-5'>
                                <div className="card-bg w-100 border d-flex flex-column">
                                    <div className="p-4 d-flex flex-column h-100">
                                        <h4 className="m-0 h5 text-center font-weight-bold text-dark">Total Employees Present</h4>
                                        <h4 className="my-4 text-center text-dark h2 font-weight-bold">{present}</h4>
                                    </div>
                                </div>
                            </Col>
                            <Col md={4} className='p-lg-5'>
                                <div className="card-bg w-100 border d-flex flex-column">
                                    <div className="p-4 d-flex flex-column h-100">
                                        <h4 className="m-0 h5 text-center font-weight-bold text-dark">Total Employees Absent</h4>
                                        <h4 className="my-4 text-center text-dark h2 font-weight-bold">{absent}</h4>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
            
        </div>
    )
}

export default AdminSection
