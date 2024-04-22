'use client'

import { apiGithubUserSearch } from '@/app/api/backend-integration'
import { useRootContext } from '@/contexts'
import { GithubUserItem } from '@/types'
import { toasty } from '@/utils'
import { throttle } from 'lodash'
import React, { useState } from 'react'
import { SearchInputResultItem } from './SearchInputResultItem'


export const SearchInput: React.FC = () => {
  const {
    searchResults, setSearchResults,
    searchValue, setSearchValue,
    isSearching, setIsSearching,
    showSearchSuggestions, setShowSearchSuggestions,
  } = useRootContext()


  const handleChangeValue = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target as HTMLInputElement
    setSearchValue(value.trim())
    setShowSearchSuggestions(true)
  }

  const debouncedSeach = throttle(handleSearch, 1234)

  const handleEnter = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code.toLowerCase() !== 'enter') {
      return
    }
    if (isSearching) {
      return
    }
    debouncedSeach()
  }

  async function handleSearchDone (foundUsers: any[]) {
    setProgress(0)
    setIsSearching(false)
    setSearchResults(foundUsers as GithubUserItem[])
    toasty(`Found ${foundUsers.length ?? 0} users.`)
    setShowSearchSuggestions(true)
  }

  async function handleSearch () {
    if (searchValue.trim() === '') {
      return
    }
    if (searchValue.length <= 3) {
      console.warn(`handleSearch: "${searchValue}" does not have the minimum of 3 characters`)
      return
    }
    if (isSearching) {
      return
    }

    setIsSearching(true)
    setShowSearchSuggestions(false)
    simulateProgress()
    await apiGithubUserSearch(searchValue)
      .then((foundUsers:GithubUserItem[]) => {
        setTimeout(
          () => handleSearchDone(foundUsers),
          1000
        )
      })
      .catch(console.error)
  }

  const handleOnFocus = () => {
    setShowSearchSuggestions(true)
  }

  const handleOnBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.relatedTarget === null) {
      setTimeout(() => setShowSearchSuggestions(false), 500)
      return
    }
    const referenceTarget = document.querySelector('div.search-input-wrapper>input')
    const result = referenceTarget === e.target
    if (!result) {
      setShowSearchSuggestions(true)
    } else {
      setShowSearchSuggestions(false)
    }
  }


  const [progress, setProgress] = useState<number>(0)
  const simulateProgress = () => {
    setProgress(0)
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        if (prevProgress >= 1) {
          clearInterval(interval)
          return prevProgress
        }
        return prevProgress + 0.09 + (Math.random() / 10)
      })
    },
      100
    )
  }

  return (
    <div className='search-input-wrapper w-full flex flex-col items-center justify-center'>
      <>
        <div className={`${isSearching ? '' : 'invisible'} -- container`} >
          <label htmlFor="searchingUser"></label>
          <progress id="searchingUser" value={progress} max={1} />
        </div>
        <input
          className="max-w-[600px] container rounded -- px-4 py-2 mb-2 -- text-stone-600 outline-[var(--primary-color-bg)]"
          autoFocus={true}
          type="text"
          placeholder="Enter the GitHub username"
          title='Press enter to search'
          value={searchValue}
          disabled={isSearching ? true : false}
          onChange={handleChangeValue}
          onKeyUp={handleEnter}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
        />
        {
          showSearchSuggestions && (
            searchResults?.length > 0 && (
              <ul className="search-result-wrapper -- max-w-[600px] container -- overflow-y-auto rounded drop-shadow-lg -- bg-[var(--text-color)] text-[var(--primary-color-bg)]">
                {
                  searchResults.map((resultItem: GithubUserItem, index: number) => (
                    <SearchInputResultItem key={index} item={resultItem} />
                  ))
                }
              </ul>
            )
          )
        }
      </>
    </div >
  )
}


