'use client'

import { apiGithubRepositoryGet } from '@/app/api/backend-integration'
import { useRootContext } from '@/contexts'
import { sortByProperty, SortOrder, toasty } from '@/utils'
import React, { useEffect, useState } from 'react'
import { RepoListItem } from './RepoListItem'


interface ViewImportedDataProps { }

export const ViewImportedData: React.FC<ViewImportedDataProps> = () => {
  const {
    importedItems
  } = useRootContext()


  const [sortType, setSortType] = useState<SortOrder>('desc')
  return (
    <>
      <div className="repo-list-wrapper max-w-[600px] container rounded -- mb-2 ">
        <div className='repo-list-tools-wrapper mb-2'>
          {
            importedItems.length > 0 &&
            <div className='text-left block opacity-40'>
              found: {importedItems.length} repos
            </div>
          }
        </div>
        <div className={
          importedItems.length > 0
            ? 'repo-list-items-wrapper'
            : ''
        }>
          {
            sortByProperty(importedItems as any, 'stars', sortType)
              .map((repo, index) => (
                <RepoListItem
                  key={index}
                  owner={String(repo.owner)}
                  title={String(repo.title)}
                  stars={Number(repo.stars)}
                  description={String(repo.description)}
                />
              ))
          }
        </div>

        {/* { // TODO melhoria; feature flag para habilitar paginação
          false &&
          <>
            <div>
              <button
                disabled={importedItems.length > visibleCount ? true : false}
                onClick={handleLoadMore}
                className='w-full md:w-[128px]'
              >
                Load More
              </button>
            </div>
          </>
        } */}
      </div>
    </>
  )
}
