import ConfigTypes "../types/config";

module {
  public func getDefault() : ConfigTypes.AppConfig {
    {
      stripePublicKey = "";
      paymentAmount = 149900;
      whatsappNumber = "";
      email = "";
      instagramHandle = "";
    };
  };

  public func update(
    current : { var val : ConfigTypes.AppConfig },
    newConfig : ConfigTypes.AppConfig,
  ) {
    current.val := newConfig;
  };

  public func get(
    current : { var val : ConfigTypes.AppConfig },
  ) : ConfigTypes.AppConfig {
    current.val;
  };
};
