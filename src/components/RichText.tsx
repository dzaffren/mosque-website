import React from 'react'
import type { SerializedLexicalNode } from '@payloadcms/richtext-lexical/lexical'

interface RichTextProps {
  data: any
}

export function RichText({ data }: RichTextProps) {
  if (!data || !data.root) {
    return null
  }

  return <div>{serializeNodes(data.root.children)}</div>
}

function serializeNodes(nodes: SerializedLexicalNode[]): React.ReactNode[] {
  return nodes.map((node: any, i: number) => {
    if (node.type === 'text') {
      let text: React.ReactNode = node.text
      if (node.format & 1) text = <strong key={i}>{text}</strong>
      if (node.format & 2) text = <em key={i}>{text}</em>
      if (node.format & 8) text = <u key={i}>{text}</u>
      if (node.format & 4) text = <s key={i}>{text}</s>
      if (node.format & 16) text = <code key={i}>{text}</code>
      return text
    }

    const children = node.children ? serializeNodes(node.children) : []

    switch (node.type) {
      case 'paragraph':
        return <p key={i}>{children}</p>
      case 'heading':
        const Tag = (node.tag || 'h2') as keyof React.JSX.IntrinsicElements
        return <Tag key={i}>{children}</Tag>
      case 'list':
        if (node.listType === 'number') return <ol key={i}>{children}</ol>
        return <ul key={i}>{children}</ul>
      case 'listitem':
        return <li key={i}>{children}</li>
      case 'link':
        return (
          <a key={i} href={node.fields?.url || '#'} target={node.fields?.newTab ? '_blank' : undefined} rel={node.fields?.newTab ? 'noopener noreferrer' : undefined}>
            {children}
          </a>
        )
      case 'quote':
        return <blockquote key={i}>{children}</blockquote>
      case 'linebreak':
        return <br key={i} />
      default:
        return <span key={i}>{children}</span>
    }
  })
}
