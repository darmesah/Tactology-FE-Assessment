import { gql } from "@apollo/client";

export interface Department {
  id: number;
  name: string;
  subDepartments?: SubDepartment[];
}

export interface SubDepartment {
  id: number;
  name: string;
  departmentId?: number;
}

export interface CreateDepartmentInput {
  input: {
    name: string;
    subDepartments?: { name: string }[];
  };
}

export interface UpdateDepartmentInput {
  input: {
    id: number;
    name: string;
  };
}

export const GET_DEPARTMENTS = gql`
  query GetDepartments {
    departments {
      id
      name
      subDepartments {
        id
        name
      }
    }
  }
`;

export const GET_DEPARTMENT = gql`
  query GetDepartment($id: Int!) {
    department(id: $id) {
      id
      name
      subDepartments {
        id
        name
      }
    }
  }
`;

export const CREATE_DEPARTMENT = gql`
  mutation CreateDepartment($input: CreateDepartmentInput!) {
    createDepartment(input: $input) {
      id
      name
      subDepartments {
        id
        name
      }
    }
  }
`;

export const UPDATE_DEPARTMENT = gql`
  mutation UpdateDepartment($input: UpdateDepartmentInput!) {
    updateDepartment(input: $input) {
      id
      name
    }
  }
`;

export const REMOVE_DEPARTMENT = gql`
  mutation RemoveDepartment($id: Int!) {
    removeDepartment(id: $id)
  }
`;
