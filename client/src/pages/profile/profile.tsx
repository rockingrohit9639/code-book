import { Button, Result, Tabs } from 'antd'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Link, useParams } from 'react-router-dom'
import { AiOutlineGlobal, AiOutlineGithub, AiOutlineLinkedin } from 'react-icons/ai'
import { EditOutlined, UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons'
import { BiBookmark, BiGridAlt } from 'react-icons/bi'
import { useCallback, useMemo } from 'react'
import invariant from 'tiny-invariant'
import Loading from '~/components/loading'
import Page from '~/components/page'
import { fetchProfile, follow, removeFollower, unfollow } from '~/queries/user'
import { getErrorMessage } from '~/utils/error'
import UpdateProfileModal from '~/components/update-profile-modal'
import { useUser } from '~/hooks/use-user'
import Post from '~/components/post'
import useError from '~/hooks/use-error'
import { UserWithoutSensitiveData } from '~/types/user'

export default function Profile() {
  const { username } = useParams() as { username: string }
  const { user } = useUser()
  const { handleError } = useError()
  const queryClient = useQueryClient()
  const profile = useQuery(['profile', username], () => fetchProfile(username))

  const followMutation = useMutation(follow, {
    onError: handleError,
    onSuccess: () => {
      /** Saving the followed user in current user's following */
      queryClient.setQueryData<UserWithoutSensitiveData>(['logged-in'], (prevData) => {
        if (!prevData) {
          return {} as UserWithoutSensitiveData
        }

        invariant(profile.data?.id, 'Profile not found!')
        return { ...prevData, followingIds: [...prevData.followingIds, profile.data.id] }
      })

      /** Saving the current user in followed user's followers */
      queryClient.setQueryData<UserWithoutSensitiveData>(['profile', username], (prevData) => {
        if (!prevData) {
          return {} as UserWithoutSensitiveData
        }

        invariant(profile.data?.id, 'Profile not found!')
        return { ...prevData, followerIds: [...prevData.followerIds, profile.data.id] }
      })
    },
  })
  const unfollowMutation = useMutation(unfollow, {
    onError: handleError,
    onSuccess: () => {
      /** Removing the un-followed user from current user's following */
      queryClient.setQueryData<UserWithoutSensitiveData>(['logged-in'], (prevData) => {
        if (!prevData) {
          return {} as UserWithoutSensitiveData
        }

        return { ...prevData, followingIds: prevData.followingIds.filter((id) => id !== profile.data?.id) }
      })

      /** Removing the current user from un-followed user's followers */
      queryClient.setQueryData<UserWithoutSensitiveData>(['profile', username], (prevData) => {
        if (!prevData) {
          return {} as UserWithoutSensitiveData
        }

        return { ...prevData, followerIds: prevData.followerIds.filter((id) => id !== user.id) }
      })
    },
  })
  const removeFollowerMutation = useMutation(removeFollower, {
    onError: handleError,
    onSuccess: () => {
      /** Removing the profile user from current user's followers */
      queryClient.setQueryData<UserWithoutSensitiveData>(['logged-in'], (prevData) => {
        if (!prevData) {
          return {} as UserWithoutSensitiveData
        }

        return { ...prevData, followerIds: prevData.followerIds.filter((id) => id !== profile.data?.id) }
      })

      /** Removing the current user from profile user's followings */
      queryClient.setQueryData<UserWithoutSensitiveData>(['profile', username], (prevData) => {
        if (!prevData) {
          return {} as UserWithoutSensitiveData
        }

        return { ...prevData, followingIds: prevData.followingIds.filter((id) => id !== user.id) }
      })
    },
  })

  const showFollowButton = useMemo(() => {
    if (!user) {
      return false
    }

    if (user.username === username) {
      return false
    }

    if (user.followingIds.includes(profile.data?.id ?? '')) {
      return false
    }

    return true
  }, [user, username, profile.data?.id])

  const showUnfollowButton = useMemo(() => {
    if (!user) {
      return false
    }

    if (user.username === username) {
      return false
    }

    if (!user.followingIds.includes(profile.data?.id ?? '')) {
      return false
    }

    return true
  }, [profile.data?.id, user, username])

  const showRemoveFollowerButton = useMemo(() => {
    if (!user) {
      return false
    }

    if (user.username === username) {
      return false
    }

    if (!user.followerIds.includes(profile.data?.id ?? '')) {
      return false
    }

    return true
  }, [profile.data?.id, user, username])

  const handleFollowUnfollow = useCallback(() => {
    invariant(profile.data?.id, 'Profile not found!')
    if (showFollowButton) {
      followMutation.mutate(profile.data.id)
    } else {
      unfollowMutation.mutate(profile.data.id)
    }
  }, [followMutation, unfollowMutation, profile.data?.id, showFollowButton])

  if (profile.isLoading) {
    return <Loading title="Loading user profile...." />
  }

  if (profile.error) {
    return <Result status="500" title="Something went wrong" subTitle={getErrorMessage(profile.error)} />
  }

  return (
    <Page className="space-y-4 p-4">
      <div className="grid grid-cols-6 items-center gap-8">
        <img src="/code.png" className="col-span-2 h-60 w-60 rounded-full object-cover" />

        <div className="col-span-3 space-y-4">
          <div>
            <div className="font-bold">@{profile.data?.username}</div>
            <div>
              {profile.data?.firstName} {profile.data?.lastName}
            </div>
            <div className="text-sm text-gray-500">{profile.data?.bio}</div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex gap-2">
              <div className="font-medium">{profile.data?.posts?.length ?? 0}</div>
              <div>posts</div>
            </div>
            <div className="flex gap-2">
              <div className="font-medium">{profile.data?.followerIds.length ?? 0}</div>
              <div>followers</div>
            </div>
            <div className="flex gap-2">
              <div className="font-medium">{profile.data?.followingIds?.length ?? 0}</div>
              <div>following</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {profile.data?.website ? (
              <Link to={profile.data.website} target="_black" rel="noreferrer">
                <AiOutlineGlobal className="h-6 w-6" />
              </Link>
            ) : null}
            {profile.data?.github ? (
              <Link to={profile.data.github} target="_black" rel="noreferrer">
                <AiOutlineGithub className="h-6 w-6" />
              </Link>
            ) : null}
            {profile.data?.linkedin ? (
              <Link to={profile.data.linkedin} target="_black" rel="noreferrer">
                <AiOutlineLinkedin className="h-6 w-6" />
              </Link>
            ) : null}
          </div>

          <div className="flex items-center space-x-2">
            {showFollowButton ? (
              <Button type="primary" icon={<UserAddOutlined />} onClick={handleFollowUnfollow}>
                Follow
              </Button>
            ) : null}
            {showUnfollowButton ? (
              <Button icon={<UserDeleteOutlined />} onClick={handleFollowUnfollow}>
                Unfollow
              </Button>
            ) : null}
            {showRemoveFollowerButton ? (
              <Button
                danger
                icon={<UserDeleteOutlined />}
                onClick={() => {
                  if (profile.data?.id) {
                    removeFollowerMutation.mutate(profile.data.id)
                  }
                }}
              >
                Remove Follower
              </Button>
            ) : null}
          </div>
        </div>

        <div className="col-span-1 self-start">
          {profile.data?.id === user.id ? (
            <UpdateProfileModal
              profileUsername={profile.data?.username!}
              trigger={
                <Button type="primary" ghost icon={<EditOutlined />}>
                  Update Profile
                </Button>
              }
            />
          ) : null}
        </div>
      </div>
      <Tabs>
        <Tabs.TabPane
          tab={
            <div className="flex items-center space-x-2">
              <BiGridAlt />
              <div>Posts</div>
            </div>
          }
          key="posts"
        >
          <div className="space-y-4">
            {profile.data?.posts && profile.data.posts.length > 0
              ? profile.data.posts.map((post) => <Post key={post.id} post={post} />)
              : null}
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <div className="flex items-center space-x-2">
              <BiBookmark />
              <div>Saved</div>
            </div>
          }
          key="saved"
        />
      </Tabs>
    </Page>
  )
}
