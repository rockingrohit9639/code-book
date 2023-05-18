---
to: client/src/pages/<%= parent %>/components/<%= name %>.tsx
---
import React from 'react'
import clsx from 'clsx'

type <%= h.changeCase.pascal(name) %>Props = {
  className?: string
  style?: React.CSSProperties
}

export default function <%= h.changeCase.pascal(name) %>({ className, style } : <%= h.changeCase.pascal(name) %>Props) {
  return (
    <div className={clsx(className)} style={style}>
      <div><%= h.changeCase.sentence(name) %></div>
    </div>
  )
}
