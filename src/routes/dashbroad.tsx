import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/dashbroad')({
  beforeLoad: ({ context }) => {
    if (context.auth.status !== 'loggedIn') {
      throw redirect({ to: '/' })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/dashbroad"!</div>
}
