import { getUserPermissions } from './userService';

// 权限缓存键名前缀
const PERMISSIONS_CACHE_KEY_PREFIX = 'user_permissions_';

/**
 * 获取当前登录用户ID
 */
export const getCurrentUserId = (): number | null => {
  try {
    const userInfoStr = localStorage.getItem('userInfo');
    if (userInfoStr) {
      const userInfo = JSON.parse(userInfoStr);
      return userInfo.userId || null;
    }
  } catch (error) {
    console.error('解析用户信息失败:', error);
  }
  return null;
};

/**
 * 获取权限缓存键名
 */
export const getPermissionsCacheKey = (userId?: number | null): string => {
  const currentUserId = userId || getCurrentUserId();
  return `${PERMISSIONS_CACHE_KEY_PREFIX}${currentUserId || 'default'}`;
};

/**
 * 获取缓存的权限
 */
export const getCachedPermissions = (userId?: number | null): string[] => {
  try {
    const cacheKey = getPermissionsCacheKey(userId);
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.error('解析缓存权限失败:', error);
  }
  return [];
};

/**
 * 设置权限缓存
 */
export const setCachedPermissions = (permissions: string[], userId?: number | null): void => {
  try {
    const cacheKey = getPermissionsCacheKey(userId);
    localStorage.setItem(cacheKey, JSON.stringify(permissions));
  } catch (error) {
    console.error('缓存权限失败:', error);
  }
};

/**
 * 清除权限缓存
 */
export const clearCachedPermissions = (userId?: number | null): void => {
  const cacheKey = getPermissionsCacheKey(userId);
  localStorage.removeItem(cacheKey);
};

/**
 * 清除所有权限缓存
 */
export const clearAllPermissionsCache = (): void => {
  // 遍历localStorage，删除所有权限缓存
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith(PERMISSIONS_CACHE_KEY_PREFIX)) {
      localStorage.removeItem(key);
    }
  });
};

/**
 * 获取用户权限（优先从缓存获取，缓存不存在则从服务器获取并缓存）
 */
export const getPermissions = async (userId?: number | null): Promise<string[]> => {
  // 获取当前用户ID（如果没有提供）
  const currentUserId = userId || getCurrentUserId();

  // 先尝试从缓存获取
  const cachedPermissions = getCachedPermissions(currentUserId);
  if (cachedPermissions.length > 0) {
    return cachedPermissions;
  }

  // 缓存不存在，从服务器获取
  try {
    const response = await getUserPermissions(currentUserId || undefined);
    if (response.data.code === 200) {
      const permissions = (response.data.data || []).map((p: any) => p.code);
      // 缓存权限
      setCachedPermissions(permissions, currentUserId);
      return permissions;
    }
  } catch (error) {
    console.error('获取权限失败:', error);
  }

  return [];
};

/**
 * 检查是否有指定权限
 */
export const hasPermission = (permissionCode: string, permissions: string[] = []): boolean => {
  // 如果没有设置权限要求，则允许访问
  if (!permissionCode) {
    return true;
  }

  // 如果用户有通配符权限，则允许访问
  if (permissions.includes('*:*:*')) {
    return true;
  }

  // 检查具体权限
  return permissions.includes(permissionCode);
};
