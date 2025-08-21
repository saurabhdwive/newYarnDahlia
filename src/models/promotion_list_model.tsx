export interface PromotionItem {
  Header?: {
    ContactId?: string;
    ChannelId?: string | number;
    BrandId?: number;
    BranchId?: number;
  };
  Data?: {
    Id?: number;
    BranchId?: number;
  };
  Url?: {
    Brand?: string;
    BaseUrl?: string;
    StoreUrl?: string;
    ImageUrl?: string;
  };
}

export interface PromotionListResponse {
  [category: string]: PromotionItem[] | undefined;
}
