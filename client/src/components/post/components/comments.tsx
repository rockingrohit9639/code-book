import { Button, Input } from 'antd'
import clsx from 'clsx'
import { range } from 'lodash'
import { SendOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

type CommentsProps = {
  className?: string
  style?: React.CSSProperties
}

function Comment() {
  return (
    <div>
      <div className="text-gray-500">
        @rohit__saini - <span className="text-sm">{dayjs().subtract(1, 'day').fromNow()}</span>
      </div>
      <div>Comment here...</div>
    </div>
  )
}

export default function Comments({ className, style }: CommentsProps) {
  return (
    <div className={clsx('p-4', className)} style={style}>
      <div className="mb-4 flex items-center gap-2">
        <Input placeholder="Enter Comment" size="large" />
        <Button size="large" icon={<SendOutlined />}>
          Comment
        </Button>
      </div>

      <div className="hide-scrollbar max-h-60 space-y-4 overflow-y-auto">
        {range(10).map((_, key) => (
          <Comment key={key} />
        ))}
      </div>
    </div>
  )
}
