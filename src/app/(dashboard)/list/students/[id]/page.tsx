import Announcements from "@/components/Announcements";
import Image from "next/image";
import Link from "next/link";
import Performance from '@/components/Performance';
import { Class, Grade, Student } from "../../../../../../generated/prisma";
import { notFound } from "next/navigation";
import { getUserRole } from "@/lib/utils";
import prisma from "@/lib/prisma";
import { Suspense } from "react";
import StudentAttendanceCard from "@/components/StudentAttendanceCard";
import BigCalenderContainer from "@/components/BigCalenderContainer";
import FormContainer from "@/components/FormContainer";

const SingleStudentPage = async ({params:{id}}: {params: {id: string}}) => {
    const {role} = await getUserRole();

    const student: (Student & { class: (Class & {_count:{lessons:number}}), grade: Grade})
     | null = await prisma.student.findUnique({
        where: { id },
        include: {
                    class: {include: {_count: {select: {lessons:true}}}},
                    grade: true,
                }
    });

    if(!student){
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
                        <Image src={student.img || '/noAvatar.png'} alt='' width={144} height={144} className="w-36 h-36 rounded-full object-cover" />
                    </div>


                    <div className="w-2/3 flex flex-col justify-between gap-4">
                        <div className="flex items-center gap-4">
                                <h1 className="text-xl font-semibold">
                                    {student.name + " " + student.surnName}
                                </h1>
                                
                                {role === 'admin' && (
                                        <FormContainer 
                                            table="student" 
                                            type="update" 
                                            data={student} 
                                        />
                                )}
                        </div>
                            
                        <p className="text-sm text-gray-500">
                            Lorem psum trakb uyvwwn umde raterd iohbdc tious sdc.
                        </p>

                        <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                            <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                                <Image src='/blood.png' alt='' width={14} height={14} />
                                <span className="">{student.bloodType}</span>
                            </div>
                            <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                                <Image src='/date.png' alt='' width={14} height={14} />
                                <span className="">{new Intl.DateTimeFormat('en-US').format(student.birthday)}</span>
                            </div>
                            <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                                <Image src='/mail.png' alt='' width={14} height={14} />
                                <span className="">{student.email || '-'}</span>
                            </div>
                            <div className="w-full md:w-1/3 lg:w-full flex items-center gap-2">
                                <Image src='/phone.png' alt='' width={14} height={14} />
                                <span className="">{student.phone || '-'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Small Cards */}
                <div className="flex flex-1 gap-4 justify-between flex-wrap">
                    {/* Card 1 */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[47%] xl:w-[45%] 2xl:w-[48%]">
                        <Image src='/singleAttendance.png' alt='' width={24} height={24} className='w-6 h-6' /> 
                        
                        <Suspense fallback="Loading...">
                            <StudentAttendanceCard id={student.id} />
                        </Suspense>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[47%] xl:w-[45%] 2xl:w-[48%]">
                        <Image src='/singleClass.png' alt='' width={24} height={24} className='w-6 h-6' /> 
                        
                        <div className="">
                            <h1 className='text-xl font-semibold'>{student.grade.level}</h1>
                            <span className="text-sm text-gray-400 ">Grade</span>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[47%] xl:w-[45%] 2xl:w-[48%]">
                        <Image src='/singleBranch.png' alt='' width={24} height={24} className='w-6 h-6' /> 
                        
                        <div className="">
                            <h1 className='text-xl font-semibold'>{student.class.name}</h1>
                            <span className="text-sm text-gray-400 ">Class</span>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[47%] xl:w-[45%] 2xl:w-[48%]">
                        <Image src='/singleLesson.png' alt='' width={24} height={24} className='w-6 h-6' /> 
                        
                        <div className="">
                            <h1 className='text-xl font-semibold'>{student.class._count.lessons}</h1>
                            <span className="text-sm text-gray-400 ">Lessons</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="mt-4 bg-white rounded-md p-4 h-[800px] ">
                <h1>Students&apos; Schedule</h1>

                <BigCalenderContainer type="classId" id={student.class.id} />
            </div>
        </div>

        {/* Right */}
        <div className='w-full xl:w-1/3 flex flex-col gap-4'>
            <div className="bg-white rounded-md p-4">
                <h1 className='text-xl font-semibold'>Shortcuts</h1>
                
                <div className='mt-4 flex gap-4 flex-wrap text-xs text-gray-500'>
                    <Link href={`/list/lessons?classId=${2}`} className='p-3 rounded-md bg-SkyLight' >Student&apos;s Lessons</Link>
                    <Link href={`/list/teachers?classId=${2}`} className='p-3 rounded-md bg-PurpleLight' >Student&apos;s Teachers</Link>
                    <Link href={`/list/results?studentId=${'student2'}`} className='p-3 rounded-md bg-YellowLight' >Student&apos;s Results</Link>
                    <Link href={`/list/exams?classId=${2}`} className='p-3 rounded-md bg-pink-50' >Student&apos;s Exams</Link>
                    <Link href={`/list/assignments?classId=${2}`} className='p-3 rounded-md bg-green-50' >Student&apos;s Assignments</Link>
                </div>
            </div>

            <Performance />
            
            <Announcements />
        </div>
    </div>
    );
};

export default SingleStudentPage;
