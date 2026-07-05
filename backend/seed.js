const prisma = require('./src/config/prisma');

const defaultVenues = [
  { name: 'Royal Palm Banquet Hall', address: '52 Canal Bank Road, Lahore', guests: 500 },
  { name: 'Jinnah Convention Centre', address: 'Club Road, Islamabad', guests: 1000 },
  { name: 'PC Hotel Marquee', address: 'Shahrah-e-Quaid-e-Azam, Lahore', guests: 400 },
  { name: 'Beach Luxury Hotel Lawn', address: 'Lalazar, Karachi', guests: 300 },
  { name: 'Shalimar Gardens Pavillion', address: 'GT Road, Lahore', guests: 250 },
  { name: 'Serena Sheesh Mahal', address: 'Khayaban-e-Suhrawardy, Islamabad', guests: 350 },
  { name: 'PAF Yacht Club Lounge', address: 'DHA Phase 8, Karachi', guests: 150 },
  { name: 'Shahi Qila Courtyard', address: 'Walled City, Lahore', guests: 800 },
  { name: 'Khanpur Lake Resort', address: 'Khanpur Dam, Haripur', guests: 120 },
  { name: 'Expo Centre Hall', address: 'Johar Town, Lahore', guests: 1500 }
];

const defaultCategories = [
  { name: 'Conference' },
  { name: 'Seminar' },
  { name: 'Workshop' },
  { name: 'Concert' },
  { name: 'Wedding' },
  { name: 'Birthday Party' },
  { name: 'Exhibition' },
  { name: 'Meetup' },
  { name: 'Sports' },
  { name: 'Festival' }
];

async function main() {
  console.log('Seeding 10 default Pakistani venues...');
  for (const venue of defaultVenues) {
    const existing = await prisma.venue.findFirst({
      where: { name: venue.name }
    });
    if (!existing) {
      await prisma.venue.create({ data: venue });
      console.log(`Created Venue: ${venue.name}`);
    } else {
      console.log(`Exists Venue: ${venue.name}`);
    }
  }

  console.log('Seeding 10 default categories...');
  for (const cat of defaultCategories) {
    const existing = await prisma.category.findFirst({
      where: { name: cat.name }
    });
    if (!existing) {
      await prisma.category.create({ data: cat });
      console.log(`Created Category: ${cat.name}`);
    } else {
      console.log(`Exists Category: ${cat.name}`);
    }
  }

  console.log('Seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
