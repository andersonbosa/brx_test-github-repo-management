// https://nextjs.org/docs/pages/building-your-application/configuring/typescript#custom-type-declarations

export interface GithubUserItem {
  username: string
  url: string
  imageURL: string
}

export interface GithubUserRepositoryItem {
  title: string
  description: string
  owner: string
  stars: number
}