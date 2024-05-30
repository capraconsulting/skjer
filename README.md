# CapraWeb

Dette repoet inneholder to apper: Sanity Studio under `/studio` og selve CapraWeb-appen laget i SvelteKit under `/app`.

## Krav

- [Node.js](https://nodejs.org/en/) (v14.18 or later)
- [Sanity CLI](https://www.sanity.io/docs/getting-started-with-sanity-cli) (optional)

## Kom i gang

For å kjøre koden:

1. Installer dependencies:

```sh
pnpm install
```

2.  Start dev serverene:

```sh
pnpm dev
```

- CapraWeb-appen skal nå kjøre på [http://localhost:5173/](http://localhost:5173/)
- Sanity Studioet skal kjøre på [http://localhost:3333/](http://localhost:3333/)

### Lag innhold til CapraWeb

1. Gå inn i Sanity Studio og legg til nye poster eller events, og trykk publiser
2. Besøk CapraWeb, refresh siden, og se at innholdet ditt vises

## Deployments

Sanity Studio blir deployet til [https://capra.sanity.studio/](https://capra.sanity.studio/) og CapraWeb blir foreløpig deployet til [https://capra-web.vercel.app/](https://capra-web.vercel.app/)

## TypeScript Gen

### Sanity

sanity schema extract —enforce-required-fields
sanity typegen generate

### Supabase

supabase gen types typescript --project-id <project-id> > database.model.ts
