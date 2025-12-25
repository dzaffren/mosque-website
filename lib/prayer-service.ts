// lib/prayer-service.ts

const LAT = 3.1123146 // Your coordinates
const LNG = 101.63408395
const METHOD = 3

export const to12Hour = (time24: string) => {
  const cleanTime = time24.split(' ')[0] 
  const [hours, minutes] = cleanTime.split(':')
  let h = parseInt(hours, 10)
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12
  h = h ? h : 12
  return `${h}:${minutes} ${ampm}`
}

export async function getDailyPrayerData() {
  const today = new Date()
  const dateStr = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`
  
  const res = await fetch(
    `http://api.aladhan.com/v1/timings/${dateStr}?latitude=${LAT}&longitude=${LNG}&method=${METHOD}`,
    { next: { revalidate: 3600 } } 
  )

  if (!res.ok) throw new Error('Aladhan Daily API failed')
  const json = await res.json()
  const { timings, date } = json.data

  return {
    gregorian: `${date.gregorian.weekday.en}, ${date.gregorian.day} ${date.gregorian.month.en} ${date.gregorian.year}`,
    hijri: `${date.hijri.day} ${date.hijri.month.en} ${date.hijri.year}`,
    prayers: [
      { name: "Fajr", time: to12Hour(timings.Fajr) },
      { name: "Sunrise", time: to12Hour(timings.Sunrise) },
      { name: "Dhuhr", time: to12Hour(timings.Dhuhr) },
      { name: "Asr", time: to12Hour(timings.Asr) },
      { name: "Maghrib", time: to12Hour(timings.Maghrib) },
      { name: "Isha", time: to12Hour(timings.Isha) },
    ]
  }
}

export async function getMonthlyPrayerData(month: string | number, year: string | number) {
  const res = await fetch(
    `http://api.aladhan.com/v1/calendar?latitude=${LAT}&longitude=${LNG}&method=${METHOD}&month=${month}&year=${year}`,
    { next: { revalidate: 86400 } }
  )

  if (!res.ok) throw new Error('Aladhan Monthly API failed')
  const json = await res.json()

  const days = json.data.map((item: any) => ({
    date: `${item.date.gregorian.day} ${item.date.gregorian.month.en} ${item.date.gregorian.year}`,
    weekday: item.date.gregorian.weekday.en,
    hijri: `${item.date.hijri.day} ${item.date.hijri.month.en}`,
    timings: {
      Fajr: to12Hour(item.timings.Fajr),
      Sunrise: to12Hour(item.timings.Sunrise),
      Dhuhr: to12Hour(item.timings.Dhuhr),
      Asr: to12Hour(item.timings.Asr),
      Maghrib: to12Hour(item.timings.Maghrib),
      Isha: to12Hour(item.timings.Isha),
    }
  }))

  return { days }
}