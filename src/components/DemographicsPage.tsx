'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useExperiment } from '@/contexts/ExperimentContext';
import { DemographicData } from '@/types/experiment';

export default function DemographicsPage() {
  const { dispatch } = useExperiment();
  const [demographics, setDemographics] = useState<DemographicData>({
    age: 0,
    gender: '',
    education: '',
    occupation: '' // Keep for compatibility with existing types
  });

  const handleInputChange = (field: keyof DemographicData, value: string | number) => {
    setDemographics(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_DEMOGRAPHICS', demographics });
    dispatch({ type: 'COMPLETE_EXPERIMENT' });
  };

  const isFormValid = demographics.age > 0 && 
                     demographics.gender && 
                     demographics.education;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
            Informacje Demograficzne
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Proszę podaj podstawowe informacje o sobie. Te informacje są anonimowe i będą wykorzystywane wyłącznie do celów badawczych.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Age */}
            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium">
                Wiek
              </Label>
              <Input
                id="age"
                type="number"
                min="18"
                max="100"
                value={demographics.age || ''}
                onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
                placeholder="Podaj swój wiek"
                required
              />
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-sm font-medium">
                Płeć
              </Label>
              <select
                id="gender"
                value={demographics.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Wybierz swoją płeć</option>
                <option value="male">Mężczyzna</option>
                <option value="female">Kobieta</option>
                <option value="non-binary">Niebinarna</option>
                <option value="prefer-not-to-say">Wolę nie odpowiadać</option>
                <option value="other">Inna</option>
              </select>
            </div>

            {/* Education */}
            <div className="space-y-2">
              <Label htmlFor="education" className="text-sm font-medium">
                Najwyższy poziom wykształcenia
              </Label>
              <select
                id="education"
                value={demographics.education}
                onChange={(e) => handleInputChange('education', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Wybierz poziom wykształcenia</option>
                <option value="podstawowe">Podstawowe</option>
                <option value="zawodowe">Zawodowe</option>
                <option value="srednie">Średnie</option>
                <option value="studia-pierwszego-stopnia">Ukończone studia pierwszego stopnia</option>
                <option value="studia-drugiego-stopnia">Ukończone studia drugiego stopnia</option>
                <option value="doktorat">Ukończony doktorat</option>
                <option value="aktualnie-studiuje">Aktualnie studiuję</option>
                <option value="aktualnie-doktorat">Aktualnie robię doktorat</option>
              </select>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Ochrona prywatności:</strong> Wszystkie podane informacje są anonimowe i będą wykorzystywane wyłącznie do celów badawczych. Żadne dane umożliwiające identyfikację osoby nie będą przechowywane ani udostępniane.
              </p>
            </div>

            <div className="text-center">
              <Button 
                type="submit"
                disabled={!isFormValid}
                className="px-8 py-3 text-lg"
                size="lg"
              >
                Zakończ badanie
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
