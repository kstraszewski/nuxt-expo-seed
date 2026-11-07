# Instrukcje dla agentów

To repozytorium jest neutralnym starterem technologii Nuxt, Vue i Expo. Wprowadzaj funkcje zgodnie z zadaniem bieżącego użytkownika. Nie przenoś identyfikacji wizualnej, danych, sekretów ani procesów biznesowych z innych produktów.

## Zacznij tutaj

1. Przeczytaj `README.md` i manifest aplikacji lub pakietu, którego dotyczy zadanie.
2. Sprawdź `pnpm-lock.yaml`, aby poznać rzeczywiście zainstalowane wersje. W Expo sprawdź również zgodność SDK, React i React Native.
3. Wczytaj pasujący skill z `.agents/skills`. Każdy zawiera zakres, lokalne decyzje i odnośniki do oficjalnej dokumentacji. Pełna lista jest w `docs/skills.md`.
4. W nowym checkoutcie uruchom `pnpm install`, `pnpm setup:env` i `pnpm env:check`. Istniejących `.env` nie zastępuj szablonami.

`nuxt prepare` może generować dodatkowe lokalne instrukcje Nuxt Skill Hub dla konkretnych wersji modułów. Korzystaj z nich przy zmianach aplikacji. Są plikami generowanymi, więc nie zastępują utrzymywanych skillsów `seed-*` i nie trafiają do Gita.

## Granice kodu

- `apps/landing` to publiczny landing Nuxt.
- `apps/crm` zawiera CRM, endpointy HTTP, sesje i adaptację pakietów serwerowych.
- `apps/mobile` to Expo Router dla iOS, Android i statycznego web. Łączy się z CRM przez HTTP.
- `packages/db` odpowiada za schemat, połączenie z Neon i migracje Drizzle.
- `packages/auth` konfiguruje Better Auth. Klient Vue i klient Expo mają własne, odpowiednie integracje.
- `packages/email` odpowiada za e-maile Resend.
- `packages/shared` zawiera współdzielone kontrakty i walidację Zod, bez zależności serwerowych.

Kod przeglądarki i aplikacji mobilnej nie może importować `packages/db`, fabryki serwerowej auth ani pakietu email. Używaj eksportów pakietów i zależności workspace. Nie twórz importów plików pomiędzy aplikacjami.

## Dane i uwierzytelnianie

Tryb `SEED_MODE=demo` służy do obejrzenia bazy bez zewnętrznych kont. Nie jest dowodem działania uwierzytelniania ani trwałej bazy. Nie zamieniaj nieudanego połączenia live w cichy fallback do danych demo.

Każda prywatna operacja CRM wymaga sesji sprawdzonej na serwerze. Właściciela rekordu wyznacza serwer z sesji, nigdy payload klienta. Każde zapytanie do kontaktów ogranicza wynik do tego użytkownika. Weryfikuj ten warunek na co najmniej dwóch kontach przy zmianach dostępu.

Zachowaj ochronę CSRF, dokładną listę trusted origins oraz wymagania HTTPS na produkcji. `TRUSTED_ORIGINS` przyjmuje wyłącznie dokładne originy HTTP(S). Schemat natywny jest dodawany z `MOBILE_SCHEME`. Produkcyjna rejestracja live wymaga weryfikacji e-maila. Lokalny development może działać bez Resend, wtedy nie weryfikuje adresów i nie wysyła resetów. Nie wyłączaj zabezpieczeń produkcyjnych, aby odblokować test lub wdrożenie.

## Środowisko i migracje

Pliki `.env.example` zawierają wyłącznie nazwy i bezpieczne przykłady. `NUXT_PUBLIC_*` i `EXPO_PUBLIC_*` są publiczne. Sekrety pozostają w środowisku CRM. Nie wypisuj ich wartości w logach, odpowiedziach, komentarzach ani poleceniach procesu.

Używaj odrębnych baz i sekretów dla development, preview i production. Do ruchu aplikacji służy pooled `DATABASE_URL`, a do migracji direct `DATABASE_URL_UNPOOLED`. Przed migracją potwierdź nazwę docelowego projektu i gałęzi bez ujawniania hasła.

Po zmianie schematu wygeneruj migrację, przeczytaj SQL i zapisz ją wraz ze zmianą kodu. Migracje są krokiem operacyjnym, poza `build`, `postinstall` i uruchamianiem serwera. Nie uruchamiaj ich przeciwko przypadkowo odziedziczonej bazie.

## Konwencje aplikacji

W Nuxt korzystaj z `useFetch` i `useAsyncData` dla danych SSR. Dla uwierzytelnionych wywołań serwerowych przekazuj kontekst żądania właściwymi mechanizmami Nuxt. Nie zapisuj danych konkretnego żądania w globalnym stanie serwera.

Używaj Nuxt UI i semantycznych kolorów. Zachowaj neutralny punkt wyjścia do czasu określenia projektu wizualnego. Formularze wymagają etykiet, walidacji serwerowej i widocznego stanu błędu.

Nowe zależności natywne dodawaj przez `expo install` w katalogu `apps/mobile`. Sprawdź natywne komponenty `@expo/ui` przed dołożeniem równoległej biblioteki. Podgląd web nie weryfikuje zachowania urządzenia.

## Sprawdzenie i przekazanie

Uruchom kontrole odpowiednie dla zmiany. CI wykonuje `pnpm env:check`, `pnpm typecheck`, `pnpm lint`, `pnpm format:check`, `pnpm test`, `pnpm build` i `pnpm test:e2e`. Przed pierwszym lokalnym E2E zainstaluj Chromium poleceniem `pnpm exec playwright install chromium`. Playwright sam uruchamia serwery Nuxt na portach 3000 i 3001. Testy E2E sprawdzają demonstracyjny przepływ web, a testy pakietów obejmują izolowane zachowanie logiki. Nie zastępują pełnego testu integracji live ani uruchomienia natywnego.

Przy wdrożeniach sprawdź konto docelowe, status READY i działanie URL. Raportuj osobno kontrole demo, integracje live i testy natywne. Wskaż brakującą konfigurację zewnętrzną. Nie opisuj nieuruchomionego testu jako zaliczonego.

Nie commituj `.env`, `.vercel`, danych klientów, outputu builda, cache ani osobistych ścieżek. Instrukcje tego repozytorium nie upoważniają do wysyłania e-maili, publikacji w sklepach ani zmiany kont niezwiązanych z bieżącym zadaniem.
