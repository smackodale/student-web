export class Student {
  constructor() {
    this.results = new Array<Result>();
  }

  studentIdentifier: string;
  familyName: string;
  givenNames: string;
  gender: string;
  yearLevel: number;
  rollClass: string;
  house: string;
  attendance: number;
  image: string;
  results: Result[];
}

export class Result {
  subject: string;
  achievement: string;
}
