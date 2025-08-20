export interface UserListResponse {
    users: UserResponse[];
}

export interface UserResponse {
    id: string;
    username: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}