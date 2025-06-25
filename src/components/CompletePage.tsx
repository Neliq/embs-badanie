'use client';

import { Button } from '@/components/ui/button';
import { useExperiment } from '@/contexts/ExperimentContext';

export default function CompletePage() {
  const { state } = useExperiment();

  const handleDownloadCSV = () => {
    // Create CSV header
    const csvRows = [];
    
    // Header row (now includes participant ID and group)
    csvRows.push([
      'uczestnik_id',
      'grupa',
      'id_pytania',
      'ocena_pytania',
      'sciezka_zdjecia',
      'prawdopodobienstwo_ai',
      'rzeczywiscie_ai',
      'wiek',
      'plec',
      'wyksztalcenie',
      'czas_rozpoczecia',
      'czas_zakonczenia',
      'czas_trwania_minuty'
    ].join(','));

    // Calculate duration
    const duration = state.data.endTime && state.data.startTime 
      ? Math.round((state.data.endTime.getTime() - state.data.startTime.getTime()) / 1000 / 60)
      : 0;

    // Data rows - one row per image rating, including all other data
    state.data.imageRatings.forEach((imageRating, imageIndex) => {
      // Find corresponding question response (assuming same order)
      const questionResponse = state.data.opinionResponses[imageIndex] || { questionId: '', rating: '' };
      
      csvRows.push([
        state.data.participantId,
        state.data.group,
        questionResponse.questionId,
        questionResponse.rating,
        `"${imageRating.imagePath}"`, // Quote the path in case it contains commas
        imageRating.aiProbability,
        imageRating.isActuallyAI,
        state.data.demographics.age,
        `"${state.data.demographics.gender}"`,
        `"${state.data.demographics.education}"`,
        state.data.startTime.toISOString(),
        state.data.endTime?.toISOString() || '',
        duration
      ].join(','));
    });

    // If there are more questions than images, add rows for remaining questions
    if (state.data.opinionResponses.length > state.data.imageRatings.length) {
      for (let i = state.data.imageRatings.length; i < state.data.opinionResponses.length; i++) {
        const questionResponse = state.data.opinionResponses[i];
        csvRows.push([
          state.data.participantId,
          state.data.group,
          questionResponse.questionId,
          questionResponse.rating,
          '', // No image
          '', // No AI probability
          '', // No is_actually_ai
          state.data.demographics.age,
          `"${state.data.demographics.gender}"`,
          `"${state.data.demographics.education}"`,
          state.data.startTime.toISOString(),
          state.data.endTime?.toISOString() || '',
          duration
        ].join(','));
      }
    }

    // Create and download CSV
    const csvContent = csvRows.join('\n');
    const csvBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `experiment-data-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const duration = state.data.endTime && state.data.startTime 
    ? Math.round((state.data.endTime.getTime() - state.data.startTime.getTime()) / 1000 / 60)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2 sm:p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 text-center mx-2 sm:mx-0">
        <div className="mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-24 sm:h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 sm:w-12 sm:h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">
            Dziękujemy za udział!
          </h1>
          
          <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 px-2 leading-relaxed">
            Pomyślnie ukończyłeś badanie naukowe. Twoje odpowiedzi zostały zapisane i przyczynią się do ważnych badań. Celem badania było sprawdzenie, jak osobiste opinie wpływają na percepcję zdjęć wygenerowanych przez AI. Twoje dane są anonimowe i zostaną użyte tylko do celów badawczych.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Podsumowanie badania</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm sm:text-base">
            <div className="text-center sm:text-left">
              <span className="font-medium">Odpowiedzi na pytania:</span>
              <p className="text-gray-600">{state.data.opinionResponses.length}</p>
            </div>
            <div className="text-center sm:text-left">
              <span className="font-medium">Ocenione zdjęcia:</span>
              <p className="text-gray-600">{state.data.imageRatings.length}</p>
            </div>
            {duration > 0 && (
              <div className="col-span-1 sm:col-span-2 text-center sm:text-left">
                <span className="font-medium">Czas trwania:</span>
                <p className="text-gray-600">{duration} minut</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-gray-600 text-sm sm:text-base px-2 leading-relaxed">
            Twoje anonimowe dane zostały zapisane. Możesz je pobrać poniżej.
          </p>
          
          <div className="flex justify-center">
            <Button 
              onClick={handleDownloadCSV}
              className="w-full sm:w-auto px-6 py-3 text-base font-medium"
              size="lg"
            >
              Pobierz dane CSV
            </Button>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-50 rounded-lg">
          <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
            Twoje dane zostaną przeanalizowane wraz z odpowiedziami innych uczestników, aby pomóc nam zrozumieć ludzką percepcję i podejmowanie decyzji. Wyniki mogą zostać opublikowane w czasopismach naukowych przy zachowaniu pełnej anonimowości.
          </p>
        </div>
      </div>
    </div>
  );
}
