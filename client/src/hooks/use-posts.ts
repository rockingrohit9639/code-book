import { useQuery, useQueryClient } from 'react-query'
import { useEffect } from 'react'
import { fetchPosts } from '~/queries/post'
import { Comment, Like, Post } from '~/types/post'
import { useSocketContext } from './use-socket'

export function usePosts() {
  const { data, isLoading, error } = useQuery(['posts'], fetchPosts)
  const { socket } = useSocketContext()
  const queryClient = useQueryClient()

  useEffect(
    function listenToLikesOrDislikes() {
      /** Listening to new likes */
      const likeEvent = socket.on('like', (newLike: Like) => {
        queryClient.setQueryData<Post[]>(['posts'], (oldPosts) => {
          if (!oldPosts) {
            return []
          }

          return oldPosts.map((post) => {
            if (post.id === newLike.postId) {
              return { ...post, likes: [...post.likes, newLike] }
            }
            return post
          })
        })
      })

      /** Listening to dislikes */
      const dislikeEvent = socket.on('dislike', (dislike: Like) => {
        queryClient.setQueryData<Post[]>(['posts'], (oldPosts) => {
          if (!oldPosts) {
            return []
          }

          return oldPosts.map((post) => {
            if (post.id === dislike.postId) {
              return { ...post, likes: post.likes.filter((like) => like.id !== dislike.id) }
            }
            return post
          })
        })
      })

      /** Listening to new comments */
      const commentEvent = socket.on('comment', (newComment: Comment) => {
        queryClient.setQueryData<Post[]>(['posts'], (oldPosts) => {
          if (!oldPosts) {
            return []
          }

          return oldPosts.map((post) => {
            if (post.id === newComment.postId) {
              return { ...post, comments: [...post.comments, newComment] }
            }
            return post
          })
        })
      })

      /** Listening to remove comments */
      const removeCommentEvent = socket.on('remove-comment', (deletedComment: Comment) => {
        queryClient.setQueryData<Post[]>(['posts'], (oldPosts) => {
          if (!oldPosts) {
            return []
          }

          return oldPosts.map((post) => {
            if (post.id === deletedComment.postId) {
              return { ...post, comments: post.comments.filter((comment) => comment.id !== deletedComment.id) }
            }
            return post
          })
        })
      })

      return () => {
        likeEvent.off()
        dislikeEvent.off()
        commentEvent.off()
        removeCommentEvent.off()
      }
    },
    [queryClient, socket],
  )

  return {
    posts: data,
    isLoading,
    error,
  }
}
