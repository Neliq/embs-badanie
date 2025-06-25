export interface Question {
  id: number;
  statement: string;
}

export interface OpinionResponse {
  questionId: number;
  rating: number; // 1-4 scale
}

export interface DemographicData {
  age: number;
  gender: string;
  education: string;
  occupation: string;
}

export interface ImageData {
  imagePath: string;
  isActuallyAI: boolean;
}

export interface ImageRating {
  imagePath: string;
  aiProbability: number; // 0-100 scale
  isActuallyAI: boolean;
}

export type ExperimentGroup =
  | 'pretest-matching'
  | 'pretest-not-matching'
  | 'no-pretest-matching'
  | 'no-pretest-not-matching'
  | 'all-images-no-questionnaire';

export interface ExperimentData {
  participantId: string;
  group: ExperimentGroup;
  opinionResponses: OpinionResponse[];
  imageRatings: ImageRating[];
  demographics: DemographicData;
  startTime: Date;
  endTime?: Date;
}

export type ExperimentStep = 
  | 'instructions'
  | 'questionnaire'
  | 'pretest'
  | 'images'
  | 'demographics'
  | 'complete';