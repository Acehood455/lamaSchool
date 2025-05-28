import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import Image from "next/image";
import { Prisma } from "../../../../../generated/prisma";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import { getUserRole } from "@/lib/utils";

type ResultList = {
    id: number;
    title: string;
    studentName: string;
    studentSurnName: string;
    teacherName: string;
    teacherSurnName: string;
    score: number;
    className: string;
    startTime: Date;
}


const ResultListPage =  async ({searchParams}: {searchParams: {[key:string]: string | undefined} }) => {
    const {userId, role} = await getUserRole();

    const {page, ...queryParams} = searchParams;
    const p = page ? parseInt(page) : 1;

    // Url Params Conditions
    const query : Prisma.ResultWhereInput = {}
    
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined){
                switch (key) {
                    case 'studentId':
                        query.studentId = value;
                    break;
                    case 'search':
                        query.OR = [
                            {exam: { title: { contains: value, mode: 'insensitive' } } },
                            {student: { name: { contains: value, mode: 'insensitive' } } },
                        ];
                    break;
                default:
                    break;
                 
                }
            }
        }
    }


    // Role Conditions
    switch (role) {
        case 'admin':
            break;

        case 'teacher':
            query.OR = [
                { exam: {lesson: { teacherId: userId! } } },
                { assignment: {lesson: { teacherId: userId! } } }
            ]
            break;

        case 'student':
            query.studentId = userId!
            break;
        case 'parent':
            query.student = {
                parentId: userId!
            };
            break;
    
        default:
            break;
    }
    
    
    const [resultsData, count] = await prisma.$transaction([
        prisma.result.findMany({
            where: query,
            include: {
                student: {select: {name:true, surnName:true} },
                exam: {
                    include: {
                        lesson:{
                            select: {
                                class: {select: {name: true}},
                                teacher: {select: {name: true, surnName: true}},
                            }
                        }
                    }
                },
                assignment: {
                    include: {
                        lesson:{
                            select: {
                                class: {select: {name: true}},
                                teacher: {select: {name: true, surnName: true}},
                            }
                        }
                    }
                }
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.result.count({where: query})
    ]);

    const data = resultsData.map(item => {
        const assessment = item.exam || item.assignment

        if (!assessment) return null;

        const isExam = 'startTime' in assessment;

        return {
            id: item.id,
            title: assessment.title,
            studentName: item.student.name,
            studentSurnName: item.student.surnName,
            teacherName: assessment.lesson.teacher.name,
            teacherSurnName: assessment.lesson.teacher.surnName,
            score: item.score,
            className: assessment.lesson.class.name,
            startTime: isExam ? assessment.startTime : assessment.startDate,

        }
    })

    // console.log(count);


    const columns = [
        {
            header: 'Title', 
            accessor:'title',
        },
        {
            header: 'Student', 
            accessor:'student', 
        },
        {
            header: 'Score', 
            accessor:'score', 
            className: 'hidden md:table-cell',
        },
        {
            header: 'Teacher', 
            accessor:'teacher', 
            className: 'hidden md:table-cell',
        },
        {
            header: 'Class', 
            accessor:'class', 
            className: 'hidden md:table-cell',
        },
        {
            header: 'Date', 
            accessor:'date', 
            className: 'hidden md:table-cell',
        },
        ...(role === 'admin' || role === 'teacher' ? [{
            header: 'Actions', 
            accessor:'action', 
        }] : []),
    ]
    
    const renderRow = (item:ResultList) =>(
        <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-PurpleLight ">
            <td className="flex items-center gap-4 p-4">
                {item.title}
            </td>
    
            <td>
                {item.studentName + ' ' + item.studentSurnName}
            </td>
    
            <td className="hidden md:table-cell">
                {item.score}
            </td>
    
            <td className="hidden md:table-cell">
                {item.teacherName + " " + item.teacherSurnName}
            </td>
    
            <td className="hidden md:table-cell">
                {item.className}
            </td>
    
            <td className="hidden md:table-cell">
                {new Intl.DateTimeFormat('en-US').format(item.startTime)}
            </td>
    
            <td className="">
                <div className="flex items-center gap-2">
                {(role === 'admin' || role === 'teacher') && ( 
                    <>
                        <FormModal table="result" type="update" data={item} />
                        <FormModal table="result" type="delete" id={item.id} />
                    </>
                    )}
                </div>
            </td>
        </tr>
    );
    
    
  return (
    <div className="mt-20 bg-white p-4 rounded-md flex-1 m-4">
      {/* Top */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Results</h1>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />

            <div className="flex items-center gap-4 self-end">
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-Yellow">
                    <Image src='/filter.png' alt='' width={14} height={14} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-Yellow">
                    <Image src='/sort.png' alt='' width={14} height={14} />
                </button>
                {(role === 'admin' || role === 'teacher') && ( 
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-Yellow">
                        <FormModal table="result" type="create" />
                    </button>
                )}
            </div>
        </div>
      </div>
        
      {/* List */}
      <Table columns={columns} render={renderRow} data={data} />

      {/* Pagination */}
      <Pagination page={p} count={count} />
    </div>
    );
};

export default ResultListPage;
