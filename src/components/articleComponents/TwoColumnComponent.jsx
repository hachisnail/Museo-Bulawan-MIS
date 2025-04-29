// src/components/editor/TwoColumnComponent.jsx
import React from 'react'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'

const TwoColumnComponent = ({ node, updateAttributes, editor }) => {
  return (
    <NodeViewWrapper className="two-column-block">
      <div 
        className="two-column-container" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '1rem',
          border: '1px dashed #ccc',
          padding: '1rem',
          margin: '1rem 0',
          borderRadius: '4px'
        }}
      >
        <div className="column column-left" onClick={(e) => e.stopPropagation()}>
          <NodeViewContent className="content-left" as="div" />
        </div>
        <div className="column column-right" onClick={(e) => e.stopPropagation()}>
          <NodeViewContent className="content-right" as="div" />
        </div>
      </div>
    </NodeViewWrapper>
  )
}

export default TwoColumnComponent
