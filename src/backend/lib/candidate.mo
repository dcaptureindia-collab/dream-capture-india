import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import CandidateTypes "../types/candidate";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  /// Register a new candidate profile. Traps on duplicate principal.
  public func register(
    profiles : Map.Map<Principal, CandidateTypes.CandidateProfile>,
    caller : Principal,
    input : CandidateTypes.CandidateProfileInput,
  ) : CandidateTypes.CandidateProfile {
    if (profiles.containsKey(caller)) {
      Runtime.trap("Profile already exists for this principal");
    };
    let now = Time.now();
    let profile : CandidateTypes.CandidateProfile = {
      id = caller;
      principalId = caller;
      name = input.name;
      email = input.email;
      phone = input.phone;
      city = input.city;
      age = input.age;
      height = input.height;
      measurements = input.measurements;
      registrationStatus = #Pending;
      paymentStatus = #NotPaid;
      portfolioImages = [];
      createdAt = now;
      updatedAt = now;
    };
    profiles.add(caller, profile);
    profile;
  };

  /// Get a candidate profile by principal.
  public func getProfile(
    profiles : Map.Map<Principal, CandidateTypes.CandidateProfile>,
    caller : Principal,
  ) : ?CandidateTypes.CandidateProfile {
    profiles.get(caller);
  };

  /// Update a candidate's own profile fields (keeps status/payment/images intact).
  public func updateProfile(
    profiles : Map.Map<Principal, CandidateTypes.CandidateProfile>,
    caller : Principal,
    input : CandidateTypes.CandidateProfileInput,
  ) : CandidateTypes.CandidateProfile {
    let existing = switch (profiles.get(caller)) {
      case (?p) { p };
      case null { Runtime.trap("Profile not found") };
    };
    let updated : CandidateTypes.CandidateProfile = {
      existing with
      name = input.name;
      email = input.email;
      phone = input.phone;
      city = input.city;
      age = input.age;
      height = input.height;
      measurements = input.measurements;
      updatedAt = Time.now();
    };
    profiles.add(caller, updated);
    updated;
  };

  /// List all candidate profiles (admin use).
  public func listAll(
    profiles : Map.Map<Principal, CandidateTypes.CandidateProfile>,
  ) : [CandidateTypes.CandidateProfile] {
    profiles.values().toArray();
  };

  /// Set the registration status for a candidate (admin use).
  public func setRegistrationStatus(
    profiles : Map.Map<Principal, CandidateTypes.CandidateProfile>,
    candidateId : Principal,
    status : CandidateTypes.RegistrationStatus,
  ) {
    let existing = switch (profiles.get(candidateId)) {
      case (?p) { p };
      case null { Runtime.trap("Candidate profile not found") };
    };
    let updated : CandidateTypes.CandidateProfile = {
      existing with
      registrationStatus = status;
      updatedAt = Time.now();
    };
    profiles.add(candidateId, updated);
  };

  /// Append portfolio images for a candidate (max 10 total).
  public func addPortfolioImages(
    profiles : Map.Map<Principal, CandidateTypes.CandidateProfile>,
    caller : Principal,
    images : [Storage.ExternalBlob],
  ) {
    let existing = switch (profiles.get(caller)) {
      case (?p) { p };
      case null { Runtime.trap("Profile not found") };
    };
    let combined = existing.portfolioImages.concat(images);
    if (combined.size() > 10) {
      Runtime.trap("Portfolio cannot exceed 10 images");
    };
    let updated : CandidateTypes.CandidateProfile = {
      existing with
      portfolioImages = combined;
      updatedAt = Time.now();
    };
    profiles.add(caller, updated);
  };
};
