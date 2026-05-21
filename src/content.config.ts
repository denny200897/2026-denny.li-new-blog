import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
	loader: glob({ pattern: "*.md", base: "src/content/blog" }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		pubDate: z.coerce.date(),
		tags: z.array(z.string()).optional(),
	}),
});

const experiences = defineCollection({
	loader: glob({ pattern: "*.md", base: "src/content/experiences" }),
	schema: z.object({
		title: z.string(),
		organization: z.string().optional(),
		pubDate: z.coerce.date(),
		result: z.string().optional(),
	}),
});

const activities = defineCollection({
	loader: glob({ pattern: "*.md", base: "src/content/activities" }),
	schema: z.object({
		title: z.string(),
		pubDate: z.coerce.date(),
		location: z.string().optional(),
	}),
});

export const collections = { blog, experiences, activities };
