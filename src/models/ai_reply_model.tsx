// foodie24x7Types.ts

/// request 

export interface ChatRequest {
  device_token: string;
  user_input: string;
  customerLocation: string;
}



/// response 

export interface ChatFoodie24x7Response {
  response: string;
  foodie24x7: Foodie24x7;
}

export interface Foodie24x7 {
  current: Current;
  context: Context;
}

export interface Current {
  intent: string;
  entitiesByIntent: EntitiesByIntent;
}

export interface EntitiesByIntent {
  PlaceOrder: PlaceOrder;
  TableBooking: TableBooking;
  TrackOrder: TrackOrder;
  CustomerServiceQuery: CustomerServiceQuery;
  GiveFeedback: GiveFeedback;
  FileComplaint: FileComplaint;
  AskPromotion: AskPromotion;
}

export interface PlaceOrder {
  cuisineType: string | null;
  selectedStore: string | null;
  selectedStoreUrl: string | null;
  dish: string | null;
  quantity: number | null;
  deliveryMethod: string | null;
  time: string | null;
  location: string | null;
  paymentMethod: string | null;
  missing: string[];
  selectedStoreUrlObj: SelectedStoreUrlObj | null;
  selectedDialogObj: SelectedDialogObj | null;
}

export interface SelectedStoreUrlObj {
  Header: {
    ContactId: string | null;
    ChannelId: string | null;
    BrandId: number | null;
    BranchId: number | null;
  };
  Data: {
    Id: number | null;
    BranchId: number | null;
  };
}

export interface SelectedDialogObj {
  storeName: string | null;
  storeImageUrl: string | null;
}

export interface TableBooking {
  partySize: number | null;
  time: string | null;
  name: string | null;
  phone: string | null;
  specialRequests: string | null;
  missing: string[];
}

export interface TrackOrder {
  orderId: string | null;
  phone: string | null;
  missing: string[];
}

export interface CustomerServiceQuery {
  orderId: string | null;
  issueType: string | null;
  description: string | null;
  missing: string[];
}

export interface GiveFeedback {
  feedbackType: string | null;
  rating: number | null;
  comments: string | null;
  orderId: string | null;
  missing: string[];
}

export interface FileComplaint {
  orderId: string | null;
  complaintType: string | null;
  details: string | null;
  requestedAction: string | null;
  missing: string[];
}

export interface AskPromotion {
  promotionType: string | null;
  referralCode: string | null;
  userId: string | null;
  missing: string[];
}

export interface Context {
  behaviour: Behaviour;
  location: Location;
}

export interface Behaviour {
  isRude: boolean | null;
  isRudeScore: number | null;
  lockScreen: boolean | null;
  lockScreenDuration: number | null;
}

export interface Location {
  customerLocation: string | null;
  latitude: string | null;
  longitude: string | null;
}
