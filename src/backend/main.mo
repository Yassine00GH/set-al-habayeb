import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import List "mo:core/List";
import Expose "mo:caffeineai-oql/Expose";
import Entity "mo:caffeineai-oql/Entity";
import ListEntity "mo:caffeineai-oql/ListEntity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import IntValue "mo:caffeineai-oql/IntValue";
import BoolValue "mo:caffeineai-oql/BoolValue";
import Types "types/restaurant";
import RestaurantApi "mixins/restaurant-api";
import ApiDocMixin "mixins/api-doc";

actor {
  func categoryToText(c : Types.DishCategory) : Text {
    switch (c) {
      case (#plats) "plats";
      case (#boissons) "boissons";
      case (#desserts) "desserts";
    };
  };

  let accessControlState : AccessControl.AccessControlState;
  include MixinAuthorization(accessControlState, null);
  include MixinObjectStorage();

  let dishes : List.List<Types.Dish>;
  let reservations : List.List<Types.Reservation>;
  let galleryImages : List.List<Types.GalleryImage>;

  include RestaurantApi(dishes, reservations, galleryImages);
  include ApiDocMixin();

  include Expose({
    entities = [
      dishes.toEntityManual("dish", "Dish", "id")
        .sample({ id = 0; name = ""; description = ""; category = #plats; priceDt = 0; imageRef = ""; popular = false; tags = [] })
        .payload("id", func d = d.id)
        .payload("name", func d = d.name)
        .payload("description", func d = d.description)
        .payload("category", func d = categoryToText(d.category))
        .payload("priceDt", func d = d.priceDt)
        .payload("imageRef", func d = d.imageRef)
        .payload("popular", func d = d.popular)
        .payload("tagCount", func d = d.tags.size())
        .public_()
        .build(),
      reservations.toEntity("reservation", "Reservation", "id")
        .sample({ id = 0; name = ""; date = ""; time = ""; partySize = 0; message = ""; createdAt = 0 })
        .controllerOnly()
        .build(),
      galleryImages.toEntityManual("galleryImage", "GalleryImage", "id")
        .sample({ id = 0; name = ""; blob = ([] : [Nat8]).toBlob(); createdAt = 0 })
        .payload("id", func g = g.id)
        .payload("name", func g = g.name)
        .payload("createdAt", func g = g.createdAt)
        .payload("blobSize", func g = g.blob.size())
        .public_()
        .build(),
    ];
  });
};
