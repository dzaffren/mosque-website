'use client'

import Link from 'next/link'
import React from 'react'

export const BackToSite = (props: any) => {
  return (
    <div className="nav-group" style={{ marginTop: '20px', padding: '0 12px' }}>
      <Link 
        href="/" 
        target="_blank" 
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          borderRadius: '8px',
          // 👇 Transparent background, blends with sidebar
          backgroundColor: 'transparent', 
          // 👇 Light gray text, similar to native links
          color: 'var(--theme-elevation-400)', 
          textDecoration: 'none',
          fontWeight: 500,
          fontSize: '0.9rem',
          border: '1px solid transparent',
          transition: 'all 0.2s ease',
        }}
        // Hover styles handled via inline CSS helper or classes if available
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--theme-elevation-150)'
          e.currentTarget.style.color = 'var(--theme-elevation-800)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = 'var(--theme-elevation-400)'
        }}
      >
        {/* Simple external link icon */}
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
          <polyline points="15 3 21 3 21 9"></polyline>
          <line x1="10" y1="14" x2="21" y2="3"></line>
        </svg>
        Visit Website
      </Link>
    </div>
  )
}