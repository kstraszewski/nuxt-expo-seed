# Wspólny motyw Nuxt UI

Landing i CRM korzystają z jednej warstwy Nuxt `@seed/ui` w `packages/ui`. Obie aplikacje rozszerzają ją przez `extends: ['@seed/ui']`. To właściwe miejsce do zmiany typografii, kolorów, geometrii komponentów i wspólnych klas.

Kierunek wizualny został wybrany na podstawie aktualnej strony głównej [koonrad.dev](https://koonrad.dev). To Inter Tight, papierowe tło, ciemny tekst, niebieski akcent i limonkowy marker. W repozytorium pozostają ogólne nazwy, treści i dane startera. Referencja wizualna nie oznacza przenoszenia danych osobowych, zdjęć ani treści innego produktu.

## Gdzie zmieniać wygląd

| Miejsce                                | Odpowiedzialność                                    |
| -------------------------------------- | --------------------------------------------------- |
| `packages/ui/nuxt.config.ts`           | Konfiguracja wspólnej warstwy i domyślny tryb jasny |
| `packages/ui/app/app.config.ts`        | Globalne warianty i sloty komponentów Nuxt UI       |
| `packages/ui/app/assets/css/main.css`  | Fonty, palety, semantyczne tokeny i wspólne klasy   |
| `apps/landing/app/assets/css/main.css` | Wyłącznie reguły charakterystyczne dla landing page |
| `apps/crm/app/assets/css/main.css`     | Wyłącznie reguły charakterystyczne dla CRM          |

Font Inter Tight Variable jest dostarczany lokalnie przez `@fontsource-variable/inter-tight`, z zestawami Latin i Latin Extended. Aplikacja nie wymaga pobierania fontu z zewnętrznego serwera w czasie wyświetlania strony.

## Tokeny i komponenty

Paleta `cobalt` zasila `primary`, `citron` zasila `secondary`, a szarości odpowiadają neutralnym powierzchniom. Kod aplikacji korzysta z semantycznych kolorów Nuxt UI, na przykład `text-default`, `bg-elevated`, `border-default` i `text-primary`.

Tokeny `--ui-*` definiują tekst, tła, obramowania, promień, szerokość kontenera i wysokość nagłówka. Tokeny `--seed-highlight-*` odpowiadają za marker, a `--seed-poster-*` za niebieskie powierzchnie z jasnym tekstem. Zmiana marki nowego projektu powinna zaczynać się od tej warstwy.

Wspólne klasy to `seed-kicker`, `seed-title`, `seed-highlight`, `seed-stat`, `seed-brand`, `seed-brand-mark`, `seed-poster` i `seed-focus`. Nie twórz w aplikacjach ich lekko zmienionych kopii. Jeśli nowe zachowanie ma być wspólne, zmień warstwę.

Formularze, tabele, przyciski i okna korzystają z prawdziwych komponentów Nuxt UI. Globalne nadpisania zmieniają ich wygląd. Nie zastępują semantyki, obsługi klawiatury ani walidacji. Przy zmianie slotów sprawdź dokumentację zainstalowanej wersji Nuxt UI i pełny skill `nuxt-ui`.

## Weryfikacja

Sprawdź oba interfejsy w wąskim i szerokim widoku. Zmiana motywu wymaga obejrzenia stanu zwykłego, focus, disabled, loading, komunikatów błędu i okien modalnych. Domyślny tryb jest jasny, a tokeny `.dark` wspierają ciemny. Uwzględnij ograniczenie ruchu użytkownika.

Expo korzysta z odrębnej warstwy natywnego interfejsu. Nie importuje arkuszy Nuxt ani komponentów Vue. Do zmiany mobilnego systemu wizualnego służą skillsy `expo-design-system`, `expo-native-ui` i `expo-ui`.
