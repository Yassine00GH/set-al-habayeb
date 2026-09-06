import List "mo:core/List";
import Time "mo:core/Time";
import Storage "mo:caffeineai-object-storage/Storage";
import Types "../types/restaurant";
import RestaurantLib "../lib/restaurant";

mixin (dishes : List.List<Types.Dish>, reservations : List.List<Types.Reservation>, galleryImages : List.List<Types.GalleryImage>) {
  public query func getDishes() : async [Types.Dish] {
    RestaurantLib.listDishes(dishes);
  };

  public query func getDish(id : Types.DishId) : async ?Types.Dish {
    RestaurantLib.getDish(dishes, id);
  };

  public query func getReservations() : async [Types.Reservation] {
    RestaurantLib.listReservations(reservations);
  };

  public shared func createReservation(name : Text, date : Text, time : Text, partySize : Nat, message : Text) : async Types.Reservation {
    let reservation : Types.Reservation = {
      id = reservations.size();
      name;
      date;
      time;
      partySize;
      message;
      createdAt = Time.now();
    };
    RestaurantLib.createReservation(reservations, reservation);
  };

  public query func getGalleryImages() : async [Types.GalleryImage] {
    RestaurantLib.listGalleryImages(galleryImages);
  };

  public shared func uploadGalleryImage(name : Text, blob : Storage.ExternalBlob) : async Types.GalleryImage {
    let image : Types.GalleryImage = {
      id = galleryImages.size();
      name;
      blob;
      createdAt = Time.now();
    };
    RestaurantLib.addGalleryImage(galleryImages, image);
  };
};
