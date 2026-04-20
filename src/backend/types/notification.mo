import Common "common";

module {
  public type NotificationType = {
    #RegistrationUpdate;
    #ProjectMatch;
    #Offer;
    #Reminder;
    #Announcement;
  };

  public type NotificationRecord = {
    id : Common.NotificationId;
    recipientPrincipal : Principal;
    senderPrincipal : Principal;
    message : Text;
    notificationType : NotificationType;
    isRead : Bool;
    createdAt : Common.Timestamp;
  };
};
