import { useQuery, useQueryClient } from 'react-query'
import { useCallback, useEffect } from 'react'
import { fetchPosts } from '~/queries/post'
import { Comment, Like, Post } from '~/types/post'
import { useSocketContext } from './use-socket'

export function usePosts() {
  const { data, isLoading, error } = useQuery(['posts'], fetchPosts)
  const { socket } = useSocketContext()
  const queryClient = useQueryClient()

  const handleLike = useCallback(
    (newLike: Like) => {
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
    },
    [queryClient],
  )

  const handleDislike = useCallback(
    (dislike: Like) => {
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
    },
    [queryClient],
  )

  const handleNewComment = useCallback(
    (newComment: Comment) => {
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
    },
    [queryClient],
  )

  const handleRemoveComment = useCallback(
    (deletedComment: Comment) => {
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
    },
    [queryClient],
  )

  useEffect(
    function listenToLikesOrDislikes() {
      /** Listening to new likes */
      socket.on('like', handleLike)

      /** Listening to dislikes */
      socket.on('dislike', handleDislike)

      /** Listening to new comments */
      socket.on('comment', handleNewComment)

      /** Listening to remove comments */
      socket.on('remove-comment', handleRemoveComment)

      return () => {
        socket.off('like', handleLike)
        socket.off('dislike', handleDislike)
        socket.off('comment', handleNewComment)
        socket.off('remove-comment', handleRemoveComment)
      }
    },
    [queryClient, socket, handleLike, handleDislike, handleNewComment, handleRemoveComment],
  )

  return {
    posts: data,
    isLoading,
    error,
  }
}
