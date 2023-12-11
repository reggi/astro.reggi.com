// 1. Import utilities from `astro:content`
import { z, defineCollection } from 'astro:content';

const dev = defineCollection({
  type: 'content',
  schema: z.object({
    devId: z.number(),
    devCollectionId: z.union([z.number(), z.null()]),
    devUrl: z.string().url(),
    devSlug: z.string(),
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    readingTimeMinutes: z.number(),
    readablePublishDate: z.string(),
    createdAt: z.date(),
    editedAt: z.union([z.date(), z.null()]),
    publishedAt: z.date(),
    publishedTimestamp: z.date(),
    coverImage: z.union([z.string().url(), z.null()]),
    socialImage: z.string().url()
  })
})

const jobs = defineCollection({ 
  type: 'content', // v2.5.0 and later
  schema: z.object({
    title: z.string(),
    start: z.string(),
    end: z.string(),
    tags: z.array(z.string()),
    company: z.object({
      name: z.string(),
      website: z.string(),
      logo: z.string(),
      emoji: z.string(),
    })
  }),
 });

 const art = defineCollection({
  type: 'data',
  schema: z.object({
    "title": z.string(),
    "description": z.string(),
    "img": z.union([z.undefined(), z.string()]),
    "rarible": z.union([z.undefined(), z.string()]),
    "video": z.union([z.undefined(), z.string()]),
    "href": z.union([z.undefined(), z.string()]),
  }),
})

const video = defineCollection({
  type: 'data',
  schema: z.object({
    "title": z.string(),
    "poster": z.string(),
    "src": z.string()
  }),
})

const notes = defineCollection({
  type: 'content',
  schema: z.object({}),
})

export const collections = {
  dev, jobs, art, video, notes
};

