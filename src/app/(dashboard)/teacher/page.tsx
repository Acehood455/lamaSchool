import Announcements from "@/components/Announcements";
import BigCalenderContainer from "@/components/BigCalenderContainer";
import { auth } from "@clerk/nextjs/server";
// import EventCalender from "@/components/EventCalender";

const TeacherPage = async () => {

  const {userId} = await auth()
  
  return (
  <div className="p-4 flex flex-1 gap-4 flex-col xl:flex-row mt-20">
    {/* Left */}
    <div className="w-full xl-2/3">
      <div className="h-full bg-white p-4 rounded-md">
        <h1 className="text-xl font-semibold">Schedule</h1>
        
        <BigCalenderContainer type="teacherId" id={userId!} />
      </div>
    </div>

    {/* Right */}
    <div className="w-full xl:w-1/3 flex flex-col gap-8">
      {/* <EventCalender /> */}
      <Announcements />
    </div>
  </div>
  );
};

export default TeacherPage;
