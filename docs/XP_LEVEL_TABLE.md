# 📊 XP & Level Reference Table

## Formula
```
required_xp = round(10 * level^1.4)
```

## Quick Reference Table

| Level | XP Start | XP End | XP Required | Cumulative XP |
|-------|----------|--------|-------------|---------------|
| 1 | 0 | 10 | 10 | 10 |
| 2 | 10 | 37 | 27 | 37 |
| 3 | 37 | 74 | 37 | 74 |
| 4 | 74 | 121 | 47 | 121 |
| 5 | 121 | 177 | 56 | 177 |
| 6 | 177 | 242 | 65 | 242 |
| 7 | 242 | 315 | 73 | 315 |
| 8 | 315 | 396 | 81 | 396 |
| 9 | 396 | 485 | 89 | 485 |
| 10 | 485 | 582 | 97 | 582 |
| 15 | 1,105 | 1,249 | 144 | 1,249 |
| 20 | 1,899 | 2,092 | 193 | 2,092 |
| 25 | 2,822 | 3,065 | 243 | 3,065 |
| 30 | 3,857 | 4,151 | 294 | 4,151 |
| 35 | 4,993 | 5,339 | 346 | 5,339 |
| 40 | 6,222 | 6,621 | 399 | 6,621 |
| 45 | 7,537 | 7,989 | 452 | 7,989 |
| 50 | 8,933 | 9,439 | 506 | 9,439 |
| 60 | 11,985 | 12,599 | 614 | 12,599 |
| 70 | 15,323 | 16,047 | 724 | 16,047 |
| 80 | 18,912 | 19,749 | 837 | 19,749 |
| 90 | 22,728 | 23,681 | 953 | 23,681 |
| 100 | 26,750 | 27,821 | 1,071 | 27,821 |
| 150 | 52,834 | 54,277 | 1,443 | 54,277 |
| 200 | 83,116 | 85,035 | 1,919 | 85,035 |
| 500 | 374,498 | 379,256 | 4,758 | 379,256 |
| 1000 | 1,003,040 | 1,013,063 | 10,023 | 1,013,063 |

## Milestones

### Minor Milestones (Every 10 levels)
- 🔥 **Level 10**: İyi başlangıç!
- 🔥 **Level 20**: Devam ediyorsun!
- 🔥 **Level 30**: Harikasın!
- 🔥 **Level 40**: İnanılmaz!
- 🔥 **Level 50**: Yarım yüz!

### Major Milestones (Every 50 levels)
- 🌟 **Level 50**: Harika bir ilerleme!
- 🌟 **Level 100**: Yüz seviye!
- 🌟 **Level 150**: Efsane!
- 🌟 **Level 200**: İki yüz!
- 🌟 **Level 500**: Beş yüz! Muhteşem!

### Epic Milestones (Every 100 levels)
- 🎉 **Level 100**: İlk yüz seviye tamamlandı!
- 🎉 **Level 200**: İki yüz seviye! İnanılmaz!
- 🎉 **Level 300**: Üç yüz seviye! Efsane!
- 🎉 **Level 500**: Beş yüz seviye! Durulamaz!
- 🎉 **Level 1000**: Bin seviye! LEGEND!

## Usage in Code

### TypeScript/JavaScript
```typescript
import { 
  calculateRequiredXP, 
  calculateUserLevel, 
  getXPProgress 
} from '@/lib/utils/levelCalculations';

// Calculate required XP for level 10
const xpNeeded = calculateRequiredXP(10); // Returns: 251

// Calculate current level from total XP
const level = calculateUserLevel(532); // Returns: 10

// Get detailed progress
const progress = getXPProgress(532);
// Returns:
// {
//   currentLevel: 10,
//   currentLevelXP: 47,
//   requiredXP: 251,
//   progressPercentage: 19,
//   totalXPForCurrentLevel: 485,
//   xpToNextLevel: 204
// }
```

### SQL (Supabase)
```sql
-- Calculate required XP for level 10
SELECT calculate_required_xp(10); -- Returns: 251

-- Calculate user level from total XP
SELECT calculate_user_level(532); -- Returns: 10

-- Get detailed XP progress
SELECT * FROM get_xp_progress(532);
-- Returns:
-- current_level: 10
-- current_level_xp: 47
-- required_xp: 251
-- progress_percentage: 18.73
-- total_xp_for_current_level: 485
-- xp_to_next_level: 204
```

## Design Considerations

### Why This Formula?
1. **Progressive Difficulty**: Exponential growth with power of 1.4 provides smooth progression
2. **Early Game**: Quick wins in early levels keep new users engaged
3. **Mid Game**: Steady progression maintains interest without frustration
4. **Late Game**: Significant XP requirements provide long-term goals
5. **No Cap**: Infinite progression allows dedicated users to continue indefinitely

### Balancing Tips
- **Daily XP Target**: Aim for 100-200 XP per day (1-2 lessons)
- **Weekly Goal**: 700-1400 XP per week
- **XP Per Question**: 5-15 XP depending on difficulty
- **Streak Bonuses**: +50% XP for 7+ day streaks
- **Perfect Score Bonus**: +20% XP for 100% correct answers

### Badge Thresholds
- **Beginner**: Level 1-10
- **Intermediate**: Level 11-30
- **Advanced**: Level 31-60
- **Expert**: Level 61-100
- **Master**: Level 101-200
- **Grandmaster**: Level 201-500
- **Legend**: Level 501+

## Testing Scenarios

### Test Cases
```typescript
// Test 1: New user
expect(calculateUserLevel(0)).toBe(1);

// Test 2: Just hit level 2
expect(calculateUserLevel(10)).toBe(2);

// Test 3: Mid-game progression
expect(calculateUserLevel(532)).toBe(10);

// Test 4: High-level user
expect(calculateUserLevel(27821)).toBe(100);

// Test 5: Edge case - negative XP
expect(calculateUserLevel(-10)).toBe(1);

// Test 6: Progress percentage at level boundaries
const progress1 = getXPProgress(10); // Start of level 2
expect(progress1.progressPercentage).toBe(0);

const progress2 = getXPProgress(36); // Just before level 3
expect(progress2.progressPercentage).toBeCloseTo(96.3, 1);
```

---

**Last Updated**: 2024
**Formula Version**: 1.0

