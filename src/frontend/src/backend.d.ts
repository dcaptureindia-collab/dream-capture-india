import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Timestamp = bigint;
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface AppConfig {
    stripePublicKey: string;
    instagramHandle: string;
    email: string;
    whatsappNumber: string;
    paymentAmount: bigint;
}
export interface PaymentRecord {
    id: PaymentId;
    status: PaymentRecordStatus;
    createdAt: Timestamp;
    stripePaymentId: string;
    amount: bigint;
    principalId: Principal;
}
export interface CandidateProfileInput {
    age: bigint;
    height: string;
    city: string;
    name: string;
    email: string;
    measurements: string;
    phone: string;
}
export interface NotificationRecord {
    id: NotificationId;
    notificationType: NotificationType;
    createdAt: Timestamp;
    isRead: boolean;
    senderPrincipal: Principal;
    message: string;
    recipientPrincipal: Principal;
}
export interface ProjectInput {
    status: ProjectStatus;
    title: string;
    description: string;
    deadline: Timestamp;
    category: ProjectCategory;
    requirements: string;
    budget: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface CandidateProfile {
    id: CandidateId;
    age: bigint;
    height: string;
    paymentStatus: PaymentStatus;
    city: string;
    name: string;
    createdAt: Timestamp;
    email: string;
    updatedAt: Timestamp;
    measurements: string;
    phone: string;
    registrationStatus: RegistrationStatus;
    portfolioImages: Array<ExternalBlob>;
    principalId: Principal;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ProjectRecord {
    id: ProjectId;
    status: ProjectStatus;
    title: string;
    createdAt: Timestamp;
    description: string;
    deadline: Timestamp;
    updatedAt: Timestamp;
    category: ProjectCategory;
    requirements: string;
    budget: string;
    assignedCandidates: Array<Principal>;
}
export interface UserApprovalInfo {
    status: ApprovalStatus;
    principal: Principal;
}
export type CandidateId = Principal;
export type PaymentId = bigint;
export type NotificationId = bigint;
export type ProjectId = bigint;
export enum ApprovalStatus {
    pending = "pending",
    approved = "approved",
    rejected = "rejected"
}
export enum NotificationType {
    RegistrationUpdate = "RegistrationUpdate",
    Reminder = "Reminder",
    Announcement = "Announcement",
    ProjectMatch = "ProjectMatch",
    Offer = "Offer"
}
export enum PaymentRecordStatus {
    Failed = "Failed",
    Completed = "Completed",
    Pending = "Pending"
}
export enum PaymentStatus {
    NotPaid = "NotPaid",
    Paid = "Paid",
    Verified = "Verified"
}
export enum ProjectCategory {
    Bridal = "Bridal",
    MusicVideo = "MusicVideo",
    ECommerce = "ECommerce",
    Fashion = "Fashion",
    Jewellery = "Jewellery",
    International = "International",
    WebSeries = "WebSeries",
    BrandPromotion = "BrandPromotion",
    Catalogue = "Catalogue"
}
export enum ProjectStatus {
    Closed = "Closed",
    Active = "Active",
    Draft = "Draft"
}
export enum RegistrationStatus {
    Approved = "Approved",
    Suspended = "Suspended",
    Rejected = "Rejected",
    Pending = "Pending"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProject(input: ProjectInput): Promise<ProjectRecord>;
    approveCandidate(candidateId: Principal): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    assignCandidateToProject(projectId: ProjectId, candidatePrincipal: Principal): Promise<void>;
    broadcastNotification(recipients: Array<Principal>, message: string, notificationType: NotificationType): Promise<void>;
    createCheckoutSession(successUrl: string, cancelUrl: string): Promise<string>;
    getCallerUserRole(): Promise<UserRole>;
    getCandidateDetail(candidateId: Principal): Promise<CandidateProfile | null>;
    getConfig(): Promise<AppConfig>;
    getMyNotifications(): Promise<Array<NotificationRecord>>;
    getMyPaymentStatus(): Promise<PaymentRecord | null>;
    getMyProfile(): Promise<CandidateProfile | null>;
    getMyProjects(): Promise<Array<ProjectRecord>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    isCallerAdmin(): Promise<boolean>;
    isCallerApproved(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    listAllCandidates(): Promise<Array<CandidateProfile>>;
    listApprovals(): Promise<Array<UserApprovalInfo>>;
    listPayments(): Promise<Array<PaymentRecord>>;
    listProjects(): Promise<Array<ProjectRecord>>;
    markNotificationRead(notificationId: NotificationId): Promise<void>;
    recordPayment(stripeSessionId: string): Promise<PaymentRecord>;
    registerCandidate(input: CandidateProfileInput): Promise<CandidateProfile>;
    rejectCandidate(candidateId: Principal): Promise<void>;
    requestApproval(): Promise<void>;
    sendNotification(recipient: Principal, message: string, notificationType: NotificationType): Promise<NotificationRecord>;
    setApproval(user: Principal, status: ApprovalStatus): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateConfig(newConfig: AppConfig): Promise<void>;
    updateMyProfile(input: CandidateProfileInput): Promise<CandidateProfile>;
    updateProject(projectId: ProjectId, input: ProjectInput): Promise<ProjectRecord>;
    uploadPortfolioImages(images: Array<ExternalBlob>): Promise<void>;
}
