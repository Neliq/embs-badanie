'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ExperimentData, ExperimentStep, OpinionResponse, DemographicData, ImageRating, ImageData } from '@/types/experiment';
import { generateParticipantId, assignGroup5 } from '@/lib/experiment-utils';

interface ExperimentState {
  data: ExperimentData;
  currentStep: ExperimentStep;
  currentImageIndex: number;
  images: ImageData[];
}

type ExperimentAction =
  | { type: 'SET_STEP'; step: ExperimentStep }
  | { type: 'SET_OPINION_RESPONSES'; responses: OpinionResponse[] }
  | { type: 'ADD_IMAGE_RATING'; rating: ImageRating }
  | { type: 'SET_DEMOGRAPHICS'; demographics: DemographicData }
  | { type: 'NEXT_IMAGE' }
  | { type: 'SET_IMAGES'; images: ImageData[] }
  | { type: 'COMPLETE_EXPERIMENT' };

const initialState: ExperimentState = {
  data: {
    participantId: generateParticipantId(),
    group: assignGroup5(), // Use new 5-group assignment
    opinionResponses: [],
    imageRatings: [],
    demographics: {
      age: 0,
      gender: '',
      education: '',
      occupation: ''
    },
    startTime: new Date()
  },
  currentStep: 'instructions',
  currentImageIndex: 0,
  images: []
};

function experimentReducer(state: ExperimentState, action: ExperimentAction): ExperimentState {
  switch (action.type) {
    case 'SET_STEP':
      // Reset image index for pretest or images step
      if (action.step === 'pretest' || action.step === 'images') {
        return { ...state, currentStep: action.step, currentImageIndex: 0 };
      }
      return { ...state, currentStep: action.step };
    
    case 'SET_OPINION_RESPONSES':
      return {
        ...state,
        data: {
          ...state.data,
          opinionResponses: action.responses
        }
      };
    
    case 'ADD_IMAGE_RATING':
      return {
        ...state,
        data: {
          ...state.data,
          imageRatings: [...state.data.imageRatings, action.rating]
        }
      };
    
    case 'SET_DEMOGRAPHICS':
      return {
        ...state,
        data: {
          ...state.data,
          demographics: action.demographics
        }
      };
    
    case 'NEXT_IMAGE':
      return {
        ...state,
        currentImageIndex: state.currentImageIndex + 1
      };
    
    case 'SET_IMAGES':
      return {
        ...state,
        images: action.images
      };
    
    case 'COMPLETE_EXPERIMENT':
      return {
        ...state,
        data: {
          ...state.data,
          endTime: new Date()
        },
        currentStep: 'complete'
      };
    
    default:
      return state;
  }
}

const ExperimentContext = createContext<{
  state: ExperimentState;
  dispatch: React.Dispatch<ExperimentAction>;
} | null>(null);

export function ExperimentProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(experimentReducer, initialState);

  // Save experiment data to localStorage for persistence
  useEffect(() => {
    localStorage.setItem('experimentData', JSON.stringify(state.data));
  }, [state.data]);

  return (
    <ExperimentContext.Provider value={{ state, dispatch }}>
      {children}
    </ExperimentContext.Provider>
  );
}

export function useExperiment() {
  const context = useContext(ExperimentContext);
  if (!context) {
    throw new Error('useExperiment must be used within an ExperimentProvider');
  }
  return context;
}
