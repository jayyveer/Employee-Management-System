import React, { useEffect, useRef, useState } from 'react'
import { CDBBtn, CDBProgress } from "cdbreact";
import axios from 'axios';
import { Col, Row } from 'react-bootstrap';
import moment from 'moment';

const UserSection = () => {
  const [timein, setTimein] = useState(false)
  const [timeout, setTimeout] = useState(false)
  const [timedinat, setTimedinat] = useState()
  const [timedoutat, setTimedoutat] = useState()
  const id = localStorage.getItem('userId')
  const userName = localStorage.getItem('userName')

  const [hh, sethh] = useState(0)
  const [mm, setmm] = useState(0)
  const [ss, setss] = useState(0)

  let intervalRef = useRef("");
  let act_date = new Date()
  const [startTime, setStarttime] = useState("") //gets timein time
  const [endTime, setEndtime] = useState("")
  const [totalTime, setTotaltime] = useState("")
  let currentTime = moment(act_date, "HH:mm:ss") //gets current time
  let duration
  let temp;

  const token = localStorage.getItem("userToken")
  const config = {
    headers: {
      'Authorization': token
    }
  };

  if (timein == true && timeout == false) {
    duration = moment.duration(currentTime.diff(startTime))//changing every millisecond isliye flickering 
  }
  // else if(timein==true && timeout==true){
  //   setTotaltime(moment.utc(moment.duration(moment(timedoutat).diff(moment(timedinat))).asMilliseconds()).format('HH:mm'))
  // }

  useEffect(() => {
    axios.get(`http://localhost:5000/sheet/user/${id}`,config)
      .then((posRes) => {
        // console.log("time in",posRes.data.data[0].time_in)
        if (posRes.data.data.length) {
          var s = new Date(posRes.data.data[0].time_in)
          temp = moment(s, 'HH:mm:ss');
          setStarttime(temp)//sets startt time for counter
          s = moment(s).format("HH:mm a")
          setTimedinat(s)// sets time in
          setTimein(true)

          if (posRes.data.data[0].time_out) {
            // console.log("time out", posRes.data.data[0].time_out);
            var s = new Date(posRes.data.data[0].time_out)
            temp = moment(s, 'HH:mm:ss');
            setEndtime(temp)// sets end time to calculate total hours
            var temp = new Date(posRes.data.data[0].time_out).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' });
            temp = moment(temp).format("HH:mm a")
            setTimedoutat(temp)
            setTimeout(true)
          }
        }
      }, (errRes) => {
        console.log("----------Error---------", errRes);
      })
    // if (timein == true && timeout == true) {
    //   setTotaltime(moment.utc(moment.duration(moment(endTime).diff(moment(startTime))).asMilliseconds()).format('HH:mm'))
    // }
  }, [timein, timeout])


  const duration_set = () => {
    sethh(duration?._data?.hours)
    setmm(duration?._data?.minutes)
    setss(duration?._data?.seconds)
  }



  useEffect(() => {
    intervalRef.current = setInterval(duration_set, 1000);
    // console.log("start time",startTime);
    // console.log("end time",endTime);
    // console.log("Total Time",totalTime);
    if (startTime) {
      if (timein == true && timeout == true) {
        setTotaltime(moment.utc(moment.duration(moment(endTime).diff(moment(startTime))).asMilliseconds()).format('HH:mm'))
      }
    }
    return () => clearInterval(intervalRef.current);  
  }, [duration,ss])

  const timeIn = () => {
    console.log("Time In");
    //API call for time in
    axios.post(`http://localhost:5000/sheet/timein/${id}`, {}, config)
      .then((posRes) => {
        //Start timer
        setTimein(true)
      }, (errRes) => {
        console.log("----------Error---------", errRes);
      })
  }

  const timeOut = () => {
    // Api call for time out
    console.log("Time Out");
    axios.post(`http://localhost:5000/sheet/timeout/${id}`,{}, config)
      .then((posRes) => {
        // console.log(posRes.data.data)
        //Stop timer
        setTimeout(true)
      }, (errRes) => {
        console.log("----------Error---------", errRes);
      })
  }

  return (
    <div>
      <div className="card-bg w-100 border d-flex flex-column">
        <div className="p-4 d-flex flex-column h-100">

          <div className="d-flex align-items-center justify-content-between">
            <h4 className="m-0 h5 font-weight-bold text-dark">{userName}'s Dashboard</h4>
            <div className="py-1 px-2 bg-grey rounded-circle"><i className="fas fa-suitcase"></i></div>
          </div>

          {
            timein == false && timeout == false
              ? <div className="card-bg w-100 border d-flex flex-column p-4" style={{ gridRow: "span 2" }}>
                <div className="d-flex align-items-center justify-content-between">
                  <CDBBtn style={{ background: "#333" }} flat size="large" className="border-0 mr-auto" onClick={timeIn}><span className="msg-rem" >Time</span> -In</CDBBtn>
                </div>
              </div>

              : (timein == true && timeout == false) || (timein == false && timeout == true)
                ? <div className="card-bg w-100 border d-flex flex-column p-4" style={{ gridRow: "span 2" }}>
                  <Row>
                    <Col md={4} className='p-lg-5'>
                      <div className="card-bg w-100 border d-flex flex-column">
                        <div className="p-4 d-flex flex-column h-100">
                          <h4 className="m-0 h5 text-center font-weight-bold text-dark">Time In at</h4>
                          <h4 className="my-4 text-center text-dark h2 font-weight-bold">{timedinat}</h4>
                        </div>
                      </div>
                    </Col>
                    <Col md={4} className='p-lg-5'>
                      <div className="card-bg w-100 border d-flex flex-column">
                        <div className="p-4 d-flex flex-column h-100 ">
                          <h4 className="m-0 h5 text-center font-weight-bold text-dark">Timing</h4>
                          <h4 className="my-4 text-center text-dark h2 font-weight-bold">{hh}:{mm}:{ss}</h4>
                        </div>
                      </div>
                    </Col>
                    <Col md={4} className='p-lg-5'>
                      <div className="card-bg w-100 border d-flex flex-column">
                        <div className="p-4 d-flex flex-column h-100 ">
                          <CDBBtn style={{ background: "#333" }} flat size="large" className="border-0 mr-auto" onClick={timeOut}><span className="msg-rem" >Time</span> -Out</CDBBtn>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>

                : <div className="card-bg w-100 border d-flex flex-column p-4" style={{ gridRow: "span 2" }}>
                  <Row>
                    <Col md={4} className='p-lg-5'>
                      <div className="card-bg w-100 border d-flex flex-column">
                        <div className="p-4 d-flex flex-column h-100">
                          <h4 className="m-0 h5 text-center font-weight-bold text-dark">Time In at</h4>
                          <h4 className="my-4 text-center text-dark h2 font-weight-bold">{timedinat}</h4>
                        </div>
                      </div>
                    </Col>
                    <Col md={4} className='p-lg-5'>
                      <div className="card-bg w-100 border d-flex flex-column">
                        <div className="p-4 d-flex flex-column h-100">
                          <h4 className="m-0 h5 text-center font-weight-bold text-dark">Total Working</h4>
                          <h4 className="mt-4 mb-0 text-center text-dark h2 font-weight-bold">{totalTime}</h4>
                          <h5 className=" text-center text-dark  font-weight-bold">{"Hours"}</h5>
                        </div>
                      </div>
                    </Col>
                    <Col md={4} className='p-lg-5'>
                      <div className="card-bg w-100 border d-flex flex-column">
                        <div className="p-4 d-flex flex-column h-100">
                          <h4 className="m-0 h5 text-center font-weight-bold text-dark">Timed out at</h4>
                          <h4 className="my-4 text-center text-dark h2 font-weight-bold">{timedoutat}</h4>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
          }
        </div>
      </div>
    </div>
  )
}

export default UserSection
