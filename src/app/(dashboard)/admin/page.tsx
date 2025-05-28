import UserCard from "@/components/UserCard";
import FinanceChart from "@/components/FinanceChart";
import Announcements from "@/components/Announcements";
import CountChartContainer from "@/components/CountChartContainer";
import AttendanceChartContainer from "@/components/AttendanceChartContainer";
import EventCalenderContainer from "@/components/EventCalenderContainer";

const AdminPage = async ({searchParams}: 
  {searchParams: {[keys:string]: string | undefined}}) => {

  return (
  <div className="p-4 flex gap-4 flex-col md:flex-row mt-20">
    {/* Left */}
    <div className="w-full lg:w-2/3 flex flex-col gap-8">
      {/* User Cards */}
      <div className="flex gap-4 justify-between flex-wrap">
        <UserCard type="admin" />
        <UserCard type="teacher" />
        <UserCard type="student" />
        <UserCard type="parent" />
      </div>

      {/* Middle Charts */}
      <div className="flex gap-4 flex-col lg:flex-row ">
          {/* Boys & Girls count chart */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChartContainer />
          </div>

          {/* Attendance Chart */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChartContainer />
          </div>
      </div>

      {/* Bottom Charts */}
      <div className="w-full h-[500px]">
          <FinanceChart />
      </div>
    </div>

    {/* Right */}
    <div className="w-full lg:w-1/3 flex flex-col gap-8">
      <EventCalenderContainer searchParams={searchParams} />
      <Announcements />
    </div>
  </div>
  );
};

export default AdminPage;
