export const LOGIN_ACCOUNT_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      access_token
      token_type
      expires_in
      refresh_token
      user {
        name
        id
        email
        phone
        avatar
        role {
          id
          description
          statut
          code
          roleName
        }
      }
    }
  }
`;

export const LOGOUT_ACCOUNT_MUTATION = `
  mutation Logout {
    logout {
      status
      message
    }
  }
`;
