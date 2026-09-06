import Storage "mo:caffeineai-object-storage/Storage";

module {
  public type DishId = Nat;

  public type DishCategory = {
    #plats;
    #boissons;
    #desserts;
  };

  public type Dish = {
    id : DishId;
    name : Text;
    description : Text;
    category : DishCategory;
    priceDt : Nat;
    imageRef : Text;
    popular : Bool;
    tags : [Text];
  };

  public type ReservationId = Nat;

  public type Reservation = {
    id : ReservationId;
    name : Text;
    date : Text;
    time : Text;
    partySize : Nat;
    message : Text;
    createdAt : Int;
  };

  public type GalleryImageId = Nat;

  public type GalleryImage = {
    id : GalleryImageId;
    name : Text;
    blob : Storage.ExternalBlob;
    createdAt : Int;
  };
};
