import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Image from "next/image";
import { Parent, Prisma, Student } from "../../../../../generated/prisma";
import { getUserRole } from "@/lib/utils";

type ParentList = Parent & {students: Student[]} 


const ParentsListPage = async ({searchParams}: {searchParams: {[key:string]: string | undefined} }) => {
    const {userId, role} = await getUserRole();

    const {page, ...queryParams} = searchParams;
    const p = page ? parseInt(page) : 1;

    // Url Params Conditions
    const query : Prisma.ParentWhereInput = {}
    
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined){
                switch (key) {
                    case 'search':
                        query.OR = [
                            { name: { contains: value, mode: 'insensitive' } },
                            { surnName: { contains: value, mode: 'insensitive' } },
                          ];
                    break;
                default:
                    break;
                 
                }
            }
        }
    }
    
    const [studentsData, count] = await prisma.$transaction([
        prisma.parent.findMany({
            where: query,
            include: {
                students: true,
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.parent.count({where: query})
    ])

    // console.log(count);


    const columns = [
        {
            header: 'Info', 
            accessor:'info',
        },
        {
            header: 'Student Names', 
            accessor:'students', 
            className: 'hidden md:table-cell',
        },
        {
            header: 'Phone', 
            accessor:'phone', 
            className: 'hidden md:table-cell',
        },
        {
            header: 'Address', 
            accessor:'address', 
            className: 'hidden md:table-cell',
        },
        ...(role === 'admin' ? [{
            header: 'Actions', 
            accessor:'action', 
        }] : []),
    ]
    
    const renderRow = (item:ParentList) =>(
        <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-PurpleLight ">
            <td className="flex items-center gap-4 p-4">
                <div className="flex flex-col">
                    <h3 className='font-semibold'>{item.name + ' ' + item.surnName}</h3>
                    <h3 className='text-xs text-gray-500'>{item?.email}</h3>
                </div>
            </td>
    
            <td className="hidden md:table-cell">{item.students.map(student => student.name).join(', ')}</td>
            <td className="hidden md:table-cell">{item.phone}</td>
            <td className="hidden md:table-cell">{item.address}</td>
    
            <td className="">
                <div className="flex items-center gap-2">
                    {role === 'admin' && ( 
                    <>
                        <FormModal table="parent" type="update" data={item} />
                        <FormModal table="parent" type="delete" id={item.id} />
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
        <h1 className="hidden md:block text-lg font-semibold">All Parents</h1>

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
                        <FormModal table="parent" type="create" />
                    </button>
                )}
            </div>
        </div>
      </div>
        
      {/* List */}
      <Table columns={columns} render={renderRow} data={studentsData} />

      {/* Pagination */}
      <Pagination page={p} count={count} />
    </div>
    );
};

export default ParentsListPage;
