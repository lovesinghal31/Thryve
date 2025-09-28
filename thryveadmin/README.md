This is the Thryve Admin Dashboard built with Next.js 15 App Router, Tailwind CSS, shadcn/ui components, Axios, and React Query.

## Getting Started

1. Install dependencies (added React Query, Recharts, React Hook Form):

```bash
npm install
```

2. Create an `.env.local` with your API base (must include `/api/v1` path):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api/v1
```

3. (Optional) If you store access tokens outside httpOnly cookies, set them in `localStorage` under key `accessToken` – or replace logic in `src/lib/api/client.ts` with your auth solution.

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The admin dashboard lives under `/dashboard` route group using the layout in `app/(dashboard)/layout.tsx`.

## Structure Overview

```
src/
	app/
		(dashboard)/
			layout.tsx              # Dashboard layout (sidebar + header + React Query provider)
			dashboard/page.tsx      # KPI metrics & charts
			users/page.tsx          # Users list (filters, pagination, revoke sessions)
			users/[id]/page.tsx     # User public detail + revoke
			institutions/add/page.tsx # Add institution form
	components/
		users/                    # Feature-specific user components
		institutions/             # Institution form
		dashboard/                # Metric & chart components
		ui/                       # shadcn/ui primitives
	hooks/                      # React Query hooks
	lib/api/                    # Axios client & resource wrappers
	types/                      # Shared TypeScript interfaces
```

## API Layer

All resource calls are centralized in `src/lib/api/*` with typed responses derived from `API_SPEC.md`. Adjust:

```ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';
```

Add auth header logic or refresh-token handling inside `client.ts` interceptors (currently minimal).

## React Query

Configured in `src/lib/react-query.tsx` and provided at the dashboard layout level. Default stale time is 30s; override per hook if required.

## Customization Points

- Token handling: replace localStorage retrieval in `client.ts`.
- Error toasts: centralize using Axios interceptor or wrap mutations.
- Access control: add a middleware or server component guard if public routes must be protected.
- Charts: Add more metric visualizations using `recharts` as backend supplies new fields.

## Scripts

Standard Next.js scripts (`dev`, `build`, `start`, `lint`).

## Future Enhancements

- Add institution list & edit when backend endpoints exist.
- Implement session refresh / silent re-auth pattern.
- Add role-based UI gating in navigation.
- Expand metrics caching / skeleton states.

## License

Internal project – add licensing details here if needed.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
