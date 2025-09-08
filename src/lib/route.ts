export const routes = {
  creator: {
    root: '/creator/home',
    createTask: '/creator/create-task',
    tasks: '/creator/create-task',
    analytics: '/creator/analytics',
  },
  completer: {
    root: '/completer/home',
    learning: '/completer/learning',
    tasks: '/completer/task',
    earnings: '/completer/earnings',
    settings: '/completer/settings',
  },
  admin: {
    root: '/admin/home',
    content: '/admin/content',
    disputes: '/admin/disputes',
    manage_users: '/admin/manage_users',
    settings: '/admin/settings',
    tasks: '/admin/tasks',
    users: '/admin/users',
  },
};

export type AccessType = keyof typeof routes;
