import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tenant/stock/opname')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/tenant/_stock/opname"!</div>
}
