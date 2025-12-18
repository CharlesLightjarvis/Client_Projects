'use client'

import type { Payment } from '@/types/payment'
import { columns } from './columns'
import { DataTable } from '@/components/ui/data-table'
import { statuses, priorities } from '@/types/payment'
import { useState, useEffect } from 'react'

function getData(): Payment[] {
  // Fetch data from your API here.
  return [
    {
      id: '728ed52f',
      name: 'Mary',
      surname: 'Smith',
      amount: 100,
      status: 'pending',
      priority: 'low',
      email: 'm@example.com',
    },
    {
      id: '56e',
      name: 'John',
      surname: 'Doe',
      amount: 100,
      status: 'processing',
      priority: 'medium',
      email: 'j@example.com',
    },
    {
      id: 'a1b2c3',
      name: 'Jane',
      surname: 'Doe',
      amount: 100,
      status: 'success',
      priority: 'high',
      email: 'jane@example.com',
    },
    {
      id: 'zxc',
      name: 'Jim',
      surname: 'Doe',
      amount: 100,
      status: 'failed',
      priority: 'low',
      email: 'jim@example.com',
    },
    {
      id: 'qwe',
      name: 'Joe',
      surname: 'Doe',
      amount: 100,
      status: 'pending',
      priority: 'low',
      email: 'joe@example.com',
    },
    // ...
  ]
}

export default function PaymentList() {
  const [data, setData] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate async data fetch
    const fetchData = async () => {
      setLoading(true)
      // In real app, this would be an API call
      const result = getData()
      setData(result)
      setLoading(false)
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-center h-64">
          <p className="text-lg">Chargement des paiements...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        data={data}
        searchFilter={{
          columnId: 'email',
          placeholder: 'Filter by email...',
        }}
        facetedFilters={[
          {
            columnId: 'status',
            title: 'Status',
            options: statuses,
          },
          {
            columnId: 'priority',
            title: 'Priority',
            options: priorities,
          },
        ]}
        actionButton={{
          label: 'Add Payment',
          onClick: () => console.log('Add payment clicked'),
        }}
      />
    </div>
  )
}
