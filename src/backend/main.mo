import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import UserApproval "mo:caffeineai-user-approval/approval";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import Stripe "mo:caffeineai-stripe/stripe";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import CandidateTypes "types/candidate";
import ProjectTypes "types/project";
import NotificationTypes "types/notification";
import PaymentTypes "types/payment";
import ConfigTypes "types/config";
import Common "types/common";
import ConfigLib "lib/config";
import CandidateMixin "mixins/candidate-api";
import AdminMixin "mixins/admin-api";
import PaymentMixin "mixins/payment-api";

actor {
  // --- Authorization & Approval ---
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let approvalState = UserApproval.initState(accessControlState);

  // Approval endpoints (user-approval extension pattern)
  public query ({ caller }) func isCallerApproved() : async Bool {
    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  // --- Object Storage ---
  include MixinObjectStorage();

  // --- State ---
  let profiles = Map.empty<Principal, CandidateTypes.CandidateProfile>();
  let projects = Map.empty<Common.ProjectId, ProjectTypes.ProjectRecord>();
  let notifications = List.empty<NotificationTypes.NotificationRecord>();
  let payments = List.empty<PaymentTypes.PaymentRecord>();

  let nextProjectId = { var val : Common.ProjectId = 0 };
  let nextNotificationId = { var val : Common.NotificationId = 0 };
  let nextPaymentId = { var val : Common.PaymentId = 0 };

  let appConfigRef = { var val : ConfigTypes.AppConfig = ConfigLib.getDefault() };
  let stripeConfigRef = { var val : ?Stripe.StripeConfiguration = null };

  // --- Stripe (must be declared directly in actor) ---
  public query func isStripeConfigured() : async Bool {
    stripeConfigRef.val != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfigRef.val := ?config;
  };

  func getStripeConfig() : Stripe.StripeConfiguration {
    switch (stripeConfigRef.val) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?cfg) { cfg };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfig(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(successUrl : Text, cancelUrl : Text) : async Text {
    let items : [Stripe.ShoppingItem] = [{
      currency = "inr";
      productName = "Dream Capture India Onboarding";
      productDescription = "One-time onboarding fee for profile setup and verification";
      priceInCents = appConfigRef.val.paymentAmount;
      quantity = 1;
    }];
    await Stripe.createCheckoutSession(getStripeConfig(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // --- Mixins ---
  include CandidateMixin(
    accessControlState,
    approvalState,
    profiles,
    payments,
    projects,
    notifications,
    nextNotificationId,
  );

  include AdminMixin(
    accessControlState,
    approvalState,
    profiles,
    projects,
    notifications,
    nextProjectId,
    nextNotificationId,
    appConfigRef,
  );

  include PaymentMixin(
    accessControlState,
    profiles,
    payments,
    nextPaymentId,
  );
};
