import { createFileRoute } from '@tanstack/react-router'
import StudentFormationsList from '../-components/formations/formation-list'

export const Route = createFileRoute('/_protected/student/formations/')({
  component: StudentFormationsList,
})
