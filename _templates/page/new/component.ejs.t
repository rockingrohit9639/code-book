---
to: client/src/pages/<%= name %>/<%= name %>.tsx
---
export default function <%= h.changeCase.pascal(name) %>() {
  return (
    <div>
      <div><%= h.changeCase.sentence(name) %></div>
    </div>
  )
}
