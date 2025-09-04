import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import deskStructure from './deskStructure'
import {initialTemplates} from './templates'
import {media} from 'sanity-plugin-media'

export default defineConfig({
  name: 'default',
  title: 'altius',
  projectId: 'ctgwxc8c',
  dataset: 'production',
  plugins: [structureTool({ structure: deskStructure }), visionTool(), media()],
  schema: { types: schemaTypes, templates: (prev) => [...initialTemplates, ...prev] },
  basePath: '/admin',
})
