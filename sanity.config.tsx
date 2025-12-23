'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './sanity/schemaTypes'

// 1. Define a simple Custom Navbar Component
const CustomNavbar = (props: any) => {
  return (
    <div className="flex flex-col">
      {/* The "Back to Website" Link */}
      <div 
        style={{ 
          backgroundColor: '#101112', 
          padding: '12px 20px', 
          borderBottom: '1px solid #2a2c30',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <a 
          href="/" 
          style={{ 
            color: '#ececec', 
            textDecoration: 'none', 
            fontSize: '14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px'
          }}
        >
          {/* Simple Left Arrow SVG */}
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Website
        </a>
      </div>
      
      {/* Render the default Sanity Navbar below it */}
      {props.renderDefault(props)}
    </div>
  )
}

export default defineConfig({
  name: 'default',
  title: 'Mosque Admin',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  basePath: '/admin',

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },

  // 2. Register the Custom Component here
  studio: {
    components: {
      navbar: CustomNavbar
    }
  }
})