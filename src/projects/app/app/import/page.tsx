import { ImportButton } from '@/components/ImportButton'
import { ViewImportedData } from '@/components/ViewImportedData'


export default function ImportPage () {
  return (
    <>
        <div className='mx-2'>
        <h1> # Import & View </h1>
        <div className='flex flex-grow flex-col'>
          <ImportButton />
        </div>
        <br />
        <br />
        <div className='flex justify-center'>
          <ViewImportedData />
        </div>
        <br />
      </div>
    </>
  )
}
  