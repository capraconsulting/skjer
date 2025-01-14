# Skjer

En løsning for administrasjon og visning av både interne og eksterne arrangementer hos Capra, Fryde og Liflig.
Dette inkluderer fagsirkler, konferanser, frokostseminarer og sosiale begivenheter.

UI med [Svelte](https://svelte.dev) og [React](https://react.dev)\
Server side rendering med [SvelteKit](https://kit.svelte.dev)\
Styling med [Tailwind](https://tailwindcss.com)\
Hosted hos [Vercel](https://vercel.com/)\
Innhold og bilder i [Sanity](https://www.sanity.io)

**Nyttige lenker**

[Kanban board i Notion](https://www.notion.so/capra/bc8fb2179c96417f9277b68124793f0e?v=e3a8a020427c4548b3c4628958d10817)

[Figma design](https://www.figma.com/design/ZFgYAb0tYd8LUwKMomOfBx/Nettsideting?node-id=1-664)

**Verktøy**

- [Node.js](https://nodejs.org) (se .node-version)
- [PNPM](https://pnpm.io/installation) (9.0.6 eller senere)
- [Sanity CLI](https://www.sanity.io/docs/getting-started-with-sanity-cli) (anbefalt)
- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started) (anbefalt)
- [Vercel CLI](https://vercel.com/docs/cli) (valgfritt)

## Komme i gang

For å kjøre koden lokalt:

1. Be om environment variabler for lokal testing i kanalen [#skjer]().
   Du må selv opprette en `.env.local` fil i både /studio og /app.

Hvis du trenger tilgang til Sanity Studio, eventuelt Google Console, Vercel og Supabase, må dette også spesifikt forespørres.

2. Installer dependencies:

```bash
pnpm install
```

3. Kjør følgende 2 kommandoer i hver sin tab i terminalen for å starte dev serverene:

```bash
pnpm -F app dev
```

```bash
pnpm -F studio dev
```

- SvelteKit applikasjonen skal nå kjøre på [http://localhost:5173](http://localhost:517/)
- Sanity Studio skal kjøre på [http://localhost:3333](http://localhost:3333)

## Sanity

Vi har to dataset i Sanity studio, en for dev testing og en for produksjon.

### Bygg

For å bygge en produksjonsversjon av Sanity studio lokalt, naviger deg til /studio og kjør følgende kommando:

```bash
pnpm -F studio build
```

Bygg bør alltid kjøres som en del av vår pull request policy 👷

### Deploy

Sanity Studio blir deployet til [https://capra.sanity.studio](https://capra.sanity.studio).
GitHub Actions deploy kjører automatisk ved push til main-branch og ved endringer i /studio mappen. Alternativt kan deploy også utføres manuelt ved å navigere til /studio og kjøre følgende kommando:

```bash
sanity deploy
```

Administrering av Sanity instansen kan gjøres via [https://www.sanity.io/manage/personal/project/<project-id>](https://www.sanity.io/manage/personal/project/<project-id>).

### TypeScript Generering

For å generere typer av innholdsskjemaer, kjør følgende kommandoer fra /studio:

```sh
sanity schema extract --enforce-required-fields
sanity typegen generate
```

NB: Når sanity.model.ts er generert i /studio/models, skal den også kopieres til /app.

## SvelteKit

### Bygg

For å bygge en produksjonsversjon av SvelteKit lokalt kjør:

```bash
pnpm -F app build
```

Bygg bør alltid kjøres som en del av vår pull request policy 👷

### Deploy

SvelteKit blir foreløpig deployet til [https://capra-web.vercel.app](https://capra-web.vercel.app) fra /app med følgenden kommando:

```bash
vercel deploy
```

### Lint

SvelteKit templaten [sanity-template-sveltekit-clean](https://github.com/sanity-io/sanity-template-sveltekit-clean) har en eslint konfigurasjon som ikke funker. Har prøvd å oppgradere til eslint 9 med flatconfig fra denne [issuen](https://github.com/sveltejs/eslint-plugin-svelte/issues/732). 👷 Det er en del lint-errors som må undersøkes.

## Supabase

Postgres-databasen kan konfigures fra [https://supabase.com/dashboard/project/<project-id>](https://supabase.com/dashboard/project/<project-id>). Vi har to prosjekter i supabase dashboardet, en for dev testing og en for produksjon.

### TypeScript Generering

For å generere typer fra databasemodellen, kjør følgende kommando fra enten /studio eller /app:

```sh
supabase gen types typescript --project-id <project-id> database.model.ts
```

NB: Når database.model.ts er generert, må den legges til i både /studio og /app.

## Testing

Vi bruker Playwright for e2e-testing i Sveltekit-appen. Disse ligger under app/src/lib/e2e.

For å kjøre alle testene:

```bash
pnpm playwright test
```

Vil du kjøre kun en enkelt test, sleng på filnavnet på slutten:

```bash
pnpm playwright test example.spec.ts
```

Vil du klikke deg rundt i browser for å se hva som skjer i testene, sleng på `--ui` på slutten 🚀 Vi trenger flere tester 👷!

## Slack

Når et arrangement publiseres for første gang, vil det automatisk genereres en Slack-melding til kanalen #tmp_arrangementer. For å bygge meldingen kan man benytte [Block Kit Builder](https://app.slack.com/block-kit-builder). Denne tjenesten lar deg visuelt designe layouten av meldingen med ulike blokker som knapper, tekstfelter og bilder.

## E-posthåndtering

E-post med kalenderinvitasjon (.ics-fil) sendes fra SvelteKit på serversiden. På grunn av manglende tilgang til en server fra Sanity, har vi satt opp et API-endepunkt i SvelteKit som Sanity kan kommunisere med for å sende e-post. Som SMTP host benytter vi oss av [Mandrillapp](https://mandrillapp.com/). Autentisering skjer via Mailchimp.

E-post domene for alle selskaper må verifiseres. Vi er på en trial-plan her og 👷

### Testing av E-post Lokalt

For å teste e-postfunksjonaliteten lokalt:

1. Fjern "development"-sjekker i funksjonskallene for å kjøre i lokalt miljø.
2. For å teste e-post sendt fra Sanity: Legg til `http://localhost:3333` i `Access-Control-Allow-Origin`.

### Kalenderinvitasjon 👷

Vi kan kun oppdatere kalenderinvitasjoner som allerede er sendt ut. Vi har ikke toveis kommunikasjon gjennom kalenderinvitasjonene, og kan derfor ikke se endringer hvis en deltager svarer Ja, Kanskje eller Nei. For å løse dette, vurderer vi å sette opp en MandrillApp webhook som kan lytte på deltagerens svar. Inntil videre må avmeldinger skje via vår nettside.

---

## Sanity Arbeidsflyt

### Publisering

1. Gå inn i Sanity Studio og legg først til et nytt arrangement, og trykk "Publiser".
2. Når et arrangement publiseres, blir det automatisk opprettet et arrangement i Postgres-databasen.
3. Besøk SvelteKit appen, eventuelt refresh siden, og se at innholdet vises.

Hvis tid eller lokasjon for et publisert arrangement endres i Sanity, følges denne prosessen:

1. En dialogboks for å bekrefte endringen vises.
2. En e-post sendes til alle påmeldte deltagere for å informere om ny tid/lokasjon.
3. Den eksisterende kalenderinvitasjonen oppdateres med de nye detaljene, slik at deltagerne har oppdatert informasjon i kalenderen.
4. Innhodet blir publisert på nytt.

### Avpublisering

1. Gå inn i Sanity Studio og trykk "Avpubliser" på et publisert arrangement.
2. Arrangement blir avpublisert og vises ikke i SvelteKit-appen.

Innholdet kan republiseres uten noen konsekvenser.

### Sletting

1. Gå inn i Sanity Studio og trykk "Slett".
2. En dialogboks for å bekrefte slettingen vises.
3. Arrangementinformasjon lagret i Sanity og Postgres-databasen blir permanent slettet.

### Avlysning

1. Gå inn i Sanity Studio og trykk "Avlys arrangement".
2. En dialogboks for å bekrefte avlysningen vises.
3. En e-post sendes ut til alle påmeldte deltagere for å informere om avlysningen.
4. Kalenderinvitasjonen markeres som avlyst i deltagerens kalender.
5. Arrangementet blir avpublisert i Sanity og innholdet blir "Read only".

Innholdet kan ikke republiseres på nytt, men kan dupliseres for nytt bruk.

### Opprydding av Arrangementer

For å oppfylle GDPR-krav og spare lagringsplass, slettes arrangementer fra Postgres-databasen som ble avsluttet for mer enn 7 dager siden. Dette håndteres av CRON-jobben "daily-event-cleaner". Innholdet forblir lagret i Sanity.

## SvelteKit Arbeidsflyt

### Påmelding

Når en bruker melder seg på et arrangement, utløses følgende prosess:

1. En e-postbekreftelse sendes til brukeren.
2. E-posten inkluderer en kalenderinvitasjon med deltagerstatus satt som akseptert.
3. Kalenderinvitasjonen legges automatisk inn i deltagerens kalender, slik at arrangementet blir synlig i kalenderen umiddelbart etter påmelding.

### Avmelding

Avhengig av om deltageren er intern eller ekstern, håndteres avmeldinger på forskjellige måter:

#### Interne deltagere

1. Når en intern deltager melder seg av et arrangement, sendes en bekreftelses e-post som informerer om at avmeldingen er mottatt.
2. Kalenderinvitasjonen oppdateres samtidig til å vise status som avslått.

#### Eksterne deltagere

1. Eksterne deltagere som ønsker å melde seg av, mottar først en e-post med en lenke for å bekrefte avmeldingen.
2. Når mottaker klikker på bekreftelseslenken og den blir godkjent på nettsiden, sendes en ny e-post som bekrefter avmeldingen.
3. Kalenderinvitasjonen oppdateres til å vise status som avslått, på samme måte som for interne deltagere.
