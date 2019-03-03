export class Student {
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

  constructor(init?: Partial<Student>) {
    Object.assign(this, init);
    this.results = new Array<Result>();
  }
}

export class Result {
  subject?: string;
  achievement?: string;
  previousAchievement?: string;
}

export class ImportStudent {
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
  subject?: string;
  achievement?: string;
  previousAchievement?: string;

  constructor(init?: Partial<ImportStudent>) {
    Object.assign(this, init);
  }

  toStudent(): Student {
    const student = new Student({
      studentIdentifier: this.studentIdentifier,
      familyName: this.familyName,
      givenNames: this.givenNames,
      gender: this.gender,
      yearLevel: this.yearLevel,
      rollClass: this.rollClass,
      house: this.house,
      indigenous: this.indigenous,
      disabilities: this.disabilities,
      attendance: this.attendance
    });

    return student;
  }
}
