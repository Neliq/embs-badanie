'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useExperiment } from '@/contexts/ExperimentContext';
import { ImageRating } from '@/types/experiment';
import Image from 'next/image';

export default function ImageRatingPage() {
  const { state, dispatch } = useExperiment();
  const [aiProbability, setAiProbability] = useState([50]);
  const [loading, setLoading] = useState(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  
  const currentImageData = state.images[state.currentImageIndex];
  const isLastImage = state.currentImageIndex >= state.images.length - 1;
  const imageNumber = state.currentImageIndex + 1;
  const totalImages = state.images.length;

  const handleNext = () => {
    setLoading(true);
    // Save the current rating
    const rating: ImageRating = {
      imagePath: currentImageData.imagePath,
      aiProbability: aiProbability[0],
      isActuallyAI: currentImageData.isActuallyAI
    };
    setTimeout(() => {
      dispatch({ type: 'ADD_IMAGE_RATING', rating });
      if (isLastImage) {
        dispatch({ type: 'SET_STEP', step: 'demographics' });
      } else {
        dispatch({ type: 'NEXT_IMAGE' });
        setAiProbability([50]);
      }
      setLoading(false);
    }, 300); // Simulate loading, can be adjusted or replaced with real image onLoad
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
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
              Ocena Zdjęcia
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Zdjęcie {imageNumber} z {totalImages}
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {/* Image Display */}
            <div className="flex justify-center">
              <div className="relative w-full max-w-2xl aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <Image 
                  ref={imageRef}
                  src={currentImageData.imagePath} 
                  alt={`Zdjęcie badania ${imageNumber}`}
                  fill
                  className="object-contain"
                  onLoad={() => setLoading(false)}
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.currentTarget;
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) {
                      target.style.display = 'none';
                      fallback.style.display = 'block';
                    }
                    setLoading(false);
                  }}
                />
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100" style={{display: 'none'}}>
                  <div className="text-center p-4">
                    <div className="w-16 sm:w-24 h-16 sm:h-24 bg-gray-300 rounded-lg mx-auto mb-4"></div>
                    <p className="text-gray-600 text-sm sm:text-base">Zdjęcie: {currentImageData.imagePath}</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                      (Nie można załadować zdjęcia)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Question */}
            <div className="space-y-4 sm:space-y-6">
              <div className="text-center px-2">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 leading-relaxed">
                  Jak prawdopodobne jest, że to zdjęcie zostało wygenerowane przez AI?
                </h2>
                <p className="text-gray-600 text-sm sm:text-base">
                  Przesuń suwak, aby wskazać swoją ocenę
                </p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between text-xs sm:text-sm text-gray-500 px-1">
                  <span>Na pewno prawdziwe</span>
                  <span>Na pewno AI</span>
                </div>
                
                <Slider
                  value={aiProbability}
                  onValueChange={setAiProbability}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
                
                <div className="text-center">
                  <span className="text-blue-600 font-semibold text-base sm:text-lg bg-blue-50 px-3 py-1 rounded-full">
                    {aiProbability[0]}% Wygenerowane AI
                  </span>
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
            <div className="flex justify-center">
              <Button 
                onClick={handleNext}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg font-medium"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Ładowanie...' : (isLastImage ? 'Przejdź do danych demograficznych' : 'Następne zdjęcie')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
