import Common "common";

module {
  public type ProjectCategory = {
    #Fashion;
    #Jewellery;
    #Bridal;
    #ECommerce;
    #Catalogue;
    #WebSeries;
    #MusicVideo;
    #BrandPromotion;
    #International;
  };

  public type ProjectStatus = {
    #Draft;
    #Active;
    #Closed;
  };

  public type ProjectRecord = {
    id : Common.ProjectId;
    title : Text;
    category : ProjectCategory;
    description : Text;
    requirements : Text;
    deadline : Common.Timestamp;
    budget : Text;
    status : ProjectStatus;
    assignedCandidates : [Principal];
    createdAt : Common.Timestamp;
    updatedAt : Common.Timestamp;
  };

  public type ProjectInput = {
    title : Text;
    category : ProjectCategory;
    description : Text;
    requirements : Text;
    deadline : Common.Timestamp;
    budget : Text;
    status : ProjectStatus;
  };
};
