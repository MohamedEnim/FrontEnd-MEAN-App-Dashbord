import { Component,  OnDestroy,  OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup,  Validators } from '@angular/forms';
import { Genre } from 'src/app/models/genre';
import { Movie } from 'src/app/models/movie';
import { AddMovieService } from 'src/app/services/add-movie.service';
import { GenresMoviesService } from 'src/app/services/genres-movies.service';
import { mimeType } from '../../validators/mine-type.validator';
import * as _moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {  of } from 'rxjs';
import { ComponontCanDeactivate } from 'src/app/models/componont-can-deactivate';




@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css'],
  providers: [

    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE]
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MAT_MOMENT_DATE_FORMATS
    },
  ],
})
export class AddMovieComponent implements OnInit, OnDestroy, ComponontCanDeactivate {

  @ViewChild('photoInput') photoInput;
  addForm: FormGroup;
  genres: Genre[] = [];
  imagePreview: string = null;
  mode = "create";
  movieId: string;
  movieToUpdate: Movie;
  isSubmited: boolean = false;
  isTrending: boolean = false;
  showActionProgress: boolean = false;

  constructor(private genresMoviesSErv: GenresMoviesService, private addMovieSErv: AddMovieService,
    private route: ActivatedRoute) { }



  ngOnInit(): void {

    this.addForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      genre: new FormControl([null], Validators.required),
      language:  new FormControl(null, Validators.required),
      contry: new FormControl(null, Validators.required),
      url: new FormControl(null, Validators.required),
      release: new FormControl(new Date(), Validators.required),
      duration: new FormControl(null, Validators.required),
      descriptionEN: new FormControl(null),
      descriptionAR: new FormControl(null),
      trending: new FormControl('false'),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.queryParamMap.pipe(switchMap((params: ParamMap) => {
      this.movieId = params.get('id');
      this.mode = params.get('mode');
      return this.genresMoviesSErv.getGenres();
    }), switchMap((genres: Genre[]) => {
      this.genres = genres;
      if(this.movieId !== null && this.mode !== null){
        this.mode = 'update';
        return this.addMovieSErv.getMoviesById(this.movieId);
      }else {
        this.mode = 'create';
        return of(null);
      }

    })).subscribe((data: any) => {
      if(this.mode === 'update'){
        this.movieToUpdate = data;
        let date = this.getStringToDate(this.movieToUpdate.movieReleaseDate);
        this.addForm.setValue({
          name: this.movieToUpdate.movieName,
          genre: this.movieToUpdate.movieGenres,
          language:  this.movieToUpdate.movieLanguage,
          contry: this.movieToUpdate.movieContry,
          url: this.movieToUpdate.movieUrl,
          release: new Date(parseInt(date.year), parseInt(date.month), parseInt(date.date)),
          duration: this.movieToUpdate.duration,
          descriptionEN: this.movieToUpdate.descriptionEN,
          descriptionAR: this.movieToUpdate.descriptionAR,
          trending: this.movieToUpdate.movieTrending,
          image: this.movieToUpdate.moviePoster
        });

        this.imagePreview = this.movieToUpdate.moviePoster;

      }else{
        this.addForm.reset();
    }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.addForm.patchValue({ image: file });
    this.addForm.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }


 clearPictureAttachment() {
  this.photoInput.nativeElement.value = '';
 }

 onNavigateToAllMovies(){
   this.addMovieSErv.onNavigateToAllMovies();
 }

  onSubmit(){
    this.showActionProgress = true;
    let descriptionEN = this.addForm.value.descriptionEN? this.addForm.value.descriptionEN : '';
    let descriptionAR = this.addForm.value.descriptionAR? this.addForm.value.descriptionAR : '';

  if(this.addForm.value.trending === null || this.addForm.value.trending === false){
    this.isTrending =  false
  }else{
    this.isTrending = true;
  }
    if (this.mode === "create") {
      const { date, month, year } = this.addForm.value.release._i;
      const dateTf = year  + ',' + month  +  ',' + date;
      let movie: Movie = {
        movieName: this.addForm.value.name,
        movieGenres: this.addForm.value.genre,
        movieLanguage: this.addForm.value.language,
        movieContry: this.addForm.value.contry,
        movieUrl: this.addForm.value.url,
        movieReleaseDate: dateTf,
        duration: this.addForm.value.duration,
        descriptionEN: descriptionEN,
        descriptionAR: descriptionAR,
        movieTrending: this.isTrending,
        moviePoster: this.addForm.value.image,
        createAt: this.addMovieSErv.getTimeStamp().toString(),
        updateAt: ''
      }
      this.isSubmited = true;
      this.addMovieSErv.addMovie(movie).subscribe((movie: Movie) => {
      this.showActionProgress = false;
      this.isSubmited = false;
      this.clearPictureAttachment();
      this.imagePreview = null;
      this.resetFormAddMovie(this.addForm);
     });
    } else {
      const yearUp = new Date(this.addForm.value.release.toString()).getFullYear();
      const dateUp = new Date(this.addForm.value.release.toString()).getDate();
      const monthUp = new Date(this.addForm.value.release.toString()).getMonth() + 1;
      const dateTf = yearUp  + ',' + monthUp  +  ',' + dateUp;
     let movie: Movie = {
       _id: this.movieToUpdate._id,
        movieName: this.addForm.value.name,
        movieGenres: this.addForm.value.genre,
        movieLanguage: this.addForm.value.language,
        movieContry: this.addForm.value.contry,
        movieUrl: this.addForm.value.url,
        movieReleaseDate:  dateTf,
        duration: this.addForm.value.duration,
        descriptionEN: descriptionEN,
        descriptionAR: descriptionAR,
        movieTrending: this.isTrending,
        moviePoster: this.addForm.value.image,
        createAt: this.movieToUpdate.createAt,
        updateAt: this.addMovieSErv.getTimeStamp().toString()
      }

      this.isSubmited = true;
      if(movie.moviePoster === this.movieToUpdate.moviePoster){
        this.addMovieSErv.updateMovieSamePoster(this.movieToUpdate._id, movie).subscribe((movie: Movie) => {
          this.showActionProgress = false;
          this.addMovieSErv.onNavigateToAllMovies();
        });
      }else{
        this.addMovieSErv.updateMovie(this.movieToUpdate._id, movie).subscribe((movie: Movie) => {
          this.showActionProgress = false;
          this.addMovieSErv.onNavigateToAllMovies();
        });
      }

    }
  }

  private resetFormAddMovie(formGroup: FormGroup) {
    this.addForm.reset();
    this.addForm.get('name').clearValidators();
    this.addForm.get('name').updateValueAndValidity();
    this.addForm.get('genre').clearValidators();
    this.addForm.get('genre').updateValueAndValidity();
    this.addForm.get('language').clearValidators();
    this.addForm.get('language').updateValueAndValidity();
    this.addForm.get('contry').clearValidators();
    this.addForm.get('contry').updateValueAndValidity();
    this.addForm.get('url').clearValidators();
    this.addForm.get('url').updateValueAndValidity();
    this.addForm.get('release').clearValidators();
    this.addForm.get('release').updateValueAndValidity();
    this.addForm.get('duration').clearValidators();
    this.addForm.get('duration').updateValueAndValidity();
    this.addForm.get('descriptionEN').clearValidators();
    this.addForm.get('descriptionEN').updateValueAndValidity();
    this.addForm.get('release').clearValidators();
    this.addForm.get('release').updateValueAndValidity();

    this.addForm.get('descriptionAR').clearValidators();
    this.addForm.get('descriptionAR').updateValueAndValidity();
  }

  canDeactivate(): boolean {
    if(this.mode === "create"){
      if(this.addForm.valid === true && this.isSubmited === false){
        return false;
      }else{
        return true;
      }
    }

    if(this.mode === "update"){
      if(this.addForm.valid === true && this.isSubmited === false){
        return true;
      }
      if(this.addForm.valid === true && this.isSubmited === true) {
        return true;
      }
    }


  }

  getStringToDate(dateStr: string){
    let date = {
     year: dateStr.split(',')[0],
     month: dateStr.split(',')[1],
     date: dateStr.split(',')[2],
   }
   return date
 }
  ngOnDestroy(): void {
  }

}



