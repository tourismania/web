interface Rights {
  isSuperAdmin: boolean
}

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  rights: Rights
}
