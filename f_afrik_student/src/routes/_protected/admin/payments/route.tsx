import { createFileRoute } from '@tanstack/react-router'
import PaymentList from '../-components/table/payment/payment-list'

export const Route = createFileRoute('/_protected/admin/payments')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <PaymentList />
    </div>
  )
}
