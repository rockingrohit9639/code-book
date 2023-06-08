import { Result } from 'antd'
import { useQuery } from 'react-query'
import { Link, useParams } from 'react-router-dom'
import { BiGlobe } from 'react-icons/bi'
import { AiOutlineGithub, AiOutlineLinkedin } from 'react-icons/ai'
import Loading from '~/components/loading'
import Page from '~/components/page'
import { fetchProfile } from '~/queries/user'
import { getErrorMessage } from '~/utils/error'

export default function Profile() {
  const { id } = useParams() as { id: string }

  const profile = useQuery(['profile', id], () => fetchProfile(id))

  if (profile.isLoading) {
    return <Loading title="Loading user profile...." />
  }

  if (profile.error) {
    return <Result status="500" title="Something went wrong" subTitle={getErrorMessage(profile.error)} />
  }

  return (
    <Page className="py-4">
      <div className="flex items-center gap-8">
        <img src="/code.png" className="h-60 w-60 rounded-full object-cover" />
        <div className="space-y-4">
          <div className="">
            <div className="font-bold">@{profile.data?.username}</div>
            <div>
              {profile.data?.firstName} {profile.data?.lastName}
            </div>
            <div>{profile.data?.bio}</div>
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
                <BiGlobe className="text-primary h-6 w-6" />
              </Link>
            ) : null}
            {profile.data?.github ? (
              <Link to={profile.data.github} target="_black" rel="noreferrer">
                <AiOutlineGithub className="h-6 w-6" />
              </Link>
            ) : null}
            {profile.data?.linkedin ? (
              <Link to={profile.data.linkedin} target="_black" rel="noreferrer">
                <AiOutlineLinkedin className="h-6 w-6 text-blue-600" />
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </Page>
  )
}
