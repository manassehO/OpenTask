import HeroPage from "../_components/landing_page/hero";

type Props = {};

function page({}: Props) {
  return (
    <div className="flex mt-24 w-full flex-col">
      <HeroPage />
    </div>
  );
}

export default page;
