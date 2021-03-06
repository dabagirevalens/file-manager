import { createModule, gql } from 'graphql-modules'

import { prismaClient } from '../prisma/config'

export const fileModule = createModule({
    id: 'file-module',
    dirname: __dirname,
    typeDefs: [
        gql`
            type File implements FileNode{
                id : ID!
                name : String!
                directoryId : String!
                createdAt: String!
                updatedAt: String!
                versions: [FileVersion]!
            }

            extend type Query{
                getAllFiles: [File]!
            }
        `
    ],
    resolvers: {
        Query: {
            getAllFiles: () => {
                return prismaClient().file.findMany()
            }
        }
    }
})