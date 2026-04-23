import { createRootRouteWithContext, createRoute, Outlet } from '@tanstack/react-router'
import type { QueryClient } from '@tanstack/react-query'
import { Layout } from './components/Layout'
import { JobsPage } from './pages/JobsPage'
import { JobDetailPage } from './pages/JobDetailPage'
import { NewJobPage } from './pages/NewJobPage'
import { AboutPage } from './pages/AboutPage'

interface RouterContext {
  queryClient: QueryClient
}

const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <Layout>
      <Outlet />
    </Layout>
  ),
})

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: JobsPage,
})

const jobDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/jobs/$jobId',
  component: JobDetailPage,
})

const newJobRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/new',
  component: NewJobPage,
})

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
})

export const routeTree = rootRoute.addChildren([
  indexRoute,
  jobDetailRoute,
  newJobRoute,
  aboutRoute,
])
