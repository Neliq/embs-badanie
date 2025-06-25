// 'use client';
import { useState, useMemo, useRef } from 'react';
import { useExperiment } from '@/contexts/ExperimentContext';
import { ImageRating } from '@/types/experiment';
import Image from 'next/image';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { getImagesByResponses } from '@/lib/experiment-utils';
import questionsData from '@/data/questions.json';

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Dynamically get all images from test-generated and test-authentic
function getPretestImages() {
  const files = ["1.png", "2.png", "3.png"];
  const generated = files.map(file => ({
    imagePath: `/images/test-generated/${file}`,
    isActuallyAI: true
  }));
  const authentic = files.map(file => ({
    imagePath: `/images/test-authentic/${file}`,
    isActuallyAI: false
  }));
  // Combine and deduplicate by imagePath
  const all = [...generated, ...authentic];
  const unique = Array.from(new Map(all.map(img => [img.imagePath, img])).values());
  return shuffleArray(unique);
}

export default function PretestPage() {
  const { state, dispatch } = useExperiment();
  const [aiProbability, setAiProbability] = useState([50]);
  const [loading, setLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const pretestImages = useMemo(() => getPretestImages(), []);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const currentImageData = pretestImages[state.currentImageIndex] || null;
  const isLastImage = state.currentImageIndex >= pretestImages.length - 1;
  const imageNumber = state.currentImageIndex + 1;
  const totalImages = pretestImages.length;

  const handleNext = () => {
    setImageLoaded(false);
    setLoading(true);
    // Save the current rating
    const rating: ImageRating = {
      imagePath: currentImageData.imagePath,
      aiProbability: aiProbability[0],
      isActuallyAI: currentImageData.isActuallyAI,
    };
    setTimeout(() => {
      dispatch({ type: 'ADD_IMAGE_RATING', rating });
      if (isLastImage) {
        // Move to next step depending on group
        if (state.data.group === 'pretest-matching' || state.data.group === 'pretest-not-matching') {
          // After pretest, go to main images (not questionnaire)
          let imageData;
          if (state.data.group === 'pretest-matching') {
            imageData = getImagesByResponses(
              state.data.opinionResponses,
              'matching'
            );
          } else {
            imageData = getImagesByResponses(
              state.data.opinionResponses,
              'opposite'
            );
          }
          dispatch({ type: 'SET_IMAGES', images: imageData });
          dispatch({ type: 'SET_STEP', step: 'images' });
        } else if (state.data.group === 'all-images-no-questionnaire') {
          // Set all images: pretest, matching, not-matching
          const allImages = [
            // Pretest images
            { imagePath: '/images/test-generated/1.png', isActuallyAI: true },
            { imagePath: '/images/test-authentic/1.png', isActuallyAI: false },
            // Matching images
            ...getImagesByResponses(questionsData.map(q => ({ questionId: q.id, rating: 3 })), 'matching'),
            // Not-matching images
            ...getImagesByResponses(questionsData.map(q => ({ questionId: q.id, rating: 3 })), 'opposite'),
          ];
          dispatch({ type: 'SET_IMAGES', images: allImages });
          dispatch({ type: 'SET_STEP', step: 'images' });
        } else {
          // For groups that do not have main test, go to demographics
          dispatch({ type: 'SET_STEP', step: 'demographics' });
        }
      } else {
        dispatch({ type: 'NEXT_IMAGE' });
        setAiProbability([50]);
      }
      setLoading(false);
    }, 300); // Simulate loading, can be replaced with real image onLoad
  };

  if (!currentImageData) {
    return <div className="min-h-screen flex items-center justify-center">Brak zdjęć do pretestu.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">
              Pretest: Ocena Zdjęcia
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Zdjęcie {imageNumber} z {totalImages}
            </p>
          </div>
          <div className="space-y-6 sm:space-y-8">
            <div className="flex justify-center">
              <div className="relative w-full max-w-2xl aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <Image 
                  ref={imageRef}
                  src={currentImageData.imagePath} 
                  alt={`Pretest zdjęcie ${imageNumber}`}
                  fill
                  className="object-contain"
                  onLoad={() => {
                    setImageLoaded(true);
                    setLoading(false);
                  }}
                  onError={() => {
                    setImageLoaded(true);
                    setLoading(false);
                  }}
                />
              </div>
            </div>
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
              </div>
            </div>
            <div className="mt-6 flex justify-center">
              <Button 
                onClick={handleNext}
                className="w-full sm:w-auto px-6 py-3 text-base font-medium"
                size="lg"
                disabled={loading || !imageLoaded}
              >
                {(loading || !imageLoaded) ? 'Ładowanie...' : 'Dalej'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
