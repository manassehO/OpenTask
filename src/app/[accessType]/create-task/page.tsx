'use client';
import { useTaskStore } from '~/store/taskStore';
import BasicInformationForm from '~/_components/creator/basicInformation';
import Header from '~/_components/creator/header';
import RequirementsComponent from '~/_components/ui/form/createTask/requirements';
import Rewards from '~/_components/ui/form/createTask/rewards';
import Distribution from '~/_components/ui/form/createTask/distribution';
import Review from '~/_components/ui/form/createTask/review';

function CreateTask() {
  const { currentStep } = useTaskStore();

  return (
    <div className="space-y-6">
      <Header activeStepper={currentStep} />
      {currentStep === 0 && <BasicInformationForm />}
      {currentStep === 1 && <RequirementsComponent />}
      {currentStep === 2 && <Rewards />}
      {currentStep === 3 && <Distribution />}
      {currentStep === 4 && <Review />}
    </div>
  );
}

export default CreateTask;
