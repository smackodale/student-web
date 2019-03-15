import { Component, OnInit, Input } from '@angular/core';
import { Student } from 'app/models/student.model';

@Component({
  selector: 'app-app-swim-lane',
  templateUrl: './app-swim-lane.component.html',
  styleUrls: ['./app-swim-lane.component.scss']
})
export class AppSwimLaneComponent implements OnInit {

  @Input() students: Student[];
  @Input() laneType: string;
  @Input() subject: string;

  constructor() { }

  ngOnInit() {
  }

}
