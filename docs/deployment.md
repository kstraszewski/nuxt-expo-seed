# Publikacja i wdrożenie

Repozytorium może być publicznym szablonem na osobistym GitHubie. Wdrożenie korzysta z osobistych projektów Vercel. Konta i zasoby każdego nowego produktu powinny być oddzielne od zasobów startera.

## GitHub

Utwórz nowe publiczne repozytorium i włącz **Template repository** w jego ustawieniach. Dzięki temu **Use this template** tworzy nowy projekt z własną historią zamiast kontynuować historię startera.

Przed publikacją sprawdź `git status`, ignorowanie `.env` oraz listę plików. W repozytorium mają być szablony `.env.example`, kod, migracje, lockfile i instrukcje. Klucze dostawców oraz lokalne pliki Vercel pozostają poza Gitem.

Połączenie repozytorium z Vercel daje deployment produkcyjny z głównej gałęzi i podglądy dla pozostałych gałęzi. CI wykonuje kontrole kodu. Migracje pozostają osobnym krokiem wdrożenia.

## Trzy projekty Vercel

Zaimportuj to samo repozytorium trzy razy, za każdym razem wybierając inny katalog aplikacji.

| Projekt    | Root Directory | Framework | Build        | Output                     |
| ---------- | -------------- | --------- | ------------ | -------------------------- |
| Landing    | `apps/landing` | Nuxt.js   | `pnpm build` | Automatycznie z Nuxt/Nitro |
| CRM        | `apps/crm`     | Nuxt.js   | `pnpm build` | Automatycznie z Nuxt/Nitro |
| Mobile web | `apps/mobile`  | Other     | `pnpm build` | `dist`                     |

Użyj instalacji `pnpm install --frozen-lockfile` i wersji Node zgodnej z głównym `package.json`. Dla aplikacji korzystających z pakietów workspace włącz dołączanie plików spoza Root Directory. Nie dodawaj pola `rootDirectory` do `vercel.json`, bo jest to ustawienie projektu w Vercel.

Pierwsze wdrożenie może działać jako demo. CRM dostaje `SEED_MODE=demo`. Mobile bez `EXPO_PUBLIC_API_URL` pokazuje samodzielny podgląd. Landing dostaje linki do rzeczywistych adresów obu aplikacji.

Przed utworzeniem projektów sprawdź aktywne konto lub osobisty team Vercel. Nazwa zespołu w konfiguracji CLI nie powinna być odziedziczona z innej firmy.

## Włączenie live na Vercel

1. Przygotuj osobną bazę Neon. Wybierz region blisko funkcji Vercel, na przykład Frankfurt dla projektu obsługującego Europę.
2. Zapisz sekrety w projekcie CRM: `DATABASE_URL`, `BETTER_AUTH_SECRET`, `RESEND_API_KEY` oraz pozostałe wartości z `apps/crm/.env.example`.
3. Ustaw `BETTER_AUTH_URL` na rzeczywisty origin CRM i `TRUSTED_ORIGINS` na dokładną listę klientów. Ustaw `SEED_MODE=live`.
4. Zastosuj migracje przez bezpośrednie połączenie `DATABASE_URL_UNPOOLED`, po sprawdzeniu docelowej gałęzi Neon.
5. Wykonaj nowy deployment CRM, a następnie zaktualizuj publiczne adresy w landing i konfigurację klienta mobile.
6. Sprawdź rzeczywisty przepływ logowania, dane dwóch użytkowników i obsługę e-maili.

Nie umieszczaj sekretów w parametrach URL ani w polach `NUXT_PUBLIC_*` i `EXPO_PUBLIC_*`. Nie dodawaj migracji do `buildCommand`. Preview powinno mieć własną bazę lub gałąź Neon oraz własny sekret.

## Sesja mobile web i różne domeny

Aplikacja natywna korzysta z integracji Better Auth Expo i bezpiecznego magazynu urządzenia. Statyczny klient web podlega polityce cookies przeglądarki.

Oddzielne adresy `*.vercel.app` nie stanowią wspólnej domeny aplikacji dla sesji. Samo dodanie CORS i `TRUSTED_ORIGINS` może nie wystarczyć do przesyłania cookies. Produkcyjny web klient mobile powinien korzystać z przemyślanej konfiguracji własnych domen oraz cookies albo z proxy API pod tym samym originem. Zweryfikuj to na docelowych domenach w przeglądarce. Domyślny podgląd mobile startera pozostaje bez backendu.

## iOS i Android

Vercel hostuje web export Expo. Natywne paczki powstają w EAS lub lokalnych narzędziach platformy.

W `apps/mobile`:

```sh
pnpm dlx eas-cli whoami
pnpm dlx eas-cli init
pnpm dlx eas-cli build --profile development --platform ios
pnpm dlx eas-cli build --profile preview --platform android
pnpm dlx eas-cli build --profile production --platform all
```

Przed `eas init` zmień nazwę aplikacji, scheme, `ios.bundleIdentifier` i `android.package`. Linkuj własny projekt Expo. `eas.json` zawiera profile startowe, bez identyfikatora cudzego projektu i bez certyfikatów.

Build produkcyjny i wysłanie do sklepu to osobne etapy. Publikacja wymaga kont Apple Developer i Google Play, podpisywania oraz metadanych produktu. Sprawdź logowanie i deep linki w podpisanej aplikacji przed submission.

## Sprawdzenie po wdrożeniu

- Każdy deployment ma stan READY, a jego strona odpowiada poprawnie.
- Linki landing prowadzą do właściwych aplikacji.
- Demo jest opisane jako demo. Live używa właściwej bazy i nadawcy.
- Prywatne endpointy odrzucają żądania bez sesji.
- Konto B nie odczytuje ani nie zmienia kontaktu konta A.
- Rejestracja i reset hasła dostarczają poprawne wiadomości na testowe konto.
- Mobile natywne zachowuje sesję i poprawnie wraca z linków.

Zapisz w raporcie, które z tych kontroli rzeczywiście wykonano. Status READY nie zastępuje testu integracji z Neon, Better Auth i Resend.
