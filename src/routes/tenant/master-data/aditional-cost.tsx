import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tenant/master-data/aditional-cost')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/tenant/_master-data/aditional-cost"!</div>
}
