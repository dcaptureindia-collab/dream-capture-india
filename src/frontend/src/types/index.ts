export type ProjectCategory =
  | "FashionShoot"
  | "JewelleryShoot"
  | "BridalShoot"
  | "ECommerce"
  | "Catalogue"
  | "WebSeries"
  | "MusicVideo"
  | "BrandPromotion"
  | "InternationalProjects";

export type RegistrationStatus =
  | "Pending"
  | "UnderReview"
  | "Approved"
  | "Rejected";

export type PaymentStatus = "Unpaid" | "Pending" | "Paid" | "Failed";

export type ProjectStatus = "Active" | "Completed" | "Cancelled" | "Draft";

export type NotificationType =
  | "General"
  | "ProjectAssignment"
  | "StatusUpdate"
  | "Payment";

export interface CandidateProfile {
  id: string;
  principalId: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  age: bigint;
  height: string;
  measurements: string;
  registrationStatus: RegistrationStatus;
  paymentStatus: PaymentStatus;
  portfolioImages: import("../backend").ExternalBlob[];
  createdAt: bigint;
  updatedAt: bigint;
}

export interface ProjectRecord {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  requirements: string;
  deadline: bigint;
  budget: string;
  status: ProjectStatus;
  assignedCandidates: string[];
  createdAt: bigint;
  updatedAt: bigint;
}

export interface NotificationRecord {
  id: string;
  recipientPrincipal: string;
  senderPrincipal: string;
  message: string;
  notificationType: NotificationType;
  isRead: boolean;
  createdAt: bigint;
}

export interface PaymentRecord {
  id: string;
  principalId: string;
  stripePaymentId: string;
  amount: bigint;
  status: PaymentStatus;
  createdAt: bigint;
}

export interface AppConfig {
  stripePublicKey: string;
  paymentAmount: bigint;
  whatsappNumber: string;
  email: string;
  instagramHandle: string;
}

export const PROJECT_CATEGORIES: { value: ProjectCategory; label: string }[] = [
  { value: "FashionShoot", label: "Fashion Shoot" },
  { value: "JewelleryShoot", label: "Jewellery Shoot" },
  { value: "BridalShoot", label: "Bridal Shoot" },
  { value: "ECommerce", label: "E-Commerce" },
  { value: "Catalogue", label: "Catalogue" },
  { value: "WebSeries", label: "Web Series" },
  { value: "MusicVideo", label: "Music Video" },
  { value: "BrandPromotion", label: "Brand Promotion" },
  { value: "InternationalProjects", label: "International Projects" },
];
