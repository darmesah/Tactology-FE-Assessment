import { gql } from "@apollo/client";

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
  };
}

export interface LoginVars {
  loginInput: {
    email: string;
    password: string;
  };
}

export interface SignupVars {
  signupInput: {
    email: string;
    password: string;
  };
}

export const LOGIN = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      access_token
      user {
        id
        email
      }
    }
  }
`;

export const SIGNUP = gql`
  mutation Signup($signupInput: SignupInput!) {
    signup(signupInput: $signupInput) {
      access_token
      user {
        id
        email
      }
    }
  }
`;
