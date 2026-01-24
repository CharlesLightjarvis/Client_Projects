import { FormationDetail } from '@/components/formations/formation-detail'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/formations/$formationId')({
  component: FormationDetailPage,
})

function FormationDetailPage() {
  const { formationId } = Route.useParams()
  return <FormationDetail formationId={formationId} />
}
