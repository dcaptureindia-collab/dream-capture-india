import Map "mo:core/Map";
import List "mo:core/List";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import UserApproval "mo:caffeineai-user-approval/approval";
import Storage "mo:caffeineai-object-storage/Storage";
import CandidateTypes "../types/candidate";
import CandidateLib "../lib/candidate";
import PaymentTypes "../types/payment";
import ProjectTypes "../types/project";
import NotificationTypes "../types/notification";
import Common "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  approvalState : UserApproval.UserApprovalState,
  profiles : Map.Map<Principal, CandidateTypes.CandidateProfile>,
  payments : List.List<PaymentTypes.PaymentRecord>,
  projects : Map.Map<Common.ProjectId, ProjectTypes.ProjectRecord>,
  notifications : List.List<NotificationTypes.NotificationRecord>,
  nextNotificationId : { var val : Common.NotificationId },
) {
  /// Register a new candidate profile (requires authenticated #user).
  public shared ({ caller }) func registerCandidate(input : CandidateTypes.CandidateProfileInput) : async CandidateTypes.CandidateProfile {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be authenticated to register");
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to register");
    };
    CandidateLib.register(profiles, caller, input);
  };

  /// Get the caller's own profile.
  public query ({ caller }) func getMyProfile() : async ?CandidateTypes.CandidateProfile {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be authenticated");
    };
    CandidateLib.getProfile(profiles, caller);
  };

  /// Update the caller's own profile.
  public shared ({ caller }) func updateMyProfile(input : CandidateTypes.CandidateProfileInput) : async CandidateTypes.CandidateProfile {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be authenticated");
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to update profile");
    };
    CandidateLib.updateProfile(profiles, caller, input);
  };

  /// Get the caller's payment record (most recent completed payment).
  public query ({ caller }) func getMyPaymentStatus() : async ?PaymentTypes.PaymentRecord {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be authenticated");
    };
    payments.find(func(p : PaymentTypes.PaymentRecord) : Bool {
      Principal.equal(p.principalId, caller)
    });
  };

  /// Get projects assigned to the caller.
  public query ({ caller }) func getMyProjects() : async [ProjectTypes.ProjectRecord] {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be authenticated");
    };
    projects.values().filter(func(p : ProjectTypes.ProjectRecord) : Bool {
      p.assignedCandidates.find(func(c : Principal) : Bool {
        Principal.equal(c, caller)
      }) != null
    }).toArray();
  };

  /// Get notifications for the caller (unread first, then all).
  public query ({ caller }) func getMyNotifications() : async [NotificationTypes.NotificationRecord] {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be authenticated");
    };
    notifications.filter(func(n : NotificationTypes.NotificationRecord) : Bool {
      Principal.equal(n.recipientPrincipal, caller)
    }).toArray();
  };

  /// Mark a notification as read (only the recipient can mark their own).
  public shared ({ caller }) func markNotificationRead(notificationId : Common.NotificationId) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be authenticated");
    };
    notifications.mapInPlace(func(n : NotificationTypes.NotificationRecord) : NotificationTypes.NotificationRecord {
      if (n.id == notificationId and Principal.equal(n.recipientPrincipal, caller)) {
        { n with isRead = true }
      } else {
        n
      }
    });
  };

  /// Upload portfolio images (ExternalBlob references from object-storage).
  public shared ({ caller }) func uploadPortfolioImages(images : [Storage.ExternalBlob]) : async () {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Must be authenticated");
    };
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Must be logged in to upload images");
    };
    CandidateLib.addPortfolioImages(profiles, caller, images);
  };
};
