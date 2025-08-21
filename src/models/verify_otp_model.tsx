export type VerifyOTPRequest = {
    Data?: {
        CustomerId?: number;
        PhoneNumber?: string;
        Token?: String;
        OTP?: String;
    };
    Header?: {
        BranchId?: number;
        BrandId?: number;
        ChannelId?: string;
        ContactId?: string;
    };
};


export type VerifyOTPResponse = {
    // Root API response
    Header?: {
        ContactId?: string;
        ChannelId?: number;
        BrandId?: number;
        BranchId?: number | null;
    };
    Data?: {
        Valid?: boolean;
        Message?: string;
        Profile?: {
            Id?: string;
            NickName?: string | null;
            FirstNameTH?: string;
            LastNameTH?: string;
            FirstNameEN?: string;
            LastNameEN?: string;
            PhoneNumber?: string;
            FormattedPhoneNumber?: string;
            Email?: string;
            Loyalty?: {
                Id?: number;
                Brand?: string;
                LoyaltyImage?: string;
                LoyaltyId?: number;
                Type?: string;
                LoyaltyDescription?: string;
                TotalPoint?: number;
                TierTargetPoint?: number;
                TierTargetAmount?: number;
                EarnRate?: number;
                BurnRequirement?: number;
                AmountPerPoint?: number;
                NextTierName?: string;
                AmountToNextTarget?: number;
                TotalPointAccrued?: number;
                EndDate?: string | null;
                IsExpired?: boolean;
                PointToDiscountBurn?: boolean;
            };
            Membership?: any | null;
            Birthday?: string | null;
            IntegralCustomerId?: number;
            Gender?: string;
            MaritalStatus?: string;
            ClientType?: string;
            UserName?: string;
            ContactNumber?: string | null;
            LineUserId?: string | null;
            AllowMarketingMessage?: boolean;
            CompanyName?: string;
            TaxID?: string;
            CompanyAddressLine1?: string;
            CompanyAddressLine2?: string;
            CompanyAddressLine3?: string;
            AlternateContactNumber?: string | null;
            AlternateChannel?: number;
        } | null;
    };
    ResponseStatus?: {
        ResponseCode?: string;
        ResponseDesc?: string;
    };
    Message?: string | null;
};
