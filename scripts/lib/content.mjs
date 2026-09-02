import { createServer } from 'vite'

/**
 * Loads the site's TypeScript content modules inside Node.
 *
 * The build scripts need the same `src/content/*.ts` data the app uses, but Node
 * cannot import TypeScript with unextensioned specifiers. Booting Vite in
 * middleware mode and going through `ssrLoadModule` reuses the project's own
 * resolution and transform pipeline, so the scripts and the app can never read
 * different data.
 */
export async function withContent(fn) {
  const server = await createServer({
    appType: 'custom',
    server: { middlewareMode: true },
    logLevel: 'error',
    optimizeDeps: { noDiscovery: true, include: [] },
  })

  try {
    const [routes, portfolio, site, resume, seo, evidence] = await Promise.all([
      server.ssrLoadModule('/src/content/routes.ts'),
      server.ssrLoadModule('/src/content/portfolio.ts'),
      server.ssrLoadModule('/src/content/site.ts'),
      server.ssrLoadModule('/src/content/resume.ts'),
      server.ssrLoadModule('/src/content/seo.ts'),
      server.ssrLoadModule('/src/content/evidence.ts'),
    ])

    return await fn({ routes, portfolio, site, resume, seo, evidence })
  } finally {
    await server.close()
  }
}
