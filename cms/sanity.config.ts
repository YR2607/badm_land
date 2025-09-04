import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import gallerySection from './schemas/gallerySection';
import tournamentCategory from './schemas/tournamentCategory';

export default defineConfig({
  name: 'default',
  title: 'Altius CMS',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [deskTool()],
  schema: {
    types: [gallerySection, tournamentCategory],
  },
});
