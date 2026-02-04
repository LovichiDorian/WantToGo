-- Seed data for Dorian King account
-- Sets Dorian at level 100 with exclusive avatar configuration

-- Update Dorian's user to level 100 with max XP
UPDATE "User"
SET 
    level = 100,
    xp = 999999,
    "placesVisitedCount" = 500,
    "avatarBase" = 'male',
    "avatarColor" = '#FFD700',
    "avatarAccessory" = 'crown_golden,aura_golden,trophy_hof,sword_legend,shield_ultimate',
    "avatarBackground" = 'cosmic_throne',
    "avatarAnimation" = 'majestic_spin'
WHERE email = 'dorianppl852@gmail.com';

-- Also update for alternate email
UPDATE "User"
SET 
    level = 100,
    xp = 999999,
    "placesVisitedCount" = 500,
    "avatarBase" = 'male',
    "avatarColor" = '#FFD700',
    "avatarAccessory" = 'crown_golden,aura_golden,trophy_hof,sword_legend,shield_ultimate',
    "avatarBackground" = 'cosmic_throne',
    "avatarAnimation" = 'majestic_spin'
WHERE email = 'dorian@email.com';

-- Done! Your account is now KING level 👑
