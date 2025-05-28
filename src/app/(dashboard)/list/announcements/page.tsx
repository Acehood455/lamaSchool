import FormModal from "@/components/FormModal";
import Pagination from "@/components/Pagination";
import Table from "@/components/Table";
import TableSearch from "@/components/TableSearch";
import prisma from "@/lib/prisma";
import { ITEM_PER_PAGE } from "@/lib/settings";
import Image from "next/image";
import { Announcement, Class, Prisma } from "../../../../../generated/prisma";
import { getUserRole } from "@/lib/utils";


type AnnouncementList = Announcement & {class: Class}

const AnnouncementListPage = async ({searchParams}: {searchParams: {[key:string]: string | undefined} }) => {
    const {userId, role} = await getUserRole();
    
    const {page, ...queryParams} = searchParams;
    const p = page ? parseInt(page) : 1;

    // Url Params Conditions
    const query : Prisma.AnnouncementWhereInput = {}
    
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined){
                switch (key) {
                    case 'search':
                        query.title = 
                            {contains: value, mode: 'insensitive'};
                        break;
                    default:
                        break;
                 
                }
            }
        }
    }

    
    // Role Conditions
    const roleCoditions = {
        teacher: { lessons: { some: { teacherId: userId! } } },
        student: { students: { some: { id: userId! } } },
        parent: { students: { some: { parentId: userId! } } },
    }
    query.OR = [
        { classId: null }, 
        { class: roleCoditions[role as keyof typeof roleCoditions] || {}}
    ];
    
    const [announcementsData, count] = await prisma.$transaction([
        prisma.announcement.findMany({
            where: query,
            include: {
                class: true,
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1),
        }),
        prisma.announcement.count({where: query})
    ])

    // console.log(count);


        
    const columns = [
        {
            header: 'Title', 
            accessor:'title',
        },
        {
            header: 'Class', 
            accessor:'class', 
        },
        {
            header: 'Date', 
            accessor:'date', 
            className: 'hidden md:table-cell',
        },
        ...(role === 'admin' ? [{
            header: 'Actions', 
            accessor:'action', 
        }] : []),
    ]

    const renderRow = (item:AnnouncementList) => (
        <tr key={item.id} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-PurpleLight ">
            <td className="flex items-center gap-4 p-4">
                {item.title}
            </td>

            <td>
                {item.class?.name || '-'}
            </td>

            <td className="hidden md:table-cell">
                {new Intl.DateTimeFormat('en-US').format(item.date)}
            </td>
            
            <td className="">
                <div className="flex items-center gap-2">
                {role === 'admin' && ( 
                    <>
                        <FormModal table="announcement" type="update" data={item} />
                        <FormModal table="announcement" type="delete" id={item.id} />
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
        <h1 className="hidden md:block text-lg font-semibold">Announcements</h1>

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
                        <FormModal table="announcement" type="create" />
                    </button>
                )}
            </div>
        </div>
      </div>
        
      {/* List */}
      <Table columns={columns} render={renderRow} data={announcementsData} />

      {/* Pagination */}
      <Pagination page={p} count={count} />
    </div>
    );
};

export default AnnouncementListPage;
