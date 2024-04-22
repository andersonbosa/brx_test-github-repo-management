'use client'

import { apiGithubRepositoryGet } from '@/app/api/backend-integration'
import { useRootContext } from '@/contexts'
import { sortByProperty, SortOrder, toasty } from '@/utils'
import React, { useEffect, useState } from 'react'
import { RepoListItem } from './RepoListItem'


interface RepoListProps { }

export const RepoList: React.FC<RepoListProps> = () => {
  const {
    selectedUser,
    setDisplayedRepositories,
    displayedRepositories,
  } = useRootContext()


  const loadUserRepositories = async (username: string) => {
    toasty(`Loading repositories...`)
    apiGithubRepositoryGet(username)
      .then(repos => { setDisplayedRepositories(repos) })
      .catch(console.error)
  }

  /* Loads repositories when different user is selected */
  useEffect(
    () => {
      if (selectedUser) loadUserRepositories(selectedUser?.username)
    },
    [selectedUser]
  )

  
  // /* TODO melhoria; feature de paginação "load more" */
  // const [visibleRepos, setVisibleRepos] = useState<GithubUserRepositoryItem[]>([])
  // const [visibleCount, setVisibleCount] = useState<number>(1000)
  // useEffect(
  //   () => { setVisibleRepos(displayedRepositories.slice(0, visibleCount)) },
  //   [displayedRepositories, visibleCount]
  // )
  // const handleLoadMore = () => {
  //   setVisibleCount(prevCount => prevCount + 4)
  // }

  // /* Loads repositories every time user is selected */
  // const { emitter } = useEventContext()
  // useEffect(
  //   () => {
  //     emitter.on(
  //       EVENT_TYPES.TRIGGER.GITHUB_REPOSITORY_SEARCH,
  //       (username: string) => {
  //         //console.log('-------------', EVENT_TYPES.TRIGGER.GITHUB_REPOSITORY_SEARCH)
  //         loadUserRepositories(username)
  //       }
  //     )

  //     return () => {
  //       emitter.removeAllListeners()
  //     }
  //   },
  //   []
  // )

  /* TODO melhoria; adicionar escolha de ordenação e filtros (componente isolado para prover isso) */
  const [sortType, setSortType] = useState<SortOrder>('desc')
  return (
    <>
      <div className="repo-list-wrapper max-w-[600px] container rounded -- mb-2 ">
        <div className='repo-list-tools-wrapper mb-2'>
          {
            displayedRepositories.length > 0 &&
            <div className='text-left block opacity-40'>
              found: {displayedRepositories.length} repos
            </div>
          }
        </div>
        <div className={
          displayedRepositories.length > 0
            ? 'repo-list-items-wrapper'
            : ''
        }>
          {
            sortByProperty(displayedRepositories, 'stars', sortType)
              .map((repo, index) => (
                <RepoListItem
                  key={index}
                  owner={repo.owner}
                  title={repo.title}
                  stars={repo.stars}
                  description={repo.description}
                />
              ))
          }
        </div>

        {/* { // TODO melhoria; feature flag para habilitar paginação
          false &&
          <>
            <div>
              <button
                disabled={displayedRepositories.length > visibleCount ? true : false}
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
