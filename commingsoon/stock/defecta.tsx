import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tenant/stock/defecta')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/tenant/_stock/defecta"!</div>
}
