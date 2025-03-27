import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/tenant/master-data/products')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/tenant/_master-data/product"!</div>
}
