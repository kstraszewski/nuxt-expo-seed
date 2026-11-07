# Nuxt Expo Seed

Uniwersalna baza nowego projektu oparta na Nuxt, Vue i Expo. Repozytorium zawiera landing page, CRM, aplikację mobilną oraz wspólne pakiety do bazy danych, logowania, e-maili i walidacji. Landing i CRM dziedziczą wspólny motyw Nuxt UI inspirowany aktualnym koonrad.dev, z fontem Inter Tight, niebieskim akcentem i limonkowym markerem. Repozytorium zachowuje ogólne treści i dane startera.

Starter działa w trybie demonstracyjnym bez konta Neon i bez klucza Resend. Tryb `live` łączy CRM i aplikację mobilną z prawdziwym backendem. To osobny etap konfiguracji opisany poniżej.

## Adresy startera

Repozytorium i podglądy tej bazy. Stan wdrożenia można sprawdzić w GitHub i Vercel.

| Element                | Adres                                                                          |
| ---------------------- | ------------------------------------------------------------------------------ |
| Publiczne repozytorium | [kstraszewski/nuxt-expo-seed](https://github.com/kstraszewski/nuxt-expo-seed)  |
| Landing                | [nuxt-expo-seed-landing.vercel.app](https://nuxt-expo-seed-landing.vercel.app) |
| CRM demo               | [nuxt-expo-seed-crm.vercel.app](https://nuxt-expo-seed-crm.vercel.app)         |
| Podgląd mobile web     | [nuxt-expo-seed-mobile.vercel.app](https://nuxt-expo-seed-mobile.vercel.app)   |

## Szybki start

Wymagania: Node.js 22.22 lub nowszy zgodny z używaną wersją Expo, pnpm 10 oraz Git. Dokładną wersję pnpm wskazuje pole `packageManager` w głównym `package.json`.

```sh
corepack enable
pnpm install
pnpm setup:env
pnpm env:check
pnpm dev
```

`pnpm setup:env` tworzy brakujące pliki `.env` z szablonów aplikacji. Generuje też losowy sekret Better Auth dla lokalnego CRM. Nie wyświetla sekretów i nie zmienia istniejących plików.

- Landing: http://localhost:3000
- CRM i backend HTTP: http://localhost:3001
- Expo: uruchom osobno `pnpm dev:mobile`, potem wybierz platformę w terminalu.

Do pracy tylko nad jedną aplikacją służą `pnpm dev:landing`, `pnpm dev:crm` i `pnpm dev:mobile`.

## Co jest w środku

| Obszar                     | Technologia                          | Miejsce           |
| -------------------------- | ------------------------------------ | ----------------- |
| Landing page               | Nuxt, Vue, Nuxt UI, Tailwind CSS     | `apps/landing`    |
| CRM i HTTP API             | Nuxt, Vue, Nuxt UI, Nitro            | `apps/crm`        |
| iOS, Android i podgląd web | Expo, React Native, Expo Router      | `apps/mobile`     |
| PostgreSQL                 | Neon, Drizzle ORM i migracje SQL     | `packages/db`     |
| Logowanie i sesje          | Better Auth i integracja Expo        | `packages/auth`   |
| E-maile transakcyjne       | Resend                               | `packages/email`  |
| Kontrakty danych           | TypeScript, Zod                      | `packages/shared` |
| Monorepo                   | pnpm workspaces i Turborepo          | katalog główny    |
| Wspólny motyw web          | Warstwa Nuxt UI, tokeny i typografia | `packages/ui`     |
| Instrukcje dla agentów     | `AGENTS.md` i skillsy projektu       | `.agents/skills`  |

Wersje zależności są zapisane w manifestach i `pnpm-lock.yaml`. Nowy projekt zaczyna od sprawdzonego zestawu. Aktualizacje powinny przechodzić przez ten sam zestaw kontroli co zmiany kodu, szczególnie w Expo, gdzie React Native i biblioteki natywne muszą pasować do SDK.

Narzędzia TypeScript i ESLint są dobrane do wsparcia frameworków i pluginów. TypeScript 6.0.3 pozostaje w zestawie ze względu na zakres wsparcia narzędzi Vue, mimo dostępności nowszego wydania głównego. Pakiety Expo korzystają ze zgodnego zestawu SDK, zamiast niezależnych numerów `latest`.

## Własna baza i prawdziwe logowanie

1. Utwórz własny projekt Neon i osobną gałąź do pracy lokalnej. Skopiuj pooled URL do `DATABASE_URL`, a direct URL do `DATABASE_URL_UNPOOLED` w `apps/crm/.env`.
2. Skonfiguruj własną domenę nadawcy w Resend. Ustaw `RESEND_API_KEY` i `EMAIL_FROM`.
3. W `apps/crm/.env` ustaw `SEED_MODE=live`, poprawny `BETTER_AUTH_URL`, `TRUSTED_ORIGINS` i `MOBILE_SCHEME`. Zachowaj własny losowy `BETTER_AUTH_SECRET`.
4. Sprawdź konfigurację, a następnie zastosuj migracje do wybranej bazy.

```sh
pnpm env:check --live
pnpm db:migrate
pnpm dev:crm
```

5. W `apps/mobile/.env` ustaw `EXPO_PUBLIC_API_URL` na origin CRM. W telefonie użyj adresu LAN komputera albo wdrożonego adresu HTTPS. `localhost` w telefonie oznacza telefon.
6. Sprawdź rejestrację, weryfikację e-maila, logowanie, obsługę kontaktów, wylogowanie i reset hasła. Sprawdź też, że drugie konto nie widzi kontaktów pierwszego.

Walidator środowiska sprawdza obecność i format konfiguracji. Nie wykonuje połączenia z dostawcami ani nie wysyła wiadomości. Szczegóły zmiennych i różnice między demo a live są w [docs/environment.md](docs/environment.md).

## Polecenia

| Polecenie               | Działanie                                         |
| ----------------------- | ------------------------------------------------- |
| `pnpm setup:env`        | Tworzy lokalne pliki `.env`, zachowuje istniejące |
| `pnpm env:check`        | Sprawdza konfigurację aktualnego trybu            |
| `pnpm env:check --live` | Sprawdza wymagania konfiguracji live              |
| `pnpm dev`              | Uruchamia aplikacje webowe                        |
| `pnpm dev:landing`      | Uruchamia landing na porcie 3000                  |
| `pnpm dev:crm`          | Uruchamia CRM i API na porcie 3001                |
| `pnpm dev:mobile`       | Uruchamia Expo                                    |
| `pnpm typecheck`        | Sprawdza TypeScript w aplikacjach i pakietach     |
| `pnpm lint`             | Sprawdza reguły kodu                              |
| `pnpm format:check`     | Sprawdza formatowanie Prettier                    |
| `pnpm format`           | Formatuje kod i dokumentację                      |
| `pnpm test`             | Uruchamia testy zachowania wspólnych pakietów     |
| `pnpm test:e2e`         | Uruchamia demonstracyjne testy web w Chromium     |
| `pnpm build`            | Buduje Nuxt i eksportuje aplikację Expo do web    |
| `pnpm db:generate`      | Generuje migrację po zmianie schematu             |
| `pnpm db:migrate`       | Stosuje zapisane migracje do wskazanej bazy       |
| `pnpm db:studio`        | Otwiera Drizzle Studio dla wskazanej bazy         |
| `pnpm check`            | Łączy env:check, typecheck, lint, test i build    |

Migracje nie uruchamiają się automatycznie podczas budowania aplikacji.

Przed pierwszym uruchomieniem E2E zainstaluj przeglądarkę:

```sh
pnpm exec playwright install chromium
pnpm test:e2e
```

Playwright sam uruchamia serwery Nuxt na portach 3000 i 3001. Testy używają trybu demo i domyślnych lokalnych adresów z szablonów. CI wykonuje również sprawdzenie formatowania oraz E2E. `pnpm check` obejmuje kontrole kodu i build, a `pnpm test:e2e` uruchamiasz osobno. Testy demonstracyjne i izolowane testy pakietów nie zastępują sprawdzenia prawdziwego Neon, e-maili Resend i aplikacji na urządzeniu.

## Nowy projekt z tego repozytorium

Na GitHubie wybierz **Use this template**, jeśli repozytorium jest oznaczone jako szablon. Możesz też sklonować repozytorium i zmienić `origin`. Nowy projekt powinien dostać własne repozytorium, projekty Vercel, bazę Neon, klucze Resend i sekret Better Auth.

Zmień nazwy aplikacji, adresy, mobile scheme i identyfikatory pakietów mobilnych. Zrób to przed konfiguracją linków logowania i buildów sklepowych. Pełna lista jest w [docs/new-project.md](docs/new-project.md).

## Wdrożenie i praca agentów

- [Architektura i granice pakietów](docs/architecture.md)
- [Zmienne środowiskowe](docs/environment.md)
- [GitHub, Vercel i EAS](docs/deployment.md)
- [Instrukcja nowego projektu](docs/new-project.md)
- [Wspólny motyw Nuxt UI](docs/design-system.md)
- [Skillsy i źródła instrukcji](docs/skills.md)
- [Zasady pracy dla agentów](AGENTS.md)

Na Vercel trafiają dwa serwery Nuxt i statyczny eksport web aplikacji Expo. Publikacja natywnych aplikacji iOS i Android wymaga EAS, własnych identyfikatorów, podpisywania i kont w sklepach. Ten starter dostarcza konfigurację wyjściową, bez cudzych danych i certyfikatów.
