import { NotFoundPage } from '@payloadcms/next/views'
import { importMap } from '../importMap.js'
import config from '@payload-config'

type Args = {
  params: Promise<{
    segments: string[]
  }>
  searchParams: Promise<{
    [key: string]: string | string[]
  }>
}

const NotFound = (args: Args) => NotFoundPage({ config, importMap, ...args })

export default NotFound
