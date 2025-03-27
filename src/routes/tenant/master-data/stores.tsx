import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tenant/master-data/stores')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/tenant/_master-data/stores"!</div>
}
