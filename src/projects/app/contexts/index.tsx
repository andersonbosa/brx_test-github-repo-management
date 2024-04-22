import { CommonProvider } from '@/app/provders'
import { GithubUserItem, GithubUserRepositoryItem } from '@/types'
import React, { createContext, useContext, useState } from 'react'


type displayedItemsType = any[] | []
type searchValueType = string
type searchResultsType = GithubUserItem[] | []
type selectedUserType = GithubUserItem | undefined
type exportDataType = Record<string, any> | undefined
type importDataType = Record<string, any> | undefined
type importedItemsType = GithubUserRepositoryItem[] | []

/* TODO melhoria; os nomes podem ser melhorados para melhor representar o que eles significam */
interface RootState {
  displayedRepositories: displayedItemsType
  setDisplayedRepositories: React.Dispatch<React.SetStateAction<displayedItemsType>>

  searchValue: searchValueType
  setSearchValue: React.Dispatch<React.SetStateAction<searchValueType>>

  searchResults: searchResultsType
  setSearchResults: React.Dispatch<React.SetStateAction<searchResultsType>>

  selectedUser: selectedUserType
  setSelectedUser: React.Dispatch<React.SetStateAction<selectedUserType>>

  exportData: exportDataType
  setExportData: React.Dispatch<React.SetStateAction<exportDataType>>

  importData: importDataType
  setImportData: React.Dispatch<React.SetStateAction<importDataType>>

  isSearching: boolean
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>

  showSearchSuggestions: boolean
  setShowSearchSuggestions: React.Dispatch<React.SetStateAction<boolean>>

  importedItems: importedItemsType
  setImportedItems: React.Dispatch<React.SetStateAction<importedItemsType>>
}


const RootContext = createContext<RootState | null>(null)

export const useRootContext = () => {
  const context = useContext(RootContext)
  if (!context) {
    throw new Error('useRootContext should be used within a provider RootContext')
  }
  return context
}

/* TODO melhoria poderiamos separar o contexto por features */
export const RootProvider = ({ children }: CommonProvider): React.ReactNode => {
  /* view repos, load more repos */
  const [displayedRepositories, setDisplayedRepositories] = useState<displayedItemsType>([])


  /* search, view users, select user */
  const [searchValue, setSearchValue] = useState<searchValueType>('')
  const [searchResults, setSearchResults] = useState<searchResultsType>([])
  const [selectedUser, setSelectedUser] = useState<selectedUserType>()
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const [showSearchSuggestions, setShowSearchSuggestions] = useState<boolean>(false)


  /* import & export */
  const [exportData, setExportData] = useState<exportDataType>()
  const [importData, setImportData] = useState<importDataType>()
  const [importedItems, setImportedItems] = useState<importedItemsType>([])
  

  return (
    <RootContext.Provider
      value={{
        displayedRepositories, setDisplayedRepositories,
        searchValue, setSearchValue,
        searchResults, setSearchResults,
        selectedUser, setSelectedUser,
        exportData, setExportData,
        importData, setImportData,
        isSearching, setIsSearching,
        showSearchSuggestions, setShowSearchSuggestions,
        importedItems, setImportedItems,
      }}
    >
      {children}
    </RootContext.Provider>
  )
}

