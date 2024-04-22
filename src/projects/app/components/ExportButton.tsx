'use client'

import { apiConvertJsonToCsv, apiCreateUserOrder, createUserOrderInput } from '@/app/api/backend-integration'
import { useRootContext } from '@/contexts'
import { toasty } from '@/utils'
import { debounce } from 'lodash'


type ExportButtonProps = {}

export const ExportButton = (props: ExportButtonProps) => {
  const {
    displayedRepositories,
    setDisplayedRepositories
  } = useRootContext()

  async function handleExport (_: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    if (displayedRepositories.length <= 0) {
      toasty('First search and select a user.', 'error')
      return
    }

    /* TODO requisito; implementar processamento background (conversão do formato) passando pela fila */
    // await apiCreateUserOrder(
    await apiConvertJsonToCsv(
      createUserOrderInput({
        type: 'export',
        data: displayedRepositories
      })
    )
      .then(
        (backendResponse: any) => {
          //console.log('---- handleExport', backendResponse)
          toasty(`Order for export created.`)
        }
      )
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