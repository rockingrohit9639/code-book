import { Result } from 'antd'
import { range } from 'lodash'
import { useEffect, useMemo } from 'react'
import { useQuery, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import Page from '~/components/page'
import Post from '~/components/post'
import useError from '~/hooks/use-error'
import { useGlobalSocket } from '~/hooks/use-global-socket'
import { fetchPosts } from '~/queries/post'
import { Comment, Like, Post as PostType } from '~/types/post'

export default function Home() {
  const { getErrorMessage } = useError()
  const posts = useQuery(['posts'], fetchPosts)
  const { socket } = useGlobalSocket()
  const queryClient = useQueryClient()

  useEffect(
    function listenToLikesOrDislikes() {
      /** Listening to new likes */
      const likeEvent = socket.on('like', (newLike: Like) => {
        queryClient.setQueryData<PostType[]>(['posts'], (oldPosts) => {
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
        queryClient.setQueryData<PostType[]>(['posts'], (oldPosts) => {
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
        queryClient.setQueryData<PostType[]>(['posts'], (oldPosts) => {
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
        queryClient.setQueryData<PostType[]>(['posts'], (oldPosts) => {
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

  const content = useMemo(() => {
    if (posts.isLoading) {
      return range(5).map((_, idx) => <div key={idx} className="h-96 w-full animate-pulse rounded-2xl bg-gray-300" />)
    }

    if (posts.error) {
      return (
        <Result
          status="500"
          title="Something went wrong while fetching posts"
          subTitle={getErrorMessage(posts.error)}
        />
      )
    }

    return posts?.data?.map((post) => <Post key={post.id} post={post} />)
  }, [posts, getErrorMessage])

  return (
    <Page isFullScreen isHeroSection className="grid grid-cols-12">
      <div className="col-span-3 hidden lg:block" />
      <div className="col-span-full space-y-4 border-l-2 border-r-2 p-4 lg:col-span-6">
        <div className="mb-4 flex items-center justify-center rounded-2xl border-2 bg-white p-4">
          <Link to="/create-new-post" className="bg-primary text-background rounded-full px-4 py-2 shadow">
            Create New Post
          </Link>
        </div>

        {content}
      </div>
      <div className="col-span-3 hidden lg:block" />
    </Page>
  )
}
