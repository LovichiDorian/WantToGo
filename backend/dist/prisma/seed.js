"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = __importDefault(require("pg"));
const bcrypt = __importStar(require("bcrypt"));
dotenv.config();
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
}
const pool = new pg_1.default.Pool({ connectionString });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('🌱 Seeding database...\n');
    const hashedPassword = await bcrypt.hash('test', 10);
    await prisma.user.deleteMany({
        where: {
            OR: [
                { email: 'test@test.com' },
                { email: 'test@wanttogo.app' },
                { shareCode: 'test' },
            ],
        },
    });
    const testUser = await prisma.user.create({
        data: {
            email: 'test@test.com',
            password: hashedPassword,
            name: 'Utilisateur Test',
            shareCode: 'test',
        },
    });
    console.log('✅ Utilisateur de test créé :');
    console.log('   📧 Email: test@test.com');
    console.log('   🔑 Mot de passe: test');
    console.log(`   🔗 Code ami: ${testUser.shareCode}\n`);
    const testPlaces = [
        {
            name: 'Tour Eiffel',
            notes: '🗼 La dame de fer ! Vue magnifique au coucher du soleil. Réserver les billets en avance.',
            latitude: 48.858370,
            longitude: 2.294481,
            address: 'Champ de Mars, 5 Avenue Anatole France, 75007 Paris',
            tripDate: new Date('2026-05-15'),
        },
        {
            name: 'Calanques de Cassis',
            notes: '🏖️ Eaux turquoises et falaises blanches. Prendre le bateau pour voir toutes les calanques !',
            latitude: 43.214050,
            longitude: 5.519180,
            address: 'Parc national des Calanques, 13260 Cassis',
            tripDate: new Date('2026-07-10'),
        },
        {
            name: 'Mont Blanc',
            notes: '⛰️ Toit de l\'Europe ! Réserver le téléphérique de l\'Aiguille du Midi pour une vue à 360°.',
            latitude: 45.832622,
            longitude: 6.865175,
            address: 'Chamonix-Mont-Blanc, Haute-Savoie',
            tripDate: null,
        },
        {
            name: 'Gorges du Verdon',
            notes: '🚣 Le Grand Canyon français. Location de kayak ou pédalo recommandée !',
            latitude: 43.783501,
            longitude: 6.218139,
            address: 'Gorges du Verdon, 04120 Castellane',
            tripDate: new Date('2026-08-20'),
        },
        {
            name: 'Dune du Pilat',
            notes: '🏜️ Plus haute dune d\'Europe (110m). Lever du soleil incroyable sur le bassin d\'Arcachon.',
            latitude: 44.589424,
            longitude: -1.214078,
            address: 'Route de la Plage, 33115 La Teste-de-Buch',
            tripDate: new Date('2026-06-01'),
        },
        {
            name: 'Château de Chambord',
            notes: '🏰 Chef-d\'œuvre de la Renaissance. Escalier à double révolution attribué à Léonard de Vinci.',
            latitude: 47.616135,
            longitude: 1.517029,
            address: 'Château de Chambord, 41250 Chambord',
            tripDate: null,
        },
        {
            name: 'Saint-Tropez',
            notes: '⛵ Port mythique de la Côte d\'Azur. Marché place des Lices le matin. Plage de Pampelonne.',
            latitude: 43.272618,
            longitude: 6.640682,
            address: 'Saint-Tropez, 83990 Var',
            tripDate: new Date('2026-07-25'),
        },
        {
            name: 'Falaises d\'Étretat',
            notes: '🌊 Falaises blanches spectaculaires. Randonnée GR21 le long des falaises. Coucher de soleil !',
            latitude: 49.707024,
            longitude: 0.205654,
            address: 'Étretat, 76790 Seine-Maritime',
            tripDate: null,
        },
        {
            name: 'Pont du Gard',
            notes: '🏛️ Aqueduc romain de 2000 ans. Baignade possible dans le Gardon en été.',
            latitude: 43.947512,
            longitude: 4.535347,
            address: 'Pont du Gard, 30210 Vers-Pont-du-Gard',
            tripDate: new Date('2026-06-15'),
        },
        {
            name: 'Île de Ré',
            notes: '🚲 Paradis du vélo ! 100km de pistes cyclables. Phare des Baleines, marais salants.',
            latitude: 46.201753,
            longitude: -1.409669,
            address: 'Île de Ré, 17000 Charente-Maritime',
            tripDate: new Date('2026-08-05'),
        },
    ];
    for (const placeData of testPlaces) {
        const place = await prisma.place.create({
            data: {
                userId: testUser.id,
                ...placeData,
            },
        });
        console.log(`  📍 ${place.name}`);
    }
    console.log(`\n✅ ${testPlaces.length} lieux créés pour l'utilisateur test`);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔐 CONNEXION TEST :');
    console.log('   Email:        test@test.com');
    console.log('   Mot de passe: test');
    console.log('');
    console.log('👥 AJOUT AMI :');
    console.log('   Code ami: test');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}
main()
    .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
});
//# sourceMappingURL=seed.js.map