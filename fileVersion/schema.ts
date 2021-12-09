import { createModule, gql } from 'graphql-modules'

import { prismaClient } from '../prisma/config'

export const fileVersionModule = createModule({
    id: 'fileVersion-module',
    dirname: __dirname,
    typeDefs: [
        gql`
            type FileVersion implements FileNode{
                id : ID!
                name : String!
                mimeType: String!
                size      :Int!
                fileId   : String!
                createdAt: String!
                updatedAt: String!
            }

            extend type Query{
                getAllFileVersions: [FileVersion]!
            }
        `
    ],
    resolvers: {
        Query: {
            getAllFileVersions: () => {
                return prismaClient().fileVersion.findMany()
            }
        }
    }
})