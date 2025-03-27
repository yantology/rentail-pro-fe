import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tenant/_stock/items')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/tenant/_master-data/_stock/items"!</div>
}
