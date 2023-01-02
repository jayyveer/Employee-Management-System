import React, { useEffect, useState, useRef } from 'react'
import Navbar from './Navbar'
import AdminSection from './AdminSection'
import Sidebar from './Sidebar'
import Screen404 from '../screens/Screen404'
import axios from 'axios'
import { Button, Form, Input, message, Modal, Popconfirm, Popover, Space, Table } from 'antd'
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import { Excel } from "antd-table-saveas-excel";

const EmployeeDetails = () => {
  const checkRole = localStorage.getItem('userRole')
  const [data, setData] = useState()
  const [loading, setLoading] = useState(true)
  const [pageSize, setPageSize] = useState(6);
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [form] = Form.useForm();
  

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {

    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        onCreate(values);
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });

  };

  const handleCancel = () => {
    setOpen(false);
  };

  const onCreate = (values) => {
    console.log('Received values of form: ', values);
    axios.post('http://localhost:5000/users', values, config)
      .then((posRes) => {
        message.success('User Added!')
        fetchUsers()
        setLoading(false)
      }, (errRes) => {
        console.log("----------Error---------", errRes);
      })
    setOpen(false);
  };

  const token = localStorage.getItem("userToken")
  const config = {
    headers: {
      'Authorization': token
    }
  };

  useEffect(() => {
    fetchUsers()
  }, [])
  
  const columns = [
    {
      title: "S no.",
      dataIndex: "sno",
      render: (value, item, index) => {
        return (page - 1) * 10 + index + 1
      }
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => {
        //to sort strings
        return a.name.localeCompare(b.name)
      },
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {

        return (
          <div style = {{ width:190}} >
            <Input
              className='m-1'
              size='small'
              autoFocus
              placeholder="Search"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onPressEnter={() => {
                confirm();
              }}
              onBlur={() => {
                confirm();
              }}
            ></Input>
            
            <Space className='p-1'>
              <Button
                type="primary"
                onClick={() => {
                  confirm();
                }}
                icon={<SearchOutlined />}
                size="small"
                style={{ width: 90 }}
              >
                Search
              </Button>
              <Button
                onClick={() => {
                  clearFilters();
                }}
                // type="danger"
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
              
            
            </Space>
          </div>
        );

      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.name.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Password",
      dataIndex: "password",
      render: (password) => {
        return(
        <>
        {console.log(password,"password")}
            <Input.Password value={password} className="border-0" readOnly
          />
        </>
        )
      }
    },
    {
      title: "Designation",
      dataIndex: "designation",
    },
    {
      title: "Department",
      dataIndex: "department",
    },
    {
      title: "Actions",
      render: (record) => {
        return (
          <>
            {/* <EditOutlined/> */}
            <Popconfirm title="Sure to delete?" onConfirm={() => deleteUser(record)}>
              <DeleteOutlined style={{ color: "red", marginLeft: 12 }} />
            </Popconfirm>
          </>
        );
      }
    }

  ]

  const fetchUsers = () => {
    axios.get('http://localhost:5000/users/employee', config)
      .then((posRes) => {
        console.log("API inside", posRes.data.data);
        setData(posRes.data.data)
        setLoading(false)
      }, (errRes) => {
        console.log("----------Error---------", errRes);
      })
  }

  const deleteUser = (record) => {
    console.log(record);
    setLoading(true)
    axios.delete(`http://localhost:5000/users/${record.id}`, {}, config)
      .then(() => {
        console.log("Delete succesfull");
        message.error('User deleted')
        fetchUsers()
      }, (errRes) => {
        console.log("Error", errRes);
      });
  }

  return (
    <div>
      <div className="dashboard d-flex">
        <div>
          <Sidebar />
        </div>
        <div style={{ flex: "1 1 auto", display: "flex", flexFlow: "column", height: "100vh", overflowY: "hidden" }}>
          <Navbar />
          {/* {checkRole == 1
            ? <>
            Employee table
            </>
            : <Screen404 />} */}
          <div className="card-bg w-100 border d-flex flex-column">
            <div className="p-4 d-flex flex-column h-100">
              <div className="d-flex align-items-center justify-content-between">
                <h4 className="m-0 h5 font-weight-bold text-dark">Manage Emplopyees</h4>
                <div className="py-1 px-2 bg-grey rounded-circle"><i className="fas fa-suitcase"></i></div>
              </div>
              <div className="card-bg w-100 border d-flex flex-column p-4" style={{ gridRow: "span 2" }}>

                <Button type="primary" style={{ marginBottom: 16 }} onClick={showModal}>
                  Add User
                </Button>
                <Modal
                  title="Add New User"
                  open={open}
                  style={{ top: 0 }}
                  onOk={handleOk}
                  confirmLoading={confirmLoading}
                  onCancel={handleCancel}
                >
                  <Form
                    form={form}
                    layout="vertical"
                    name="form_in_modal"
                    initialValues={{ modifier: 'public' }}
                  >
                    <Form.Item
                      name="name"
                      label="Name"
                      rules={[{ required: true, message: 'Please enter Name of the employee' }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[{ required: true, message: 'Please enter Email of the employee' }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[{ required: true, message: 'Please enter Password of the employee' }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="designation"
                      label="Designation"
                      rules={[{ required: true, message: 'Please enter Designation of the employee' }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="department"
                      label="Department"
                      rules={[{ required: true, message: 'Please enter Department of the employee' }]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="address"
                      label="Address"
                      rules={[{ required: true, message: 'Please enter Address of the employee' }]}
                    >
                      <Input />
                    </Form.Item>
                  </Form>
                </Modal>
                <Table
                  loading={loading}
                  columns={columns}
                  dataSource={data}
                  pagination={{
                    position: ['bottomCenter'],
                    scroll: { x: 1300 },
                    current: page,
                    pageSize: pageSize,
                    onChange: (page, pageSize) => {
                      setPage(page)
                      setPageSize(pageSize)
                    }
                  }}
                ></Table>

              </div>
            </div>
          </div>
          
        </div>

      </div>
    </div>
  )
}

export default EmployeeDetails
