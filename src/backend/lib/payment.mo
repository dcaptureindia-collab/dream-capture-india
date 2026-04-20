import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import PaymentTypes "../types/payment";
import Common "../types/common";

module {
  public func record(
    payments : List.List<PaymentTypes.PaymentRecord>,
    nextId : { var val : Common.PaymentId },
    caller : Principal,
    stripePaymentId : Text,
    amount : Nat,
  ) : PaymentTypes.PaymentRecord {
    let id = nextId.val;
    nextId.val += 1;
    let payment : PaymentTypes.PaymentRecord = {
      id;
      principalId = caller;
      stripePaymentId;
      amount;
      status = #Completed;
      createdAt = Time.now();
    };
    payments.add(payment);
    payment;
  };

  public func getForCaller(
    payments : List.List<PaymentTypes.PaymentRecord>,
    caller : Principal,
  ) : ?PaymentTypes.PaymentRecord {
    payments.find(func(p) { Principal.equal(p.principalId, caller) });
  };

  public func updateStatus(
    payments : List.List<PaymentTypes.PaymentRecord>,
    paymentId : Common.PaymentId,
    status : PaymentTypes.PaymentRecordStatus,
  ) {
    payments.mapInPlace(func(p) {
      if (p.id == paymentId) { { p with status } } else { p }
    });
  };
};
