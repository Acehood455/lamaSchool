import prisma from "@/lib/prisma";
import BigCalendar from "./BigCalender";
import { adjustedScheduleToCurrentWeek } from "@/lib/utils";

const BigCalenderContainer = async ({type, id
}:{
    type: 'teacherId' | 'classId';
    id: string | number
}) => {

    const responseData = await prisma.lesson.findMany({
        where: {
            ...(type === 'teacherId' 
            ? {teacherId: id as string} 
            : {classId: id as number})
        }
    })

    const data = responseData.map(lesson => ({
        title: lesson.name,
        start: lesson.startTime,
        end: lesson.endTime
    }))

  const schedule = adjustedScheduleToCurrentWeek(data)
    
  return (
    <>
        <BigCalendar data={data} />
    </>
  );
};

export default BigCalenderContainer;
