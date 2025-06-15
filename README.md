# Experiment Study App

A Next.js application for conducting research studies on opinion measurement and AI image detection.

## Features

1. **Random Group Assignment**: Participants are randomly assigned to either:
   - Matching group: shown images that match their opinion responses
   - Opposite group: shown images that oppose their opinion responses

2. **Multi-step Experiment Flow**:
   - Instructions page
   - Opinion questionnaire with 1-4 scale sliders
   - Image rating with AI probability assessment
   - Demographics form
   - Completion page with data download

3. **Data Collection**:
   - Anonymous participant tracking
   - Opinion responses on 1-4 scale
   - AI probability ratings for images (0-100%)
   - Demographic information
   - Complete session timing

## Setup

1. Install dependencies:
```bash
npm install
```

2. Add your images to the appropriate folders:
   - `public/images/matching-generated/` - AI-generated images for high-agreement responses
   - `public/images/matching-authentic/` - Real images for high-agreement responses
   - `public/images/not-matching-generated/` - AI-generated images for low-agreement responses
   - `public/images/not-matching-authentic/` - Real images for low-agreement responses

3. Customize questions in `src/data/questions.json`

4. Run the development server:
```bash
npm run dev
```

## Image Organization

The app expects images to be organized in four folders under `public/images/`:

- **matching-generated**: AI-generated images shown to participants whose responses indicate high agreement (rating 3-4)
- **matching-authentic**: Real images shown to participants whose responses indicate high agreement (rating 3-4)
- **not-matching-generated**: AI-generated images shown to participants whose responses indicate low agreement (rating 1-2)
- **not-matching-authentic**: Real images shown to participants whose responses indicate low agreement (rating 1-2)

## Question Format

Questions should be formatted in `src/data/questions.json`:

```json
[
  {
    "id": 1,
    "statement": "Your opinion statement here"
  }
]
```

## Data Export

Participants can download their anonymous data at the end of the study. The data includes:
- Participant ID
- Group assignment
- All opinion responses
- All image ratings
- Demographic information
- Session timing

## Technologies Used

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui components
- React Hook Form
- Zod for validation

## Development

The app uses React Context for state management and localStorage for data persistence. All components are built with shadcn/ui for consistent styling.

## Lokalizacja (Język Polski)

Aplikacja została w pełni przetłumaczona na język polski, obejmując:

- Wszystkie interfejsy użytkownika
- Instrukcje i komunikaty
- Pytania kwestionariusza
- Nazwy kolumn w eksporcie CSV
- Komunikaty o błędach i walidacji

### Struktura danych CSV

Eksportowane dane CSV zawierają następujące kolumny:
- `id_uczestnika` - Unikalny identyfikator uczestnika
- `grupa` - Przypisanie do grupy (matching/opposite)
- `id_pytania` - Identyfikator pytania
- `ocena_pytania` - Ocena na skali 1-4
- `sciezka_zdjecia` - Ścieżka do ocenianego zdjęcia
- `prawdopodobienstwo_ai` - Ocena prawdopodobieństwa generacji AI (0-100%)
- `rzeczywiscie_ai` - Czy zdjęcie rzeczywiście zostało wygenerowane przez AI
- `wiek` - Wiek uczestnika
- `plec` - Płeć uczestnika
- `wyksztalcenie` - Poziom wykształcenia
- `zawod` - Zawód uczestnika
- `czas_rozpoczecia` - Znacznik czasu rozpoczęcia
- `czas_zakonczenia` - Znacznik czasu zakończenia
- `czas_trwania_minuty` - Czas trwania badania w minutach

## Randomizacja Zdjęć

Aplikacja implementuje wielopoziomową randomizację:

### 1. Losowy wybór typu zdjęcia
- Dla każdego pytania: 50% szans na wybór zdjęcia wygenerowanego AI vs. autentycznego
- Zapewnia równomierne rozmieszczenie typów zdjęć w badaniu

### 2. Losowy wybór konkretnego zdjęcia
- Z odpowiedniej kategorii (matching/not-matching + generated/authentic)
- Losowy wybór z puli dostępnych zdjęć w folderze

### 3. Losowa kolejność prezentacji
- Wszystkie wybrane zdjęcia są tasowane przed pokazaniem
- Eliminuje efekty związane z kolejnością prezentacji

### Logika wyboru zdjęć:
- **Grupa "Zgodna" + Wysoka zgoda (3-4)** → zdjęcia z folderów `matching-*`
- **Grupa "Zgodna" + Niska zgoda (1-2)** → zdjęcia z folderów `not-matching-*`  
- **Grupa "Przeciwna" + Wysoka zgoda (3-4)** → zdjęcia z folderów `not-matching-*`
- **Grupa "Przeciwna" + Niska zgoda (1-2)** → zdjęcia z folderów `matching-*`
