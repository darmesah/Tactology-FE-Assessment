import { gql } from "@apollo/client";

export interface SubDepartment {
  id: number;
  name: string;
}

export interface CreateSubDepartmentInput {
  input: {
    name: string;
    departmentId: number;
  };
}

export interface UpdateSubDepartmentInput {
  input: {
    subDepartmentId: number;
    name: string;
  };
}

export const GET_SUB_DEPARTMENTS = gql`
  query GetSubDepartments {
    subDepartments {
      id
      name
    }
  }
`;

export const GET_SUB_DEPARTMENT = gql`
  query GetSubDepartment($id: Int!) {
    subDepartment(id: $id) {
      id
      name
    }
  }
`;

export const CREATE_SUB_DEPARTMENT = gql`
  mutation CreateSubDepartment($input: CreateSubDepartmentInput!) {
    createSubDepartment(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_SUB_DEPARTMENT = gql`
  mutation UpdateSubDepartment($input: UpdateSubDepartmentInput!) {
    updateSubDepartment(input: $input) {
      id
      name
    }
  }
`;

export const REMOVE_SUB_DEPARTMENT = gql`
  mutation RemoveSubDepartment($id: Int!) {
    removeSubDepartment(id: $id)
  }
`;
