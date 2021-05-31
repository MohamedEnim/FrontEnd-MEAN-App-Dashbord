import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Genre } from 'src/app/models/genre';
import { AddMovieService } from 'src/app/services/add-movie.service';
import { AuthService } from 'src/app/services/auth.service';
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
  userImage: string = '../../../assets/userImg.png';
  isSideBarOpen: boolean = false;
  iSideBarClose: boolean = true;

  genres: Genre[] = [];
  
  open(menu){
    this.isSideBarOpen = true;
    this.iSideBarClose = true;
   
    menu.openMenu();
    }
onToggle(){
  this.isSideBarOpen = !this.isSideBarOpen;
  return this.sidenav.toggle()
}
  closeMenu() {
    this.isSideBarOpen = false;
    this.iSideBarClose = false;
    console.log("helooo")
    this.menuTrigger.closeMenu();
  }
 
  constructor(private observer: BreakpointObserver, private router: Router,
     private genresMoviesSErv: GenresMoviesService, private addMovieSErv: AddMovieService,
     private tvShowSErv: TvShowService, private authSErv: AuthService) {}

  ngOnInit(){
    console.log(this.isSideBarOpen);
    
    this.genresMoviesSErv.getGenres().subscribe((genres: Genre[]) => {
      this.genres = genres;
    });
  }

  ngAfterViewInit() {
    this.observer.observe(['(max-width: 800px)']).subscribe((res) => {
      console.log(res.matches);
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

 /* onGetGenreMovies(id: string, name: string){
    this.addMovieSErv.getMoviesByGenre(id, name);
    this.router.navigate(["/home/movies"], {queryParams: {id: id ,genre: name}});
  }*/

  onLogout(){
    this.authSErv.logout();
  }

  onShowMovies(){
     this.addMovieSErv.getMovies();
     this.router.navigate(["/home/allMovies"]);
  }

  onShowTVShows(){
   // this.tvShowSErv.getTVShows();
    this.router.navigate(["/home/allTVShows"]);
  }

 /* onShowTVEpisodes(){
    this.router.navigate(["/home/allTVEpisodes"]);
  }*/

  onNavigateToAddGenre(){
    this.router.navigate(["/home/addGenre"]);
  }

  onShowTrending(){
    this.router.navigate(["/home/allTrending"]);
  }
}
