import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Result, Student } from 'app/models/student.model';
import { StudentService } from 'app/services/student.service';
import { find } from 'lodash';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-student-card',
  templateUrl: './app-student-card.component.html',
  styleUrls: ['./app-student-card.component.scss']
})
export class AppStudentCardComponent implements OnInit {
  aStudent: Student;
  aSubject: string;
  base64Image: SafeUrl;

  @ViewChild(FileUpload) fileUpload: FileUpload;

  @Input() set student(value: Student) {
    this.aStudent = value;
    this.populateResults();
  }
  @Input() set subject(value: string) {
    this.aSubject = value;
    this.populateResults();
  }

  previousResult: string;
  currentResult: string;

  constructor(private domSanitizer: DomSanitizer, private studentService: StudentService, private confirmService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit() { }

  upload(event: any) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      this.aStudent.image = btoa(data);

      this.studentService.saveStudents([this.aStudent]).subscribe(() => {
        this.messageService.add({ severity: 'info', summary: 'Image Updated', detail: `Image updated for ${this.aStudent.givenNames + ' ' + this.aStudent.familyName}.` });
        this.loadImage();
      });
      this.fileUpload.clear();
    };

    reader.readAsBinaryString(file);
  }

  delete() {
    this.confirmService.confirm({
      message: `Do you want to delete this student record for ${this.aStudent.givenNames + ' ' + this.aStudent.familyName}? WARNING: This cannot be undone!.`,
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.studentService.deleteStudent(this.aStudent.studentIdentifier).subscribe(() => {
          this.messageService.add({ severity: 'warn', summary: 'Record Deleted', detail: `${this.aStudent.givenNames + ' ' + this.aStudent.familyName} has been deleted. You will need to refresh for changes to take effect!` });
        });
      },
      reject: () => { }
    });
  }

  private populateResults() {
    if (!!this.aSubject && !!this.aStudent) {
      const subjectResult = find(this.aStudent.results, (result: Result) => result.subject === this.aSubject);

      if (!!subjectResult) {
        this.previousResult = subjectResult.previousAchievement;
        this.currentResult = subjectResult.achievement;
      }

      this.loadImage();
    }
  }

  private loadImage() {
    if (!!this.aStudent && !!this.aStudent.image) {
      // show image
      this.base64Image = this.domSanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + this.aStudent.image);
    }
  }
}
