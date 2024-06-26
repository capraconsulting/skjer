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

Design drodling finner man her: [Nettside design](https://www.figma.com/design/ZFgYAb0tYd8LUwKMomOfBx/Nettsideting?node-id=1-664&t=96Kmh2v9JKb1BpLY-0)

## Deploy

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

## Bygg

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

## Testing

Vi bruker Playwright for e2e-testing i Sveltekit-appen. Disse ligger under app/src/lib/e2e.

For å kjøre alle testene:

```
pnpm playwright test
```

Vil du kjøre kun en enkelt test, sleng på filnavnet på slutten:

```
pnpm playwright test example.spec.ts
```

Vil du klikke deg rundt i browser for å se hva som skjer i testene, sleng på `--ui` på slutten 🚀

## Slack

Når et arrangement publiseres for første gang, vil det automatisk genereres en Slack-melding til kanalen #tmp\*arrangementer For å bygge meldingen kan du benytte [Block Kit Builder](https://app.slack.com/block-kit-builder). Denne tjenesten tillater deg å visuelt designe layouten av dine Slack-meldinger med ulike blokker som knapper, tekstfelter og bilder for en mer engasjerende kommunikasjon.

## Mandrillapp

Hvis du vil teste e-post lokalt, kan du legge til http://localhost:5173 i Access-Control-Allow-Origin i /app/src/lib/auth/cors.ts.
I tillegg må denne linjen kommenteres ut:

```
process.env.MODE !== "development"
```

## Sentry

Sentry brukes for å overvåke, logge og rapportere klientfeil.

## Plausible

Plausible tilbyr en g måte å analysere trafikk på nettstedet. Det er et open-source alternativ til tradisjonelle analyseverktøy som Google Analytics. Plausible er fritt for cookies og samler ingen personopplysninger.
Vi trenger derfor ingen cookie consent. For å integrere Plausible er det lagt til et sporingsskriptet i HTML-headeren. Sporingen for å måle og analysere besøksstatistikk vises i Sanity studio.

# Legges inn i Notion

## App Features

| Status | Feature                             | Alle                                                                                | Intern                                                          |
| ------ | ----------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| ✅     | Liste over kommende arrangementer   | Viser alle synlige arrangementer                                                    | Viser alle synlige og lukkede arrangementer, samt påmeldinginfo |
| ✅     | Liste over tidligere arrangementer  | Viser alle tidligere arrangementer                                                  | Samme                                                           |
| ✅     | Filtrering av liste arrangementer   | Viser filtreringsbokser                                                             | Samme                                                           |
| ✅     | Visning av arrangement              | Viser ikke deltagere                                                                | Viser interne deltagere                                         |
| ✅     | Påmeldingsskjema                    | Viser alle skjema felter. Interne kan ikke bruke dette skjemaet.                    | Viser alle felter utenom vanlige personopplysninger             |
| ✅     | Påmeldingsskjema e-post             | Sender e-post bekreftelse                                                           | Samme                                                           |
| ✅     | Påmeldingsskjema kalenderinvitasjon | Kalenderinvitasjon sendes som akseptert og blir lagt til i kalender                 | Samme                                                           |
| ✅     | Avmeldingsskjema                    | Viser inputfelt for e-post                                                          | Viser kun knapp for avmelding                                   |
| ✅     | Avmeldingsskjema e-post             | Sender e-psot avmelding token som må bekreftes. Sender ny e-post etter bekreftelse. | Sender e-post bekreftelse, men trenger ikke å bekrefte          |
| ✅     | Avmeldingsskjema kalenderinvitasjon | Kalenderinvitasjonen blir avslått i kalenderen                                      | Samme                                                           |

NB. Vi kan kun oppdatere kalenderinvitasjonen som allerede er sendt ut. Vi har ikke en toveis kommunikasjon gjennom kalenderinvitasjonen, og kan derfor ikke se endringer hvis en deltager svarer Ja, Kanskje eller Nei. En avmelding skal skje via vår nettside.

## Sanity Features
