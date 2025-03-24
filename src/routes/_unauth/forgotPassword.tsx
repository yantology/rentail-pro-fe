import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_unauth/forgotPassword')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_unauth/forgotPassword"!</div>
}
