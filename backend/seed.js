const prisma = require('./src/config/prisma');

const defaultPlants = [
  {
    commonName: 'Aloe Vera',
    scientificName: 'Aloe barbadensis miller',
    oxygenSupport: '~1 person',
    advantages: 'Medicinal gel, air purification',
    disadvantages: 'Toxic if eaten raw',
    humanBenefits: 'Heals burns and skin problems'
  },
  {
    commonName: 'Money Plant',
    scientificName: 'Epipremnum aureum',
    oxygenSupport: '~1 person',
    advantages: 'Removes toxins',
    disadvantages: 'Toxic to pets',
    humanBenefits: 'Improves air quality'
  },
  {
    commonName: 'Snake Plant',
    scientificName: 'Sansevieria trifasciata',
    oxygenSupport: '~2 persons at night',
    advantages: 'Night oxygen release',
    disadvantages: 'Slow growth',
    humanBenefits: 'Better sleep'
  },
  {
    commonName: 'Areca Palm',
    scientificName: 'Areca catechu',
    oxygenSupport: '~3 persons',
    advantages: 'Humidifier',
    disadvantages: 'Needs space',
    humanBenefits: 'Improves breathing'
  },
  {
    commonName: 'Tulsi',
    scientificName: 'Ocimum tenuiflorum',
    oxygenSupport: '~1 person',
    advantages: 'Medicinal',
    disadvantages: 'Needs sunlight',
    humanBenefits: 'Boosts immunity'
  },
  {
    commonName: 'Rubber Plant',
    scientificName: 'Ficus elastica',
    oxygenSupport: '~2 persons',
    advantages: 'Removes pollutants',
    disadvantages: 'Large size',
    humanBenefits: 'Cleaner air'
  },
  {
    commonName: 'Spider Plant',
    scientificName: 'Chlorophytum comosum',
    oxygenSupport: '~1 person',
    advantages: 'Removes CO',
    disadvantages: 'Needs maintenance',
    humanBenefits: 'Reduces allergies'
  },
  {
    commonName: 'Peace Lily',
    scientificName: 'Spathiphyllum wallisii',
    oxygenSupport: '~1 person',
    advantages: 'Removes mold',
    disadvantages: 'Toxic',
    humanBenefits: 'Better breathing'
  },
  {
    commonName: 'Neem',
    scientificName: 'Azadirachta indica',
    oxygenSupport: '~5 persons',
    advantages: 'Antibacterial',
    disadvantages: 'Bitter smell',
    humanBenefits: 'Kills germs'
  },
  {
    commonName: 'Rose',
    scientificName: 'Rosa indica',
    oxygenSupport: '~1 person',
    advantages: 'Fragrance',
    disadvantages: 'Needs care',
    humanBenefits: 'Reduces stress'
  }
];

async function main() {
  console.log('Seeding reference plant catalog...');
  for (const p of defaultPlants) {
    const existing = await prisma.plantCatalog.findUnique({
      where: { scientificName: p.scientificName }
    });
    if (!existing) {
      await prisma.plantCatalog.create({ data: p });
      console.log(`Created PlantCatalog: ${p.commonName}`);
    } else {
      console.log(`Exists PlantCatalog: ${p.commonName}`);
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
