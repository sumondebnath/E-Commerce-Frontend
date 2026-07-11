export default function getUserRoles(user) {
  if (!user) return [];
  const roles = new Set();

  if (Array.isArray(user.roles)) user.roles.forEach((r) => roles.add(r));
  if (user.role) roles.add(user.role);
  if (user.user_type) roles.add(user.user_type);
  if (user.type) roles.add(user.type);
  if (user.group) roles.add(user.group);
  if (Array.isArray(user.groups)) user.groups.forEach((g) => roles.add(g));
  if (user.is_superuser || user.is_admin) roles.add('admin');
  if (user.is_staff && !roles.size) roles.add('staff');

  return [...roles];
}
