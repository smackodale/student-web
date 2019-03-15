import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Result, Student } from 'app/models/student.model';
import { StudentService } from 'app/services/student.service';
import { find } from 'lodash';
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

  constructor(private domSanitizer: DomSanitizer, private studentService: StudentService) { }

  ngOnInit() { }

  upload(event: any) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      this.aStudent.image = btoa(data);

      this.studentService.saveStudents([this.aStudent]).subscribe(() => {
        this.loadImage();
      });
      this.fileUpload.clear();
    };

    reader.readAsBinaryString(file);
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
