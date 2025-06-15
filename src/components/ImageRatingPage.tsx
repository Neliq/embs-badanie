'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useExperiment } from '@/contexts/ExperimentContext';
import { ImageRating } from '@/types/experiment';
import Image from 'next/image';

export default function ImageRatingPage() {
  const { state, dispatch } = useExperiment();
  const [aiProbability, setAiProbability] = useState([50]);
  
  const currentImageData = state.images[state.currentImageIndex];
  const isLastImage = state.currentImageIndex >= state.images.length - 1;
  const imageNumber = state.currentImageIndex + 1;
  const totalImages = state.images.length;

  const handleNext = () => {
    // Save the current rating
    const rating: ImageRating = {
      imagePath: currentImageData.imagePath,
      aiProbability: aiProbability[0],
      isActuallyAI: currentImageData.isActuallyAI
    };
    
    dispatch({ type: 'ADD_IMAGE_RATING', rating });

    if (isLastImage) {
      // Move to demographics
      dispatch({ type: 'SET_STEP', step: 'demographics' });
    } else {
      // Move to next image
      dispatch({ type: 'NEXT_IMAGE' });
      setAiProbability([50]); // Reset slider for next image
    }
  };

  if (!currentImageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600">Ładowanie zdjęć...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Ocena Zdjęcia
            </h1>
            <p className="text-gray-600">
              Zdjęcie {imageNumber} z {totalImages}
            </p>
          </div>

          <div className="space-y-8">
            {/* Image Display */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-2xl aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <Image 
                  src={currentImageData.imagePath} 
                  alt={`Zdjęcie badania ${imageNumber}`}
                  fill
                  className="object-contain"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.currentTarget;
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) {
                      target.style.display = 'none';
                      fallback.style.display = 'block';
                    }
                  }}
                />
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100" style={{display: 'none'}}>
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-300 rounded-lg mx-auto mb-4"></div>
                    <p className="text-gray-600">Zdjęcie: {currentImageData.imagePath}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      (Nie można załadować zdjęcia)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Question */}
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  Jak prawdopodobne jest, że to zdjęcie zostało wygenerowane przez AI?
                </h2>
                <p className="text-gray-600">
                  Przesuń suwak, aby wskazać swoją ocenę
                </p>
              </div>

              <div className="space-y-4">
                <Slider
                  value={aiProbability}
                  onValueChange={setAiProbability}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>0% - Na pewno prawdziwe</span>
                  <span className="font-medium text-gray-800 text-lg">
                    {aiProbability[0]}% Wygenerowane AI
                  </span>
                  <span>100% - Na pewno AI</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(imageNumber / totalImages) * 100}%` }}
              ></div>
            </div>

            {/* Navigation */}
            <div className="text-center">
              <Button 
                onClick={handleNext}
                className="px-8 py-3 text-lg"
                size="lg"
              >
                {isLastImage ? 'Przejdź do danych demograficznych' : 'Następne zdjęcie'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
