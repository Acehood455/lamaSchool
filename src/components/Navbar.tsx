import prisma from "@/lib/prisma";
// import { getUserRole } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";

const Navbar = async () =>  {
    const user = await currentUser()
    // const role = user?.publicMetadata.role as string;
    // const {role} = await getUserRole();
    const fullName = user?.fullName || "Admin";


  return (
  <div className="flex items-center justify-between p-4 fixed z-50 w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-white">
    {/* Search Bar */}
    <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
        <Image src='/search.png' alt="search" width={14} height={14} />
        <input type="text" placeholder="Search..." className="w-[200px] p-2 bg-transparent outline-none " />
    </div>

    {/* Icons an User */}
    <div className=" flex items-center gap-6 justify-end w-full">
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
            <Image src='/message.png' alt='' width={20} height={20}/>
        </div>
        
        <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
            <Image src='/announcement.png' alt='' width={20} height={20}/>
            <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-sm">1</div>
        </div>

        <div className="flex flex-col">
            <span className="text-xs leading-3 font-medium">{fullName}</span>
            <span className="text-[10px] text-gray-500 text-right">{user?.publicMetadata?.role as string}</span>
        </div>

        {/* <Image src="/avatar.png" alt="" width={36} height={36} className="rounded-full" /> */}
        <UserButton />
    </div>
  </div>);
};

export default Navbar;



// import prisma from "@/lib/prisma";
// import { currentUser } from "@clerk/nextjs/server";
// import { UserButton } from "@clerk/nextjs";
// import Image from "next/image";

// const Navbar = async () => {
//   const user = await currentUser();
//   const role = user?.publicMetadata?.role as string;
//   const fullName = user?.fullName || "Administrator";

//   let avatarUrl: string | null = null;

//   if (user?.id) {
//     if (role === "teacher") {
//       const teacher = await prisma.teacher.findUnique({ where: { id: user.id }, select: { img: true } });
//       avatarUrl = teacher?.img || null;
//     } else if (role === "student") {
//       const student = await prisma.student.findUnique({ where: { id: user.id }, select: { img: true } });
//       avatarUrl = student?.img || null;
//     } 
//   }

//   return (
//     <div className="flex items-center justify-between p-4 fixed z-50 w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] bg-white">
//       {/* Search Bar */}
//       <div className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
//         <Image src='/search.png' alt="search" width={14} height={14} />
//         <input type="text" placeholder="Search..." className="w-[200px] p-2 bg-transparent outline-none " />
//       </div>

//       {/* Icons and User */}
//       <div className="flex items-center gap-6 justify-end w-full">
//         <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer">
//           <Image src='/message.png' alt='' width={20} height={20} />
//         </div>

//         <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative">
//           <Image src='/announcement.png' alt='' width={20} height={20} />
//           <div className="absolute -top-3 -right-3 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-sm">1</div>
//         </div>

//         <div className="flex flex-col">
//           <span className="text-xs leading-3 font-medium">{fullName}</span>
//           <span className="text-[10px] text-gray-500 text-right">{role}</span>
//         </div>

//         {/* Avatar Image */}
//         {avatarUrl ? (
//           <Image
//             src={avatarUrl}
//             alt="User Avatar"
//             width={36}
//             height={36}
//             className="rounded-full"
//           />
//         ) : (
//           <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
//             <Image src='/avatar.png' alt="" width={36} height={36} className="rounded-full" />
//           </div>
//         )}

//         {/* Sign Out Only Button */}
//         <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "hidden" } }} />
//       </div>
//     </div>
//   );
// };

// export default Navbar;
