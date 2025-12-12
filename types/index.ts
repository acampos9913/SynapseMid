export * from './auth';
export * from './memory';
export * from './system';
export * from './chat';

export enum AppRoute {
  LOGIN = '/login',
  REGISTER = '/register',
  DASHBOARD = '/',
  MEMORY = '/memory',
  BILLING = '/billing',
  SETTINGS = '/settings'
}
