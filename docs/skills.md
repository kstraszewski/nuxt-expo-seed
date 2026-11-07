# Skillsy projektu

Repozytorium zawiera 16 krótkich skillsów w `.agents/skills`. Są częścią startera, więc trafiają razem z nim do każdego nowego projektu. `AGENTS.md` wskazuje je również agentom, które nie odkrywają tego katalogu automatycznie.

Instrukcje opisują konkretne granice i decyzje tego monorepo. Przed zmianą API każą sprawdzić zainstalowaną wersję i dokumentację jej odpowiadającą. Nie zastępują dokumentacji bibliotek.

Podczas `nuxt prepare` moduł Nuxt Skill Hub generuje również lokalne instrukcje dopasowane do zainstalowanych modułów Nuxt. Te katalogi są ignorowane w Git. Po świeżej instalacji należy wykonać krok prepare aplikacji, zanim agent będzie potrzebował tej dodatkowej wiedzy.

| Skill                 | Kiedy go użyć                                |
| --------------------- | -------------------------------------------- |
| `seed-nuxt`           | Strony Nuxt, SSR, endpointy i runtime config |
| `seed-nuxt-ui`        | Formularze, tabele i komponenty Nuxt UI      |
| `seed-better-auth`    | Rejestracja, logowanie, sesje i reset hasła  |
| `seed-neon-postgres`  | Neon, Drizzle, schemat i migracje            |
| `seed-resend`         | Wiadomości transakcyjne i nadawca            |
| `seed-expo-overview`  | Wybór właściwego workflow Expo               |
| `seed-expo-structure` | Rozmieszczenie plików mobilnych              |
| `seed-expo-router`    | Routing, linki i powrót z uwierzytelniania   |
| `seed-expo-native-ui` | Ekrany i kontrolki natywne                   |
| `seed-expo-data`      | Żądania HTTP i sesje mobile                  |
| `seed-expo-upgrade`   | Aktualizacja SDK i zgodność zależności       |
| `seed-eas`            | Buildy natywne i przygotowanie sklepów       |
| `seed-turborepo`      | Taski, cache i granice workspace             |
| `seed-vercel-deploy`  | Trzy projekty Vercel i sprawdzenie wdrożenia |
| `seed-environment`    | Pliki `.env`, sekrety i środowiska           |
| `seed-quality`        | Testy i zakres końcowej weryfikacji          |

## Pochodzenie i licencja

Skillsy `seed-*` są oryginalnymi instrukcjami przygotowanymi dla tego startera i udostępnionymi na jego licencji MIT. Nie są kopiami komercyjnych pluginów ani prywatnych skillsów autora. Nie zawierają osobistych ścieżek, identyfikatorów kont i sekretów.

Każdy `SKILL.md` zawiera odnośniki do oficjalnej dokumentacji. Maszynowa lista, zakres i źródła znajdują się w [skills-manifest.json](skills-manifest.json). Dokumentacja zewnętrzna zachowuje własne prawa i licencje. Sam odnośnik nie oznacza, że jej treść została dołączona do repozytorium.

Data przygotowania instrukcji: 7 listopada 2026. Zgodność należy sprawdzać przy aktualizacji bibliotek. Skille nie utrwalają numerów wersji jako wiecznego zalecenia.

## Opcjonalne instrukcje dostawców

Jeśli agent potrzebuje szerszych instrukcji, sprawdź oficjalne źródło i licencję, a potem zainstaluj tylko wybrane skillsy w projekcie. Zachowaj ich źródła i wersję lub commit. Nie ma potrzeby instalowania niepowiązanych skillsów tylko dlatego, że są dostępne.

- Nuxt: [Nuxt Skill Hub](https://github.com/onmax/nuxt-skill-hub).
- Nuxt UI: [skills w repozytorium Nuxt UI](https://github.com/nuxt/ui/tree/v4/skills).
- Better Auth: [better-auth/skills](https://github.com/better-auth/skills).
- Neon: [neondatabase/agent-skills](https://github.com/neondatabase/agent-skills).
- Resend: [resend/resend-skills](https://github.com/resend/resend-skills).
- Turborepo: [vercel/turborepo](https://github.com/vercel/turborepo/tree/main/skills).
- Expo: [instrukcje AI w dokumentacji Expo](https://docs.expo.dev/llms.txt).
- Vercel: [dokumentacja platformy](https://vercel.com/docs).

Instalowanie instrukcji dostawcy nie daje zgody na wysyłkę danych, zmianę kont ani publikację. Zakres zewnętrznych działań nadal wynika z bieżącego zlecenia użytkownika.
