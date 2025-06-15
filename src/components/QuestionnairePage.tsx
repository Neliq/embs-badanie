'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useExperiment } from '@/contexts/ExperimentContext';
import { Question, OpinionResponse } from '@/types/experiment';
import { getImagesByResponses } from '@/lib/experiment-utils';
import questionsData from '@/data/questions.json';

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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
            Kwestionariusz Opinii
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Proszę oceń, w jakim stopniu zgadzasz się lub nie zgadzasz z każdym stwierdzeniem
          </p>

          <div className="space-y-8">
            {questions.map((question, index) => {
              const currentResponse = responses.find(r => r.questionId === question.id);
              const currentRating = currentResponse?.rating || 2;
              
              return (
                <div key={question.id} className="border-b border-gray-200 pb-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium text-gray-800 mb-2">
                      {index + 1}. {question.statement}
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    <Slider
                      value={[currentRating]}
                      onValueChange={(value) => handleSliderChange(question.id, value)}
                      max={4}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>1 - Zdecydowanie się nie zgadzam</span>
                      <span className="text-blue-500 font-bold">
                        {currentRating}
                      </span>
                      <span>4 - Zdecydowanie się zgadzam</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center">
            <Button 
              onClick={handleSubmit}
              className="px-8 py-3 text-lg"
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
