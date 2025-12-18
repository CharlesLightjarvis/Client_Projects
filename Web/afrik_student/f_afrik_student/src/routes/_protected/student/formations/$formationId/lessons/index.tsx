import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_protected/student/formations/$formationId/lessons/',
)({
  beforeLoad: ({ params }): void => {
    throw redirect({
      to: '/student/formations/$formationId',
      params: {
        formationId: params.formationId,
      },
    })
  },
})
