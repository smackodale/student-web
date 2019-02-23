import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SidebarModule } from 'primeng/sidebar';
import { AppRoutingModule } from './app-routing.module';
import { AppStudentCardComponent } from './app-student-card/app-student-card.component';
import { AppSwimLaneComponent } from './app-swim-lane/app-swim-lane.component';
import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
    AppStudentCardComponent,
    AppSwimLaneComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SidebarModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
