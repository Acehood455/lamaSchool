import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Image from "next/image";
import { Assignment, Class, Prisma, Subject, Teacher } from "../../../../../generated/prisma";
import { getUserRole } from "@/lib/utils";

type AssignmentList = Assignment & {lesson:{ 
    subject: Subject;
    teacher: Teacher ;   
    class: Class    ;
}
}

 

const AssignmentListPage = async ({searchParams}: {searchParams: {[key:string]: string | undefined} }) => {
    const {userId, role} = await getUserRole();
    
    const {page, ...queryParams} = searchParams;
    const p = page ? parseInt(page) : 1;

    // Url Params Conditions
    const query : Prisma.AssignmentWhereInput = {}
    query.lesson = {}
    
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined){
                switch (key) {
                    case 'teacherId':
                        query.lesson.teacherId = value;
                    break;
                    case 'classId':
                        query.lesson.classId = parseInt(value);
                    break;
                    case 'search':
                        query.lesson.subject =
                            { name: 
                                {contains: value, mode: 'insensitive'}
                            }
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
            query.lesson.teacherId = userId!;
            break;
        case 'student':
            query.lesson.class = {
                students: {
                  some: {
                      id: userId!
                  }
                }
            };
            break;
        case 'parent':
            query.lesson.class = {
                students: {
                  some: {
                      parentId: userId!
                  }
                }
            };
            break;
        default:
            break;
    }
    
    const [assignmentsData, count] = await prisma.$transaction([
        prisma.assignment.findMany({
            where: query,
            include: {
                lesson: {
                    select: {
                        subject: { select: { name: true } },
                        teacher: { select: { name: true, surnName: true } },
                        class: { select: { name: true } },
                    }
                }
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.assignment.count({where: query})
    ])

    // console.log(count);


    const columns = [
        {
            header: 'Subject Name', 
            accessor:'name',
        },
        {
            header: 'Class', 
            accessor:'class', 
        },
        {
            header: 'Teacher', 
            accessor:'teacher', 
            className: 'hidden md:table-cell',
        },
        {
            header: 'Due Date', 
            accessor:'dueDate', 
            className: 'hidden md:table-cell',
        },
        ...(role === 'admin' || role === 'teacher' ? [{
            header: 'Actions', 
            accessor:'action', 
        }] : []),
    ]
    
    const renderRow = (item:AssignmentList) =>(
        <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-PurpleLight ">
            <td className="flex items-center gap-4 p-4">
                {item.lesson.subject.name}
            </td>
    
            <td>
                {item.lesson.class.name}
            </td> 
    
            <td className="hidden md:table-cell">
                {item.lesson.teacher.name + ' ' + item.lesson.teacher.surnName}
            </td>
    
            <td className="hidden md:table-cell">
            {new Intl.DateTimeFormat('en-US').format(item.dueDate)}
            </td>
    
            <td className="">
                <div className="flex items-center gap-2">
                {(role === 'admin' || role === 'teacher') && (  
                    <>
                        <FormModal table="assignment" type="update" data={item} />
                        <FormModal table="assignment" type="delete" id={item.id} />
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
        <h1 className="hidden md:block text-lg font-semibold">Assignments</h1>

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
                        <FormModal table="assignment" type="create" />
                    </button>
                )}
            </div>
        </div>
      </div>
        
      {/* List */}
      <Table columns={columns} render={renderRow} data={assignmentsData} />

      {/* Pagination */}
      <Pagination page={p} count={count} />
    </div>
    );
};

export default AssignmentListPage;
