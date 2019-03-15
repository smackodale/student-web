import { Injectable } from '@angular/core';
import { ImportStudent, Student } from 'app/models/student.model';
import { filter, find, uniq } from 'lodash';
import * as xlsx from 'xlsx';
import { isNumber } from 'util';

@Injectable({
  providedIn: 'root'
})
export class ImporterService {

  importStudents(data: any, error: (message: string) => void, success: (students: Student[]) => void): void {
    const workbook = xlsx.read(data, { type: 'binary' });

    // always work on the first sheet
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

    // build a list of column definitions
    const colDef = new Array<ColumnDef>();
    let columnFound = true;
    let colIndex = 0;
    while (columnFound) {
      const column = this.numToAlpha(colIndex);
      const cell = firstSheet[column + '1'];

      if (!!cell && !!cell.v) {
        colDef.push({ col: column, name: cell.v });
        columnFound = true;
        colIndex++;
      } else {
        columnFound = false;
      }
    }

    if (!this.getColDef('student id', colDef)) {
      error('A student identifier column must be provided (Student Id)');
      return null;
    }

    const students = new Array<ImportStudent>();

    // populate import students
    let rowFound = true;
    let rowIndex = 2;
    while (rowFound) {
      const student = this.getStudent(colDef, rowIndex, firstSheet);
      if (!!student) {
        students.push(student);
        rowFound = true;
        rowIndex++;
      } else {
        rowFound = false;
      }
    }

    // transform students to correct dataset
    const convertedStudents = new Array<Student>();
    const studentIds = uniq(students.map((val: ImportStudent) => val.studentIdentifier));

    studentIds.forEach((id: string) => {
      const sameStudents = filter(students, (student: ImportStudent) => student.studentIdentifier === id);
      const convertedStudent = sameStudents[0].toStudent();

      sameStudents.forEach((student: ImportStudent) => {
        convertedStudent.results.push({
          subject: student.subject,
          achievement: student.achievement,
          previousAchievement: student.previousAchievement
        });
      });

      convertedStudents.push(convertedStudent);
    });

    success(convertedStudents);
  }

  private getStudent(colDef: ColumnDef[], row: number, worksheet: xlsx.WorkSheet): ImportStudent {
    // check first cell for something
    if (!worksheet['A' + row] || !worksheet['A' + row].v) {
      return null;
    }

    const student = new ImportStudent({
      studentIdentifier: this.getCellValue(this.getColDef('student id', colDef), row, worksheet) as string,
      familyName: this.getCellValue(this.getColDef('family name', colDef), row, worksheet) as string,
      givenNames: this.getCellValue(this.getColDef('given names', colDef), row, worksheet) as string,
      gender: this.getCellValue(this.getColDef('gender', colDef), row, worksheet) as string,
      yearLevel: this.getCellValue(this.getColDef('year level', colDef), row, worksheet) as number,
      rollClass: this.getCellValue(this.getColDef('roll class', colDef), row, worksheet) as string,
      house: this.getCellValue(this.getColDef('house', colDef), row, worksheet) as string,
      indigenous: this.toBool(this.getCellValue(this.getColDef('indigenous', colDef), row, worksheet)),
      disabilities: this.toBool(this.getCellValue(this.getColDef('disabilities', colDef), row, worksheet)),
      attendance: this.getCellValue(this.getColDef('attendance', colDef), row, worksheet) as number,
      subject: this.getCellValue(this.getColDef('subject id', colDef), row, worksheet) as string,
      achievement: this.getCellValue(this.getColDef('achievement', colDef), row, worksheet) as string,
      previousAchievement: this.getCellValue(this.getColDef('previous achievement', colDef), row, worksheet) as string
    });

    this.transformStudent(student);

    return student;
  }

  private toBool(value: any): boolean {
    if (!!value) {
      let stringValue = value;
      if (isNumber(value)) {
        stringValue = value.toString();
      }
      stringValue = stringValue.toLowerCase();
      if (stringValue === 'y' || stringValue === 'yes' || stringValue === 'true' || stringValue === 't' || stringValue === '1') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  private getCellValue(colDef: string, row: number, worksheet: xlsx.WorkSheet): any {
    if (!colDef) {
      return null;
    }
    const cell = worksheet[colDef + row];

    if (!cell) {
      return null;
    }

    return cell.v;
  }

  private getColDef(colName: string, colDef: ColumnDef[]): string {
    const col = find(colDef, (val: ColumnDef) => val.name.toLowerCase() === colName);
    if (!!col) {
      return col.col;
    }

    return null;
  }

  private numToAlpha(num: number): string {
    let alpha = '';

    for (; num >= 0; num = num / 26 - 1) {
      alpha = String.fromCharCode(num % 26 + 0x41) + alpha;
    }

    return alpha;
  }

  private transformStudent(student: ImportStudent): void {
    // this is due to attendance being a percentage
    if (student.attendance != null && student.attendance < 1) {
      student.attendance = student.attendance * 100;
    }

    // import changes int to string
    if (isNumber(student.studentIdentifier)) {
      student.studentIdentifier = student.studentIdentifier.toString();
    }
  }


}

class ColumnDef {
  col: string;
  name: string;
}
