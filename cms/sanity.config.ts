// @ts-nocheck
import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
// Use the central schema types defined for the whole app
// This exposes post, category, author, gallery, clubEmbed, eventEmbed, etc. in Studio
import { schemaTypes } from '../altius/schemaTypes';

export default defineConfig({
  name: 'default',
  title: 'Altius CMS',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [deskTool()],
  schema: {
    types: schemaTypes,
  },
});
