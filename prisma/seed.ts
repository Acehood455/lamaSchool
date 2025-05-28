const { PrismaClient, UseSex, Day } = require('../generated/prisma');
const prisma = new PrismaClient();

async function main() {
  // ADMIN
  await prisma.admin.upsert({
    where: { id: "admin1" },
    update: {},
    create: { id: "admin1", username: "admin1" },
  });
  await prisma.admin.upsert({
    where: { id: "admin2" },
    update: {},
    create: { id: "admin2", username: "admin2" },
  });

  // GRADE
  for (const i of Array.from({ length: 6 }, (_, i) => i + 1)) {
    await prisma.grade.upsert({
      where: { id: i },
      update: {},
      create: { level: i.toString() },
    });
  }

  // CLASS
  for (const i of Array.from({ length: 6 }, (_, i) => i + 1)) {
    await prisma.class.upsert({
      where: { id: i },
      update: {},
      create: {
        name: `${i}A`,
        gradeId: i,
        capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
      },
    });
  }

  // SUBJECT
  const subjectData = [
    "Mathematics", "Science", "English", "History", "Geography",
    "Physics", "Chemistry", "Biology", "Computer Science", "Art",
  ];

  for (const [i, subject] of subjectData.entries()) {
    await prisma.subject.upsert({
      where: { id: i + 1 },
      update: {},
      create: { name: subject },
    });
  }

  // TEACHER
  for (const i of Array.from({ length: 15 }, (_, i) => i + 1)) {
    await prisma.teacher.upsert({
      where: { id: `teacher${i}` },
      update: {},
      create: {
        id: `teacher${i}`,
        username: `teacher${i}`,
        name: `TName${i}`,
        surnName: `TSurname${i}`,
        email: `teacher${i}@example.com`,
        phone: `123-456-789${i}`,
        address: `Address${i}`,
        bloodType: "A+",
        sex: i % 2 === 0 ? UseSex.MALE : UseSex.FEMALE,
        subjects: { connect: [{ id: (i % 10) + 1 }] },
        classes: { connect: [{ id: (i % 6) + 1 }] },
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
      },
    });
  }

  // LESSON
  for (const i of Array.from({ length: 30 }, (_, i) => i + 1)) {
    await prisma.lesson.upsert({
      where: { id: i },
      update: {},
      create: {
        name: `Lesson${i}`,
        day: Day[Object.keys(Day)[Math.floor(Math.random() * Object.keys(Day).length)] as keyof typeof Day],
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 3)),
        subjectId: (i % 10) + 1,
        classId: (i % 6) + 1,
        teacherId: `teacher${(i % 15) + 1}`,
      },
    });
  }

  // PARENT
  for (const i of Array.from({ length: 25 }, (_, i) => i + 1)) {
    await prisma.parent.upsert({
      where: { id: `parentId${i}` },
      update: {},
      create: {
        id: `parentId${i}`,
        username: `parentId${i}`,
        name: `PName ${i}`,
        surnName: `PSurname ${i}`,
        email: `parent${i}@example.com`,
        phone: `123-456-789${i}`,
        address: `Address${i}`,
      },
    });
  }

  // STUDENT
  for (const i of Array.from({ length: 50 }, (_, i) => i + 1)) {
    await prisma.student.upsert({
      where: { id: `student${i}` },
      update: {},
      create: {
        id: `student${i}`,
        username: `student${i}`,
        name: `SName${i}`,
        surnName: `SSurname ${i}`,
        email: `student${i}@example.com`,
        phone: `987-654-321${i}`,
        address: `Address${i}`,
        bloodType: "O-",
        sex: i % 2 === 0 ? UseSex.MALE : UseSex.FEMALE,
        parentId: `parentId${Math.ceil(i / 2) % 25 || 25}`,
        gradeId: (i % 6) + 1,
        classId: (i % 6) + 1,
        birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
      },
    });
  }

  // EXAM
  for (const i of Array.from({ length: 10 }, (_, i) => i + 1)) {
    await prisma.exam.upsert({
      where: { id: i },
      update: {},
      create: {
        title: `Exam ${i}`,
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
        lessonId: (i % 30) + 1,
      },
    });
  }

  // ASSIGNMENT
  for (const i of Array.from({ length: 10 }, (_, i) => i + 1)) {
    await prisma.assignment.upsert({
      where: { id: i },
      update: {},
      create: {
        title: `Assignment ${i}`,
        startDate: new Date(new Date().setHours(new Date().getHours() + 1)),
        dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
        lessonId: (i % 30) + 1,
      },
    });
  }

  // RESULT
  for (const i of Array.from({ length: 10 }, (_, i) => i + 1)) {
    await prisma.result.upsert({
      where: { id: i },
      update: {},
      create: {
        score: 90,
        studentId: `student${i}`,
        ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }),
      },
    });
  }

  // ATTENDANCE
  for (const i of Array.from({ length: 10 }, (_, i) => i + 1)) {
    await prisma.attendance.upsert({
      where: { id: i },
      update: {},
      create: {
        date: new Date(),
        present: true,
        studentId: `student${i}`,
        lessonId: (i % 30) + 1,
      },
    });
  }

  // EVENT
  for (const i of Array.from({ length: 5 }, (_, i) => i + 1)) {
    await prisma.event.upsert({
      where: { id: i },
      update: {},
      create: {
        title: `Event ${i}`,
        description: `Description for Event ${i}`,
        startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
        endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
        classId: (i % 5) + 1,
      },
    });
  }

  // ANNOUNCEMENT
  for (const i of Array.from({ length: 5 }, (_, i) => i + 1)) {
    await prisma.announcement.upsert({
      where: { id: i },
      update: {},
      create: {
        title: `Announcement ${i}`,
        description: `Description for Announcement ${i}`,
        date: new Date(),
        classId: (i % 5) + 1,
      },
    });
  }

  console.log("Seeding completed successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });




























// const { PrismaClient, UseSex, Day } = require('../generated/prisma');

// const prisma = new PrismaClient();

// async function main() {
//   // ADMIN
//   await prisma.admin.upsert({
//     where: { id: "admin1" },
//     update: {},
//     create: { id: "admin1", username: "admin1" },
//   });
//   await prisma.admin.upsert({
//     where: { id: "admin2" },
//     update: {},
//     create: { id: "admin2", username: "admin2" },
//   });

//   // GRADE
//   for (let i = 1; i <= 6; i++) {
//     await prisma.grade.upsert({
//       where: { id: i },
//       update: {},
//       create: { level: i.toString() },
//     });
//   }

//   // CLASS
//   for (let i = 1; i <= 6; i++) {
//     await prisma.class.upsert({
//       where: { id: i },
//       update: {},
//       create: {
//         name: `${i}A`,
//         gradeId: i,
//         capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
//       },
//     });
//   }

//   // SUBJECT
//   const subjectData = [
//     "Mathematics", "Science", "English", "History", "Geography",
//     "Physics", "Chemistry", "Biology", "Computer Science", "Art",
//   ];

//   for (let i = 0; i < subjectData.length; i++) {
//     await prisma.subject.upsert({
//       where: { id: i + 1 },
//       update: {},
//       create: { name: subjectData[i] },
//     });
//   }

//   // TEACHER
//   for (let i = 1; i <= 15; i++) {
//     await prisma.teacher.upsert({
//       where: { id: `teacher${i}` },
//       update: {},
//       create: {
//         id: `teacher${i}`,
//         username: `teacher${i}`,
//         name: `TName${i}`,
//         surnName: `TSurname${i}`,
//         email: `teacher${i}@example.com`,
//         phone: `123-456-789${i}`,
//         address: `Address${i}`,
//         bloodType: "A+",
//         sex: i % 2 === 0 ? UseSex.MALE : UseSex.FEMALE,
//         subjects: { connect: [{ id: (i % 10) + 1 }] },
//         classes: { connect: [{ id: (i % 6) + 1 }] },
//         birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
//       },
//     });
//   }

//   // LESSON
//   for (let i = 1; i <= 30; i++) {
//     await prisma.lesson.upsert({
//       where: { id: i },
//       update: {},
//       create: {
//         name: `Lesson${i}`,
//         day: Day[Object.keys(Day)[Math.floor(Math.random() * Object.keys(Day).length)] as keyof typeof Day],
//         startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
//         endTime: new Date(new Date().setHours(new Date().getHours() + 3)),
//         subjectId: (i % 10) + 1,
//         classId: (i % 6) + 1,
//         teacherId: `teacher${(i % 15) + 1}`,
//       },
//     });
//   }

//   // PARENT
//   for (let i = 1; i <= 25; i++) {
//     await prisma.parent.upsert({
//       where: { id: `parentId${i}` },
//       update: {},
//       create: {
//         id: `parentId${i}`,
//         username: `parentId${i}`,
//         name: `PName ${i}`,
//         surnName: `PSurname ${i}`,
//         email: `parent${i}@example.com`,
//         phone: `123-456-789${i}`,
//         address: `Address${i}`,
//       },
//     });
//   }

//   // STUDENT
//   for (let i = 1; i <= 50; i++) {
//     await prisma.student.upsert({
//       where: { id: `student${i}` },
//       update: {},
//       create: {
//         id: `student${i}`,
//         username: `student${i}`,
//         name: `SName${i}`,
//         surnName: `SSurname ${i}`,
//         email: `student${i}@example.com`,
//         phone: `987-654-321${i}`,
//         address: `Address${i}`,
//         bloodType: "O-",
//         sex: i % 2 === 0 ? UseSex.MALE : UseSex.FEMALE,
//         parentId: `parentId${Math.ceil(i / 2) % 25 || 25}`,
//         gradeId: (i % 6) + 1,
//         classId: (i % 6) + 1,
//         birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
//       },
//     });
//   }

//   // EXAM
//   for (let i = 1; i <= 10; i++) {
//     await prisma.exam.upsert({
//       where: { id: i },
//       update: {},
//       create: {
//         title: `Exam ${i}`,
//         startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
//         endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
//         lessonId: (i % 30) + 1,
//       },
//     });
//   }

//   // ASSIGNMENT
//   for (let i = 1; i <= 10; i++) {
//     await prisma.assignment.upsert({
//       where: { id: i },
//       update: {},
//       create: {
//         title: `Assignment ${i}`,
//         startDate: new Date(new Date().setHours(new Date().getHours() + 1)),
//         dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
//         lessonId: (i % 30) + 1,
//       },
//     });
//   }

//   // RESULT
//   for (let i = 1; i <= 10; i++) {
//     await prisma.result.upsert({
//       where: { id: i },
//       update: {},
//       create: {
//         score: 90,
//         studentId: `student${i}`,
//         ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }),
//       },
//     });
//   }

//   // ATTENDANCE
//   for (let i = 1; i <= 10; i++) {
//     await prisma.attendance.upsert({
//       where: { id: i },
//       update: {},
//       create: {
//         date: new Date(),
//         present: true,
//         studentId: `student${i}`,
//         lessonId: (i % 30) + 1,
//       },
//     });
//   }

//   // EVENT
//   for (let i = 1; i <= 5; i++) {
//     await prisma.event.upsert({
//       where: { id: i },
//       update: {},
//       create: {
//         title: `Event ${i}`,
//         description: `Description for Event ${i}`,
//         startTime: new Date(new Date().setHours(new Date().getHours() + 1)),
//         endTime: new Date(new Date().setHours(new Date().getHours() + 2)),
//         classId: (i % 5) + 1,
//       },
//     });
//   }

//   // ANNOUNCEMENT
//   for (let i = 1; i <= 5; i++) {
//     await prisma.announcement.upsert({
//       where: { id: i },
//       update: {},
//       create: {
//         title: `Announcement ${i}`,
//         description: `Description for Announcement ${i}`,
//         date: new Date(),
//         classId: (i % 5) + 1,
//       },
//     });
//   }

//   console.log("Seeding completed successfully.");
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect();
//   })
//   .catch(async (e) => {
//     console.error(e);
//     await prisma.$disconnect();
//     process.exit(1);
//   });




























// // const { PrismaClient, UseSex, Day } = require('../generated/prisma');

// // const prisma = new PrismaClient();

// // async function main() {
// //   // ADMIN
// //   await prisma.admin.createMany({
// //     data: [
// //       { id: 'admin1', username: 'admin1' },
// //       { id: 'admin2', username: 'admin2' },
// //     ],
// //     skipDuplicates: true,
// //   });

// //   // GRADE
// //   await prisma.grade.createMany({
// //     data: Array.from({ length: 6 }, (_, i) => ({ level: `${i + 1}` })),
// //     skipDuplicates: true,
// //   });

// //   // CLASS
// //   await prisma.class.createMany({
// //     data: Array.from({ length: 6 }, (_, i) => ({
// //       name: `${i + 1}A`,
// //       gradeId: i + 1,
// //       capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
// //     })),
// //     skipDuplicates: true,
// //   });

// //   // SUBJECT
// //   const subjectData = [
// //     'Mathematics', 'Science', 'English', 'History', 'Geography',
// //     'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Art'
// //   ].map(name => ({ name }));
// //   await prisma.subject.createMany({ data: subjectData, skipDuplicates: true });

// //   // TEACHER (Individual inserts to allow nested connects)
// //   for (let i = 1; i <= 15; i++) {
// //     await prisma.teacher.create({
// //       data: {
// //         id: `teacher${i}`,
// //         username: `teacher${i}`,
// //         name: `TName${i}`,
// //         surnName: `TSurname${i}`,
// //         email: `teacher${i}@example.com`,
// //         phone: `123-456-789${i}`,
// //         address: `Address${i}`,
// //         bloodType: 'A+',
// //         sex: i % 2 === 0 ? UseSex.MALE : UseSex.FEMALE,
// //         subjects: { connect: [{ id: (i % 10) + 1 }] },
// //         classes: { connect: [{ id: (i % 6) + 1 }] },
// //         birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
// //       },
// //     });
// //   }

// //   // LESSON
// //   for (let i = 1; i <= 30; i++) {
// //     const randomDayKey = Object.keys(Day)[Math.floor(Math.random() * Object.keys(Day).length)];
// //     await prisma.lesson.create({
// //       data: {
// //         name: `Lesson${i}`,
// //         day: Day[randomDayKey],
// //         startTime: new Date(new Date().setHours(9)),
// //         endTime: new Date(new Date().setHours(11)),
// //         subjectId: (i % 10) + 1,
// //         classId: (i % 6) + 1,
// //         teacherId: `teacher${(i % 15) + 1}`,
// //       },
// //     });
// //   }

// //   // PARENT
// //   await prisma.parent.createMany({
// //     data: Array.from({ length: 25 }, (_, i) => ({
// //       id: `parentId${i + 1}`,
// //       username: `parentId${i + 1}`,
// //       name: `PName ${i + 1}`,
// //       surnName: `PSurname ${i + 1}`,
// //       email: `parent${i + 1}@example.com`,
// //       phone: `123-456-789${i + 1}`,
// //       address: `Address${i + 1}`,
// //     })),
// //     skipDuplicates: true,
// //   });

// //   // STUDENT
// //   await prisma.student.createMany({
// //     data: Array.from({ length: 50 }, (_, i) => ({
// //       id: `student${i + 1}`,
// //       username: `student${i + 1}`,
// //       name: `SName${i + 1}`,
// //       surnName: `SSurname ${i + 1}`,
// //       email: `student${i + 1}@example.com`,
// //       phone: `987-654-321${i + 1}`,
// //       address: `Address${i + 1}`,
// //       bloodType: 'O-',
// //       sex: (i + 1) % 2 === 0 ? UseSex.MALE : UseSex.FEMALE,
// //       parentId: `parentId${((Math.ceil((i + 1) / 2) - 1) % 25) + 1}`,
// //       gradeId: ((i + 1) % 6) + 1,
// //       classId: ((i + 1) % 6) + 1,
// //       birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
// //     })),
// //     skipDuplicates: true,
// //   });

// //   // EXAM
// //   await prisma.exam.createMany({
// //     data: Array.from({ length: 10 }, (_, i) => ({
// //       title: `Exam ${i + 1}`,
// //       startTime: new Date(new Date().setHours(9)),
// //       endTime: new Date(new Date().setHours(11)),
// //       lessonId: (i % 30) + 1,
// //     })),
// //     skipDuplicates: true,
// //   });

// //   // ASSIGNMENT
// //   await prisma.assignment.createMany({
// //     data: Array.from({ length: 10 }, (_, i) => ({
// //       title: `Assignment ${i + 1}`,
// //       startDate: new Date(new Date().setHours(9)),
// //       dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
// //       lessonId: (i % 30) + 1,
// //     })),
// //     skipDuplicates: true,
// //   });

// //   // RESULT
// //   for (let i = 1; i <= 10; i++) {
// //     await prisma.result.create({
// //       data: {
// //         score: 90,
// //         studentId: `student${i}`,
// //         ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }),
// //       },
// //     });
// //   }

// //   // ATTENDANCE
// //   for (let i = 1; i <= 10; i++) {
// //     await prisma.attendance.create({
// //       data: {
// //         date: new Date(),
// //         present: true,
// //         studentId: `student${i}`,
// //         lessonId: (i % 30) + 1,
// //       },
// //     });
// //   }

// //   // EVENT
// //   await prisma.event.createMany({
// //     data: Array.from({ length: 5 }, (_, i) => ({
// //       title: `Event ${i + 1}`,
// //       description: `Description for Event ${i + 1}`,
// //       startTime: new Date(new Date().setHours(9)),
// //       endTime: new Date(new Date().setHours(11)),
// //       classId: (i % 5) + 1,
// //     })),
// //     skipDuplicates: true,
// //   });

// //   // ANNOUNCEMENT
// //   await prisma.announcement.createMany({
// //     data: Array.from({ length: 5 }, (_, i) => ({
// //       title: `Announcement ${i + 1}`,
// //       description: `Description for Announcement ${i + 1}`,
// //       date: new Date(),
// //       classId: (i % 5) + 1,
// //     })),
// //     skipDuplicates: true,
// //   });

// //   console.log('Seeding completed successfully.');
// // }

// // main()
// //   .then(async () => {
// //     await prisma.$disconnect();
// //   })
// //   .catch(async (e) => {
// //     console.error(e);
// //     await prisma.$disconnect();
// //     process.exit(1);
// //   });




























// // // const { PrismaClient, UseSex, Day } = require('../generated/prisma');

// // // const prisma = new PrismaClient();

// // // async function main() {
// // //   // ADMIN
// // //   await prisma.admin.create({
// // //     data: {
// // //       id: "admin1",
// // //       username: "admin1",
// // //     },
// // //   });
// // //   await prisma.admin.create({
// // //     data: {
// // //       id: "admin2",
// // //       username: "admin2",
// // //     },
// // //   });

// // //   // GRADE
// // //   for (let i = 1; i <= 6; i++) {
// // //     await prisma.grade.create({
// // //       data: {
// // //         level: i.toString(),
// // //       },
// // //     });
// // //   }

// // //   // CLASS
// // //   for (let i = 1; i <= 6; i++) {
// // //     await prisma.class.create({
// // //       data: {
// // //         name: `${i}A`, 
// // //         gradeId: i, 
// // //         capacity: Math.floor(Math.random() * (20 - 15 + 1)) + 15,
// // //       },
// // //     });
// // //   }

// // //   // SUBJECT
// // //   const subjectData = [
// // //     { name: "Mathematics" },
// // //     { name: "Science" },
// // //     { name: "English" },
// // //     { name: "History" },
// // //     { name: "Geography" },
// // //     { name: "Physics" },
// // //     { name: "Chemistry" },
// // //     { name: "Biology" },
// // //     { name: "Computer Science" },
// // //     { name: "Art" },
// // //   ];

// // //   for (const subject of subjectData) {
// // //     await prisma.subject.create({ data: subject });
// // //   }

// // //   // TEACHER
// // //   for (let i = 1; i <= 15; i++) {
// // //     await prisma.teacher.create({
// // //       data: {
// // //         id: `teacher${i}`, // Unique ID for the teacher
// // //         username: `teacher${i}`,
// // //         name: `TName${i}`,
// // //         surnName: `TSurname${i}`,
// // //         email: `teacher${i}@example.com`,
// // //         phone: `123-456-789${i}`,
// // //         address: `Address${i}`,
// // //         bloodType: "A+",
// // //         sex: i % 2 === 0 ? UseSex.MALE : UseSex.FEMALE,
// // //         subjects: { connect: [{ id: (i % 10) + 1 }] }, 
// // //         classes: { connect: [{ id: (i % 6) + 1 }] }, 
// // //         birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 30)),
// // //       },
// // //     });
// // //   }

// // //   // LESSON
// // //   for (let i = 1; i <= 30; i++) {
// // //     await prisma.lesson.create({
// // //       data: {
// // //         name: `Lesson${i}`, 
// // //         day: Day[
// // //           Object.keys(Day)[
// // //             Math.floor(Math.random() * Object.keys(Day).length)
// // //           ] as keyof typeof Day
// // //         ], 
// // //         startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
// // //         endTime: new Date(new Date().setHours(new Date().getHours() + 3)), 
// // //         subjectId: (i % 10) + 1, 
// // //         classId: (i % 6) + 1, 
// // //         teacherId: `teacher${(i % 15) + 1}`, 
// // //       },
// // //     });
// // //   }

// // //   // PARENT
// // //   for (let i = 1; i <= 25; i++) {
// // //     await prisma.parent.create({
// // //       data: {
// // //         id: `parentId${i}`,
// // //         username: `parentId${i}`,
// // //         name: `PName ${i}`,
// // //         surnName: `PSurname ${i}`,
// // //         email: `parent${i}@example.com`,
// // //         phone: `123-456-789${i}`,
// // //         address: `Address${i}`,
// // //       },
// // //     });
// // //   }

// // //   // STUDENT
// // //   for (let i = 1; i <= 50; i++) {
// // //     await prisma.student.create({
// // //       data: {
// // //         id: `student${i}`, 
// // //         username: `student${i}`, 
// // //         name: `SName${i}`,
// // //         surnName: `SSurname ${i}`,
// // //         email: `student${i}@example.com`,
// // //         phone: `987-654-321${i}`,
// // //         address: `Address${i}`,
// // //         bloodType: "O-",
// // //         sex: i % 2 === 0 ? UseSex.MALE : UseSex.FEMALE,
// // //         parentId: `parentId${Math.ceil(i / 2) % 25 || 25}`, 
// // //         gradeId: (i % 6) + 1, 
// // //         classId: (i % 6) + 1, 
// // //         birthday: new Date(new Date().setFullYear(new Date().getFullYear() - 10)),
// // //       },
// // //     });
// // //   }

// // //   // EXAM
// // //   for (let i = 1; i <= 10; i++) {
// // //     await prisma.exam.create({
// // //       data: {
// // //         title: `Exam ${i}`, 
// // //         startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
// // //         endTime: new Date(new Date().setHours(new Date().getHours() + 2)), 
// // //         lessonId: (i % 30) + 1, 
// // //       },
// // //     });
// // //   }

// // //   // ASSIGNMENT
// // //   for (let i = 1; i <= 10; i++) {
// // //     await prisma.assignment.create({
// // //       data: {
// // //         title: `Assignment ${i}`, 
// // //         startDate: new Date(new Date().setHours(new Date().getHours() + 1)), 
// // //         dueDate: new Date(new Date().setDate(new Date().getDate() + 1)), 
// // //         lessonId: (i % 30) + 1, 
// // //       },
// // //     });
// // //   }

// // //   // RESULT
// // //   for (let i = 1; i <= 10; i++) {
// // //     await prisma.result.create({
// // //       data: {
// // //         score: 90, 
// // //         studentId: `student${i}`, 
// // //         ...(i <= 5 ? { examId: i } : { assignmentId: i - 5 }), 
// // //       },
// // //     });
// // //   }

// // //   // ATTENDANCE
// // //   for (let i = 1; i <= 10; i++) {
// // //     await prisma.attendance.create({
// // //       data: {
// // //         date: new Date(), 
// // //         present: true, 
// // //         studentId: `student${i}`, 
// // //         lessonId: (i % 30) + 1, 
// // //       },
// // //     });
// // //   }

// // //   // EVENT
// // //   for (let i = 1; i <= 5; i++) {
// // //     await prisma.event.create({
// // //       data: {
// // //         title: `Event ${i}`, 
// // //         description: `Description for Event ${i}`, 
// // //         startTime: new Date(new Date().setHours(new Date().getHours() + 1)), 
// // //         endTime: new Date(new Date().setHours(new Date().getHours() + 2)), 
// // //         classId: (i % 5) + 1, 
// // //       },
// // //     });
// // //   }

// // //   // ANNOUNCEMENT
// // //   for (let i = 1; i <= 5; i++) {
// // //     await prisma.announcement.create({
// // //       data: {
// // //         title: `Announcement ${i}`, 
// // //         description: `Description for Announcement ${i}`, 
// // //         date: new Date(), 
// // //         classId: (i % 5) + 1, 
// // //       },
// // //     });
// // //   }

// // //   console.log("Seeding completed successfully.");
// // // }

// // // main()
// // //   .then(async () => {
// // //     await prisma.$disconnect();
// // //   })
// // //   .catch(async (e) => {
// // //     console.error(e);
// // //     await prisma.$disconnect();
// // //     process.exit(1);
// // //   });
