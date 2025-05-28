import Announcements from "@/components/Announcements";
import Image from "next/image";
import Link from "next/link";
import Performance from '@/components/Performance';
import FormContainer from "@/components/FormContainer";
import prisma from "@/lib/prisma";
import { Teacher } from "../../../../../../generated/prisma";
import { notFound } from "next/navigation";
import { getUserRole } from "@/lib/utils";
import BigCalenderContainer from "@/components/BigCalenderContainer";

const SingleTeacherPage = async ({params:{id}}: {params: {id: string}}) => {
    const {role} = await getUserRole();

    const teacher: (Teacher & {_count: {subjects: number, lessons: number, classes: number}})
     | null = await prisma.teacher.findUnique({
        where: { id },
        include: {
            _count: {
                select: {
                    subjects: true,
                    lessons: true,
                    classes: true,
                }
            }
        }
    });

    if(!teacher){
        return notFound()
    }
    
  return (
    <div className='mt-16 flex-1 p-4 flex flex-col gap-4 xl:flex-row'>
        {/* Left */}
        <div className='w-full xl:w-2/3'>
            {/* Top */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* User Info Card */}
                <div className="bg-Sky py-6 px-4 rounded-md flex flex-1 gap-4">
                    <div className="w-1/3 items-center">
                        <Image src={teacher.img || "/noAvata.png"} alt='' width={144} height={144} className="w-36 h-36 rounded-full object-cover" />
                    </div>


                    <div className="w-2/3 flex flex-col justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-semibold">
                                {teacher.name + " " + teacher.surnName}
                            </h1>

                            {role === 'admin' && (
                                <FormContainer 
                                    table="teacher" 
                                    type="update" 
                                    data={teacher} 
                                />
                            )}
                        </div>
                        
                        <p className="text-sm text-gray-500">
                            Lorem psum trakb uyvwwn umde raterd iohbdc tious sdc.
                        </p>

                        <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                            <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                                <Image src='/blood.png' alt='' width={14} height={14} />
                                <span className="">{teacher.bloodType}</span>
                            </div>
                            <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                                <Image src='/date.png' alt='' width={14} height={14} />
                                <span className="">{new Intl.DateTimeFormat('en-US').format(teacher.birthday)}</span>
                            </div>
                            <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                                <Image src='/mail.png' alt='' width={14} height={14} />
                                <span className="">{teacher.email || "-"}</span>
                            </div>
                            <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                                <Image src='/phone.png' alt='' width={14} height={14} />
                                <span className="">{teacher.phone || "-"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Small Cards */}
                <div className="flex flex-1 gap-4 justify-between flex-wrap">
                    {/* Card 1 */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[47%] xl:w-[45%] 2xl:w-[48%]">
                        <Image src='/singleAttendance.png' alt='' width={24} height={24} className='w-6 h-6' /> 
                        
                        <div className="">
                            <h1 className='text-xl font-semibold'>90%</h1>
                            <span className="text-sm text-gray-400 ">Attendance</span>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[47%] xl:w-[45%] 2xl:w-[48%]">
                        <Image src='/singleClass.png' alt='' width={24} height={24} className='w-6 h-6' /> 
                        
                        <div className="">
                            <h1 className='text-xl font-semibold'>{teacher._count.classes}</h1>
                            <span className="text-sm text-gray-400 ">Classes</span>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[47%] xl:w-[45%] 2xl:w-[48%]">
                        <Image src='/singleBranch.png' alt='' width={24} height={24} className='w-6 h-6' /> 
                        
                        <div className="">
                            <h1 className='text-xl font-semibold'>{teacher._count.subjects}</h1>
                            <span className="text-sm text-gray-400 ">Subject&apos;s&apos;</span>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[47%] xl:w-[45%] 2xl:w-[48%]">
                        <Image src='/singleLesson.png' alt='' width={24} height={24} className='w-6 h-6' /> 
                        
                        <div className="">
                            <h1 className='text-xl font-semibold'>{teacher._count.lessons}</h1>
                            <span className="text-sm text-gray-400 ">Lesson&apos;s&apos;</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="mt-4 bg-white rounded-md p-4 h-[800px] ">
                <h1>Teachers&apos; Schedule</h1>

                <BigCalenderContainer type='teacherId' id={teacher.id} />
            </div>
        </div>

        {/* Right */}
        <div className='w-full xl:w-1/3 flex flex-col gap-4'>
            <div className="bg-white rounded-md p-4">
                <h1 className='text-xl font-semibold'>Shortcuts</h1>
                
                <div className='mt-4 flex gap-4 flex-wrap text-xs text-gray-500'>
                    <Link href={`/list/students?teacherId=${'teacher2'}`} className='p-3 rounded-md bg-SkyLight' >Teacher&apos;s Students</Link>
                    <Link href={`/list/lessons?teacherId=${'teacher2'}`} className='p-3 rounded-md bg-PurpleLight' >Teacher&apos;s Lessons</Link>
                    <Link href={`/list/classes?supervisorId=${'teacher2'}`} className='p-3 rounded-md bg-YellowLight' >Teacher&apos;s Classes</Link>
                    <Link href={`/list/exams?teacherId=${'teacher2'}`} className='p-3 rounded-md bg-pink-50' >Teacher&apos;s Exams</Link>
                    <Link href={`/list/assignments?teacherId=${'teacher2'}`} className='p-3 rounded-md bg-green-50' >Teacher&apos;s Assignments</Link>
                </div>
            </div>

            <Performance />
            
            <Announcements />
        </div>
    </div>
    );
};

export default SingleTeacherPage;
