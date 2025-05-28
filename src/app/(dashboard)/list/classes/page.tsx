import FormContainer from "@/components/FormContainer";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Image from "next/image";
import { Class, Grade, Prisma, Teacher } from "../../../../../generated/prisma";
import { getUserRole } from "@/lib/utils";

type ClassList = Class & {supervisor: Teacher, grade: Grade}


const ClassesListPage = async ({searchParams}: {searchParams: {[key:string]: string | undefined} }) => {
    const {role} = await getUserRole();


    const {page, ...queryParams} = searchParams;
    const p = page ? parseInt(page) : 1;

    // Url Params Conditions
    const query : Prisma.ClassWhereInput = {}
    
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined){
                switch (key) {
                    case 'supervisorId':
                        query.name = value;
                    break;
                    case 'search':
                        query.name = 
                            {contains: value, mode: 'insensitive'};
                    break;
                default:
                    break;
                 
                }
            }
        }
    }
    
    const [classesData, count] = await prisma.$transaction([
        prisma.class.findMany({
            where: query,
            include: {
                supervisor: true,
                grade: true,
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.class.count({where: query})
    ])

    // console.log(count);


    const columns = [
        {
            header: 'Class Name', 
            accessor:'name',
        },
        {
            header: 'Grade', 
            accessor:'grade', 
            className: 'hidden md:table-cell',
        },
        {
            header: 'Supervisor', 
            accessor:'supervisor', 
            className: 'hidden md:table-cell',
        },
        {
            header: 'Capacity', 
            accessor:'Capacity', 
            className: 'hidden md:table-cell',
        },
        ...(role === 'admin' ? [{
            header: 'Actions', 
            accessor:'action', 
        }] : []),
    ]
    const renderRow = (item:ClassList) =>(
            <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-PurpleLight ">
                <td className="flex items-center gap-4 p-4">
                    {item.name}
                </td>
    
                <td className="hidden md:table-cell">
                    {item.grade.level}
                </td>
    
                <td className="hidden md:table-cell">
                    {item.supervisor.name + ' ' + item.supervisor.surnName}
                </td>
    
                <td className="hidden md:table-cell">
                    {item.capacity}
                </td>
    
                <td className="">
                    <div className="flex items-center gap-2">
                        {role === 'admin' && ( 
                        <>
                            <FormContainer table="class" type="update" data={item} />
                            <FormContainer table="class" type="delete" id={item.id} />
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
        <h1 className="hidden md:block text-lg font-semibold">Classes</h1>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />

            <div className="flex items-center gap-4 self-end">
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-Yellow">
                    <Image src='/filter.png' alt='' width={14} height={14} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded-full bg-Yellow">
                    <Image src='/sort.png' alt='' width={14} height={14} />
                </button>
                {role === 'admin' && ( 
                    <button className="w-8 h-8 flex items-center justify-center rounded-full bg-Yellow">
                        <FormContainer table="class" type="create" />
                    </button>
                )}
            </div>
        </div>
      </div>
        
      {/* List */}
      <Table columns={columns} render={renderRow} data={classesData} />

      {/* Pagination */}
      <Pagination page={p} count={count} />
    </div>
    );
};

export default ClassesListPage;
