import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tenant/master-data/memberships')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/tenant/master-data/memberships"!</div>
}
