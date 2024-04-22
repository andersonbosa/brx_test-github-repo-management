'use client'

import { apiConvertCsvToJson, apiCreateUserOrder, createUserOrderInput } from '@/app/api/backend-integration'
import { useRootContext } from '@/contexts'
import { GithubUserRepositoryItem } from '@/types'
import { toasty } from '@/utils'
import { debounce } from 'lodash'
import { useState } from 'react'


type ImportButtonProps = {}

export const ImportButton = (props: ImportButtonProps) => {
  const {
    setImportedItems
  } = useRootContext()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // async function handleImport (_: React.MouseEvent<HTMLButtonElement>): Promise<void> {
  //   // Request to API to process the CSV into JSON and get data to display 
  //   await apiCreateUserOrder(
  //     createUserOrderInput({
  //       type: 'import',
  //       data: importedItems
  //     })
  //   )
  //     .then(
  //       (backendResponse: any) => {
  //         toasty(`Order for import created. `)
  //         // TODO definir dados exibidos através de backendResponse
  //       }
  //     )
  // }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0]
    setSelectedFile(file)
    //console.log(file)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toasty('Please select a file to upload.', 'warning')
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const fileContent = await selectedFile.text()

      /* TODO requisito; implementar processamento background (conversão do formato) passando pela fila */
      // await apiCreateUserOrder(
      await apiConvertCsvToJson(
        createUserOrderInput({
          type: 'import',
          data: fileContent,
        })
      )
        .then((backendResponse: any) => {
          toasty('Order for import data created.')
          setTimeout(
            () => {
              setImportedItems(backendResponse.data as GithubUserRepositoryItem[])
              toasty('Importing data...', 'success')
            },
            1234
          )
        })
    } catch (error) {
      console.error('Error uploading file:', error)
      toasty('Error uploading file. Please try again later.', 'error')
    }
  }

  return (
    <>
      <div className='w-full flex justify-center'>
        <div>
          <input type="file" onChange={handleFileChange} autoFocus />
        </div>
        <div>
          <button
            className='md:w-[128px] min:w-[128px]'
            onClick={debounce(handleUpload, 1234, { leading: true })} autoFocus>
            Upload File
          </button>
          <button
            className='w-[46px]'
            onClick={debounce(() => { setImportedItems([]) }, 1234, { leading: true })}
            autoFocus
            title='Clean displayed data'
          >
            ♻️
          </button>
        </div>
      </div>
    </>
  )
}


const mock = [
  {
    "title": "clean-code-developer-checklist",
    "description": "A developer checklist derived from the book Clean Code by Robert C Martin ",
    "owner": "andersonbosa",
    "stars": 5
  },
  {
    "title": "moshell.sh",
    "description": "Make your customizations and take them everywhere. moshell.sh is a framework to persist its customizations without complexity!",
    "owner": "andersonbosa",
    "stars": 5
  },
  {
    "title": "security-goat",
    "description": "Security-Goat is a command line client to perform Security Gate written in Go. It interacts with DependaBot alerts using GitHub GraphQL API.",
    "owner": "andersonbosa",
    "stars": 4
  },
  {
    "title": "droxy",
    "description": "SOCKS5 server through SSH tunnel made easy. To enable a Docker Container to easily communicate with an application/target on another network without much effort. Droxy allows you to automate part of the effort, leaving you only to configure other applications to use SOCKS tunnels.",
    "owner": "andersonbosa",
    "stars": 3
  },
  {
    "title": "wayback.go",
    "description": "Search inside by multiple targets within the \"wayback machine\" using Golang.Project done with educational purpose.",
    "owner": "andersonbosa",
    "stars": 3
  },
  {
    "title": "automocker.js",
    "description": "Automocker.js was developed to make developers' lives easier! With this tool, you can fill in the input fields of your form with random values and thus speed up your tests. Don't waste any more time manually filling in your form inputs. Use Automocker.js and increase the agility and efficiency of your workflow.",
    "owner": "andersonbosa",
    "stars": 2
  },
  {
    "title": "denv",
    "description": "It's goal to be a development environment for developers, containerized, \"ready for action\".",
    "owner": "andersonbosa",
    "stars": 2
  },
  {
    "title": "run-stremio-run",
    "description": "Make a Stremio server available on the user's machine and a page to make them connect to the server with 1 click.",
    "owner": "andersonbosa",
    "stars": 2
  },
  {
    "title": "andersonbosa",
    "description": "This is a special repository. Its README.md will appear on your public profile on github.com/andersonbosa.",
    "owner": "andersonbosa",
    "stars": 1
  },
  {
    "title": "car-speed-tracking",
    "description": "Simple application of how to use the \"OpenCV\" python module to track a object in real time from a video source.",
    "owner": "andersonbosa",
    "stars": 1
  },
  {
    "title": "dothub",
    "description": "Repository template for application projects. It includes templates for Issues and PRs. Standard documentation pattern using RFCs and ADRs (WIP). Scan workflows to cover various security tests.",
    "owner": "andersonbosa",
    "stars": 1
  },
  {
    "title": "feedbacker",
    "description": "Product developed during the Vue3 course offered by the @vuejs-br community and refactored by me in 2023.",
    "owner": "andersonbosa",
    "stars": 1
  },
  {
    "title": "10-design-patterns-in-typescript",
    "description": "Implementations of Design Patterns in TypeScript for demonstration purposes. Some of them include Facade, Iterator, Factory, etc.",
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "andersonbosa.github.io",
    "description": "Deprecated page that I kept to redirect to the new page. Be sure to check out the new version!",
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "andersonbosa.vercel.app",
    "description": "This is the repository of my personal page. Here you can find my projects, publications and contact me!",
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "clean-architecture-in-typescript",
    "description": null,
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "codeSnippets",
    "description": "Some code snippets that could be useful someday",
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "finance-api-expressjs",
    "description": "The API is a banking system with routes to manage accounts, statements, deposits, and withdrawals. It is built in Node.js with the Express framework. The API supports CRUD operations for accounts, retrieves statements by date, performs customer deposit transactions, and allows withdrawals from customer accounts.",
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "finger-counter-py",
    "description": "I am studying on how to perform \"object position detection\" so that I can do another project.At Momentom, my goal is to be able to detect people walking through any image or video input (MP4, streaming, etc.).",
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "fork-distributed_systems",
    "description": null,
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "fork-zarn",
    "description": "A lightweight static security analysis tool for modern Perl Apps",
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "fullcycle-challenge-data-sort-with-go",
    "description": null,
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "git_audit_go",
    "description": "Extract commit data from Git log to CSV. Includes hash, timestamp, and author details. Helps analyze activity patterns and improve team efficiency.",
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "go-restful-api",
    "description": "A RESTful web service API with Go and the Gin Web Framework (Gin) powered by https://go.dev/doc/tutorial/web-service-gin",
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "guia-cli",
    "description": "Gu, is a simple IA agent that specializes in software engineering, aiding in coding tasks and providing technical guidance.",
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "IsCreamRecord.py",
    "description": "Tool for collecting image data from computer screen or live camera feed.",
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "khathuram-csv-search-upload",
    "description": "The aim of this assessment is to assess your abilities in both Backend and Frontend development. You must create a website that permits the loading of a preformatted CSV file by users. This data should then be displayed as cards on the site, which the user can filter.",
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "learning-terraform",
    "description": "Notes from my studies on Terraform and its use cases. Feel free to contribute, I would appreciate help to learn!",
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "nipe",
    "description": "An engine to make Tor network your default gateway",
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "nlw-expert-csharp",
    "description": null,
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "nlw12-spacetime",
    "description": "Web application developed during the NLW 12 event offered by RocketSeat. It is an application that records user memories on a timeline. To know which technologies we use in this project, see README.md",
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "nlw4-moveit",
    "description": "Move.It is an application that was created for the NLW #4, an event organized by Rocketseat. Move.it aims to motivate users to exercise after a cycle of work that utilizes the Pomodoro technique. After 25 minutes, users take a break to do a quick workout. The app uses gamification to make exercising fun.",
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "nodemon-vscode-tutorial",
    "description": null,
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "openai-quickstart-node",
    "description": null,
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "playground-crewai",
    "description": null,
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "react-chat-app",
    "description": "A real-time chat app using React.js and Firebase.",
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "superhero-consumer",
    "description": "Project developed as part of the AppMasters selection test. It's an API that cache responses from SuperHeroAPI. The main objective was to implement an API with the ability to search and cache another API at the time of its initialization.",
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "system-design-101",
    "description": "Explain complex systems using visuals and simple terms. Help you prepare for system design interviews.",
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "tic-tac-toe-react",
    "description": null,
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "tri",
    "description": "Todo CLI Application created on the workshop by Steve Francia and Ashley McNamara at OSCON 2017 offered by https://spf13.com.",
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "url-shortner",
    "description": null,
    "owner": "andersonbosa",
    "stars": 0
  },
  {
    "title": "video-chat-app",
    "description": "Arquivado. Fiquei sem recurso para dedicar a este projeto, pretendo retomá-lo quando possível. É uma POC de streaming de vídeo para eu usar no servidor de um aim-bot que eu estava criando.",
    "owner": "andersonbosa",
    "stars": 0
  }
]