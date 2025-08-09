import Banner from "@/components/UserComponents/Banner";
import Hero from "@/components/UserComponents/Hero";
import SpecialityMenu from "@/components/UserComponents/SpecialityMenu";
import TopDoctors from "@/components/UserComponents/TopDoctors";

export default function Home() {

  return <div className="mx-4 sm:mx-[10%]">
    <Hero />
    <SpecialityMenu />
    <TopDoctors />
    <Banner />
  </div>;
}
