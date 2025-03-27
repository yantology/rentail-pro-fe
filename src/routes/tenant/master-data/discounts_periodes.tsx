import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tenant/master-data/discounts_periodes')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <div>Hello "/tenant/_master-data/discounts_periodes"!</div>
}
