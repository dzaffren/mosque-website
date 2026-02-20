import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function seed() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  console.log('🌱 Seeding database...')

  // Create admin user
  try {
    await payload.create({
      collection: 'users',
      data: {
        email: 'admin@mosque.com',
        password: 'changeme123',
      },
    })
    console.log('✅ Admin user created (admin@mosque.com / changeme123)')
  } catch {
    console.log('⏭️  Admin user already exists')
  }

  // Update mosque settings
  await payload.updateGlobal({
    slug: 'mosque-settings',
    data: {
      name: 'Masjid Al-Iman',
      tagline: 'A place of worship, community, and learning',
      address: '123 Jalan Masjid, Taman Bahagia\n50000 Kuala Lumpur, Malaysia',
      phone: '+60 12-345 6789',
      email: 'info@masjid-aliman.com',
      mapCoordinates: { lat: 3.139, lng: 101.6869 },
      socialLinks: {
        facebook: 'https://facebook.com/masjidaliman',
        instagram: 'https://instagram.com/masjidaliman',
      },
      donation: {
        bankName: 'Bank Islam Malaysia',
        accountName: 'Masjid Al-Iman',
        accountNumber: '1234-5678-9012',
      },
      jumuah: {
        time: '1:15 PM',
      },
    },
  })
  console.log('✅ Mosque settings updated')

  // Seed prayer times for this week
  const today = new Date()
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - today.getDay())

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + i)
    const dateStr = date.toISOString().split('T')[0]

    try {
      await payload.create({
        collection: 'prayer-times',
        data: {
          date: dateStr,
          fajr: '5:45 AM',
          dhuhr: '1:15 PM',
          asr: '4:45 PM',
          maghrib: '7:25 PM',
          isha: '8:45 PM',
          jumuah: date.getDay() === 5 ? '1:15 PM' : undefined,
        },
      })
    } catch {
      // Already exists
    }
  }
  console.log('✅ Prayer times seeded for this week')

  // Seed announcements
  const announcements = [
    { title: 'Ramadan Preparation Workshop', priority: 'high' as const },
    { title: 'Weekly Quran Circle Every Wednesday', priority: 'normal' as const },
    { title: 'Mosque Cleaning Day - Volunteers Needed', priority: 'normal' as const },
  ]

  for (const ann of announcements) {
    await payload.create({
      collection: 'announcements',
      data: {
        title: ann.title,
        date: new Date().toISOString(),
        priority: ann.priority,
      },
    })
  }
  console.log('✅ Announcements seeded')

  // Seed events
  const events = [
    {
      title: 'Community Iftar Dinner',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Main Hall',
      featured: true,
    },
    {
      title: 'Youth Islamic Quiz Night',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Community Room',
      featured: false,
    },
    {
      title: 'Weekend Arabic Class',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Classroom 1',
      featured: false,
    },
  ]

  for (const event of events) {
    await payload.create({ collection: 'events', data: event })
  }
  console.log('✅ Events seeded')

  // Seed staff
  const staff = [
    { name: 'Ustaz Ahmad bin Abdullah', role: 'imam' as const, bio: 'Imam of Masjid Al-Iman since 2015. Graduated from Al-Azhar University.', order: 1 },
    { name: 'Ustaz Muhammad Farid', role: 'ustaz' as const, bio: 'Quran teacher and youth program coordinator.', order: 2 },
    { name: 'Haji Ismail bin Omar', role: 'committee' as const, bio: 'Chairman of the mosque committee. Dedicated community leader.', order: 3 },
  ]

  for (const member of staff) {
    await payload.create({ collection: 'staff', data: member })
  }
  console.log('✅ Staff seeded')

  // Seed khutbah schedule
  const topics = ['The Importance of Taqwa', 'Brotherhood in Islam', 'Patience and Gratitude', 'Seeking Knowledge']
  const speakers = ['Ustaz Ahmad', 'Ustaz Muhammad Farid', 'Ustaz Ahmad', 'Guest Speaker']

  for (let i = 0; i < 4; i++) {
    const friday = new Date()
    friday.setDate(friday.getDate() + ((5 - friday.getDay() + 7) % 7) + i * 7)
    await payload.create({
      collection: 'khutbah-schedule',
      data: {
        date: friday.toISOString().split('T')[0],
        topic: topics[i],
        speaker: speakers[i],
      },
    })
  }
  console.log('✅ Khutbah schedule seeded')

  console.log('\n🎉 Seed complete! Visit /admin to manage content.')
  console.log('   Admin login: admin@mosque.com / changeme123')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
