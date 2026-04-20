import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import CandidateTypes "../types/candidate";
import PaymentTypes "../types/payment";
import Common "../types/common";
import PaymentLib "../lib/payment";

mixin (
  accessControlState : AccessControl.AccessControlState,
  profiles : Map.Map<Principal, CandidateTypes.CandidateProfile>,
  payments : List.List<PaymentTypes.PaymentRecord>,
  nextPaymentId : { var val : Common.PaymentId },
) {
  /// Record a completed Stripe payment for the caller.
  /// Checks that the caller has a candidate profile, then creates a PaymentRecord
  /// and updates the candidate's paymentStatus to Verified.
  public shared ({ caller }) func recordPayment(stripeSessionId : Text) : async PaymentTypes.PaymentRecord {
    // Check that the caller has a registered candidate profile
    let profile = switch (profiles.get(caller)) {
      case (?p) p;
      case null Runtime.trap("No candidate profile found. Please register first.");
    };
    // Create the payment record
    let payment = PaymentLib.record(payments, nextPaymentId, caller, stripeSessionId, 149900);
    // Update the candidate's paymentStatus to Verified
    let updated : CandidateTypes.CandidateProfile = {
      profile with
      paymentStatus = #Verified;
      updatedAt = Time.now();
    };
    profiles.add(caller, updated);
    payment;
  };

  /// Get all payment records (admin only)
  public query ({ caller }) func listPayments() : async [PaymentTypes.PaymentRecord] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    payments.toArray();
  };

};
