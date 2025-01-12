export interface createPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number: string;
  active?: boolean;
}

export interface updatePayload {
  first_name: string;
  last_name: string;
  phone_number: string;
}

export interface User {
  name: string;
  email: string;
  phone_number: string;
  active: boolean;
}
