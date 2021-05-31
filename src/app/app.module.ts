import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatBadgeModule} from '@angular/material/badge';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { UsersComponent } from './components/users/users.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './routerModule/routeModule';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import { LoginInComponent } from './components/login-in/login-in.component';
import { HomeComponent } from './components/home/home.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatMenuModule} from '@angular/material/menu';
import {  HoverDropDownDirective } from './directives/hover-drop-down.directive';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { AddTvshowComponent } from './components/add-tvshow/add-tvshow.component';
import {MatDialogModule} from '@angular/material/dialog';
import { TvEpisodesComponent } from './components/tv-episodes/tv-episodes.component';

import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';

import { AddGenreComponent } from './components/add-genre/add-genre.component';
import { ManageTVShowsComponent } from './components/manage-tvshows/manage-tvshows.component';
import { ManageEpisodeComponent } from './components/manage-episode/manage-episode.component';
import { MatTableResponsiveModule } from './directives/mat-table-responsive/mat-table-responsive.module';
import { ManageMoviesComponent } from './components/manage-movies/manage-movies.component';
import { AddMovieComponent } from './components/add-movie/add-movie.component';
import { DisableControlDirective } from './directives/disable-control.directive';
import { AddSeasonTvShowComponent } from './components/add-season-tv-show/add-season-tv-show.component';
import { ManageTrendingComponent } from './components/manage-trending/manage-trending.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { InterceptService } from './services/intercept.service';


@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    AppComponent,
    UsersComponent,
    LoginInComponent,
    HomeComponent,
    HoverDropDownDirective,
    AddTvshowComponent,
    TvEpisodesComponent,
    AddGenreComponent,
    ManageTVShowsComponent,
    ManageEpisodeComponent,
    ManageMoviesComponent,
    AddMovieComponent,
    DisableControlDirective,
    AddSeasonTvShowComponent,
    ManageTrendingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    MatToolbarModule,
    MatBadgeModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatCardModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatSelectModule,
    MatExpansionModule,
    MatMenuModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule, 
    MatSortModule,
    MatTableResponsiveModule,
    MatCheckboxModule
  ],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: {
          dateInput: ['l', 'LL'],
        },
        display: {
          dateInput: 'L',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'LL',
          monthYearA11yLabel: 'MMMM YYYY',
        },
      },
    },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
