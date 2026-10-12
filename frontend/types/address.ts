export type Address = {
  _id: string;

  fullName: string;
  mobile: string;
  pincode: string;

  houseNumber: string;
  area: string;
  landmark?: string;

  city: string;
  district?: string;
  state: string;
  country: string;

  addressType: "Home" | "Work" | "Other";
  isDefault: boolean;
};