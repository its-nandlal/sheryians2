

type authUserSuccess = {
    success: true;
    data: {
      id: string;
      email: string;
      name: string;
      image: string | null;
      role: string;
      createdAt: Date;
      updatedAt: Date;
    } | null;
    status: string | number;
}


type authUserError = {
    success: false;
    error: string;
    status: string | number;
}


export type AuthUserResponse = authUserSuccess | authUserError;