import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tenant/stock/stock_history')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/tenant/_stock/stock_history"!</div>
}
