'use client'

import { apiCreateUserOrder, createUserOrderInput } from '@/app/api/backend-integration'
import { useRootContext } from '@/contexts'
import { incrementSessionOrders, toasty } from '@/utils'
import { debounce } from 'lodash'


type ExportButtonProps = {}

export const ExportButton = (props: ExportButtonProps) => {
  const {
    displayedRepositories,
    setDisplayedRepositories
  } = useRootContext()

  const handleOrderCreated = ({ order }: { order: any }) => {
    toasty(`Export order created with ID: ${order.id}.`, 'success')
    incrementSessionOrders('orders:exported', order)
  }

  async function handleExport (_: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    if (displayedRepositories.length <= 0) {
      toasty('First search and select a user.', 'error')
      return
    }

    await apiCreateUserOrder(
      createUserOrderInput({ type: 'export', data: displayedRepositories })
    ).then(handleOrderCreated)
  }

  return (
    <>
      <button
        className='md:w-[128px] min:w-[128px]'
        autoFocus
        onClick={debounce(handleExport, 1234, { leading: true })}
      >
        Export to CSV
      </button>
      <button
        onClick={debounce(() => { setDisplayedRepositories([]) }, 1234, { leading: true })}
        autoFocus
        title='Clean displayed data'
      > ♻️ </button>
    </>
  )
}