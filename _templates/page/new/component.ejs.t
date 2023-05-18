---
to: client/src/pages/<%= name %>/<%= name %>.tsx
---
import React from 'react'

export default function <%= h.changeCase.pascal(name) %>() {
  return (
    <div>
      <div><%= h.changeCase.sentence(name) %></div>
    </div>
  )
}
