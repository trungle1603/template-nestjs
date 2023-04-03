
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export enum RoleEnum {
    ADMIN = "ADMIN",
    USER = "USER",
    GUEST = "GUEST"
}

export enum ArticleStatusEnum {
    PENDING = "PENDING",
    PUBLISHED = "PUBLISHED",
    REJECT = "REJECT",
    ARCHIVED = "ARCHIVED"
}

export enum SortTypeEnum {
    ASCENDING = "ASCENDING",
    DESCENDING = "DESCENDING"
}

export interface FilterGetAllArticleInput {
    category?: Nullable<ObjectID>;
    tags?: Nullable<ObjectID[]>;
    title?: Nullable<string>;
    content?: Nullable<string>;
    status?: Nullable<ArticleStatusEnum>;
}

export interface PaginationInput {
    pageNumber: number;
    pageSize: number;
    sort: SortInput;
}

export interface SortInput {
    createdAt: SortTypeEnum;
}

export interface BaseInput {
    _id: ObjectID;
}

export interface FilterGetAllUserInput {
    displayName?: Nullable<string>;
    email?: Nullable<string>;
}

export interface FilterGetOneUserInput {
    _id?: Nullable<ObjectID>;
    email?: Nullable<string>;
}

export interface FilterGetAllCategoryInput {
    name?: Nullable<string>;
}

export interface FilterGetAllTagInput {
    name?: Nullable<string>;
}

export interface CreateArticleInput {
    category: ObjectID;
    tags: ObjectID[];
    title: string;
    content: string;
}

export interface UpdateArticleInput {
    category?: Nullable<ObjectID>;
    tags?: Nullable<ObjectID[]>;
    title?: Nullable<string>;
    content?: Nullable<string>;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface SignUpInput {
    displayName: string;
    email: string;
    password: string;
}

export interface ForgotPasswordInput {
    email: string;
}

export interface VerifyForgotPasswordInput {
    token: string;
    newPassword: string;
}

export interface ResetPasswordInput {
    oldPassword: string;
    newPassword: string;
}

export interface CreateUserInput {
    displayName: string;
    email: string;
    password: string;
}

export interface UpdateUserInput {
    displayName?: Nullable<string>;
    email?: Nullable<string>;
    password?: Nullable<string>;
}

export interface CreateRoleInput {
    name: RoleEnum;
    permissions: string[];
}

export interface UpdatePermissionRoleInput {
    permissions: string[];
    roleId: ObjectID;
}

export interface CreateCategoryInput {
    name: string;
}

export interface UpdateCategoryInput {
    name?: Nullable<string>;
}

export interface CreateTagInput {
    name: string;
    description?: Nullable<string>;
}

export interface UpdateTagInput {
    name?: Nullable<string>;
    description?: Nullable<string>;
}

export interface Role {
    _id: ObjectID;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    name: RoleEnum;
    permissions: string[];
}

export interface User {
    _id: ObjectID;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    displayName: string;
    email: string;
    roles: Role[];
    isEmailVerified: boolean;
}

export interface Category {
    _id: ObjectID;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    name: string;
    slug: string;
}

export interface Tag {
    _id: ObjectID;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    name: string;
    slug: string;
    description?: Nullable<string>;
}

export interface Article {
    _id: ObjectID;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    title: string;
    content: string;
    slug: string;
    status: ArticleStatusEnum;
    author: User;
    category: Category;
    tags: Tag[];
}

export interface Auth {
    accessToken: string;
    refreshToken: string;
    publicKey: string;
}

export interface GridFsFile {
    _id: ObjectID;
    length: number;
    chunkSize: number;
    uploadDate: DateTime;
    filename: string;
    contentType: string;
}

export interface ProfilePicture {
    _id: ObjectID;
    createdAt?: Nullable<DateTime>;
    updatedAt?: Nullable<DateTime>;
    author: ObjectID;
    originalname: string;
    mimetype: string;
    size: number;
    buffer: string;
}

export interface IQuery {
    getAllArticle(filter?: Nullable<FilterGetAllArticleInput>, pagination?: Nullable<PaginationInput>): Article[] | Promise<Article[]>;
    getOneArticle(filter: BaseInput): Article | Promise<Article>;
    getAllUser(filter?: Nullable<FilterGetAllUserInput>, pagination?: Nullable<PaginationInput>): User[] | Promise<User[]>;
    getOneUser(filter: FilterGetOneUserInput): User | Promise<User>;
    getMyInformation(): User | Promise<User>;
    getAllCategory(filter?: Nullable<FilterGetAllCategoryInput>, pagination?: Nullable<PaginationInput>): Category[] | Promise<Category[]>;
    getOneCategory(filter: BaseInput): Category | Promise<Category>;
    getGridFsFile(args: BaseInput): GridFsFile | Promise<GridFsFile>;
    getProfilePicture(): ProfilePicture | Promise<ProfilePicture>;
    getAllTag(filter?: Nullable<FilterGetAllTagInput>, pagination?: Nullable<PaginationInput>): Tag[] | Promise<Tag[]>;
    getOneTag(filter: BaseInput): Tag | Promise<Tag>;
}

export interface IMutation {
    createArticle(input: CreateArticleInput): Article | Promise<Article>;
    updateArticle(filter: BaseInput, input: UpdateArticleInput): Article | Promise<Article>;
    deleteArticle(filter: BaseInput): string | Promise<string>;
    login(input: LoginInput): Auth | Promise<Auth>;
    refreshToken(): Auth | Promise<Auth>;
    signUp(input: SignUpInput): string | Promise<string>;
    logout(): string | Promise<string>;
    forgotPassword(input: ForgotPasswordInput): string | Promise<string>;
    verifyForgotPassword(input: VerifyForgotPasswordInput): string | Promise<string>;
    resetPassword(input: ResetPasswordInput): string | Promise<string>;
    createUser(input: CreateUserInput): User | Promise<User>;
    updateUser(filter: BaseInput, input: UpdateUserInput): User | Promise<User>;
    createRole(input: CreateRoleInput): Role | Promise<Role>;
    updatePermissionRole(input: UpdatePermissionRoleInput): string | Promise<string>;
    generateListPermission(): string | Promise<string>;
    createCategory(input: CreateCategoryInput): Category | Promise<Category>;
    updateCategory(filter: BaseInput, input: UpdateCategoryInput): Category | Promise<Category>;
    deleteCategory(filter: BaseInput): string | Promise<string>;
    deleteGridFsFile(args: BaseInput): string | Promise<string>;
    createTag(input: CreateTagInput): Tag | Promise<Tag>;
    updateTag(filter: BaseInput, input: UpdateTagInput): Tag | Promise<Tag>;
    deleteTag(filter: BaseInput): string | Promise<string>;
}

export type ObjectID = any;
export type DateTime = any;
type Nullable<T> = T | null;
