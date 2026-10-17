import { useEffect, useState } from 'react'

export default function LocalTime({ timeZone = 'Asia/Kolkata' }) {
  const [time, setTime] = useState('')
  useEffect(() => {
    const update = () => setTime(new Intl.DateTimeFormat('en-IN', { timeZone, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()))
    update()
    const timer = window.setInterval(update, 30000)
    return () => window.clearInterval(timer)
  }, [timeZone])
  return <time className="local-time" dateTime={new Date().toISOString()}>{time || '--:--'} IST</time>
}
