import { FormationsList } from '@/components/formations/formations-list'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/formations/')({
  component: FormationsPage,
})

function FormationsPage() {
  return <FormationsList />
}
