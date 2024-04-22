export class GithubRepoEntity {
  constructor(
    public title: string,
    public description: string,
    public owner: string,
    public stars: number,
  ) { }

  static NewWithInput (input: GithubRepoEntity) {
    return new GithubRepoEntity(
      input.title,
      input.description,
      input.owner,
      input.stars,
    )
  }
}
