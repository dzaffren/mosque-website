"use client"

import { useEffect, useState } from "react"
import { Timer } from "lucide-react"

interface Prayer {
  name: string
  time: string
}

interface CountdownProps {
  prayers: Prayer[]
}

export function NextPrayerCountdown({ prayers }: CountdownProps) {
  const [nextPrayer, setNextPrayer] = useState<Prayer | null>(null)
  const [timeObj, setTimeObj] = useState({ h: "00", m: "00", s: "00" })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    // ... (Keep existing logic exactly the same) ...
    const calculateNextPrayer = () => {
      const now = new Date()
      const currentMinutes = now.getHours() * 60 + now.getMinutes()
      const currentSeconds = now.getSeconds()

      let foundNext = false
      for (const prayer of prayers) {
        const prayerMinutes = parseTime(prayer.time)
        if (prayerMinutes > currentMinutes) {
          setNextPrayer(prayer)
          updateTimer(prayerMinutes, currentMinutes, currentSeconds)
          foundNext = true
          break
        }
      }
      if (!foundNext && prayers.length > 0) {
        const fajr = prayers[0]
        setNextPrayer(fajr)
        const fajrMinutesTomorrow = parseTime(fajr.time) + (24 * 60)
        updateTimer(fajrMinutesTomorrow, currentMinutes, currentSeconds)
      }
    }
    const parseTime = (timeStr: string) => {
      const [time, modifier] = timeStr.split(' ')
      let [hours, minutes] = time.split(':').map(Number)
      if (modifier === 'PM' && hours !== 12) hours += 12
      if (modifier === 'AM' && hours === 12) hours = 0
      return hours * 60 + minutes
    }
    const updateTimer = (targetMinutes: number, currentMinutes: number, currentSeconds: number) => {
      let diffMinutes = targetMinutes - currentMinutes - 1
      let diffSeconds = 60 - currentSeconds
      if (diffSeconds === 60) {
        diffSeconds = 0
        diffMinutes += 1
      }
      const h = Math.floor(diffMinutes / 60)
      const m = diffMinutes % 60
      const sStr = diffSeconds < 10 ? `0${diffSeconds}` : diffSeconds.toString()
      const mStr = m < 10 ? `0${m}` : m.toString()
      const hStr = h.toString()
      setTimeObj({ h: hStr, m: mStr, s: sStr })
    }
    calculateNextPrayer()
    const timer = setInterval(calculateNextPrayer, 1000)
    return () => clearInterval(timer)
  }, [prayers])

  if (!isMounted || !nextPrayer) return null

  return (
    <div className="flex flex-col items-center justify-center pt-2 pb-0 space-y-4">
      
      {/* 1. Header Pill: Smaller padding */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-100">
        <Timer className="w-3 h-3" />
        <span>Next Prayer: <span className="uppercase font-bold">{nextPrayer.name}</span></span>
      </div>

      {/* 2. THE TIMER: Smaller Fonts */}
      <div className="flex items-start gap-1 md:gap-3">
        <TimeBlock value={timeObj.h} label="Hours" />
        <span className="text-3xl md:text-5xl font-bold text-emerald-300 mt-[-2px]">:</span>
        <TimeBlock value={timeObj.m} label="Minutes" />
        <span className="text-3xl md:text-5xl font-bold text-emerald-300 mt-[-2px]">:</span>
        <TimeBlock value={timeObj.s} label="Seconds" />
      </div>
    </div>
  )
}

function TimeBlock({ value, label }: { value: string, label: string }) {
  return (
    <div className="flex flex-col items-center w-16 md:w-20">
      {/* Reduced font size: text-4xl / text-6xl */}
      <span className="text-4xl md:text-6xl font-bold text-emerald-950 tabular-nums tracking-tight leading-none">
        {value}
      </span>
      {/* Reduced label size */}
      <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mt-1">
        {label}
      </span>
    </div>
  )
}