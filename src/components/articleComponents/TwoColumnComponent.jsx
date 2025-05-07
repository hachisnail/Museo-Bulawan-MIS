// TwoColumnComponent.jsx
import React from 'react'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'

const TwoColumnComponent = () => {
  return (
    <NodeViewWrapper className="two-column-wrapper">
      {/* You can style `.two-column-grid` with your two-column layout: grid/flex/etc. */}
      <div className="two-column-grid">
        {/* Left column -> child #0 */}
        <div data-type="column-left" className="column column-left">
          <NodeViewContent nodeKey="0" className="content-left" />
        </div>
        {/* Right column -> child #1 */}
        <div data-type="column-right" className="column column-right">
          <NodeViewContent nodeKey="1" className="content-right" />
        </div>
      </div>
    </NodeViewWrapper>
  )
}

export default TwoColumnComponent
