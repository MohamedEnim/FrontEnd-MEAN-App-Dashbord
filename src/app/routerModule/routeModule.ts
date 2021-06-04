import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageEpisodeComponent } from '../components/manage-episode/manage-episode.component';
import { AddGenreComponent } from '../components/add-genre/add-genre.component';
import { AddTvshowComponent } from '../components/add-tvshow/add-tvshow.component';
import { HomeComponent } from '../components/home/home.component';
import { LoginInComponent } from '../components/login-in/login-in.component';
import { ManageTVShowsComponent } from '../components/manage-tvshows/manage-tvshows.component';
import { ManageMoviesComponent } from '../components/manage-movies/manage-movies.component';
import { AddMovieComponent } from '../components/add-movie/add-movie.component';
import { CheckFormGuard } from '../guards/check-form.guard';
import { TvEpisodesComponent } from '../components/tv-episodes/tv-episodes.component';
import { AddSeasonTvShowComponent } from '../components/add-season-tv-show/add-season-tv-show.component';
import { ManageTrendingComponent } from '../components/manage-trending/manage-trending.component';
import { AuthGuardGuard } from '../guards/auth-guard.guard';





const appRoutes: Routes =
[
    { path: 'home', component: HomeComponent , canActivate: [AuthGuardGuard] , children: [
        { path: 'addMovie', component: AddMovieComponent, canDeactivate: [CheckFormGuard] }, 
        { path: 'addTVShow', component: AddTvshowComponent, canDeactivate: [CheckFormGuard]  },
        { path: 'addGenre', component: AddGenreComponent, canDeactivate: [CheckFormGuard]  },
        { path: 'addEpisode', component: TvEpisodesComponent, canDeactivate: [CheckFormGuard]  },
        { path: 'addSeason', component:  AddSeasonTvShowComponent, canDeactivate: [CheckFormGuard] },
       

        { path: 'allMovies', component: ManageMoviesComponent },
       // { path: 'movies', component: FeedComponent },
        { path: 'allTrending', component: ManageTrendingComponent },
        { path: 'allTVShows', component:  ManageTVShowsComponent },
        { path: 'allTVEpisodes', component:  ManageEpisodeComponent },
    ] },
   
    { path: 'login', component: LoginInComponent },
    { path: '',   redirectTo: '/login', pathMatch: 'full' }
 
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