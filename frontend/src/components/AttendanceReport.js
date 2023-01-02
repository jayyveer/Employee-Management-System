import { Button, Space, Table } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { DatePicker, Input } from 'antd';
import moment from 'moment'
import { Excel } from 'antd-table-saveas-excel'
import tableExport from "antd-table-export";
import { CDBBtn } from 'cdbreact'
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Search } = Input;

const AttendanceReport = () => {
  const [data, setData] = useState()
  const [loading, setLoading] = useState(true)
  const [pageSize, setPageSize] = useState(6);
  const [page, setPage] = useState(1);
  const [dates, setDates] = useState([])

  const checkRole = localStorage.getItem('userRole')
  const token = localStorage.getItem("userToken")
  const id = localStorage.getItem('userId')
  const userName = localStorage.getItem('userName')
  const config = {
    headers: {
      'Authorization': token
    }
  };

  useEffect(() => {
    fetchAttendance()
  }, [])

  const adminColumns = [
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
          <div style={{ width: 190 }} >
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
      title: "Time In",
      dataIndex: "time_in",
      render: (time_in) => {
        var temp = new Date(time_in).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' })
        temp = moment(temp).format("HH:mm a")
        return <>{time_in ? temp : "-"} {time_in ? time_in.substring(0, 10) : ""}</>
      },
    },
    {
      title: "Time_out",
      dataIndex: "time_out",
      render: (time_out) => {
        var temp = new Date(time_out).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' })
        temp = moment(temp).format("HH:mm a")
        return <>{time_out ? temp : "-"} {time_out ? time_out.substring(0, 10) : ""}</>
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (time_in, a) => {
        return <>{a.time_in != null && a.time_out != null 
        ? "Present" : a.time_in != null && a.time_out == null ? 'Working': "Absent"}{console.log(a)}</>
      }
    }
  ]

  const userColumns = [
    {
      title: "S no.",
      dataIndex: "sno",
      render: (value, item, index) => {
        return (page - 1) * 10 + index + 1
      }

    },
    {
      title: "Date",
      dataIndex: "date",
      render: (date) => {
        return <> {date ? date.substring(0, 10) : ""}
        </>
      },
    },
    {
      title: "Time In",
      dataIndex: "time_in",
      render: (time_in) => {

        var temp = new Date(time_in).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' })
        temp = moment(temp).format("HH:mm a")
        return <>{time_in ? temp : "-"} </>
      },
    },
    {
      title: "Time_out",
      dataIndex: "time_out",
      render: (time_out) => {
        var temp = new Date(time_out).toLocaleString(undefined, { timeZone: 'Asia/Kolkata' })
        temp = moment(temp).format("HH:mm a")
        // console.log(temp)
        return <>{time_out ? temp : "-"} </>
      },
    },
    {
      title: "Total Working Hours",
      render: (records) => {
        return <>{records.time_out ? moment.utc(moment.duration(moment(records.time_out).diff(moment(records.time_in))).asMilliseconds()).format('HH:mm') : ""}</>

      }
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (time_in, a) => {
        return <>{a.time_in != null && a.time_out != null
          ? "Present" : a.time_in != null && a.time_out == null ? 'Working' : "Absent"}{console.log(a)}</>
      }
    }
  ]

  const onSearch = (value) => {
    if (value) {
      axios.get(`http://localhost:5000/sheet/search/${value}`, config)
        .then((posRes) => {
          console.log("API inside", posRes.data.data);
          setData(posRes.data.data)
          setLoading(false)
        }, (errRes) => {
          console.log("----------Error---------", errRes);
        })
    }
    else {
      fetchAttendance()
    }

  }

  const dateHandler = (values) => {
    if (values) {
      const date1 = values[0].format('YYYY-MM-DD')
      const date2 = values[1].format('YYYY-MM-DD')
      onSearchDate(date1, date2)
    }
    else {
      fetchAttendance()

    }
  }


  const onSearchDate = (date1, date2) => {
    if (checkRole == 1) {
      if (date1) {
        axios.get(`http://localhost:5000/sheet/dateRange/${date1}/${date2}`, config)
          .then((posRes) => {
            console.log("API inside", posRes.data.data);
            setData(posRes.data.data)
            setLoading(false)
          }, (errRes) => {
            console.log("----------Error---------", errRes);
          })
      }
      else {
        fetchAttendance()
      }
    }
    else {
      if (date1) {
        axios.get(`http://localhost:5000/sheet/userDateRange/${id}/${date1}/${date2}`, config)
          .then((posRes) => {
            console.log("API inside", posRes.data.data, date1, date2);
            setData(posRes.data.data)
            setLoading(false)
          }, (errRes) => {
            console.log("----------Error---------", errRes);
          })
      }
      else {
        fetchAttendance()
      }
    }
  }

  const fetchAttendance = () => {
    if (checkRole == 1) {
      axios.get('http://localhost:5000/sheet', config)
        .then((posRes) => {
          console.log("API inside", posRes.data.data);
          setData(posRes.data.data)
          setLoading(false)
        }, (errRes) => {
          console.log("----------Error---------", errRes);
        })
    }
    else {
      axios.get(`http://localhost:5000/sheet/${id}`, config)
        .then((posRes) => {
          console.log("API inside", posRes.data.data);
          setData(posRes.data.data)
          setLoading(false)
        }, (errRes) => {
          console.log("----------Error---------", errRes);
        })
    }

  }

  const handleExport = () => {
    // console.log("Clicked", data, adminColumns);
    // const excel = new Excel();
    // console.log(excel, "excel object");
    // excel
    //   .addSheet("test")
    //   .addColumns({adminColumns})
    //   .addDataSource({data}, {
    //     str2Percent: true
    //   })
    //   .saveAs("Attendance-Report.xlsx");
    // console.log(excel, "excel object");


    if (checkRole == 1) {
      const exportInstance = new tableExport(data, adminColumns);
      exportInstance.download("Admin-Attendance-Report", "xlsx");
    }
    else {
      console.log("data", data);
      for(var i = 0 ; i< data.length ; i++){
        data[i].time_in = moment(data[i].time_in).format("HH:mm a")
        data[i].time_out = moment(data[i].time_out).format("HH:mm a")
        data[i].date = moment(data[i].date).format("DD/MM/YYYY")
        console.log(data[i]);
      }
      var tableName = userName + "-Attendance-report"
      const exportInstance = new tableExport(data, userColumns);
      exportInstance.download(tableName, "xlsx");
    }
  };

  return (
    <div>
      <div className="dashboard d-flex">
        <div>
          <Sidebar />
        </div>
        <div style={{ flex: "1 1 auto", display: "flex", flexFlow: "column", height: "100vh", overflowY: "hidden" }}>
          <Navbar />
          {checkRole == 1
            ? <>
              <div className="card-bg w-100 border d-flex flex-column">
                <div className="p-4 d-flex flex-column h-100">
                  <div className="d-flex align-items-center justify-content-between">
                    <h4 className="m-0 h5 font-weight-bold text-dark">Attendance Report</h4>
                    <div className="py-1 px-2 bg-grey rounded-circle"><i className="fas fa-suitcase"></i></div>
                  </div>
                  <div className="card-bg w-100 border d-flex flex-column p-4" style={{ gridRow: "span 2" }}>

                    <div className='p-3 d-flex justify-content-around'>
                      {/* <Search placeholder="Search User" allowClear onSearch={onSearch} style={{ width: 200 }} /> */}
                      <RangePicker
                        allowClear={true}
                        onChange={dateHandler}
                      />
                      <Button onClick={handleExport}>Export to excel</Button>
                    </div>

                    <Table
                      loading={loading}
                      columns={adminColumns}
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
            </>
            :
            <>
              <div className="card-bg w-100 border d-flex flex-column">
                <div className="p-4 d-flex flex-column h-100">
                  <div className="d-flex align-items-center justify-content-between">
                    <h4 className="m-0 h5 font-weight-bold text-dark">{userName}'s Attendance Report</h4>
                    <div className="py-1 px-2 bg-grey rounded-circle"><i className="fas fa-suitcase"></i></div>
                  </div>
                  <div className="card-bg w-100 border d-flex flex-column p-4" style={{ gridRow: "span 2" }}>

                    <div className='p-3 d-flex justify-content-around'>
                      <RangePicker
                        allowClear={true}
                        onChange={dateHandler}
                      />
                      <Button onClick={handleExport}>Export to excel</Button>
                    </div>
                    <Table
                      loading={loading}
                      columns={userColumns}
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
            </>}
        </div>

      </div>
    </div>
  )
}

export default AttendanceReport
