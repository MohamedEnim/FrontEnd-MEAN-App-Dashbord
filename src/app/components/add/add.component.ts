import { Component,  OnInit } from '@angular/core';
import { FormControl, FormGroup,  Validators } from '@angular/forms';
import { Genre } from 'src/app/models/genre';
import { Movie } from 'src/app/models/movie';
import { AddMovieService } from 'src/app/services/add-movie.service';
import { GenresMoviesService } from 'src/app/services/genres-movies.service';
import { mimeType } from '../../validators/mine-type.validator';
import * as _moment from 'moment';
//import { default as _rollupMoment } from 'moment';

import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import {  of } from 'rxjs';



const moment = _moment; //_rollupMoment || _moment;

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
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
export class AddComponent implements OnInit {
  
  addForm: FormGroup;
  genres: Genre[] = [];
  imagePreview: string;
  private mode = "create";
  movieId: string;
  movieToUpdate: Movie;
 

  constructor(private genresMoviesSErv: GenresMoviesService, private addMovieSErv: AddMovieService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.addForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      genre: new FormControl([null], Validators.required),      
      language:  new FormControl(null, Validators.required),
      contry: new FormControl(null, Validators.required),
      url: new FormControl(null, Validators.required),
      release: new FormControl(moment([null]), Validators.required),
      duration: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
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
      console.log(this.mode);
      if(this.mode === 'update'){
        this.movieToUpdate = data;
        this.addForm.setValue({
          name: this.movieToUpdate.movieName,
          genre: this.movieToUpdate.movieGenres,      
          language:  this.movieToUpdate.movieLanguage,
          contry: this.movieToUpdate.movieContry,
          url: this.movieToUpdate.movieUrl,
          release: moment(this.movieToUpdate.movieReleaseDate),
          duration: this.movieToUpdate.movieDuration,
          description: this.movieToUpdate.movieDescription,
          image: this.movieToUpdate.moviePoster
        });
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


  onSubmit(){
    if (this.mode === "create") {
      let movie: Movie = {
        movieName: this.addForm.value.name,
        movieGenres: this.addForm.value.genre,
        movieLanguage: this.addForm.value.language,
        movieContry: this.addForm.value.contry,
        movieUrl: this.addForm.value.url,
        movieReleaseDate: this.addForm.value.release.format("DD/MM/YYYY/hh.mm.ss"),
        movieDuration: this.addForm.value.duration,
        movieDescription: this.addForm.value.description,
        moviePoster: this.addForm.value.image,
        movieSubmitDate: this.addMovieSErv.getTimeStamp().toString(),
        movieUpdateDate: ''
      }
     this.addMovieSErv.addMovie(movie);
    } else {
     let movie: Movie = {
       _id: this.movieToUpdate._id,
        movieName: this.addForm.value.name,
        movieGenres: this.addForm.value.genre,
        movieLanguage: this.addForm.value.language,
        movieContry: this.addForm.value.contry,
        movieUrl: this.addForm.value.url,
        movieReleaseDate: this.addForm.value.release.format("DD/MM/YYYY/hh.mm.ss"),
        movieDuration: this.addForm.value.duration,
        movieDescription: this.addForm.value.description,
        moviePoster: this.addForm.value.image,
        movieSubmitDate: this.movieToUpdate.movieSubmitDate,
        movieUpdateDate: this.addMovieSErv.getTimeStamp().toString()
      }
      if(movie.moviePoster === this.movieToUpdate.moviePoster){
        this.addMovieSErv.updateMovieSamePoster(this.movieToUpdate._id, movie);
      }else{
        this.addMovieSErv.updateMovie(this.movieToUpdate._id, movie);
      }
     
    }
    this.resetFormAdd(this.addForm);
    
  }
  
  private resetFormAdd(formGroup: FormGroup) {
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
    this.addForm.get('description').clearValidators();
    this.addForm.get('description').updateValueAndValidity();
  //  this.addForm.get('image').clearValidators();
   // this.addForm.get('image').updateValueAndValidity();
  }

}
