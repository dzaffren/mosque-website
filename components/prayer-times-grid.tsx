"use client"

import { useEffect, useState } from "react"

interface Prayer {
  name: string
  time: string
}

export function PrayerTimesGrid({ prayers }: { prayers: Prayer[] }) {
  const [currentPrayer, setCurrentPrayer] = useState<string>("")
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const checkCurrentPrayer = () => {
      const now = new Date()
      const currentMinutes = now.getHours() * 60 + now.getMinutes()
      const parseTime = (timeStr: string) => {
        const [time, modifier] = timeStr.split(' ')
        let [hours, minutes] = time.split(':').map(Number)
        if (modifier === 'PM' && hours !== 12) hours += 12
        if (modifier === 'AM' && hours === 12) hours = 0
        return hours * 60 + minutes
      }
      let active = "Isha"
      const fajrTime = parseTime(prayers[0].time)
      if (currentMinutes < fajrTime) {
        setCurrentPrayer("Isha")
        return
      }
      for (let i = 0; i < prayers.length; i++) {
        const prayerTime = parseTime(prayers[i].time)
        const nextPrayerTime = prayers[i + 1] ? parseTime(prayers[i + 1].time) : 9999
        if (currentMinutes >= prayerTime && currentMinutes < nextPrayerTime) {
          active = prayers[i].name
          break
        }
      }
      setCurrentPrayer(active)
    }
    checkCurrentPrayer()
    const interval = setInterval(checkCurrentPrayer, 60000)
    return () => clearInterval(interval)
  }, [prayers])

  if (!isMounted) return null

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {prayers.map((prayer) => {
        const isCurrent = currentPrayer === prayer.name
        return (
          <div 
            key={prayer.name} 
            className={`
              text-center p-3 rounded-xl flex-1 min-w-[110px] max-w-[150px]
              transition-all duration-300 group
              ${isCurrent 
                ? "bg-emerald-600 border-emerald-600 shadow-md scale-105" 
                : "bg-white border border-slate-100 hover:border-emerald-500 hover:shadow-md hover:-translate-y-1"
              }
            `}
          >
            <p className={`
              font-bold mb-1 text-[10px] uppercase tracking-widest transition-colors
              ${isCurrent ? "text-emerald-100" : "text-slate-400 group-hover:text-emerald-600"}
            `}>
              {prayer.name}
            </p>
            <p className={`
              text-xl font-bold transition-colors
              ${isCurrent ? "text-white" : "text-slate-800 group-hover:text-emerald-900"}
            `}>
              {prayer.time}
            </p>
            
            {isCurrent && (
              <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 text-white text-[9px] font-medium rounded-full">
                NOW
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}