# Skillsy projektu

Repozytorium zawiera 46 skillsów w `.agents/skills`. To 17 krótkich instrukcji opisujących decyzje startera oraz 29 pełnych skillsów upstream z referencjami, przykładami, licencjami i zapisanym pochodzeniem. Cały zestaw trafia do nowego projektu razem z kodem.

Instrukcje `seed-*` mówią, jak pracować w tym konkretnym monorepo. Skillsy upstream opisują właściwe użycie bibliotek i usług. Agent powinien wczytać odpowiedni skill i potrzebne referencje, zamiast ładować wszystkie instrukcje do każdego zadania.

## Skillsy upstream

| Obszar                  | Zainstalowane skillsy                                                                                                         | Źródło                      | Licencja   |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ---------- |
| Nuxt UI                 | `nuxt-ui`                                                                                                                     | `nuxt/ui`, gałąź v4         | MIT        |
| Vue                     | `vue-best-practices`, `vue-debug-guides`, `vue-testing-best-practices`, `create-adaptable-composable`                         | `vuejs-ai/skills`           | MIT        |
| Expo, struktura i UI    | `expo-overview`, `expo-project-structure`, `expo-router`, `expo-ui`, `expo-native-ui`, `expo-design-system`, `expo-animation` | `expo/skills`               | MIT        |
| Expo, dane i utrzymanie | `expo-data-fetching`, `expo-upgrade`, `expo-dev-client`, `expo-examples`                                                      | `expo/skills`               | MIT        |
| EAS                     | `eas-app-stores`, `eas-workflows`, `eas-simulator`                                                                            | `expo/skills`               | MIT        |
| Neon                    | `neon`, `neon-postgres`                                                                                                       | `neondatabase/agent-skills` | Apache-2.0 |
| Resend                  | `resend`, `email-best-practices`                                                                                              | `resend/resend-skills`      | MIT        |
| Turborepo               | `turborepo`                                                                                                                   | `vercel/turborepo`          | MIT        |
| Vercel                  | `vercel-cli`, `deployments-cicd`, `env-vars`, `bootstrap`, `verification`                                                     | `vercel/vercel-plugin`      | Apache-2.0 |

Nuxt UI, Expo, Neon, Resend, Turborepo i Vercel pochodzą z repozytoriów dostawców. Zestaw Vue pochodzi z ekosystemu `vuejs-ai`, z którego korzysta również Nuxt Skill Hub. Przy rozbieżności API sprawdź wersję biblioteki i jej oficjalną dokumentację.

Nuxt UI zawiera między innymi instrukcje themingu, formularzy, layoutów landing i dashboard oraz tabel. Expo ma osobne, pełne instrukcje systemu wizualnego, natywnych komponentów i animacji. Wcześniejsze krótkie wskazówki startera nie zastępują tych materiałów.

Skillsy EAS opisują workflow na przyszłość. Sama obecność instrukcji nie oznacza utworzenia projektu EAS, uruchomienia symulatora ani opublikowania aplikacji w sklepie. Nie dołączamy instrukcji dla nieużywanych funkcji takich jak App Clips, brownfield, Neon AI Gateway czy React Email.

## Instrukcje własne startera

| Skill                 | Kiedy go użyć                                             |
| --------------------- | --------------------------------------------------------- |
| `seed-design-system`  | Wspólny motyw `@seed/ui`, tokeny, typografia i komponenty |
| `seed-nuxt`           | Strony Nuxt, SSR, endpointy i runtime config              |
| `seed-nuxt-ui`        | Lokalne konwencje Nuxt UI i granice wspólnej warstwy      |
| `seed-better-auth`    | Rejestracja, logowanie, sesje i reset hasła               |
| `seed-neon-postgres`  | Neon, Drizzle, schemat i migracje startera                |
| `seed-resend`         | Lokalne szablony transakcyjne i nadawca                   |
| `seed-expo-overview`  | Wybór workflow mobilnej aplikacji startera                |
| `seed-expo-structure` | Rozmieszczenie plików mobilnych w monorepo                |
| `seed-expo-router`    | Routing i powrót z uwierzytelniania                       |
| `seed-expo-native-ui` | Granice natywnej warstwy interfejsu                       |
| `seed-expo-data`      | Kontrakt CRM, żądania HTTP i sesje mobile                 |
| `seed-expo-upgrade`   | Aktualizacja SDK i zgodność zależności                    |
| `seed-eas`            | Własne identyfikatory produktu i przygotowanie dostawy    |
| `seed-turborepo`      | Taski, cache i granice workspace                          |
| `seed-vercel-deploy`  | Trzy projekty Vercel i sprawdzenie wdrożenia              |
| `seed-environment`    | Pliki `.env`, sekrety i środowiska                        |
| `seed-quality`        | Testy i zakres końcowej weryfikacji                       |

Nuxt Skill Hub może ponadto generować lokalne instrukcje dopasowane do zainstalowanych modułów przy `nuxt prepare`. Pliki generowane są ignorowane w Git. W CI moduł pomija generowanie. Utrzymywany zestaw 46 skillsów jest dostępny także bez tego kroku.

## Instalacja, sprawdzenie i aktualizacja

```sh
pnpm skills:check
pnpm skills:install
pnpm skills:refresh
```

`skills:check` działa offline. Porównuje pliki upstream z zapisanymi sumami SHA-256, więc wykrywa brakujący plik i bezpośrednią zmianę importowanej instrukcji.

`skills:install` odtwarza wyłącznie wybrane katalogi ze wskazanych commitów. Nie instaluje niczego globalnie i nie pobiera pełnych repozytoriów ani `node_modules`. Wymaga sieci. Nie nadpisuje lokalnych zmian, które nie odpowiadają lockfile.

`skills:refresh` jest świadomą aktualizacją. Sprawdza bieżące commity wybranych gałęzi źródłowych, pobiera wyłącznie wybrane skillsy i zapisuje nowy lockfile. Po wykonaniu przejrzyj diff instrukcji, źródeł i licencji oraz sprawdź zgodność z zainstalowanymi bibliotekami. Zmiana instrukcji nie aktualizuje automatycznie zależności aplikacji. Opcja `--force` nadpisuje lokalne zmiany, więc używaj jej dopiero po ich zachowaniu lub świadomym odrzuceniu.

Polecenia odpowiadają bezpośrednio `node scripts/sync-skills.mjs --check`, `--install` i `--refresh`. Skrypt wymaga Node zgodnego ze starterem oraz dostępu HTTPS do publicznego GitHub i serwera licencji Apache. Publiczne API GitHub ma limity, więc ponowne odtwarzanie całego zestawu nie powinno być krokiem każdego builda. Kontrola offline może działać w CI.

## Pochodzenie, adaptacja i licencje

- [skills-sources.json](skills-sources.json) określa wybrane repozytoria, gałęzie, ścieżki i licencje.
- [skills-upstream-lock.json](skills-upstream-lock.json) zapisuje dokładne commity, URL źródeł, rozmiary i sumy plików.
- Każdy importowany skill ma `SOURCE.json`, `UPSTREAM-LICENSE` oraz pełny oryginał entrypointu w `UPSTREAM-SKILL.md`. Apache-2.0 ma dodatkowo pełny tekst licencji, jeśli plik dostawcy zawiera tylko skróconą deklarację.
- [skills-manifest.json](skills-manifest.json) opisuje autorskie instrukcje i łączny zestaw.

Metadane entrypointów `SKILL.md` zostały dostosowane do pól wspieranych przez Codex. Treść instrukcji i referencje pozostają niezmienione. Oryginalne metadane, w tym dodatkowe pola pluginów, można sprawdzić w `UPSTREAM-SKILL.md`. Lockfile zapisuje osobno sumę oryginału i wynikowej adaptacji. Skrypt odtwarza ją deterministycznie.

Nie edytuj importowanych instrukcji, aby dopisać regułę tego projektu. Dodaj taką decyzję do odpowiedniego `seed-*` lub `AGENTS.md`. Importowane pliki są wyłączone z Prettier, żeby zachować weryfikowalne sumy i pochodzenie. Instrukcje `seed-*` są oryginalne i mają licencję MIT startera. Materiały upstream zachowują własne licencje.

## Better Auth i zakres instrukcji

Repozytorium [better-auth/skills](https://github.com/better-auth/skills) zawiera szersze instrukcje `better-auth-best-practices`, tworzenia auth, email/password i bezpieczeństwa. Sprawdzone źródło nie deklaruje licencji repozytorium i nie ma pliku LICENSE. Dlatego publiczny starter korzysta z własnego `seed-better-auth` oraz linków do oficjalnej dokumentacji, zamiast redystrybuować tę treść jako MIT.

Dokumentacja auth: [Better Auth](https://www.better-auth.com/docs), [Nuxt](https://www.better-auth.com/docs/integrations/nuxt), [Expo](https://www.better-auth.com/docs/integrations/expo). Sprawdzaj ją dla wersji zapisanej w lockfile. Zainstalowane instrukcje dostawcy w środowisku konkretnego agenta można wykorzystać lokalnie.

Starter pozostaje przy wybranej architekturze. Instrukcje Neon nie są poleceniem zastąpienia istniejącego Better Auth, a przykłady Next.js w skillu Vercel nie zmieniają aplikacji Nuxt. Demo nie wymaga połączenia z Vercel ani provisioning usług. Reguły `bootstrap` o linkowaniu dotyczą konfiguracji prawdziwych zasobów, nie obejrzenia demonstracyjnego UI.

Skillsy nie nadają zgody na wysyłanie wiadomości, zmianę kont ani publikację. Takie działania nadal wynikają z bieżącego zadania użytkownika.
