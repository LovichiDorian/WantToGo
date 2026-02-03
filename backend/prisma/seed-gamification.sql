-- WantToGo Gamification Extras
-- Run AFTER prisma migrate dev
-- Usage: psql -d wanttogo -f prisma/seed-gamification.sql

-- ==================== SEED DEFAULT ACHIEVEMENTS ====================

INSERT INTO "Achievement" ("id", "code", "nameEn", "nameFr", "descriptionEn", "descriptionFr", "icon", "xpReward", "criteria", "sortOrder")
VALUES 
    (gen_random_uuid()::text, 'first_place', 'First Steps', 'Premiers Pas', 'Add your first place to the map', 'Ajoutez votre premier lieu sur la carte', '🎯', 50, '{"type": "places_count", "count": 1}', 1),
    (gen_random_uuid()::text, 'explorer_5', 'Curious Explorer', 'Explorateur Curieux', 'Add 5 places to your map', 'Ajoutez 5 lieux sur votre carte', '🔍', 100, '{"type": "places_count", "count": 5}', 2),
    (gen_random_uuid()::text, 'explorer_25', 'Seasoned Explorer', 'Explorateur Aguerri', 'Add 25 places to your map', 'Ajoutez 25 lieux sur votre carte', '🗺️', 250, '{"type": "places_count", "count": 25}', 3),
    (gen_random_uuid()::text, 'city_explorer', 'City Explorer', 'Explorateur de Ville', 'Add 10 places in the same city', 'Ajoutez 10 lieux dans la même ville', '🏙️', 300, '{"type": "places_same_city", "count": 10}', 4),
    (gen_random_uuid()::text, 'globetrotter', 'Globetrotter', 'Globe-trotteur', 'Add places in 5 different countries', 'Ajoutez des lieux dans 5 pays différents', '🌍', 500, '{"type": "different_countries", "count": 5}', 5),
    (gen_random_uuid()::text, 'planner_pro', 'Planner Pro', 'Planificateur Pro', 'Add 20 places with planned dates', 'Ajoutez 20 lieux avec des dates planifiées', '📅', 400, '{"type": "places_with_dates", "count": 20}', 6),
    (gen_random_uuid()::text, 'social_traveler', 'Social Traveler', 'Voyageur Social', 'Add 5 friends to your network', 'Ajoutez 5 amis à votre réseau', '👥', 350, '{"type": "friends_count", "count": 5}', 7),
    (gen_random_uuid()::text, 'photographer', 'Travel Photographer', 'Photographe Voyageur', 'Add 10 photos to your places', 'Ajoutez 10 photos à vos lieux', '📸', 200, '{"type": "photos_count", "count": 10}', 8),
    (gen_random_uuid()::text, 'first_visited', 'Dream Come True', 'Rêve Réalisé', 'Mark your first place as visited', 'Marquez votre premier lieu comme visité', '✅', 100, '{"type": "visited_count", "count": 1}', 9),
    (gen_random_uuid()::text, 'visited_10', 'Adventurer', 'Aventurier', 'Visit 10 places from your wishlist', 'Visitez 10 lieux de votre wishlist', '🎒', 500, '{"type": "visited_count", "count": 10}', 10),
    (gen_random_uuid()::text, 'geoloc_master', 'On Location', 'Sur Place', 'Mark 5 places as visited while being there', 'Marquez 5 lieux comme visités en étant sur place', '📍', 600, '{"type": "visited_with_geoloc", "count": 5}', 11),
    (gen_random_uuid()::text, 'trip_creator', 'Trip Planner', 'Organisateur de Voyage', 'Create your first collaborative trip', 'Créez votre premier voyage collaboratif', '✈️', 150, '{"type": "trips_created", "count": 1}', 12)
ON CONFLICT ("code") DO UPDATE SET
    "nameEn" = EXCLUDED."nameEn",
    "nameFr" = EXCLUDED."nameFr",
    "descriptionEn" = EXCLUDED."descriptionEn",
    "descriptionFr" = EXCLUDED."descriptionFr",
    "icon" = EXCLUDED."icon",
    "xpReward" = EXCLUDED."xpReward",
    "criteria" = EXCLUDED."criteria",
    "sortOrder" = EXCLUDED."sortOrder";

-- ==================== UTILITY FUNCTIONS (OPTIONAL) ====================

-- Function to calculate user level from XP
CREATE OR REPLACE FUNCTION calculate_level(user_xp INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN FLOOR(SQRT(user_xp::FLOAT / 1000)) + 1;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to calculate XP needed for next level
CREATE OR REPLACE FUNCTION xp_for_level(target_level INTEGER)
RETURNS INTEGER AS $$
BEGIN
    RETURN ((target_level - 1) * (target_level - 1)) * 1000;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ==================== COMMENTS ====================

COMMENT ON TABLE "Achievement" IS 'Gamification badges that users can unlock';
COMMENT ON TABLE "UserActivity" IS 'Social feed - tracks all user actions for realtime updates';
COMMENT ON TABLE "Trip" IS 'Collaborative trips that multiple users can contribute to';
COMMENT ON TABLE "UserSubscription" IS 'Premium subscription status - Stripe integration ready';

-- Done!
SELECT 'Gamification seed completed! ' || COUNT(*) || ' achievements loaded.' FROM "Achievement";
