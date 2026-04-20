import List "mo:core/List";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import NotificationTypes "../types/notification";
import Common "../types/common";

module {
  public func send(
    notifications : List.List<NotificationTypes.NotificationRecord>,
    nextId : { var val : Common.NotificationId },
    recipient : Principal,
    sender : Principal,
    message : Text,
    notificationType : NotificationTypes.NotificationType,
  ) : NotificationTypes.NotificationRecord {
    let id = nextId.val;
    nextId.val += 1;
    let record : NotificationTypes.NotificationRecord = {
      id;
      recipientPrincipal = recipient;
      senderPrincipal = sender;
      message;
      notificationType;
      isRead = false;
      createdAt = Time.now();
    };
    notifications.add(record);
    record;
  };

  public func broadcast(
    notifications : List.List<NotificationTypes.NotificationRecord>,
    nextId : { var val : Common.NotificationId },
    recipients : [Principal],
    sender : Principal,
    message : Text,
    notificationType : NotificationTypes.NotificationType,
  ) {
    for (recipient in recipients.values()) {
      let id = nextId.val;
      nextId.val += 1;
      let record : NotificationTypes.NotificationRecord = {
        id;
        recipientPrincipal = recipient;
        senderPrincipal = sender;
        message;
        notificationType;
        isRead = false;
        createdAt = Time.now();
      };
      notifications.add(record);
    };
  };

  public func getForRecipient(
    notifications : List.List<NotificationTypes.NotificationRecord>,
    recipient : Principal,
  ) : [NotificationTypes.NotificationRecord] {
    notifications.filter(func(n : NotificationTypes.NotificationRecord) : Bool {
      Principal.equal(n.recipientPrincipal, recipient)
    }).toArray();
  };

  public func markRead(
    notifications : List.List<NotificationTypes.NotificationRecord>,
    notificationId : Common.NotificationId,
    caller : Principal,
  ) {
    notifications.mapInPlace(
      func(n : NotificationTypes.NotificationRecord) : NotificationTypes.NotificationRecord {
        if (n.id == notificationId and Principal.equal(n.recipientPrincipal, caller)) {
          { n with isRead = true }
        } else {
          n
        }
      }
    );
  };

  public func getUnreadCount(
    notifications : List.List<NotificationTypes.NotificationRecord>,
    recipient : Principal,
  ) : Nat {
    notifications.foldLeft(
      0,
      func(acc : Nat, n : NotificationTypes.NotificationRecord) : Nat {
        if (Principal.equal(n.recipientPrincipal, recipient) and not n.isRead) {
          acc + 1
        } else {
          acc
        }
      },
    );
  };
};
