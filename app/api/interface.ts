export interface JKN {
  DepartmentID: string;
  ServiceUnitCode: string;
  ServiceUnitName: string;
  AplicaresClassCode: string;
  AplicaresClassName: string;
  TotalBed: number;
  TotalBedEmpty: number;
  TotalMaleBedEmpty: number;
  TotalFemaleBedEmpty: number;
}

export interface RSSES {
  ServiceUnitName: string;
  RoomCode: string;
  RoomName: string;
  ClassCode: string;
  ClassName: string;
  BedBooking: number;
  BedCleaned: number;
  BedOccupied: number;
  BedEmpty: number;
  TotalBed: number;
  IsBorCalculation: boolean;
  IsAplicares: boolean;
  AplicaresClassCode: string;
  AplicaresClassName: string;
}
