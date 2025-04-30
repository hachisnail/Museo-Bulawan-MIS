// components/editor/TwoColumnComponent.jsx
import React from 'react'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'

const TwoColumnComponent = () => {
  return (
    <NodeViewWrapper className="two-column-block">
      <div className="two-column-container">
        <div className="column column-left">
          <NodeViewContent className="content-left" />
        </div>
        <div className="column column-right">
          <NodeViewContent className="content-right" />
        </div>
      </div>
    </NodeViewWrapper>
  )
}

export default TwoColumnComponent
