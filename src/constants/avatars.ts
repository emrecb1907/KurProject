// Avatar mapping for consistent usage across the app
// Default avatar is 'avatar_2' (2.webp)

export const AVATAR_SOURCES: Record<string, any> = {
    avatar_1: require('../../assets/images/avatars/1.webp'),
    avatar_2: require('../../assets/images/avatars/2.webp'),
    avatar_3: require('../../assets/images/avatars/3.webp'),
    avatar_4: require('../../assets/images/avatars/4.webp'),
    avatar_5: require('../../assets/images/avatars/5.webp'),
    avatar_6: require('../../assets/images/avatars/6.webp'),
    avatar_7: require('../../assets/images/avatars/7.webp'),
    avatar_8: require('../../assets/images/avatars/8.webp'),
    avatar_9: require('../../assets/images/avatars/9.webp'),
    avatar_10: require('../../assets/images/avatars/10.webp'),
    avatar_11: require('../../assets/images/avatars/11.webp'),
    avatar_12: require('../../assets/images/avatars/12.webp'),
    avatar_13: require('../../assets/images/avatars/13.webp'),
    avatar_14: require('../../assets/images/avatars/14.webp'),
    avatar_15: require('../../assets/images/avatars/15.webp'),
};

export const DEFAULT_AVATAR_ID = 'avatar_2';

/**
 * Get avatar image source by ID
 * Falls back to default avatar if ID not found
 */
export const getAvatarSource = (avatarId: string): any => {
    return AVATAR_SOURCES[avatarId] || AVATAR_SOURCES[DEFAULT_AVATAR_ID];
};
