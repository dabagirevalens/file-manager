import { createModule, gql } from 'graphql-modules'

import { prismaClient } from '../prisma/config'

export const directoryModule = createModule({
    id: 'directory-module',
    dirname: __dirname,
    typeDefs: [
        gql`
            type Directory implements FileNode{
                id : ID!
                name : String!
                parentId: String
                createdAt: String!
                updatedAt: String!
                files: [File]!
                directories: [Directory]!
            }

            extend type Query{
                getAllDirectories: [Directory]!
            }
        `
    ],
    resolvers: {
        Query: {
            getAllDirectories: () => {
                return prismaClient().directory.findMany()
            }
        }
    }
})