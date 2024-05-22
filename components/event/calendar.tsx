interface ScheduleItemProps {
  title: string
  startTime: number
  endTime: number
}

function ScheduleItem({ title, startTime, endTime }: ScheduleItemProps) {
  return (
    <div className="p-2 rounded-lg flex-grow bg-purple-100" style={{ maxHeight: "72px" }}>
      <div className="capitalize text-sm text-purple-800">{title}</div>
      <div className="text-sm text-purple-600">{`${formatTime(startTime)} - ${formatTime(endTime)}`}</div>
    </div>
  )
}

interface ScheduleProps {
  events: { title: string; startTime: number; endTime: number }[]
}

function formatTime(time: number): string {
  const hour = time % 12 || 12
  const period = time < 12 || time === 24 ? "AM" : "PM"
  return `${hour}:00 ${period}`
}

export function Schedule({ events }: ScheduleProps) {
  const minTime = Math.min(...events.map(event => event.startTime))
  const maxTime = Math.max(...events.map(event => event.endTime))

  const generateTimeLabels = (start: number, end: number): number[] => {
    const times = []
    for (let i = start; i <= end; i++) {
      times.push(i)
    }
    return times
  }

  const times = generateTimeLabels(minTime, maxTime)

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex flex-col gap-3 justify-between">
        {times.map((time, index) => (
          <div key={index} className="text-xs text-zinc-400">{formatTime(time)}</div>
        ))}
      </div>
      <div className="flex flex-col gap-1 w-full">
        {events.map((event, index) => (
          <ScheduleItem
            key={index}
            title={event.title}
            startTime={event.startTime}
            endTime={event.endTime}
          />
        ))}
      </div>
    </div>
  )
}