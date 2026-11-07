# Nowy projekt ze startera

Najpierw utwórz własne repozytorium przez **Use this template** albo sklonuj starter i zmień remote. Zachowaj lockfile, aby zacząć od sprawdzonego zestawu zależności.

## Tożsamość projektu

- Zmień nazwę w głównym `package.json` i opis w `README.md`.
- Wybierz własne nazwy aplikacji i projekty Vercel.
- Zmień nazwę, slug i scheme w konfiguracji Expo.
- Ustaw własne `ios.bundleIdentifier` i `android.package` przed pierwszym buildem.
- Dopasuj `MOBILE_SCHEME` i trusted origins CRM do konfiguracji Expo.
- Zastąp ogólne teksty i własną treścią, a wygląd zaprojektuj według nowego produktu.

Nazwy workspace `@seed/*` można zmienić, ale należy wtedy poprawić wszystkie zależności, importy, filtry Turborepo i polecenia w instrukcjach. Nie jest to wymagane do lokalnego uruchomienia.

## Własne zasoby

- Utwórz nowy projekt Neon z gałęzią development oraz produkcją.
- Wygeneruj nowe sekrety Better Auth osobno dla każdego środowiska.
- Utwórz własny klucz Resend i zweryfikuj domenę nadawcy.
- Skonfiguruj osobne środowiska Vercel Preview i Production.
- Połącz własny projekt EAS, jeśli aplikacja ma trafić na urządzenia.

Starter ma służyć jako kodowa baza. Nie kopiuj do nowego produktu lokalnych plików `.env`, powiązań `.vercel`, projektu EAS ani certyfikatów podpisywania.

## Pierwsza funkcja produktu

Ustal, które przykładowe elementy CRM rzeczywiście są potrzebne. Usuń nieużywane przykłady. Współdzielony kontrakt API umieść w `packages/shared`, reguły dostępu na serwerze CRM, a wygląd w odpowiednich aplikacjach.

Jeśli produkt wymaga zespołów lub wielu organizacji, zaprojektuj model członkostwa przed rozszerzeniem przykładowego `ownerId`. Dołączenie pola organizacji do formularza nie zapewnia uprawnień do jej danych.

## Gotowość do pracy zespołu

```sh
pnpm install
pnpm setup:env
pnpm env:check
pnpm typecheck
pnpm lint
pnpm format:check
pnpm test
pnpm build
pnpm exec playwright install chromium
pnpm test:e2e
```

Dopisz do `AGENTS.md` decyzje charakterystyczne dla nowego produktu. Usuń nieaktualne przykłady i uzupełnij instrukcję wdrożenia o nazwy własnych projektów, bez sekretów. Sprawdź, że nowa osoba może uruchomić demo wyłącznie na podstawie repozytorium.
