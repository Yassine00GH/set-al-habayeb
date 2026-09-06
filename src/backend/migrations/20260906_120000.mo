import List "mo:core/List";
import Map "mo:core/Map";
import Principal "mo:core/Principal";

module {
  type UserRole = {
    #admin;
    #user;
    #guest;
  };

  type AccessControlState = {
    var adminAssigned : Bool;
    userRoles : Map.Map<Principal, UserRole>;
  };

  type DishCategory = {
    #plats;
    #boissons;
    #desserts;
  };

  type Dish = {
    id : Nat;
    name : Text;
    description : Text;
    category : DishCategory;
    priceDt : Nat;
    imageRef : Text;
    popular : Bool;
    tags : [Text];
  };

  type Reservation = {
    id : Nat;
    name : Text;
    date : Text;
    time : Text;
    partySize : Nat;
    message : Text;
    createdAt : Int;
  };

  type GalleryImage = {
    id : Nat;
    name : Text;
    blob : Blob;
    createdAt : Int;
  };

  type OldActor = {};

  type NewActor = {
    accessControlState : AccessControlState;
    dishes : List.List<Dish>;
    reservations : List.List<Reservation>;
    galleryImages : List.List<GalleryImage>;
  };

  public func migration(_old : OldActor) : NewActor {
    let seededDishes = List.empty<Dish>();
    seededDishes.add({
      id = 1;
      name = "Couscous au poulet et légumes";
      description = "Couscous traditionnel tunisien accompagné de poulet tendre et de légumes de saison mijotés dans une sauce parfumée.";
      category = #plats;
      priceDt = 45;
      imageRef = "";
      popular = true;
      tags = ["plat", "traditionnel", "couscous"];
    });
    seededDishes.add({
      id = 2;
      name = "Merguez";
      description = "Saucisses épicées grillées au feu de bois, servies avec frites maison et harissa.";
      category = #plats;
      priceDt = 25;
      imageRef = "";
      popular = true;
      tags = ["plat", "grillade", "épicé"];
    });
    seededDishes.add({
      id = 3;
      name = "Madfouna";
      description = "Spécialité berbère : pâte fine garnie de viande hachée, d'œufs et d'épices, cuite au four traditionnel.";
      category = #plats;
      priceDt = 35;
      imageRef = "";
      popular = true;
      tags = ["plat", "spécialité", "four"];
    });
    seededDishes.add({
      id = 4;
      name = "Spaghetti";
      description = "Spaghetti al dente nappés d'une sauce tomate maison aux herbes fraîches et parmesan.";
      category = #plats;
      priceDt = 30;
      imageRef = "";
      popular = false;
      tags = ["plat", "pâtes"];
    });
    seededDishes.add({
      id = 5;
      name = "Saganáki";
      description = "Fromage grec pané et doré, servi chaud avec une touche de citron et d'origan.";
      category = #plats;
      priceDt = 28;
      imageRef = "";
      popular = false;
      tags = ["plat", "entrée", "fromage"];
    });
    seededDishes.add({
      id = 6;
      name = "Café turc";
      description = "Café turc préparé à la manière traditionnelle, servi avec un verre d'eau et une douceur orientale.";
      category = #boissons;
      priceDt = 20;
      imageRef = "";
      popular = true;
      tags = ["boisson", "café"];
    });
    {
      accessControlState = {
        var adminAssigned = false;
        userRoles = Map.empty();
      };
      dishes = seededDishes;
      reservations = List.empty();
      galleryImages = List.empty();
    };
  };
};
