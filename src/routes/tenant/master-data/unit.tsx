import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tenant/master-data/unit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/tenant/master-data/unit"!</div>
}
