'use client';

import { Button } from '@/components/ui/button';
import { useExperiment } from '@/contexts/ExperimentContext';
import { getImagesByResponses } from '@/lib/experiment-utils';
import questionsData from '@/data/questions.json';

export default function InstructionsPage() {
  const { state, dispatch } = useExperiment();

  const handleStart = () => {
    // Decide first step based on group
    if (
      state.data.group === 'pretest-matching' ||
      state.data.group === 'pretest-not-matching'
    ) {
      dispatch({ type: 'SET_STEP', step: 'pretest' });
    } else if (
      state.data.group === 'no-pretest-matching' ||
      state.data.group === 'no-pretest-not-matching'
    ) {
      dispatch({ type: 'SET_STEP', step: 'questionnaire' });
    } else if (state.data.group === 'all-images-no-questionnaire') {
      // Skip pretest for this group, go directly to images
      // Set all images: pretest (test-generated/test-authentic) + matching + not-matching
      const allImages = [
        { imagePath: '/images/test-generated/1.png', isActuallyAI: true },
        { imagePath: '/images/test-authentic/1.png', isActuallyAI: false },
        ...getImagesByResponses((questionsData as { id: number }[]).map(q => ({ questionId: q.id, rating: 3 })), 'matching'),
        ...getImagesByResponses((questionsData as { id: number }[]).map(q => ({ questionId: q.id, rating: 3 })), 'opposite'),
      ];
      dispatch({ type: 'SET_IMAGES', images: allImages });
      dispatch({ type: 'SET_STEP', step: 'images' });
    } else {
      dispatch({ type: 'SET_STEP', step: 'questionnaire' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2 sm:p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 mx-2 sm:mx-0">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-6 sm:mb-8 text-gray-800 leading-tight">
          Instrukcje Badania Naukowego
        </h1>
        
        <div className="space-y-4 sm:space-y-6 text-gray-700">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Witamy w naszym badaniu naukowym!</h2>
            <p className="leading-relaxed text-sm sm:text-base">
              Dziękujemy za udział w tym badaniu naukowym. Twój udział jest dobrowolny i anonimowy. 
              Badanie składa się z kilku części i powinno zająć około 10-15 minut.
            </p>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">Co będziesz robić:</h3>
            <ol className="list-decimal list-inside space-y-1 sm:space-y-2 pl-2 sm:pl-4 text-sm sm:text-base">
              <li>Odpowiesz na serię pytań o opiniach używając skali 1-4</li>
              <li>Obejrzysz i ocenisz serię zdjęć</li>
              <li>Podasz podstawowe informacje demograficzne</li>
            </ol>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-2">Ważne informacje:</h3>
            <ul className="list-disc list-inside space-y-1 sm:space-y-2 pl-2 sm:pl-4 text-sm sm:text-base">
              <li>Twoje odpowiedzi są całkowicie anonimowe</li>
              <li>Możesz wycofać się z badania w dowolnym momencie</li>
              <li>Prosimy o szczere odpowiedzi na wszystkie pytania</li>
              <li>Nie ma odpowiedzi prawidłowych ani błędnych</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
            <p className="text-xs sm:text-sm leading-relaxed">
              <strong>Wykorzystanie danych:</strong> Zebrane dane będą wykorzystywane wyłącznie do celów badawczych. 
              Żadne dane umożliwiające identyfikację osoby nie będą zbierane ani przechowywane.
            </p>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 flex justify-center">
          <Button 
            onClick={handleStart}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg font-medium"
            size="lg"
          >
            Rozumiem i zgadzam się na udział
          </Button>
        </div>
      </div>
    </div>
  );
}
