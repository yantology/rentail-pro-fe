import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tenant/master-data/customer-point')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/tenant/_master-data/customer-point"!</div>
}
