export interface IStudent {
  studentIdentifier?: string;
  familyName?: string;
  givenNames?: string;
  gender?: string;
  yearLevel?: number;
  rollClass?: string;
  house?: string;
  attendance?: number;
  image?: string;
  results?: IResult[];
}

export class Student implements IStudent {
  constructor() {
    this.results = new Array<Result>();
  }

  studentIdentifier?: string;
  familyName?: string;
  givenNames?: string;
  gender?: string;
  yearLevel?: number;
  rollClass?: string;
  house?: string;
  indigenous?: boolean;
  disabilities?: boolean;
  attendance?: number;
  image?: string;
  results?: Result[];
}

export interface IResult {
  subject?: string;
  achievement?: string;
  previousAchievement?: string;
}

export class Result implements IResult {
  subject?: string;
  achievement?: string;
  previousAchievement?: string;
}
