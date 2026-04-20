import Common "common";

module {
  public type PaymentRecordStatus = {
    #Pending;
    #Completed;
    #Failed;
  };

  public type PaymentRecord = {
    id : Common.PaymentId;
    principalId : Principal;
    stripePaymentId : Text;
    amount : Nat;
    status : PaymentRecordStatus;
    createdAt : Common.Timestamp;
  };
};
