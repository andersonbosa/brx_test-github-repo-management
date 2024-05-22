'use client'

import { apiConvertCsvToJson, apiCreateUserOrder, createUserOrderInput } from '@/app/api/backend-integration'
import { useRootContext } from '@/contexts'
import { GithubUserRepositoryItem } from '@/types'
import { incrementSessionOrders, toasty } from '@/utils'
import { debounce } from 'lodash'
import { useState } from 'react'


type ImportButtonProps = {}

export const ImportButton = (props: ImportButtonProps) => {
  const { setImportedItems } = useRootContext()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleOrderCreated = ({ order }: { order: any }) => {
    toasty(`Import order created with ID: ${order.id}.`, 'success')
    incrementSessionOrders('orders:exported', order)
  }


  async function handleImport (_: React.MouseEvent<HTMLButtonElement>): Promise<void> {
    if (!selectedFile) {
      toasty('Please select a file to upload.', 'warning')
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)
    try {
      const fileContent = await selectedFile.text()
      await apiCreateUserOrder(
        createUserOrderInput({ type: 'import', data: fileContent })
      ).then(handleOrderCreated)
    } catch (error) {

    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]
    setSelectedFile(file)
  }

  // const handleUploadMock = async () => {
  //   if (!selectedFile) {
  //     toasty('Please select a file to upload.', 'warning')
  //     return
  //   }

  //   const formData = new FormData()
  //   formData.append('file', selectedFile)

  //   try {
  //     const fileContent = await selectedFile.text()

  //     /* TODO requisito; implementar processamento background (conversão do formato) passando pela fila */
  //     // await apiCreateUserOrder(
  //     await apiConvertCsvToJson(
  //       createUserOrderInput({
  //         type: 'import',
  //         data: fileContent,
  //       })
  //     )
  //       .then((backendResponse: any) => {
  //         toasty('Order for import data created.')
  //         setTimeout(
  //           () => {
  //             setImportedItems(backendResponse.data as GithubUserRepositoryItem[])
  //             toasty('Importing data...', 'success')
  //           },
  //           1234
  //         )
  //       })
  //   } catch (error) {
  //     console.error('Error uploading file:', error)
  //     toasty('Error uploading file. Please try again later.', 'error')
  //   }
  // }

  return (
    <>
      <div className='w-full flex justify-center'>
        <div>
          <input type="file" onChange={handleFileChange} autoFocus />
        </div>
        <div>
          <button
            className='md:w-[128px] min:w-[128px]'
            onClick={debounce(handleImport, 1234, { leading: true })} autoFocus>
            Import file
          </button>
          <button
            className='w-[46px]'
            onClick={debounce(() => { setImportedItems([]) }, 1234, { leading: true })}
            autoFocus
            title='Clean displayed data'
          >
            ♻️
          </button>
        </div>
      </div>
    </>
  )
}

