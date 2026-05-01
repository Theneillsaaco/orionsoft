import { defineCollection} from 'astro:content'
import { glob } from 'astro/loaders';
import { z } from 'zod';

const projects = defineCollection({
    loader: glob({
        base: './src/content/projects',
        pattern: '**/*.md'
    }),
    schema: z.object({
        title: z.string(),
        category: z.string(),
        desc: z.string(),
        year: z.string(),
        tags: z.array(z.string()),
    }),
})

export const collections = {
  projects,
}