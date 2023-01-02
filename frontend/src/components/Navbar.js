import React from 'react'
import { CDBNavbar, CDBInput } from "cdbreact";
import { NavDropdown } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd'

const Navbar = () => {
    const navigate = useNavigate()
    const userName = localStorage.getItem("userName")
    const logoutHandler = () => {
        localStorage.removeItem('userName')
        localStorage.removeItem('userToken')
        localStorage.removeItem('userRole')
        navigate("/");
        // window.location.reload(true);
        message.info("Logged out Succesfully")
    }
  return (
      <header style={{ background: "#333", color: "#fff", height: "75px" }}>
          <CDBNavbar dark expand="md" scrolling className="justify-content-start">
              {/* <CDBInput type="search" size="md" hint="Search" className="mb-n4 mt-n3 input-nav" />
              <div className="ml-auto">
                  <i className="fas fa-bell"></i>
                  <i className="fas fa-comment-alt mx-4"></i>
                  <img alt="panelImage" src="img/pane/pane4.png" style={{ width: "3rem", height: "3rem" }} />
              </div> */}
              <NavDropdown title={userName} id='username' className='ml-auto'>                
                  <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                  </NavDropdown.Item>
              </NavDropdown>
          </CDBNavbar>
      </header>
  )
}

export default Navbar
