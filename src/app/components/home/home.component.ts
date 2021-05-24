import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Genre } from 'src/app/models/genre';
import { AddMovieService } from 'src/app/services/add-movie.service';
import { GenresMoviesService } from 'src/app/services/genres-movies.service';
import { TvShowService } from 'src/app/services/tv-show.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild(MatMenuTrigger) menuTrigger: MatMenuTrigger;
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  title = 'dashboard';

  genres: Genre[] = [];
  
  open(menu){
    menu.openMenu();
    }
  closeMenu() {
    this.menuTrigger.closeMenu();
  }
 
  constructor(private observer: BreakpointObserver, private router: Router,
     private genresMoviesSErv: GenresMoviesService, private addMovieSErv: AddMovieService,
     private tvShowSErv: TvShowService) {}
  ngOnInit(){
    this.genresMoviesSErv.getGenres().subscribe((genres: Genre[]) => {
      this.genres = genres;
      console.log( this.genres);
    });
  }

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = 'over';
        this.sidenav.close();
      } else {
        this.sidenav.mode = 'side';
        this.sidenav.open();
      }
    });
  }

  onNavigateToAddMovie(){
      this.addMovieSErv.onNavigateToAddMovie();
  }

  onNavigateToAddTVShow(){
    this.router.navigateByUrl("home/addTVShow");
}

  onGetGenreMovies(id: string, name: string){
    this.addMovieSErv.getMoviesByGenre(id, name);
    this.router.navigate(["/home/movies"], {queryParams: {id: id ,genre: name}});
  }

  onLogout(){
    this.router.navigateByUrl("login")
  }

  onShowMovies(){
     this.addMovieSErv.getMovies();
     this.router.navigate(["/home/allMovies"]);
  }

  onShowTVShows(){
   // this.tvShowSErv.getTVShows();
    this.router.navigate(["/home/allTVShows"]);
  }

  onShowTVEpisodes(){
    this.router.navigate(["/home/allTVEpisodes"]);
  }

  onNavigateToAddGenre(){
    this.router.navigate(["/home/addGenre"]);
  }

  onShowGenres(){
    this.router.navigate(["/home/manageGenre"]);
  }
}
