import { ObjectId } from 'mongodb';

//Firmname is unique - we add the first person in a firm
export interface IDriver {
  getResetPasswordToken(): string;
  getSignedToken(): string;
  resetPasswordToken: string | undefined;
  resetPasswordExpire: string | undefined;
  matchPassword(password: string): boolean | PromiseLike<boolean>;
  email: string;
  password: string;
  transportFirm: Array<{ name: string; active: boolean }>;
  profile: Profile;
  rememberMe: boolean;
}

export interface DriverTransportfirm {
  name: string;
  active: boolean;
}

export interface Profile {
  name: string;
  phoneNumber: string; // country code + numberpersonalInfo;
  carRegistrationNumber: string;
  waybills: Array<ObjectId>;
}

export interface Address {
  street1: string;
  street2: string;
  city: string;
  state: string;
  country: string;
  zip: string;
}

export interface IFirm {
  name: string;
  address: Address;
  customerID: number;
  signature: Signature;
}

export interface ICargo {
  itemReference: string;
  itemName: string;
  unitCount: number;
  unitDescription: string;
  netWeight: number;
}

export interface IComment {
  description: string;
  time: Date;
  author: string;
}

export interface Signature {
  name: string;
  time: Date;
}

export enum chargedToEnum {
  'sender',
  'receiver',
  'other',
}
export enum transportCodesEnum {
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
}
export enum temperatureEnum {
  'FREEZE',
  'COLD',
  'ROOM',
  'MIX',
}
export enum waybillStatusEnum {
  'PLANNED',
  'IN PROGRESS',
  'DELIVERED',
}

export interface IWaybill {
  transportFirm: string;
  refrenceNumber: string;
  routeNumber: number;
  receiver: IFirm;
  sender: IFirm;
  pickupTime: Date;
  deliveryTime: Date;
  pickUpDriver: {
    id: ObjectId;
    signature: Signature;
  };
  deliveryDriver: {
    id: ObjectId;
    signature: Signature;
  };
  chargedTo: string;
  transportCodes: string;
  packageCount: number;
  volume: number;
  temperature: string;
  measurements: string;
  grossWeight: number;
  palletCount: number;
  palletSpaces: number;
  dangerous: boolean;
  reloading: boolean;
  price: number;
  extraCharge: string;
  allCargo: Array<ICargo>;
  allComments: Array<IComment>;
  archived: boolean;
  status: string;
  emergencyContact: string; // admin phone nr.
}

export interface IAdmin {
  transportFirm: string;
  email: string;
  name: string;
  phoneNumber: string; // country code + phone number
  responsibleFor: Array<ObjectId>; // driver._id
}

export interface LicenseInfo {
  // expiration date as a string
  licenseNumber: number;
  expirationDate: string;
}

export interface Transport {
  //Array<string> => array with car reg. num.
  cars: Array<string>;
  //Array<string> => array with trailer reg. num.
  trailer: Array<string>;
}

export interface ITransportFirm {
  name: string;
  //Array<string> => array with admin._id
  adminList: Array<ObjectId>;
  //Array<string> => array with drivers._id
  activeDriverList: Array<ObjectId>;
  inactiveDriverList: Array<ObjectId>;
  //Array<string> => array with waybill._id
  waybillList: Array<ObjectId>;
  archivedWaybillList: Array<ObjectId>;
  // Array with expiration date and license number
  licenseInfo: Array<LicenseInfo>;
  // list with both cars and trailers reg. nr.
  transport: Transport;
}
