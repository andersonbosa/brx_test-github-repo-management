'use client'

import React from 'react'

interface RepoListItemProps {
  owner: string
  title: string
  stars: number
  description: string
}

export const RepoListItem: React.FC<RepoListItemProps> = ({ owner, title, stars, description }) => {
  return (
    <div className="repo-list-item-wrapper -- px-4 py-2 mb-4 -- border border-gray-300 rounded -- text-justify ">
      <div className='flex justify-between'>
        <h2 className="text-lg font-bold mb-2" title={`Criado por ${owner}`}>
          # {title}
        </h2>
        <p className="text-gray-300" title="número de estrelas que um repositório recebeu">
          ⭐ {stars}
        </p>
      </div>
      <p className="mb-2 font-normal">
        {description}
      </p>
    </div>
  )
}
