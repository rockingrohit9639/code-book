import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useCallback, useEffect } from 'react'
import constate from 'constate'
import { fetchPosts, fetchTrendingPosts, likePost, unlikePost, updateViews } from '~/queries/post'
import { Comment, Like, Post } from '~/types/post'
import { useSocketContext } from './use-socket'
import useError from './use-error'
import { useAuthContext } from './use-auth'
import { getMergedPosts } from '~/utils/post'

export function usePosts() {
  const { user } = useAuthContext()
  const { data, isLoading, error } = useQuery(['posts'], fetchPosts, {
    enabled: !!user,
  })
  const { data: trendingPosts } = useQuery(['trending-posts'], fetchTrendingPosts, {
    enabled: !!user,
  })

  const { socket } = useSocketContext()
  const queryClient = useQueryClient()
  const { handleError } = useError()

  /** Doing this manage all the posts in one context, so that we don't have to manage like or comments etc. */
  const allPosts = useQuery({
    queryKey: ['all-posts'],
    queryFn: () => getMergedPosts(data ?? [], trendingPosts ?? []),
    initialData: [...(data ?? [])],
    enabled: Boolean(data?.length),
  })

  /** Handling socket events */
  const handleLike = useCallback(
    (newLike: Like) => {
      queryClient.setQueryData<Post[]>(['all-posts'], (oldPosts) => {
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
      queryClient.setQueryData<Post[]>(['all-posts'], (oldPosts) => {
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
      queryClient.setQueryData<Post[]>(['all-posts'], (oldPosts) => {
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
      queryClient.setQueryData<Post[]>(['all-posts'], (oldPosts) => {
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

  /** Handling user requests */
  const likePostMutation = useMutation(likePost, {
    onError: handleError,
    onSuccess: (like) => {
      queryClient.setQueryData<Post[]>(['all-posts'], (prev) => {
        if (!prev) return []

        return prev.map((post) => {
          if (post.id === like.postId) {
            return { ...post, likes: [...post.likes, like] }
          }

          return post
        })
      })
    },
  })

  const unLikePostMutation = useMutation(unlikePost, {
    onError: handleError,
    onSuccess: (like) => {
      queryClient.setQueryData<Post[]>(['all-posts'], (prev) => {
        if (!prev) return []

        return prev.map((post) => {
          if (post.id === like.postId) {
            return { ...post, likes: post.likes.filter((_like) => _like.id !== like.id) }
          }

          return post
        })
      })
    },
  })

  const updateViewsMutation = useMutation(updateViews, {
    onSuccess: (post) => {
      queryClient.setQueryData<Post[]>(['all-posts'], (prev) => {
        if (!prev) return []

        return prev.map((_post) => {
          if (_post.id === post.id) {
            return { ..._post, views: _post.views + 1 }
          }

          return post
        })
      })
    },
  })

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
    allPosts: allPosts.data,
    posts: allPosts.data?.filter((post) => !post.isTrending),
    trendingPosts: allPosts.data?.filter((post) => post.isTrending),
    isLoading,
    error,
    likePostMutation,
    unLikePostMutation,
    updateViewsMutation,
  }
}

export const [PostsProvider, usePostsContext] = constate(usePosts)
