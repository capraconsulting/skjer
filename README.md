# CapraWeb

Dette repositoriet inneholder to applikasjoner: Sanity Studio under /studio og CapraWeb applikasjonen laget i SvelteKit under /app. Prosjektet har fått navnet CapraWeb for å inkludere hele nettsiden her i fremtiden. Foreløpig fokuserer vi på arrangementsdelen.

## Krav

### Verktøy

- [Node.js](https://nodejs.org/en/) (v18.19 eller senere)
- [PNPM](https://pnpm.io/installation) (9.0.6 eller senere)
- [Sanity CLI](https://www.sanity.io/docs/getting-started-with-sanity-cli) (anbefalt)
- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started) (anbefalt)
- [Vercel CLI](https://vercel.com/docs/cli) (valgfritt)

### Utvidelser

- ESLint
- EditorConfig
- Prettier
- Svelte
- Tailwind CSS IntelliSense

## Kom i gang

For å kjøre koden:

1. Be om environment variabler for lokal testing i kanalen #tmp_arrangementsoversikt. Du må selv opprette en .env fil i /studio og /app.

2. Installer dependencies:

```bash
cd capra-web
pnpm install
```

3.  Start dev serverene:

```bash
pnpm dev
```

- CapraWeb skal nå kjøre på [http://localhost:5173/](http://localhost:5173/)
- Sanity Studioet skal kjøre på [http://localhost:3333/](http://localhost:3333/)

NB: Du kan også starte dev serverne hver for seg i deres respektive mapper.

## Lag innhold til CapraWeb

1. Gå inn i Sanity Studio og legg til nye events, og trykk publiser
2. Besøk CapraWeb, eventuelt refresh siden, og se at innholdet vises

## Figma

Design droddling finner man her: [Capra design](https://www.figma.com/design/nQIBm3tpk1F7zo3QXEIjJs/Capra-design-drodling?node-id=4934-2547)

## Deployments

### Sanity

Sanity Studio blir deployet til [https://capra.sanity.studio/](https://capra.sanity.studio/). Vi vurderer muligheter for CI/CD, men foreløpig må du navigere til /studio og kjøre følgende kommando:

```bash
sanity deploy
```

Administrering av Sanity instansen kan gjøres via [https://www.sanity.io/manage/personal/project/<project-id>](https://www.sanity.io/manage/personal/project/<project-id>).

CapraWeb blir foreløpig deployet til [https://capra-web.vercel.app/](https://capra-web.vercel.app/) fra /app med følgenden kommando:

```bash
vercel deploy
```

Supabase Postgres database kan konfigures fra [https://supabase.com/dashboard/project/<project-id>](https://supabase.com/dashboard/project/<project-id>).

## Building

For å bygge en produksjonsversjon av CapraWeb, naviger til /app og kjør følgende kommando:

```bash
pnpm build
```

For å bygge en produksjonsversjon av Sanity studio, naviger til /studio og kjør følgende kommando:

```bash
pnpm build
```

## TypeScript Generering

### Sanity

For å generere typer av innholdsskjemaer, kjør følgende kommandoer fra /studio:

```sh
sanity schema extract --enforce-required-fields
sanity typegen generate
```

NB: Når sanity.model.ts er generert i /studio/models, skal den også kopieres til /app.

### Supabase

For å generere typer fra databasemodellen, kjør følgende kommando fra enten /studio eller /app:

```sh
supabase gen types typescript --project-id <project-id> database.model.ts
```

NB: Når database.model.ts er generert, må den legges til i både /studio og /app.

## Slack

Når et arrangement publiseres for første gang, vil det automatisk genereres en Slack-melding til kanalen #tmp*arrangementer. For å bygge meldingen kan du benytte [Block Kit Builder](https://app.slack.com/block-kit-builder/T025RMM9M#%7B%22blocks%22:%5B%7B%22type%22:%22header%22,%22text%22:%7B%22type%22:%22plain_text%22,%22text%22:%22Her%20er%20en%20tittel%20:loudspeaker:%22,%22emoji%22:true%7D%7D,%7B%22type%22:%22image%22,%22image_url%22:%22https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Placeholder_view_vector.svg/991px-Placeholder_view_vector.svg.png%22,%22alt_text%22:%22Image%22%7D,%7B%22type%22:%22context%22,%22elements%22:%5B%7B%22type%22:%22mrkdwn%22,%22text%22:%22_Beskrivelse%20av%20arrangementet*%22%7D%5D%7D,%7B%22type%22:%22section%22,%22fields%22:%5B%7B%22type%22:%22mrkdwn%22,%22text%22:%22*P%C3%A5melding:*%5Cn%3Cexample.com%7CMeld%20deg%20p%C3%A5%20her%3E%22%7D,%7B%22type%22:%22mrkdwn%22,%22text%22:%22*Kategori:*%5CnTech%22%7D%5D%7D,%7B%22type%22:%22section%22,%22fields%22:%5B%7B%22type%22:%22mrkdwn%22,%22text%22:%22*N%C3%A5r:*%5Cn25.01.03%22%7D,%7B%22type%22:%22mrkdwn%22,%22text%22:%22*Hvor:*%5CnOslo%22%7D%5D%7D%5D%7D)
