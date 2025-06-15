'use client';

import { Button } from '@/components/ui/button';
import { useExperiment } from '@/contexts/ExperimentContext';

export default function InstructionsPage() {
  const { dispatch } = useExperiment();

  const handleStart = () => {
    dispatch({ type: 'SET_STEP', step: 'questionnaire' });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Instrukcje Badania Naukowego
        </h1>
        
        <div className="space-y-6 text-gray-700">
          <div>
            <h2 className="text-xl font-semibold mb-3">Witamy w naszym badaniu naukowym!</h2>
            <p className="leading-relaxed">
              Dziękujemy za udział w tym badaniu naukowym. Twój udział jest dobrowolny i anonimowy. 
              Badanie składa się z kilku części i powinno zająć około 10-15 minut.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Co będziesz robić:</h3>
            <ol className="list-decimal list-inside space-y-2 pl-4">
              <li>Odpowiesz na serię pytań o opiniach używając skali 1-4</li>
              <li>Obejrzysz i ocenisz serię zdjęć</li>
              <li>Podasz podstawowe informacje demograficzne</li>
            </ol>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Ważne informacje:</h3>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>Twoje odpowiedzi są całkowicie anonimowe</li>
              <li>Możesz wycofać się z badania w dowolnym momencie</li>
              <li>Prosimy o szczere odpowiedzi na wszystkie pytania</li>
              <li>Nie ma odpowiedzi prawidłowych ani błędnych</li>
            </ul>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm">
              <strong>Wykorzystanie danych:</strong> Zebrane dane będą wykorzystywane wyłącznie do celów badawczych. 
              Żadne dane umożliwiające identyfikację osoby nie będą zbierane ani przechowywane.
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button 
            onClick={handleStart}
            className="px-8 py-3 text-lg"
            size="lg"
          >
            Rozumiem i zgadzam się na udział
          </Button>
        </div>
      </div>
    </div>
  );
}
