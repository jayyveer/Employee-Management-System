import React, { useCallback, useMemo, useState } from 'react'
import '@mobiscroll/react/dist/css/mobiscroll.min.css';
import { Eventcalendar, getJson, toast } from '@mobiscroll/react';

const Calender = () => {
    const [myEvents, setEvents] = useState([]);

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = () => {
        axios.get('http://localhost:5000/events')
            .then((posRes) => {
                console.log("API inside", posRes.data.data);
                setEvents(posRes.data.data)
                // setLoading(false)
            }, (errRes) => {
                console.log("----------Error---------", errRes);
            })
    }
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

  return (
      <Eventcalendar
          theme="ios"
          themeVariant="light"
          clickToCreate={false}
          dragToCreate={false}
          dragToMove={false}
          dragToResize={false}
          eventDelete={false}
          data={myEvents}
          view={view}
          onEventClick={onEventClick}
      />
  )
}

export default Calender
