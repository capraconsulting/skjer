# CapraWeb

Dette repositoriet inneholder to applikasjoner: Sanity Studio under /studio og SvelteKit applikasjonen under /app. Prosjektet har fått navnet CapraWeb for å inkludere hele nettsiden her i fremtiden. Foreløpig fokuserer vi på arrangementsdelen.

Dette er et levende dokument og steder med denne arbeideren 👷 trenger hjelp!

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

1. Be om environment variabler for lokal testing i kanalen #tmp_arrangementsoversikt.
   Du må selv opprette en `.env` fil i /studio og /app.

2. Installer dependencies:

```bash
cd capra-web
pnpm install
```

3.  Start dev serverene:

```bash
pnpm dev
```

- SvelteKit skal nå kjøre på [http://localhost:5173/](http://localhost:5173/)
- Sanity Studio skal kjøre på [http://localhost:3333/](http://localhost:3333/)

NB: Du kan også starte dev serverne hver for seg i deres respektive mapper.

## Lag innhold til SvelteKit

1. Gå inn i Sanity Studio og legg til nye events, og trykk publiser
2. Besøk SvelteKit appen, eventuelt refresh siden, og se at innholdet vises

## Figma

Design drodling finner man her: [Nettside design](https://www.figma.com/design/ZFgYAb0tYd8LUwKMomOfBx/Nettsideting?node-id=1-664&t=96Kmh2v9JKb1BpLY-0)

👷 Venter på oppdatert Sanity views for Påmeldinger og Matallergier/preferanser
👷 Venter på oppdatert design for avmelding
👷 Venter på e-post template

## Sanity

### Deploy

Sanity Studio blir deployet til [https://capra.sanity.studio/](https://capra.sanity.studio/). Github Actions deploy utløses ved push til main-branch og endring i /studio. Det er også mulig å gjøre det manuelt ved å navigere til /studio og kjøre følgende kommando:

```bash
sanity deploy
```

Administrering av Sanity instansen kan gjøres via [https://www.sanity.io/manage/personal/project/<project-id>](https://www.sanity.io/manage/personal/project/<project-id>).

## Bygg

For å bygge en produksjonsversjon av Sanity studio lokalt, naviger deg til /studio og kjør følgende kommando:

```bash
pnpm build
```

Bygg bør alltid kjøres som en del av vår pull request policy 👷

## Lint

Sanity/SvelteKit templaten [sanity-template-sveltekit-clean](https://github.com/sanity-io/sanity-template-sveltekit-clean) hadde en broken eslint konfigurasjon. Har derfor prøvd å oppgradere til eslint 9 med flatconfig fra denne [issuen](https://github.com/sveltejs/eslint-plugin-svelte/issues/732). 👷 Det er en del lint-errors som må undersøkes.

## SvelteKit

### Deploy

SvelteKit blir foreløpig deployet til [https://capra-web.vercel.app/](https://capra-web.vercel.app/) fra /app med følgenden kommando:

```bash
vercel deploy
```

👷 Vi er på en Vercel-plan som ikke tillater bygg og deploy i en organisasjon. Må undersøke CI/CD-løsninger på et tidspunkt for å automatisere vår deploy prosess.

### Bygg

For å bygge en produksjonsversjon av SvelteKit lokalt, naviger til /app og kjør følgende kommando:

```bash
pnpm build
```

Bygg bør alltid kjøres som en del av vår pull request policy 👷

### TypeScript Generering

For å generere typer av innholdsskjemaer, kjør følgende kommandoer fra /studio:

```sh
sanity schema extract --enforce-required-fields
sanity typegen generate
```

NB: Når sanity.model.ts er generert i /studio/models, skal den også kopieres til /app.

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

Vi er på en trial versjon foreløpig 👷

## Slack

Når et arrangement publiseres for første gang, vil det automatisk genereres en Slack-melding til kanalen #tmp_arrangementer. For å bygge meldingen kan man benytte [Block Kit Builder](https://app.slack.com/block-kit-builder). Denne tjenesten lar deg visuelt designe layouten av meldingen med ulike blokker som knapper, tekstfelter og bilder.

## E-posthåndtering

E-post med kalenderinvitasjon (.ics-fil) sendes fra SvelteKit på serversiden. På grunn av manglende tilgang til en server fra Sanity, har vi satt opp et API-endepunkt i SvelteKit som Sanity kan kommunisere med for å sende e-post. Som SMTP host benytter vi oss av [Mandrill](https://mandrillapp.com/). Innlogging skjer via Capra sin Mailchimp bruker siden Mandrill er en underleverandær av dem.

### Påmelding

Når en bruker melder seg på et arrangement, utløses følgende prosess:

1. En e-postbekreftelse sendes til brukeren.
2. Denne e-posten inkluderer en kalenderinvitasjon med deltagerstatus satt som akseptert
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

1. Legg til `localhost` i `Access-Control-Allow-Origin`.
2. Fjern "development"-sjekker i funksjonskallene for å kjøre i lokalt miljø.

### Kalenderinvitasjon 👷

Vi kan kun oppdatere kalenderinvitasjoner som allerede er sendt ut. Vi har ikke toveis kommunikasjon gjennom kalenderinvitasjonene, og kan derfor ikke se endringer hvis en deltager svarer Ja, Kanskje eller Nei. For å løse dette, vurderer vi å sette opp en MandrillApp webhook som kan lytte på deltagerens svar. Inntil videre må avmeldinger skje via vår nettside.

---
