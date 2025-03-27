import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tenant/master-data/sales')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/tenant/_master-data/sales"!</div>
}
