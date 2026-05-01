import { defineCollection, z } from 'astro:content'

const projects = defineCollection({
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