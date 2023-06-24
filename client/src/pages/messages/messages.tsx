import { useEffect } from 'react'
import Page from '~/components/page'
import { useAppShellContext } from '~/hooks/use-app-shell'

export default function Messages() {
  const { setIsSiderCollapsed } = useAppShellContext()

  useEffect(
    function collapseSider() {
      setIsSiderCollapsed(true)
    },
    [setIsSiderCollapsed],
  )

  return (
    <Page className="p-4">
      <div>Messages</div>
    </Page>
  )
}
