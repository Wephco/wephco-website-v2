import { IProperty } from "./propertyInterface"

export enum Role {
    AGENT = "AGENT",
    ADMIN = "ADMIN",
    SUPPORT = "SUPPORT",
    SUPERADMIN = "SUPERADMIN",
}

export interface IUser {
    id?: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt?: Date;
  
}

export interface IContactUs {
    id?: string;
    name: string;
    email: string;
    phoneNumber: string;
    status: boolean;
    message: string;
    createdAt?: Date;
}

export interface IConsultation {
    id?: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    status: boolean;
    createdAt?: Date;
}

export interface IAgent {
  id?: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  properties?: IProperty[]
}