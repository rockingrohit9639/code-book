import { Button, Result, Tabs } from 'antd'
import { useQuery } from 'react-query'
import { Link, useParams } from 'react-router-dom'
import { AiOutlineGlobal, AiOutlineGithub, AiOutlineLinkedin } from 'react-icons/ai'
import { EditOutlined } from '@ant-design/icons'
import { BiBookmark, BiGridAlt } from 'react-icons/bi'
import Loading from '~/components/loading'
import Page from '~/components/page'
import { fetchProfile } from '~/queries/user'
import { getErrorMessage } from '~/utils/error'
import UpdateProfileModal from '~/components/update-profile-modal'
import { useUser } from '~/hooks/use-user'
import Post from '~/components/post'

export default function Profile() {
  const { id } = useParams() as { id: string }
  const { user } = useUser()

  const profile = useQuery(['profile', id], () => fetchProfile(id))

  if (profile.isLoading) {
    return <Loading title="Loading user profile...." />
  }

  if (profile.error) {
    return <Result status="500" title="Something went wrong" subTitle={getErrorMessage(profile.error)} />
  }

  return (
    <Page className="space-y-4 py-4">
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
              <div className="font-medium">{profile.data?.followers?.length ?? 0}</div>
              <div>followers</div>
            </div>
            <div className="flex gap-2">
              <div className="font-medium">{profile.data?.following?.length ?? 0}</div>
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
        </div>

        <div className="col-span-1 self-start">
          {profile.data?.id === user.id ? (
            <UpdateProfileModal
              profileId={profile.data?.id!}
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
