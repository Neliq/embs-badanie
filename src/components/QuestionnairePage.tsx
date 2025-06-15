'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useExperiment } from '@/contexts/ExperimentContext';
import { Question, OpinionResponse } from '@/types/experiment';
import { getImagesByResponses } from '@/lib/experiment-utils';
import questionsData from '@/data/questions.json';

const getScaleLabel = (rating: number): string => {
  switch (rating) {
    case 1: return 'Zdecydowanie nie';
    case 2: return 'Raczej nie';
    case 3: return 'Raczej tak';
    case 4: return 'Zdecydowanie tak';
    default: return '';
  }
};

export default function QuestionnairePage() {
  const { dispatch } = useExperiment();
  const [questions] = useState<Question[]>(questionsData);
  const [responses, setResponses] = useState<OpinionResponse[]>(
    questions.map(q => ({ questionId: q.id, rating: 2 }))
  );

  const handleSliderChange = (questionId: number, value: number[]) => {
    setResponses(prev => 
      prev.map(response => 
        response.questionId === questionId 
          ? { ...response, rating: value[0] }
          : response
      )
    );
  };

  const handleSubmit = () => {
    dispatch({ type: 'SET_OPINION_RESPONSES', responses });
    
    // Generate images based on responses
    const imageData = getImagesByResponses(responses);
    dispatch({ type: 'SET_IMAGES', images: imageData });
    
    dispatch({ type: 'SET_STEP', step: 'images' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-2 text-gray-800">
            Kwestionariusz Opinii
          </h1>
          <p className="text-center text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base px-2">
            Proszę oceń, w jakim stopniu zgadzasz się lub nie zgadzasz z każdym stwierdzeniem
          </p>

          <div className="space-y-6 sm:space-y-8">
            {questions.map((question, index) => {
              const currentResponse = responses.find(r => r.questionId === question.id);
              const currentRating = currentResponse?.rating || 2;
              
              return (
                <div key={question.id} className="border-b border-gray-200 pb-4 sm:pb-6">
                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-medium text-gray-800 mb-2 leading-relaxed">
                      {index + 1}. {question.statement}
                    </h3>
                  </div>
                  
                    <div className="flex flex-col space-y-2 sm:space-y-3">
                      <div className="flex justify-between text-xs sm:text-sm text-gray-500 px-1">
                        <span>Zdecydowanie nie</span>
                        <span>Zdecydowanie tak</span>
                      </div>
                      
                      <Slider
                        value={[currentRating]}
                        onValueChange={(value) => handleSliderChange(question.id, value)}
                        max={4}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                      
                      <div className="text-center">
                        <span className="text-blue-600 font-semibold text-base sm:text-lg bg-blue-50 px-3 py-1 rounded-full">
                          {currentRating} - {getScaleLabel(currentRating)}
                        </span>
                      </div>
                    </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex justify-center">
            <Button 
              onClick={handleSubmit}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg font-medium"
              size="lg"
            >
              Przejdź do oceny zdjęć
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
