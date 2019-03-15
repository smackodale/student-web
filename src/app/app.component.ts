import { Component, OnInit, ViewChild } from '@angular/core';
import { filter, find, some, uniq, uniqBy } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FilterValue, StudentFilter } from './models/student-filter.model';
import { StudentSubject } from './models/student-subject.model';
import { Result, Student } from './models/student.model';
import { ImporterService } from './services/importer.service';
import { StudentService } from './services/student.service';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private allStudents: Student[];

  showSidebar: false;
  filters: StudentFilter[];
  subjects: StudentSubject[];

  highStudents: Student[];
  mediumStudents: Student[];
  lowStudents: Student[];

  selectedFilter: StudentFilter;
  selectedSubject: StudentSubject;

  @ViewChild(FileUpload) fileUpload: FileUpload;

  constructor(
    private studentService: StudentService,
    private confirmService: ConfirmationService,
    private messageService: MessageService,
    private importerService: ImporterService) { }

  ngOnInit() {
    this.refreshStudents();
  }

  performFilter(): void {
    this.updateStudentLists();
  }

  clearFilter(): void {
    this.filters.forEach((studentFilter: StudentFilter) => studentFilter.values.forEach((value: FilterValue) => value.selected = false));
    this.updateStudentLists();
  }

  changeSubject(): void {
    this.updateStudentLists();
  }

  import(event: any): void {
    this.showSidebar = false;
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      this.importerService.importStudents(data,
        (message: string) => {
          this.messageService.add({ severity: 'warn', summary: 'Import Failed', detail: message });
        },
        (students: Student[]) => {
          this.studentService.saveStudents(students).subscribe(() => {
            this.messageService.add({ severity: 'info', summary: 'Students Updated', detail: 'Student records have been updated.' });

            this.refreshStudents();
          });
        });
      this.fileUpload.clear();
    };

    reader.readAsBinaryString(file);
  }

  deleteAll(): void {
    this.showSidebar = false;

    this.confirmService.confirm({
      message: 'Do you want to delete all student records? NOTE: You will need to re-import to continue to use this tool.',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.studentService.deleteAllStudents().subscribe(() => {
          this.messageService.add({ severity: 'warn', summary: 'Records Deleted', detail: 'All student records have been deleted.' });

          this.refreshStudents();
        });
      },
      reject: () => {

      }
    });
  }

  private refreshStudents() {
    this.studentService.getStudents()
      .subscribe((students: Student[]) => {
        this.allStudents = students;

        this.filters = this.constructFilters(students);
        if (this.filters.length > 0) {
          this.selectedFilter = this.filters[0];
        }

        this.subjects = this.constructSubjects(students);
        if (this.subjects.length > 0) {
          this.selectedSubject = this.subjects[0];
        }

        this.updateStudentLists();
      });
  }

  private updateStudentLists() {
    // filter students by subject
    const students = filter(this.allStudents, (student: Student) => {
      if (!!student.results) {
        return some(student.results, (result: Result) => result.subject === this.selectedSubject.name);
      }
      return false;
    });

    let filteredStudents = new Array<Student>();

    // get selected filters
    const filters = filter(this.filters, (studentFilter: StudentFilter) => some(studentFilter.values, (value: FilterValue) => value.selected));

    // add all students where passes
    filters.forEach((studentFilter: StudentFilter) => {
      const selectedValues = filter(studentFilter.values, (value: FilterValue) => value.selected);

      switch (studentFilter.name) {
        case 'Gender':
          filteredStudents.push(...filter(students, (student: Student) => some(selectedValues, (value: FilterValue) => value.name === student.gender)));
          break;
        case 'Disabilities':
          filteredStudents.push(...filter(students, (student: Student) => some(selectedValues, (value: FilterValue) => (value.name === 'Yes' ? true : false) === student.disabilities)));
          break;
        case 'Indigenous':
          filteredStudents.push(...filter(students, (student: Student) => some(selectedValues, (value: FilterValue) => (value.name === 'Yes' ? true : false) === student.indigenous)));
          break;
        case 'Year Level':
          filteredStudents.push(...filter(students, (student: Student) => some(selectedValues, (value: FilterValue) => parseInt(value.name) === student.yearLevel)));
          break;
        case 'Roll Class':
          filteredStudents.push(...filter(students, (student: Student) => some(selectedValues, (value: FilterValue) => value.name === student.rollClass)));
          break;
        case 'Attendance':
          filteredStudents.push(...filter(students, (student: Student) => some(selectedValues, (value: FilterValue) => eval(student.attendance.toString() + ' ' + value.name))));
          break;
      }
    });

    filteredStudents = uniqBy(filteredStudents, (student: Student) => student.studentIdentifier);

    this.sortStudents(filteredStudents);
  }

  private sortStudents(students: Student[]) {
    this.highStudents = filter(students, (student: Student) => {
      const achievement = find(student.results, (result: Result) => result.subject === this.selectedSubject.name).achievement.toUpperCase();
      return achievement === 'A' || achievement === 'B';
    });

    this.mediumStudents = filter(students, (student: Student) => {
      const achievement = find(student.results, (result: Result) => result.subject === this.selectedSubject.name).achievement.toUpperCase();
      return achievement === 'C';
    });

    this.lowStudents = filter(students, (student: Student) => {
      const achievement = find(student.results, (result: Result) => result.subject === this.selectedSubject.name).achievement.toUpperCase();
      return achievement !== 'A' && achievement !== 'B' && achievement !== 'C';
    });
  }


  private constructFilters(students: Student[]): StudentFilter[] {
    const filters = new Array<StudentFilter>();

    filters.push({
      name: 'Gender',
      values: uniq(students.map(x => x.gender)).map(x => { return { name: x, selected: false } as FilterValue })
    });
    filters.push({
      name: 'Disabilities',
      values: uniq(students.map(x => x.disabilities ? 'Yes' : 'No')).map(x => { return { name: x, selected: false } as FilterValue })
    });
    filters.push({
      name: 'Indigenous',
      values: uniq(students.map(x => x.indigenous ? 'Yes' : 'No')).map(x => { return { name: x, selected: false } as FilterValue })
    });
    filters.push({
      name: 'Year Level',
      values: uniq(students.map(x => x.yearLevel.toString())).map(x => { return { name: x, selected: false } as FilterValue })
    });
    filters.push({
      name: 'Roll Class',
      values: uniq(students.map(x => x.rollClass)).map(x => { return { name: x, selected: false } as FilterValue })
    });
    filters.push({
      name: 'Attendance',
      values: ['> 95', '> 90', '> 85', '> 80', '> 70', '> 60', '> 50', '< 95', '< 90', '< 85', '< 80', '< 70', '< 60', '< 50']
        .map(x => { return { name: x, selected: false } as FilterValue })
    });

    return filters;
  }

  private constructSubjects(students: Student[]): StudentSubject[] {
    const subjects = new Array<StudentSubject>();

    students.forEach((student: Student) => {
      if (!!student.results) {
        subjects.push(...student.results.map((result: Result) => {
          return { name: result.subject };
        }));
      }
    })

    return uniqBy(subjects, (subject: StudentSubject) => subject.name);
  }

}
