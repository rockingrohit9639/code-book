import { Popover, PopoverProps } from 'antd'
import { cloneElement, useMemo, useState } from 'react'
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from 'react-share'

type SharePostProps = Omit<PopoverProps, 'open' | 'onOpenChange' | 'content' | 'trigger'> & {
  postId: string
  trigger: React.ReactElement<{ onClick: () => void }>
  title: string
  description?: string
}

export default function SharePost({ trigger, postId, title, description }: SharePostProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { url, quote } = useMemo(() => {
    const quote = `
    Hello everyone,
    I found an awesome trick for you on codebook
    Title : ${title}
    ${description ?? ''}
    To know more about such awesome tricks signup to Codebook now - `

    return { quote, url: `${window.location.origin}/post/${postId}` }
  }, [description, title, postId])

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      content={
        <div className="grid grid-cols-2 gap-2">
          <TwitterShareButton url={url} title={quote}>
            <TwitterIcon size={35} round />
          </TwitterShareButton>
          <WhatsappShareButton url={url} title={quote}>
            <WhatsappIcon size={35} round />
          </WhatsappShareButton>
          <RedditShareButton url={url} title={quote}>
            <RedditIcon size={35} round />
          </RedditShareButton>
          <FacebookShareButton url={url} title={quote}>
            <FacebookIcon size={35} round />
          </FacebookShareButton>
          <LinkedinShareButton url={url} summary={quote}>
            <LinkedinIcon size={35} round />
          </LinkedinShareButton>
        </div>
      }
      trigger={['click']}
      placement="right"
    >
      {cloneElement(trigger, {
        onClick: () => {
          setIsOpen(true)
        },
      })}
    </Popover>
  )
}
