import { AfterViewInit, Component,  OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Genre } from 'src/app/models/genre';
import { Movie } from 'src/app/models/movie';
import { AddMovieService } from 'src/app/services/add-movie.service';
import { GenresMoviesService } from 'src/app/services/genres-movies.service';
import { DetailsComponent } from '../details/details.component';

@Component({
  selector: 'app-manage-trending',
  templateUrl: './manage-trending.component.html',
  styleUrls: ['./manage-trending.component.css']
})
export class ManageTrendingComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort; 

  displayedColumns: string[] = ['movieName', 'movieReleaseDate', 'movieGenres', 'movieUrl',  'createAt', 'updateAt', 'actions'];
  dataSource: MatTableDataSource<Movie>;
  movies: Movie[] = [];
  sendMoviesSub: Subscription;
  genreId: string;
  genreName: string;
  length: number;
  pageSize: number = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100]

  constructor(private addMovieSErv: AddMovieService, private route: ActivatedRoute, public dialog: MatDialog) { }

  ngOnInit(): void {
    
  this.addMovieSErv.getTrendingMovies().subscribe((movies: Movie[]) => {
    movies.forEach(movie => {
      movie.movieReleaseDate = this.getYear(movie.movieReleaseDate);
    });
    this.movies = movies;
    this.length = this.movies.length;
    this.dataSource = new MatTableDataSource<Movie>(movies);
    this.dataSource.paginator = this.paginator;
 //   this.dataSource.sort = this.sort;
  });
   this.sendMoviesSub = this.addMovieSErv.sendMovies.subscribe((movies: Movie[]) =>{
    movies.forEach(movie => {
      movie.movieReleaseDate = this.getYear(movie.movieReleaseDate);
    });
    this.movies = movies;
    this.dataSource = new MatTableDataSource<Movie>(movies);
    this.dataSource.paginator = this.paginator;
   // this.dataSource.sort = this.sort;
    });
  }


  tableToString(genres: [string]){
    let genresSTR: string = '';
    for(let genre of genres){
      genresSTR += genre + ', ';
    }
   let editGenresSTR = genresSTR.slice(0, -2);
    return editGenresSTR;
  }

  onUpdateMovie(movieId: string){
    this.addMovieSErv.onUpdateMovie(movieId);
  }

  onRemoveMovie(movieId: string){
    this.addMovieSErv.onRemoveMovie(movieId);
    
  }

  onNavigateToAddMovie(){
    this.addMovieSErv.onNavigateToAddMovie();
  }

  getYear(date: string){
    return date.split(',')[0];
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  sortData(sort: Sort): void {
    if (sort.direction === '') {
      this.dataSource.data = this.movies;
      return;
    }

    const sortedData = this.movies.slice();
    sortedData.sort(
      (a: Movie, b: Movie) => sort.direction === 'asc'
        ? _sortAlphanumeric(a[sort.active], b[sort.active])
        : _sortAlphanumeric(b[sort.active], a[sort.active])
    );
    this.dataSource.data = sortedData;
  }

  onMovieDetails(movie: Movie){
    let dialogRef = this.dialog.open(DetailsComponent, {
      height: '600px',
      width: '800px',
      data: {
        model: movie,
        type: 'movie'
      }
    });
  }

  ngOnDestroy(){
    this.sendMoviesSub.unsubscribe();
  }

}

function _sortAlphanumeric(a: string, b: string): number {
  return a.localeCompare(b, 'en', { numeric: true });
  }
