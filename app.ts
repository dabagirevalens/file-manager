// eslint-disable-next-line
require("dotenv").config()
import { File, FileVersion, Directory } from ".prisma/client"
import express from "express"

import { graphqlHTTP } from 'express-graphql'
import { createApplication, gql, createModule } from "graphql-modules"
import { directoryModule } from "./directory/schema"
import { fileModule } from "./file/schema"
import { fileVersionModule } from "./fileVersion/schema"


const mainModule = createModule({
  id: 'main-module',
  dirname: __dirname,
  typeDefs: [
    gql`

      interface FileNode { 
        id: ID!
        name: String!
        createdAt: String!
        updatedAt: String!
      }

      type Query{
        searchFiles(query: String!): [FileNode]
      }
    `
  ],
  resolvers: {
    FileNode: {
      __resolveType(obj: File | FileVersion | Directory) {

        if (Object.prototype.hasOwnProperty.call(obj, 'parentId')) {
          return 'Directory'
        }

        if (Object.prototype.hasOwnProperty.call(obj, 'directoryId')) {
          return 'File'
        }

        if (Object.prototype.hasOwnProperty.call(obj, 'fileId')) {
          return 'FileVersion'
        }

      }
    },
    Query: {
      searchFiles: () => { return [] }
    }
  }
})


const api = createApplication({
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  modules: [mainModule, directoryModule, fileModule, fileVersionModule]
})

const app = express()

app.use('/graphql',
  //eslint-disable-next-line @typescript-eslint/no-misused-promises
  graphqlHTTP({
    schema: api.schema,
    customExecuteFn: api.createExecution(),
    graphiql: process.env.NODE_ENV === 'development'
  })
)


export default app;
