import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import UserApproval "mo:caffeineai-user-approval/approval";
import CandidateTypes "../types/candidate";
import ProjectTypes "../types/project";
import NotificationTypes "../types/notification";
import ConfigTypes "../types/config";
import Common "../types/common";
import CandidateLib "../lib/candidate";
import ProjectLib "../lib/project";
import NotificationLib "../lib/notification";
import ConfigLib "../lib/config";

mixin (
  accessControlState : AccessControl.AccessControlState,
  approvalState : UserApproval.UserApprovalState,
  profiles : Map.Map<Principal, CandidateTypes.CandidateProfile>,
  projects : Map.Map<Common.ProjectId, ProjectTypes.ProjectRecord>,
  notifications : List.List<NotificationTypes.NotificationRecord>,
  nextProjectId : { var val : Common.ProjectId },
  nextNotificationId : { var val : Common.NotificationId },
  appConfig : { var val : ConfigTypes.AppConfig },
) {
  /// List all candidate profiles (admin only)
  public query ({ caller }) func listAllCandidates() : async [CandidateTypes.CandidateProfile] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    CandidateLib.listAll(profiles);
  };

  /// Get a specific candidate's detail (admin only)
  public query ({ caller }) func getCandidateDetail(candidateId : Principal) : async ?CandidateTypes.CandidateProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    CandidateLib.getProfile(profiles, candidateId);
  };

  /// Approve a candidate — sets registrationStatus to Approved and sends notification (admin only)
  public shared ({ caller }) func approveCandidate(candidateId : Principal) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    CandidateLib.setRegistrationStatus(profiles, candidateId, #Approved);
    UserApproval.setApproval(approvalState, candidateId, #approved);
    ignore NotificationLib.send(
      notifications,
      nextNotificationId,
      candidateId,
      caller,
      "Congratulations! Your profile has been approved. Welcome to Dream Capture India.",
      #RegistrationUpdate,
    );
  };

  /// Reject a candidate — sets registrationStatus to Rejected and sends notification (admin only)
  public shared ({ caller }) func rejectCandidate(candidateId : Principal) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    CandidateLib.setRegistrationStatus(profiles, candidateId, #Rejected);
    UserApproval.setApproval(approvalState, candidateId, #rejected);
    ignore NotificationLib.send(
      notifications,
      nextNotificationId,
      candidateId,
      caller,
      "Your application has been reviewed. Unfortunately, your profile was not approved at this time.",
      #RegistrationUpdate,
    );
  };

  /// List all projects (admin only)
  public query ({ caller }) func listProjects() : async [ProjectTypes.ProjectRecord] {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    ProjectLib.listAll(projects);
  };

  /// Add a new project (admin only)
  public shared ({ caller }) func addProject(input : ProjectTypes.ProjectInput) : async ProjectTypes.ProjectRecord {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    ProjectLib.add(projects, nextProjectId, input);
  };

  /// Update an existing project (admin only)
  public shared ({ caller }) func updateProject(projectId : Common.ProjectId, input : ProjectTypes.ProjectInput) : async ProjectTypes.ProjectRecord {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    ProjectLib.update(projects, projectId, input);
  };

  /// Assign a candidate to a project — also sends a ProjectMatch notification (admin only)
  public shared ({ caller }) func assignCandidateToProject(projectId : Common.ProjectId, candidatePrincipal : Principal) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    ProjectLib.assignCandidate(projects, projectId, candidatePrincipal);
    let project = switch (ProjectLib.getById(projects, projectId)) {
      case (?p) p;
      case null Runtime.trap("Project not found");
    };
    ignore NotificationLib.send(
      notifications,
      nextNotificationId,
      candidatePrincipal,
      caller,
      "You have been shortlisted for a project: " # project.title # ". Check your profile for details.",
      #ProjectMatch,
    );
  };

  /// Send a notification to a specific candidate (admin only)
  public shared ({ caller }) func sendNotification(
    recipient : Principal,
    message : Text,
    notificationType : NotificationTypes.NotificationType,
  ) : async NotificationTypes.NotificationRecord {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    NotificationLib.send(notifications, nextNotificationId, recipient, caller, message, notificationType);
  };

  /// Broadcast a notification to multiple candidates (admin only)
  public shared ({ caller }) func broadcastNotification(
    recipients : [Principal],
    message : Text,
    notificationType : NotificationTypes.NotificationType,
  ) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    NotificationLib.broadcast(notifications, nextNotificationId, recipients, caller, message, notificationType);
  };

  /// Get the current app config (admin only)
  public query ({ caller }) func getConfig() : async ConfigTypes.AppConfig {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    appConfig.val;
  };

  /// Update the app config (admin only)
  public shared ({ caller }) func updateConfig(newConfig : ConfigTypes.AppConfig) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    ConfigLib.update(appConfig, newConfig);
  };
};
