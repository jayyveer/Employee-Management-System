import React, { useCallback, useMemo, useState, useEffect } from 'react'
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Eventcalendar, getJson, toast } from '@mobiscroll/react';
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { Button, Form, Input, message, Modal, Popconfirm, Popover, Space, Table } from 'antd'
import { EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons";
import axios from 'axios'
import moment from 'moment'

const checkRole = localStorage.getItem('userRole')

const Events = () => {
    const checkRole = localStorage.getItem('userRole')
    const [data, setData] = useState()
    const [loading, setLoading] = useState(true)
    const [pageSize, setPageSize] = useState(7);
    const [page, setPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchEvents()
    }, [])

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
        axios.post('http://localhost:5000/events', values)
            .then((posRes) => {
                message.success('Event Added!')
                fetchEvents()
                setLoading(false)
            }, (errRes) => {
                console.log("----------Error---------", errRes);
            })
        setOpen(false);
    };

    const fetchEvents = () => {
        axios.get('http://localhost:5000/events')
            .then((posRes) => {
                console.log("API inside", posRes.data.data);
                setData(posRes.data.data)
                setLoading(false)
            }, (errRes) => {
                console.log("----------Error---------", errRes);
            })
    }

    const deleteEvent = (record) => {
        console.log(record);
        setLoading(true)
        axios.delete(`http://localhost:5000/events/${record.id}`, {})
            .then(() => {
                console.log("Delete succesfull");
                message.error('Event deleted')
                fetchEvents()
            }, (errRes) => {
                console.log("Error", errRes);
            });
    }

    const columns = [
        {
            title: "S no.",
            dataIndex: "sno",
            render: (value, item, index) => {
                return (page - 1) * 7 + index + 1
            }
        },
        {
            title: "Name",
            dataIndex: "title",
            
        },
        {
            title: "Date",
            dataIndex: "start",
            render: (start) => {
                start = moment(start).format("DD-MM-YYYY")
                return <>{start } </>
            },
        },
        {
            title: "Actions",
            render: (record) => {
                return (
                    <>
                        {/* <EditOutlined/> */}
                        <Popconfirm title="Sure to delete?" onConfirm={() => deleteEvent(record)}>
                            <DeleteOutlined style={{ color: "red", marginLeft: 12 }} />
                        </Popconfirm>
                    </>
                );
            }
        }

    ]

    /**
     * User evetns functions
     */
    const onEventClick = useCallback((event) => {
        toast({
            message: event.event.title
        });
    }, []);

    const view = useMemo(() => {
        return {
            calendar: { labels: true }
        };
    }, []);

    const events = [
    { "start":"2023-01-02T08:00:00.000Z",  "title":"Business of Software Conference"},
    { "start":"2022-12-31T12:00:00.000Z", "end":"2023-01-01T20:00:00.000Z", "title":"Friends binge marathon", "color":"#7bde83"}, 
    { "start":"2023-01-07T12:00:00.000Z", "end":"2023-01-08T20:00:00.000Z", "title":"Friends binge marathon", "color":"#7bde83"},
    { "start":"2022-12-29T08:00:00.000Z", "end":"2022-12-29T09:00:00.000Z", "title":"Product team mtg.", "color":"#913aa7"}, 
    { "start":"2022-12-29T10:00:00.000Z", "end":"2022-12-29T11:00:00.000Z", "title":"Green box to post office", "color":"#6e7f29"}, 
    { "start":"2022-12-29T13:00:00.000Z", "end":"2022-12-29T14:00:00.000Z", "title":"Lunch @ Butcher's", "color":"#bb0000"}, 
    { "start":"2022-12-29T15:00:00.000Z", "end":"2022-12-29T16:00:00.000Z", "title":"Status Update Meeting", "color":"#00aabb"}, 
    { "start":"2022-12-29T09:00:00.000Z", "end":"2022-12-29T10:00:00.000Z", "title":"Board meeting", "color":"#cfc014"}, 
    { "start":"2022-12-29T19:00:00.000Z", "end":"2022-12-29T21:00:00.000Z", "title":"Pizza Night", "color":"#d7be0d"}, 
    { "start":"2022-12-29T17:00:00.000Z", "end":"2022-12-29T18:00:00.000Z", "title":"Clever Conference", "color":"#a71111"}, 
    { "start":"2022-12-28T07:45:00.000Z", "end":"2022-12-28T09:00:00.000Z", "title":"Quick mtg. with Martin", "color":"#de3d83"}, 
    { "start":"2022-12-08T08:30:00.000Z", "end":"2022-12-08T09:30:00.000Z", "title":"Product team mtg.", "color":"#f67944"}, 
    { "start":"2022-12-08T10:00:00.000Z", "end":"2022-12-08T10:45:00.000Z", "title":"Stakeholder mtg.", "color":"#a144f6"}, 
    { "recurring": { "repeat":"yearly", "month":12, "day":14}, "allDay":true, "title":"Dexter BD", "color":"#37bbe4"}, 
    { "recurring": { "repeat":"yearly", "month":12, "day":25}, "allDay":true, "title":"Luke BD", "color":"#37bbe4"}, 
    { "recurring": { "repeat":"weekly", "weekDays":"WE"}, "allDay":true, "title":"Employment (Semi-weekly)", "color":"#228c73"}, 
    { "start":"2022-12-09T23:00:00.000Z", "end":"2022-12-14T23:00:00.000Z", "allDay":true, "title":"Sam OFF", "color":"#ca4747"}, 
    { "start":"2022-12-17T23:00:00.000Z", "end":"2022-12-28T23:00:00.000Z", "allDay":true, "title":"Europe tour", "color":"#56ca70"}, 
    { "start":"2022-02-06T23:00:00.000Z", "end":"2022-02-24T23:00:00.000Z", "allDay":true, "title":"Dean OFF", "color":"#99ff33"}, 
    { "start":"2022-03-04T23:00:00.000Z", "end":"2022-03-13T23:00:00.000Z", "allDay":true, "title":"Mike OFF", "color":"#e7b300"}, 
    { "start":"2022-05-06T22:00:00.000Z", "end":"2022-05-15T22:00:00.000Z", "allDay":true, "title":"John OFF", "color":"#669900"}, 
    { "start":"2022-05-31T22:00:00.000Z", "end":"2022-06-10T22:00:00.000Z", "allDay":true, "title":"Carol OFF", "color":"#6699ff"}, 
    { "start":"2022-07-01T22:00:00.000Z", "end":"2022-07-16T22:00:00.000Z", "allDay":true, "title":"Jason OFF", "color":"#cc9900"}, 
    { "start":"2022-08-05T22:00:00.000Z", "end":"2022-08-13T22:00:00.000Z", "allDay":true, "title":"Ashley OFF", "color":"#339966"}, 
    { "start":"2022-09-09T22:00:00.000Z", "end":"2022-09-19T22:00:00.000Z", "allDay":true, "title":"Marisol OFF", "color":"#8701a9"}, 
    { "start":"2022-09-30T22:00:00.000Z", "end":"2022-10-11T22:00:00.000Z", "allDay":true, "title":"Sharon OFF", "color":"#cc6699"}, 
    { "recurring": { "repeat":"yearly", "month":12, "day":25}, "allDay":true, "title":"Christmas Day", "color":"#ff0066"}, 
    { "recurring": { "repeat":"yearly", "month":1, "day":1}, "allDay":true, "title":"New Year's day", "color":"#99ccff"}, 
    { "recurring": { "repeat":"yearly", "month":4, "day":1}, "allDay":true, "title":"April Fool's Day", "color":"#ff6666"}, 
    { "recurring": { "repeat":"yearly", "month":11, "day":2}, "allDay":true, "title":"File Form 720 for the third quarter", "color":"#147ea6"}, 
    { "recurring": { "repeat":"yearly", "month":11, "day":2}, "allDay":true, "title":"File Form 730 and pay tax on wagers accepted during September", "color":"#a73a4e"}, 
    { "recurring": { "repeat":"yearly", "month":11, "day":2}, "allDay":true, "title":"File Form 2290 and pay the tax for vehicles first used during September", "color":"#218e0d"}, 
    { "recurring": { "repeat":"yearly", "month":11, "day":2}, "allDay":true, "title":"File Form 941 for the third quarter", "color":"#a67914"}, 
    { "recurring": { "repeat":"yearly", "month":11, "day":2}, "allDay":true, "title":"Deposit FUTA owed through Sep if more than $500", "color":"#3c0707"}, 
    { "recurring": { "repeat":"yearly", "month":11, "day":30}, "allDay":true, "title":"Deposit payroll tax for payments on Nov 21-24 if the semiweekly deposit rule applies", "color":"#14a618"}, 
    { "recurring": { "repeat":"yearly", "month":11, "day":30}, "allDay":true, "title":"File Form 730 and pay tax on wagers accepted during October", "color":"#722ac1"}, 
    { "recurring": { "repeat":"yearly", "month":11, "day":30}, "allDay":true, "title":"File Form 2290 and pay the tax for vehicles first used during October", "color":"#256069"}
]
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
                                      <h4 className="m-0 h5 font-weight-bold text-dark">Events</h4>
                                      <div className="py-1 px-2 bg-grey rounded-circle"><i className="fas fa-suitcase"></i></div>
                                  </div>
                                  <div className="card-bg w-100 border d-flex flex-column p-4" style={{ gridRow: "span 2" }}>

                                      <Button type="primary" style={{ marginBottom: 16 }} onClick={showModal}>
                                          Add Event
                                      </Button>
                                      <Modal
                                          title="Add New Event"
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
                                                  rules={[{ required: true, message: 'Please enter Event' }]}
                                              >
                                                  <Input />
                                              </Form.Item>
                                              <Form.Item
                                                  name="date"
                                                  label="Date"
                                                  rules={[{ required: true, message: 'Please enter Date of the event' }]}
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
                      </>
                      :
                      <>
                          <div className="card-bg w-100 border d-flex flex-column">
                              <div className="p-4 d-flex flex-column h-100">
                                  <div className="d-flex align-items-center justify-content-between">
                                      <h4 className="m-0 h5 font-weight-bold text-dark">Upcoming Events</h4>
                                      <div className="py-1 px-2 bg-grey rounded-circle"><i className="fas fa-suitcase"></i></div>
                                  </div>
                                  <div className="card-bg w-100 border d-flex flex-column p-4" style={{ gridRow: "span 2" }}>
                                      <Eventcalendar
                                          theme="windows"
                                          themeVariant="light"
                                          clickToCreate={false}
                                          dragToCreate={false}
                                          dragToMove={false}
                                          dragToResize={false}
                                          eventDelete={false}
                                          data={data}
                                          view={view}
                                          onEventClick={onEventClick}
                                      />
                                  </div>
                              </div>
                          </div>
                      </>}
              </div>

          </div>
      </div>
  )
}

export default Events
