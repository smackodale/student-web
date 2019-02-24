import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Student } from './models/student.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  showSidebar: false;
  private allStudents: Observable<Student[]>;

  highStudents: Observable<Student[]>;
  mediumStudents: Observable<Student[]>;
  lowStudents: Observable<Student[]>;

  constructor() { }

  ngOnInit() {
    const students = new Array<Student>();
    students.push(
      {
        studentIdentifier: '121331D',
        familyName: 'Cahill',
        givenNames: 'Dale',
        gender: 'M',
        yearLevel: 5,
        rollClass: '5D',
        house: 'Eagles',
        attendance: 95.46,
        image: null,
        results: [
          {
            subject: 'Maths',
            achievement: 'C'
          },
          {
            subject: 'English',
            achievement: 'A'
          },
          {
            subject: 'Science',
            achievement: 'C'
          }
        ]
      },
      {
        studentIdentifier: '1232D1D',
        familyName: 'Peterson',
        givenNames: 'Bill',
        gender: 'M',
        yearLevel: 5,
        rollClass: '5D',
        house: 'Eagles',
        attendance: 95.46,
        image: null,
        results: [
          {
            subject: 'Maths',
            achievement: 'B'
          },
          {
            subject: 'English',
            achievement: 'D'
          },
          {
            subject: 'Science',
            achievement: 'A'
          }
        ]
      },
      {
        studentIdentifier: '122232D1D',
        familyName: 'Aaran',
        givenNames: 'Hooty',
        gender: 'M',
        yearLevel: 5,
        rollClass: '5D',
        house: 'Eagles',
        attendance: 95.46,
        image: null,
        results: [
          {
            subject: 'Maths',
            achievement: 'B'
          },
          {
            subject: 'English',
            achievement: 'A'
          },
          {
            subject: 'Science',
            achievement: 'A'
          }
        ]
      });

    this.highStudents = of(students);
    this.mediumStudents = of(students);
    this.lowStudents = of(students);
  }

}
