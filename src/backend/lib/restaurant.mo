import List "mo:core/List";
import Types "../types/restaurant";

module {
  public func listDishes(dishes : List.List<Types.Dish>) : [Types.Dish] {
    dishes.toArray();
  };

  public func getDish(dishes : List.List<Types.Dish>, id : Types.DishId) : ?Types.Dish {
    dishes.find(func d = d.id == id);
  };

  public func listReservations(reservations : List.List<Types.Reservation>) : [Types.Reservation] {
    reservations.toArray();
  };

  public func createReservation(reservations : List.List<Types.Reservation>, reservation : Types.Reservation) : Types.Reservation {
    reservations.add(reservation);
    reservation;
  };

  public func listGalleryImages(galleryImages : List.List<Types.GalleryImage>) : [Types.GalleryImage] {
    galleryImages.toArray();
  };

  public func addGalleryImage(galleryImages : List.List<Types.GalleryImage>, image : Types.GalleryImage) : Types.GalleryImage {
    galleryImages.add(image);
    image;
  };
};
