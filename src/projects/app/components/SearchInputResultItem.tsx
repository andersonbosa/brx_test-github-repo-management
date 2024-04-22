import { useRootContext } from '@/contexts'
import { EVENT_TYPES, useEventContext } from '@/contexts/events'
import { GithubUserItem } from '@/types'
import { toasty } from '@/utils'


interface SearchInputResultItemProps {
  item: GithubUserItem
}

export const SearchInputResultItem: React.FC<SearchInputResultItemProps> = ({ item }) => {
  const {
    setShowSearchSuggestions,
    setSelectedUser,
  } = useRootContext()

  const { emitter } = useEventContext()

  const handleSuggestionClick = async (item: GithubUserItem) => {
    setShowSearchSuggestions(false)
    setSelectedUser(item)
    toasty(`User "${item.username} selected..."`, 'success')
    emitter.emit(EVENT_TYPES.TRIGGER.GITHUB_REPOSITORY_SEARCH, item.username)
  }

  const handleOpenUserPage = () => {
    window.open(item.url, '_blank')
  }

  return (
    <li
      className="search-input-result-item -- flex items-center justify-between cursor-pointer px-4 py-2 hover:bg-gray-100"
      onClick={() => handleSuggestionClick(item)}
    >
      <div className="flex items-center">
        <img src={item.imageURL} alt={item.username} className="w-8 h-8 mx-2 rounded-full" />
        <span>{item.username}</span>
      </div>
      <span
        title="Open user page in new tab"
        className="hover:scale-110"
        onClick={handleOpenUserPage}
      >
        🔗
      </span>
    </li>
  )
}
