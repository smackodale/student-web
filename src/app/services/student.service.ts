import { Injectable } from '@angular/core';
import { Student } from 'app/models/student.model';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private dataService: DataService) { }

  public saveStudents(students: Student[]): Observable<any> {
    return this.dataService.post<Student[], any>('students', students);
  }

  public getStudents(): Observable<Student[]> {
    return this.dataService.get<Student[]>('students');
  }

  public deleteStudent(studentId: string): Observable<any> {
    return this.dataService.delete(`students/${studentId}`);
  }
}
