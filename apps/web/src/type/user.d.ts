interface TIUser {
  _id: string;
  name: string;
  email: string;
  role:  'admin' | 'engineer';
  team: string;
  isOnCall: boolean;
}