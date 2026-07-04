import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { AffiliateLinks } from './collections/AffiliateLinks'
import { Articles } from './collections/Articles'
import { Brands } from './collections/Brands'
import { Claims } from './collections/Claims'
import { EvidenceSources } from './collections/EvidenceSources'
import { Ingredients } from './collections/Ingredients'
import { Media } from './collections/Media'
import { NewsletterSubscribers } from './collections/NewsletterSubscribers'
import { Products } from './collections/Products'
import { Retailers } from './collections/Retailers'
import { Users } from './collections/Users'
import { WellnessGoals } from './collections/WellnessGoals'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— The Herb Pusher Admin',
    },
  },

  collections: [
    Users,
    Media,
    Ingredients,
    Products,
    Brands,
    Retailers,
    AffiliateLinks,
    Claims,
    EvidenceSources,
    WellnessGoals,
    Articles,
    NewsletterSubscribers,
  ],

  editor: lexicalEditor({}),

  secret: process.env.PAYLOAD_SECRET || 'CHANGE_ME_IN_PRODUCTION',

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),

  plugins: [
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.R2_BUCKET || '',
      config: {
        endpoint: process.env.R2_ENDPOINT || '',
        credentials: {
          accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
        },
        region: 'auto',
        forcePathStyle: true,
      },
    }),
  ],

  upload: {
    limits: {
      fileSize: 10_000_000, // 10 MB
    },
  },

  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },
})
