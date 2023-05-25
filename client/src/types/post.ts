export type Post = {
  id: string
  title: string
  codeSnippet: string
}

export type CreatePostDto = Pick<Post, 'title' | 'codeSnippet'> & {
  imageBase64: string
}
