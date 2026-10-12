<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Kopi Kita Design Rules

1. Use semantic tokens from `app/globals.css`; never put raw hex, rgb, oklch, or Tailwind palette colors in app/components files.
2. Add any needed color token to `globals.css` before using it.
3. Use only `rounded-sm`, `rounded-md`, `rounded-lg`, or `rounded-xl` and Tailwind spacing scale values.
4. Use at most two fonts, one accent color, and one primary action per screen.
5. Reuse `components/ui` before creating a UI primitive. Inputs require labels and visible keyboard focus.
