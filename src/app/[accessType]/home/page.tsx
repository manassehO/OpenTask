'use client';
import GreetingCard from '~/_components/dashboard_components/greeting-card';
import RecomendedTasks from '~/_components/dashboard_components/recomended-tasks';
import Summary from '~/_components/dashboard_components/summary';
import RightBar from '~/_components/layout/RightBar';

function Dashboardage() {
<<<<<<< HEAD
=======
  const name = 'Bartholomew Favour';
  const task = api.task.getTaskById.useQuery({ taskId: '1' });
  const { data: tasks } = api.task.findTasks.useQuery({
    limit: 10,
    page: 1,
    sort_by: 'created_at',
    order: 'desc',
  });

  // useEffect(() => {
  //   findTasks({
  //     limit: 10,
  //     page: 1,
  //     sort_by: 'created_at',
  //     order: 'desc',
  //   });
  // }, [findTasks]);

  console.log({ tasks, task });
>>>>>>> 5b0b55894bec81bc6da9e62921d39fb5503f5deb
  return (
    <div className="flex h-full w-full flex-row items-start gap-4 bg-[#FAFAFA] text-black">
      <div className="flex-1">
        <GreetingCard />
        <Summary />
        <RecomendedTasks />
      </div>

      <div className="w-25%">
        <RightBar />
      </div>
    </div>
  );
}

export default Dashboardage;
