import Image from "next/image";
import AttendanceChart from "./AttendanceChart";
import prisma from "@/lib/prisma";

const AttendanceChartContainer = async () => {

    const today = new Date();
    const dayOfTheWeek = today.getDay();
    const daysSinceMonday = dayOfTheWeek === 0 ? 6 : dayOfTheWeek - 1;

    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - daysSinceMonday);
    
    const responseData = await prisma.attendance.findMany({
        where: {
            date: {
                gte: lastMonday
            }
        },
        select: {
            date: true,
            present: true
        }
    });

    const daysOfTheWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
    
    const attendanceMap: {[key: string]: {present:number, absent:number}} = {
        Mon: {present:0, absent:0},
        Tue: {present:0, absent:0},
        Wed: {present:0, absent:0},
        Thu: {present:0, absent:0},
        Fri: {present:0, absent:0},
    }

    responseData.forEach(item => {
        const itemData = new Date (item.date)

        if (dayOfTheWeek >= 1 && dayOfTheWeek <= 5) {
            const dayName = daysOfTheWeek[dayOfTheWeek - 1];

            if (item.present) {
                attendanceMap[dayName].present += 1;
            }else {
                attendanceMap[dayName].absent += 1;
            }
        }
    });

    const data = daysOfTheWeek.map(day => ({
        name: day,
        present: attendanceMap[day].present,
        absent: attendanceMap[day].absent
    }))
    
    
  return (
    <div className='bg-white rounded-lg p-4 h-full '>
        <div className="flex justify-between items-center">
            <h1 className='text-lg font-semibold'>Attendance</h1>
            <Image src='/moreDark.png' alt='' width={20} height={20} />
        </div>

        <AttendanceChart data={data} />
    </div>
  );
};

export default AttendanceChartContainer;
