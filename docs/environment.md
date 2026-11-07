# Zmienne środowiskowe

Każda aplikacja ma własny `.env.example`. `pnpm setup:env` kopiuje go do lokalnego `.env`, o ile taki plik jeszcze nie istnieje. W CRM zastępuje wartość `BETTER_AUTH_SECRET` losowym sekretem. Pliki wynikowe są lokalne i nie trafiają do repozytorium.

```sh
pnpm setup:env
pnpm env:check
pnpm env:check --live
```

Zmienne ustawione przez proces, CI lub Vercel mają pierwszeństwo przed lokalnymi plikami podczas sprawdzania. Walidator nie wyświetla ich wartości. Nie sprawdza działania usług sieciowych.

## CRM

| Zmienna                   | Znaczenie                                              | Tryb live                    |
| ------------------------- | ------------------------------------------------------ | ---------------------------- |
| `SEED_MODE`               | `demo` albo `live`                                     | `live`                       |
| `DATABASE_URL`            | Pooled connection string PostgreSQL dla aplikacji      | Wymagana                     |
| `DATABASE_URL_UNPOOLED`   | Direct connection string do migracji                   | Wymagana przy `db:migrate`   |
| `BETTER_AUTH_SECRET`      | Własny losowy sekret, minimum 32 znaki                 | Wymagana                     |
| `BETTER_AUTH_URL`         | Origin CRM, lokalnie `http://localhost:3001`           | Wymagana, HTTPS na produkcji |
| `TRUSTED_ORIGINS`         | Dokładne dozwolone originy, rozdzielone przecinkiem    | Wymagana                     |
| `MOBILE_SCHEME`           | Scheme aplikacji bez `://`, domyślnie `nuxt-expo-seed` | Wymagana                     |
| `RESEND_API_KEY`          | Klucz Resend, przechowywany tylko na serwerze          | Wymagana                     |
| `EMAIL_FROM`              | Nadawca na zweryfikowanej domenie Resend               | Wymagana                     |
| `NUXT_PUBLIC_LANDING_URL` | Publiczny link do landing page                         | Dostosuj do wdrożenia        |

Przykładowe lokalne originy to `http://localhost:3001,http://localhost:8081`. Ta zmienna przyjmuje tylko dokładne originy HTTP(S), bez końcowego ukośnika, ścieżek i wildcardów. Schemat aplikacji natywnej jest dodawany automatycznie na podstawie `MOBILE_SCHEME`. Nie wpisuj `nuxt-expo-seed://` do `TRUSTED_ORIGINS`. Na produkcji użyj konkretnych adresów HTTPS.

Sekret wygenerowany lokalnie nie powinien zostać wspólnym sekretem dla wszystkich projektów i środowisk. Każde środowisko live potrzebuje własnej wartości. Zmiana aktywnego sekretu może unieważnić istniejące sesje.

## Landing

| Zmienna                  | Znaczenie                            |
| ------------------------ | ------------------------------------ |
| `NUXT_PUBLIC_CRM_URL`    | Adres CRM używany przez linki        |
| `NUXT_PUBLIC_MOBILE_URL` | Adres statycznego web exportu mobile |

Obie zmienne są publiczne. Landing nie potrzebuje kluczy Neon, Better Auth ani Resend.

## Mobile

| Zmienna               | Znaczenie                                                            |
| --------------------- | -------------------------------------------------------------------- |
| `EXPO_PUBLIC_API_URL` | Origin CRM. Pusta wartość uruchamia samodzielny podgląd bez backendu |

Typowe wartości lokalne:

- Przeglądarka i symulator iOS: `http://localhost:3001`.
- Android Emulator: `http://10.0.2.2:3001`.
- Telefon w tej samej sieci: `http://ADRES_LAN_KOMPUTERA:3001`.
- Wdrożony backend: własny adres HTTPS CRM.

`EXPO_PUBLIC_*` jest wbudowywane w aplikację. Po zmianie zmiennej uruchom ponownie Metro lub wykonaj nowy eksport/build. Nie umieszczaj tu żadnych sekretów. Web export i aplikacja natywna mogą korzystać z tego samego CRM, ale potrzebują właściwej konfiguracji originów i scheme.

## Demo i live

Demo pozwala zobaczyć strukturę aplikacji bez usług zewnętrznych. Widoczne dane przykładowe nie potwierdzają zapisu w Neon ani działania prawdziwej sesji.

Pełny tryb live wymaga bazy z zastosowanymi migracjami, konfiguracji Better Auth i nadawcy Resend. Test powinien przejść przez rejestrację, weryfikację wiadomości, logowanie, kontakt CRM, wylogowanie i reset hasła. Samo `env:check` sprawdza konfigurację, nie wykonuje tego testu.

Kod auth dopuszcza lokalny development bez Resend. W takim przypadku nie wymaga weryfikacji e-maila i nie wysyła resetów hasła. Produkcja wymaga nadawcy i weryfikacji. `pnpm env:check --live` sprawdza pełną konfigurację z Resend także lokalnie, aby przygotować cały przepływ do wdrożenia.

## Środowiska Vercel

Ustaw zmienne oddzielnie w każdym projekcie Vercel. CRM ma sekrety. Landing i mobile mają publiczne adresy. Preview używa osobnej gałęzi Neon i własnego sekretu. Nie kieruj testowych migracji do bazy produkcyjnej.

Po dodaniu albo zmianie zmiennej wykonaj nowy deployment. `.env` i pobrane przez CLI pliki `.vercel` nie mogą trafić do Gita, logów ani artefaktów publicznego CI.
