'use client';

import { ExperimentProvider, useExperiment } from '@/contexts/ExperimentContext';
import InstructionsPage from '@/components/InstructionsPage';
import QuestionnairePage from '@/components/QuestionnairePage';
import ImageRatingPage from '@/components/ImageRatingPage';
import DemographicsPage from '@/components/DemographicsPage';
import CompletePage from '@/components/CompletePage';
import PretestPage from '@/components/PretestPage';

function ExperimentContent() {
  const { state } = useExperiment();

  switch (state.currentStep) {
    case 'instructions':
      return <InstructionsPage />;
    case 'pretest':
      return <PretestPage />;
    case 'questionnaire':
      return <QuestionnairePage />;
    case 'images':
      return <ImageRatingPage />;
    case 'demographics':
      return <DemographicsPage />;
    case 'complete':
      return <CompletePage />;
    default:
      return <InstructionsPage />;
  }
}

export default function Home() {
  return (
    <ExperimentProvider>
      <ExperimentContent />
    </ExperimentProvider>
  );
}
