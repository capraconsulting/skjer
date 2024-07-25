# CapraWeb

UI med [Svelte](https://svelte.dev) og [React](https://react.dev)\
Server side rendering med [SvelteKit](https://kit.svelte.dev)\
Styling med [Tailwind](https://tailwindcss.com)\
Hosted hos [Vercel](https://vercel.com/)\
Innhold og bilder i [Sanity](https://www.sanity.io)

En MVP løsning for administrasjon og visning av både interne og eksterne arrangementer hos Liflig, Fryde og Capra. Dette inkluderer fagsirkler, konferanser, frokostseminarer og sosiale begivenheter. Prosjektet har fått navnet CapraWeb for å inkludere hele nettsiden her i fremtiden. Foreløpig fokuserer vi på arrangementsdelen.

Dette er et levende dokument, denne arbeideren 👷 betyr at vi trenger hjelp!

## Kanban

Kanban board finner man her: [Notion](https://www.notion.so/capra/bc8fb2179c96417f9277b68124793f0e?v=e3a8a020427c4548b3c4628958d10817)

## Figma

Design drodling finner man her: [Nettside design](https://www.figma.com/design/ZFgYAb0tYd8LUwKMomOfBx/Nettsideting?node-id=1-664&t=96Kmh2v9JKb1BpLY-0)

- 👷 Venter på oppdatert Sanity views for Påmeldinger og Matallergier/preferanser
- 👷 Venter på oppdatert design for avmelding
- 👷 Venter på e-post template

## Krav

### Verktøy

- [Node.js](https://nodejs.org) (v18.19 eller senere)
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

## Komme i gang

For å kjøre koden:

1. Be om environment variabler for lokal testing i kanalen [#tmp_arrangementsoversikt]().
   Du må selv opprette en `.env` fil i /studio og /app.

2. Installer dependencies:

```bash
cd capra-web/app
pnpm install

cd capra-web/studio
pnpm install
```

3.  Start dev serverene:

```bash
cd capra-web/app
pnpm dev

cd capra-web/studio
pnpm dev
```

- SvelteKit skal nå kjøre på [http://localhost:5173](http://localhost:517/)
- Sanity Studio skal kjøre på [http://localhost:3333](http://localhost:3333)

NB: Du kan også starte dev serverne hver for seg i deres respektive mapper.

## Sanity

### Bygg

For å bygge en produksjonsversjon av Sanity studio lokalt, naviger deg til /studio og kjør følgende kommando:

```bash
pnpm build
```

Bygg bør alltid kjøres som en del av vår pull request policy 👷

### Deploy

Sanity Studio blir deployet til [https://capra.sanity.studio](https://capra.sanity.studio).
GitHub Actions CI/CD deploy kjører automatisk ved push til main-branch og ved endringer i /studio mappen. Alternativt kan deploy også utføres manuelt ved å navigere til /studio-katalogen og kjøre følgende kommando:

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

### Lage Innhold

1. Gå inn i Sanity Studio og legg til nye events, og trykk publiser
2. Besøk SvelteKit appen, eventuelt refresh siden, og se at innholdet vises

## SvelteKit

### Bygg

For å bygge en produksjonsversjon av SvelteKit lokalt, naviger til /app og kjør følgende kommando:

```bash
pnpm build
```

Bygg bør alltid kjøres som en del av vår pull request policy 👷

### Deploy

SvelteKit blir foreløpig deployet til [https://capra-web.vercel.app](https://capra-web.vercel.app) fra /app med følgenden kommando:

```bash
vercel deploy
```

👷 Vi er på en Vercel-plan som ikke tillater bygg og deploy i en organisasjon. Må undersøke CI/CD-løsninger på et tidspunkt for å automatisere vår deploy prosess.

### Lint

SvelteKit templaten [sanity-template-sveltekit-clean](https://github.com/sanity-io/sanity-template-sveltekit-clean) har en eslint konfigurasjon som ikke funker. Har prøvd å oppgradere til eslint 9 med flatconfig fra denne [issuen](https://github.com/sveltejs/eslint-plugin-svelte/issues/732). 👷 Det er en del lint-errors som må undersøkes.

### CRON

CRON jobben "daily-event-cleaner" kjører daglig i vercel for å finne arrangementer som ble avsluttet for mer enn 7 dager siden. Sletter deretter database arrangementer, deltagerinformasjonen og matpreferanser for å sikre samsvar med GDPR regelverket. Sanity arrangementet beholdes.

## Supabase

Supabase Postgres database kan konfigures fra [https://supabase.com/dashboard/project/<project-id>](https://supabase.com/dashboard/project/<project-id>).

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

## Plausible

Plausible tilbyr en måte å analysere trafikk på nettstedet. Den er fritt for cookies og samler ingen personopplysninger. Vi trenger derfor ingen cookie consent. For å integrere Plausible er det lagt til et sporingsskriptet i HTML-headeren. Sporingen for å måle og analysere besøksstatistikk vises i et Sanity dashboard.

Vi er på en trial-plan foreløpig 👷

## Slack

Når et arrangement publiseres for første gang, vil det automatisk genereres en Slack-melding til kanalen #tmp_arrangementer. For å bygge meldingen kan man benytte [Block Kit Builder](https://app.slack.com/block-kit-builder). Denne tjenesten lar deg visuelt designe layouten av meldingen med ulike blokker som knapper, tekstfelter og bilder.

## E-posthåndtering

E-post med kalenderinvitasjon (.ics-fil) sendes fra SvelteKit på serversiden. På grunn av manglende tilgang til en server fra Sanity, har vi satt opp et API-endepunkt i SvelteKit som Sanity kan kommunisere med for å sende e-post. Som SMTP host benytter vi oss av [Mandrillapp](https://mandrillapp.com/). Autentisering skjer via Mailchimp.

E-post domene for alle selskaper må verifiseres. Vi er på en trial-plan her og 👷

### Påmelding

Når en bruker melder seg på et arrangement, utløses følgende prosess:

1. En e-postbekreftelse sendes til brukeren.
2. Denne e-posten inkluderer en kalenderinvitasjon med deltagerstatus satt som akseptert.
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

### Endring av Tid/Lokasjon

Hvis tid eller lokasjon for et arrangement endres i Sanity, følges denne prosessen:

1. Brukeren får en dialogboks for å bekrefte endringen.
2. En e-post sendes til alle påmeldte deltagere for å informere om ny tid/lokasjon.
3. Den eksisterende kalenderinvitasjonen oppdateres med de nye detaljene, slik at deltagerne har oppdatert informasjon i sine kalendere.

### Avlysing av Arrangement

Ved avlysing av et arrangement i Sanity:

1. Brukeren får en dialogboks for å bekrefte avlysningen.
2. En e-post sendes ut til alle påmeldte deltagere for å informere om avlysningen.
3. Kalenderinvitasjonen markeres som avlyst i deltagerens kalender.
4. Arrangementet blir avpublisert i Sanity og tittelen blir markert med "Avlyst"

### Testing av E-post Lokalt

For å teste e-postfunksjonaliteten lokalt:

1. Fjern "development"-sjekker i funksjonskallene for å kjøre i lokalt miljø.
2. For å teste e-post sendt fra Sanity: Legg til `http://localhost:3333` i `Access-Control-Allow-Origin`.

### Kalenderinvitasjon 👷

Vi kan kun oppdatere kalenderinvitasjoner som allerede er sendt ut. Vi har ikke toveis kommunikasjon gjennom kalenderinvitasjonene, og kan derfor ikke se endringer hvis en deltager svarer Ja, Kanskje eller Nei. For å løse dette, vurderer vi å sette opp en MandrillApp webhook som kan lytte på deltagerens svar. Inntil videre må avmeldinger skje via vår nettside.

---
