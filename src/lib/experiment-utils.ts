import { OpinionResponse, ImageData } from '@/types/experiment';

export function generateParticipantId(): string {
  return 'P' + Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function assignGroup(): 'matching' | 'opposite' {
  return Math.random() < 0.5 ? 'matching' : 'opposite';
}

export function getImagesByResponses(
  opinionResponses: OpinionResponse[]
): ImageData[] {
  const imageData: ImageData[] = [];
  
  // For each opinion response, add BOTH generated and authentic variants
  opinionResponses.forEach((response) => {
    const isHighAgreement = response.rating >= 3; // 3-4 = high agreement
    
    // Determine folder based on agreement level
    let folderPrefix: string;
    if (isHighAgreement) {
      folderPrefix = 'matching'; // User agrees, show matching images
    } else {
      folderPrefix = 'not-matching'; // User disagrees, show opposite images
    }
    
    // Add BOTH generated and authentic versions for this question
    const questionId = response.questionId;
    
    // Generated version
    imageData.push({
      imagePath: `/images/${folderPrefix}-generated/${questionId}.png`,
      isActuallyAI: true
    });
    
    // Authentic version
    imageData.push({
      imagePath: `/images/${folderPrefix}-authentic/${questionId}.png`,
      isActuallyAI: false
    });
  });
  
  // Shuffle the final array to completely randomize the order of presentation
  return shuffleArray(imageData);
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function calculateAverageRating(responses: OpinionResponse[]): number {
  if (responses.length === 0) return 0;
  const sum = responses.reduce((acc, response) => acc + response.rating, 0);
  return sum / responses.length;
}
