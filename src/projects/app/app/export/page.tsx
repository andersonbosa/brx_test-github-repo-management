import { ExportButton } from '@/components/ExportButton'
import { RepoList } from '@/components/RepoList'
import { SearchInput } from '@/components/SearchInput'

/* FIXME tem alguma regra CSS quebrando o encaixe dos elementos (provavel algum padding ou margem) */
export default function ExportPage () {
  return (
    <>
      <div className='mx-2'>
        <h1> # Search & Export </h1>
        <div className='flex flex-grow flex-col'>
          <SearchInput />
        </div>
        <br />
        <div>
          <ExportButton />
        </div>
        <br />
        <div className='flex justify-center'>
          <RepoList />
        </div>
        <br />
      </div>
    </>
  )
}
