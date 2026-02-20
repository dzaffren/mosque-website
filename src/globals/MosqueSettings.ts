import type { GlobalConfig } from 'payload'

export const MosqueSettings: GlobalConfig = {
  slug: 'mosque-settings',
  label: 'Mosque Settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'whatsappGroupUrl',
      type: 'text',
      admin: { description: 'WhatsApp group invite link (e.g. https://chat.whatsapp.com/...)' },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      defaultValue: 'Masjid Al-Iman',
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'A place of worship, community, and learning',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'mapCoordinates',
      type: 'group',
      fields: [
        { name: 'lat', type: 'number', defaultValue: 3.139 },
        { name: 'lng', type: 'number', defaultValue: 101.6869 },
      ],
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'facebook', type: 'text' },
        { name: 'instagram', type: 'text' },
        { name: 'youtube', type: 'text' },
        { name: 'twitter', type: 'text' },
      ],
    },
    {
      name: 'about',
      type: 'group',
      fields: [
        { name: 'history', type: 'richText' },
        { name: 'mission', type: 'richText' },
      ],
    },
    {
      name: 'donation',
      type: 'group',
      fields: [
        { name: 'bankName', type: 'text' },
        { name: 'accountName', type: 'text' },
        { name: 'accountNumber', type: 'text' },
        { name: 'description', type: 'richText' },
        { name: 'paymentLink', type: 'text' },
        {
          name: 'qrImage',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'DuitNow / bank QR code image for scan-to-pay' },
        },
      ],
    },
    {
      name: 'jumuah',
      type: 'group',
      fields: [
        { name: 'time', type: 'text', defaultValue: '1:00 PM' },
        { name: 'guidelines', type: 'richText' },
      ],
    },
    {
      name: 'sermonPortal',
      type: 'group',
      fields: [
        { name: 'name', type: 'text', defaultValue: 'e-Khutbah JAIS', admin: { description: 'Name of the sermon portal (e.g. e-Khutbah JAIS)' } },
        { name: 'url', type: 'text', defaultValue: 'https://e-khutbah.jais.gov.my/senarai-khutbah-jumaat/', admin: { description: 'URL to the sermon portal' } },
      ],
    },
  ],
}
