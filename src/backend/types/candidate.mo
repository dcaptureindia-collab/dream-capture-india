import Common "common";
import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type RegistrationStatus = {
    #Pending;
    #Approved;
    #Rejected;
    #Suspended;
  };

  public type PaymentStatus = {
    #NotPaid;
    #Paid;
    #Verified;
  };

  public type CandidateProfile = {
    id : Common.CandidateId;
    principalId : Principal;
    name : Text;
    email : Text;
    phone : Text;
    city : Text;
    age : Nat;
    height : Text;
    measurements : Text;
    registrationStatus : RegistrationStatus;
    paymentStatus : PaymentStatus;
    portfolioImages : [Storage.ExternalBlob];
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type CandidateProfileInput = {
    name : Text;
    email : Text;
    phone : Text;
    city : Text;
    age : Nat;
    height : Text;
    measurements : Text;
  };
};
