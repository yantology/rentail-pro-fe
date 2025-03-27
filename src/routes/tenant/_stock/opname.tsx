import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tenant/_stock/opname')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/tenant/_stock/opname"!</div>
}
