export type LoginOTPRequest = {
  Data?: {
    CountryCode?: string;
    PhoneNumber?: string;
    token?:String;
    IsTest?: boolean;
  };
  Header?: {
    BranchId?: number;
    BrandId?: number;
    ChannelId?: string;
    ContactId?: string;
    TransactionId?: string;
    TransactionDate?: string;
  };
};


export type LoginOTPResponse = {
  Header?: {
    ContactId?: string;
    ChannelId?: number;
    BrandId?: number;
    BranchId?: number | null;
  };
  Data?: {
    CustomerId?: number;
    Token?: string;
    CustomerCode?: string | null;
    PhoneNumber?: string;
    Reference?: string;
    RequestDate?: string;
    ValidToDate?: string;
    OTP?: string;
    ContactNumberType?: number;
  };
  ResponseStatus?: {
    ResponseCode?: string;
    ResponseDesc?: string;
  };
  Message?: string | null;
};
