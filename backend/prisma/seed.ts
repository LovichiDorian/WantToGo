import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create a default user (for development)
  const user = await prisma.user.upsert({
    where: { id: 'default-user-id' },
    update: {},
    create: {
      id: 'default-user-id',
      email: 'demo@wanttogo.app',
      name: 'Demo User',
    },
  });

  console.log(`Created user: ${user.email}`);

  // Create some sample places
  const samplePlaces = [
    {
      name: 'Eiffel Tower',
      notes: 'Visit at sunset for the best views! Try the restaurant on the second floor.',
      latitude: 48.858370,
      longitude: 2.294481,
      address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris, France',
      tripDate: new Date('2026-06-15'),
    },
    {
      name: 'Colosseum',
      notes: 'Book tickets in advance to avoid long queues. Best visited early morning.',
      latitude: 41.890251,
      longitude: 12.492373,
      address: 'Piazza del Colosseo, 1, 00184 Roma RM, Italy',
      tripDate: new Date('2026-09-20'),
    },
    {
      name: 'Sagrada Família',
      notes: 'Gaudí\'s masterpiece. Definitely worth the climb to the towers!',
      latitude: 41.403629,
      longitude: 2.174355,
      address: 'Carrer de Mallorca, 401, 08013 Barcelona, Spain',
      tripDate: null,
    },
    {
      name: 'Tower Bridge',
      notes: 'Walk across the glass floor walkways. Great views of the Thames.',
      latitude: 51.505456,
      longitude: -0.075356,
      address: 'Tower Bridge Rd, London SE1 2UP, UK',
      tripDate: new Date('2026-03-10'),
    },
    {
      name: 'Mont Saint-Michel',
      notes: 'Check the tide schedule! The abbey is magical at sunrise.',
      latitude: 48.636063,
      longitude: -1.511457,
      address: 'Mont Saint-Michel, 50170, France',
      tripDate: new Date('2026-07-25'),
    },
  ];

  for (const placeData of samplePlaces) {
    const place = await prisma.place.create({
      data: {
        userId: user.id,
        ...placeData,
      },
    });
    console.log(`Created place: ${place.name}`);
  }

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
