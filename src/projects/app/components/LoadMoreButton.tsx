'use client'

import { debounce } from 'lodash'


type LoadMoreButtonProps = {}
export const LoadMoreButton = (props: LoadMoreButtonProps) => {

  /* TODO: tipar função */
  function handleLoadMore (event: React.MouseEvent<HTMLButtonElement>): void {
    //console.log('handleLoadMore')
    // throw new Error('Function not implemented.')
  }

  return (
    <>
      <button
        className='w-full md:w-[128px]'
        onClick={debounce(handleLoadMore, 1000, { leading: true })}
      >
        Load more
      </button>
    </>
  )
}