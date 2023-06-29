export type Tag = {
  id: string
  createdAt: string
  updatedAt: string
  tag: string
}

export type CerateTagDto = Pick<Tag, 'tag'>
