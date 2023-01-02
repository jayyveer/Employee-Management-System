import React from 'react'
import {
    CDBSidebar,
    CDBSidebarContent,
    CDBSidebarFooter,
    CDBSidebarHeader,
    CDBSidebarMenu,
    CDBSidebarMenuItem
} from "cdbreact";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const checkRole = localStorage.getItem("userRole")
    const userName = localStorage.getItem("userName")
  return (
      <div style={{ display: 'flex', height: '100vh', overflow: 'scroll initial' }}>
          {
              checkRole == 1
                  ? <CDBSidebar textColor="#fff" backgroundColor="#333">
                      <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
                          <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
                              Company Name
                          </a>
                      </CDBSidebarHeader>

                      <CDBSidebarContent className="sidebar-content">
                          <CDBSidebarMenu>
                              <NavLink exact to="/dashboard" activeClassName="activeClicked">
                                  <CDBSidebarMenuItem icon="columns">Dashboard</CDBSidebarMenuItem>
                              </NavLink>
                              <NavLink to="/employee-details" activeClassName="activeClicked">
                                  <CDBSidebarMenuItem icon="table">Manage Employees</CDBSidebarMenuItem>
                              </NavLink>
                              <NavLink to="/attendance-report" activeClassName="activeClicked">
                                  <CDBSidebarMenuItem icon="chart-line">Attendance Report</CDBSidebarMenuItem>
                              </NavLink>
                              <NavLink to="/events" activeClassName="activeClicked">
                                  <CDBSidebarMenuItem icon="fas fa-sticky-note">Add Events</CDBSidebarMenuItem>
                              </NavLink>
                          </CDBSidebarMenu>
                      </CDBSidebarContent>

                      <CDBSidebarFooter style={{ textAlign: 'center' }}>
                          {/* <div
                      style={{
                          padding: '20px 5px',
                      }}
                  >
                      Copyright @ 2022
                  </div> */}
                      </CDBSidebarFooter>
                  </CDBSidebar>
                  : <CDBSidebar textColor="#fff" backgroundColor="#333">
                      <CDBSidebarHeader prefix={<i className="fa fa-bars fa-large"></i>}>
                          <a href="/" className="text-decoration-none" style={{ color: 'inherit' }}>
                                {userName}
                          </a>
                      </CDBSidebarHeader>

                      <CDBSidebarContent className="sidebar-content">
                          <CDBSidebarMenu>
                              <NavLink exact to="/dashboard" activeClassName="activeClicked">
                                  <CDBSidebarMenuItem icon="columns">Dashboard</CDBSidebarMenuItem>
                              </NavLink>
                              <NavLink to="/attendance-report" activeClassName="activeClicked">
                                  <CDBSidebarMenuItem icon="chart-line">Attendance Report</CDBSidebarMenuItem>
                              </NavLink>
                              <NavLink to="/events" activeClassName="activeClicked">
                                  <CDBSidebarMenuItem icon="fas fa-sticky-note">Upcoming Events</CDBSidebarMenuItem>
                              </NavLink>
                          </CDBSidebarMenu>
                      </CDBSidebarContent>

                      <CDBSidebarFooter style={{ textAlign: 'center' }}>
                          {/* <div
                      style={{
                          padding: '20px 5px',
                      }}
                  >
                      Copyright @ 2022
                  </div> */}
                      </CDBSidebarFooter>
                  </CDBSidebar>
          }
      </div>
      
  )
}

export default Sidebar
