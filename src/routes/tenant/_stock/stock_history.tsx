import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tenant/_stock/stock_history')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/tenant/_stock/stock_history"!</div>
}
