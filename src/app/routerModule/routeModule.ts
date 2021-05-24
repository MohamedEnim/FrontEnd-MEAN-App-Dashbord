import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageEpisodeComponent } from '../components/manage-episode/manage-episode.component';
import { AddGenreComponent } from '../components/add-genre/add-genre.component';
import { AddTvshowComponent } from '../components/add-tvshow/add-tvshow.component';
import { AddComponent } from '../components/add/add.component';
import { FeedComponent } from '../components/feed/feed.component';
import { HomeComponent } from '../components/home/home.component';
import { LoginInComponent } from '../components/login-in/login-in.component';
import { ManageGenreComponent } from '../components/manage-genre/manage-genre.component';
import { ManageTVShowsComponent } from '../components/manage-tvshows/manage-tvshows.component';





const appRoutes: Routes =
[
    { path: 'home', component: HomeComponent , children: [
        { path: 'addMovie', component: AddComponent }, 
        { path: 'addTVShow', component: AddTvshowComponent },
        { path: 'addGenre', component: AddGenreComponent },
        { path: 'allMovies', component: FeedComponent },
        { path: 'movies', component: FeedComponent },
        { path: 'manageGenre', component: ManageGenreComponent },
        { path: 'allTVShows', component:  ManageTVShowsComponent },
        { path: 'allTVEpisodes', component:  ManageEpisodeComponent },
    ] },
   
    { path: 'login', component: LoginInComponent },
    { path: '',   redirectTo: '/home', pathMatch: 'full' }
 
];

@NgModule({
    imports: [
  
      RouterModule.forRoot(appRoutes)
    ],
    exports: [
        RouterModule
    ] 
})

 export class AppRoutingModule {}