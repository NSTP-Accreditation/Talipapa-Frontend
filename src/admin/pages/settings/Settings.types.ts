export interface Admin {
  _id: string;
  username: string;
  email: string;
  contactNumber: string;
  rolesKeys: string[];
}

export interface NewAdminForm {
  username: string;
  email: string;
  contactNumber: string;
  password: string;
  roles: string[];
}

export interface FormErrors {
  username?: string;
  email?: string;
  contactNumber?: string;
  password?: string;
  confirmPassword?: string;
  roles?: string;
}
