import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { SidebarModule } from 'primeng/sidebar';
import { ToastModule } from 'primeng/toast';
import { AppRoutingModule } from './app-routing.module';
import { AppSwimLaneComponent } from './app-swim-lane/app-swim-lane.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
    AppSwimLaneComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule,
    SidebarModule,
    CardModule,
    BrowserAnimationsModule,
    ButtonModule,
    CheckboxModule,
    DropdownModule,
    ConfirmDialogModule,
    ToastModule,
    FileUploadModule
  ],
  providers: [ConfirmationService, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
