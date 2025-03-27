import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tenant/master-data/customers')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/tenant/_master-data/customers"!</div>
}
