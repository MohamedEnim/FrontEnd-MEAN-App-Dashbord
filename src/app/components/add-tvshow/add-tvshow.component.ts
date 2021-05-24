import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Genre } from 'src/app/models/genre';
import { TVShow } from 'src/app/models/tvShow';
import { GenresMoviesService } from 'src/app/services/genres-movies.service';
import { TvShowService } from 'src/app/services/tv-show.service';
import { mimeType } from 'src/app/validators/mine-type.validator';
import { TvEpisodesComponent } from '../tv-episodes/tv-episodes.component';
import * as _moment from 'moment';
//import { default as _rollupMoment } from 'moment';

const moment = _moment; //_rollupMoment || _moment;

@Component({
  selector: 'app-add-tvshow',
  templateUrl: './add-tvshow.component.html',
  styleUrls: ['./add-tvshow.component.css']
})
export class AddTvshowComponent implements OnInit {

  addTVShowForm: FormGroup;
  imagePreview: string;
  genres: Genre[] = [];
  private mode = "create";
  tvShowId: string;
  tvShowToUpdate: TVShow;

  constructor(private genresMoviesSErv: GenresMoviesService, private addTVShowSErv: TvShowService,
    public dialog: MatDialog, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.addTVShowForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      genre: new FormControl(null, Validators.required),
      language:  new FormControl(null, Validators.required),
      contry: new FormControl(null, Validators.required),
      season: new FormControl(null, Validators.required),
      release: new FormControl(null, Validators.required),
      episode: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.queryParamMap.pipe(switchMap((params: ParamMap) => {
      this.tvShowId = params.get('id');
      this.mode = params.get('mode');
      return this.genresMoviesSErv.getGenres();
    }), switchMap((genres: Genre[]) => {
      this.genres = genres;
      if(this.tvShowId !== null && this.mode !== null){
        this.mode = 'update';
        return this.addTVShowSErv.getTVShowById(this.tvShowId);   // TO DO 
      }else {
        this.mode = 'create';
        return of(null);
      }

    })).subscribe((data: any) => {
      if(this.mode === 'update'){
        this.tvShowToUpdate = data;
        this.addTVShowForm.setValue({
          name: this.tvShowToUpdate.tvShowName,
          genre: this.tvShowToUpdate.tvShowGenres,      
          language:  this.tvShowToUpdate.tvShowLanguage,
          contry: this.tvShowToUpdate.tvShowContry,
          season: this.tvShowToUpdate.tvShowSeason,
          release: moment(this.tvShowToUpdate.tvShowReleaseDate),
          episode: this.tvShowToUpdate.tvShowEpisodes,
          description: this.tvShowToUpdate.tvShowDescription,
          image: this.tvShowToUpdate.tvShowPoster
        });
      }else{
        this.addTVShowForm.reset();
    }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.addTVShowForm.patchValue({ image: file });
    this.addTVShowForm.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }


  onSubmit(){
    if (this.mode === "create") {
      let tvShow: TVShow = {
        tvShowName: this.addTVShowForm.value.name,
        tvShowGenres: this.addTVShowForm.value.genre,
        tvShowLanguage: this.addTVShowForm.value.language,
        tvShowContry: this.addTVShowForm.value.contry,
        tvShowSeason: this.addTVShowForm.value.season,
        tvShowReleaseDate: this.addTVShowForm.value.release,//.format("DD/MM/YYYY/hh.mm.ss"),
        tvShowEpisodes: this.addTVShowForm.value.episode,
        tvShowDescription: this.addTVShowForm.value.description,
        tvShowPoster: this.addTVShowForm.value.image,
        createdAt: this.addTVShowSErv.getTimeStamp().toString(),
        updatedAt: ''
      }   
      this.addTVShowSErv.addTVShow(
        tvShow
      ).subscribe(responseData => {
        let dialogRef = this.dialog.open(TvEpisodesComponent, {
          height: '400px',
          width: '600px',
          data: {
            tvShow: responseData, 
            mode: 'create'
          }
        });  
      });


    } else {
      const tvShow: TVShow = {
        _id: this.tvShowToUpdate._id,
        tvShowName: this.addTVShowForm.value.name,
        tvShowGenres: this.addTVShowForm.value.genre,
        tvShowLanguage: this.addTVShowForm.value.language,
        tvShowContry: this.addTVShowForm.value.contry,
        tvShowSeason: this.addTVShowForm.value.season,
        tvShowReleaseDate: this.addTVShowForm.value.release,//.format("DD/MM/YYYY/hh.mm.ss"),
        tvShowEpisodes: this.addTVShowForm.value.episode,
        tvShowDescription: this.addTVShowForm.value.description,
        tvShowPoster: this.addTVShowForm.value.image,
        createdAt: this.tvShowToUpdate.createdAt,
        updatedAt: this.addTVShowSErv.getTimeStamp().toString()
      }; 
      if(tvShow.tvShowPoster === this.tvShowToUpdate.tvShowPoster){
        this.addTVShowSErv.updateTVShowSamePoster(this.tvShowToUpdate._id, tvShow); // TO DO
      }else{
        this.addTVShowSErv.updateTVShow(this.tvShowToUpdate._id, tvShow); // TO DO
      }
     
    }

    this.resetFormAddTVShow(this.addTVShowForm);
    
  }
  
  private resetFormAddTVShow(formGroup: FormGroup) {
    this.addTVShowForm.reset();  
    this.addTVShowForm.get('name').clearValidators();
    this.addTVShowForm.get('name').updateValueAndValidity();
    this.addTVShowForm.get('genre').clearValidators();
    this.addTVShowForm.get('genre').updateValueAndValidity();
    this.addTVShowForm.get('language').clearValidators();
    this.addTVShowForm.get('language').updateValueAndValidity();
    this.addTVShowForm.get('contry').clearValidators();
    this.addTVShowForm.get('contry').updateValueAndValidity();
    this.addTVShowForm.get('season').clearValidators();
    this.addTVShowForm.get('season').updateValueAndValidity();

    this.addTVShowForm.get('release').clearValidators();
    this.addTVShowForm.get('release').updateValueAndValidity();
    this.addTVShowForm.get('episode').clearValidators();
    this.addTVShowForm.get('episode').updateValueAndValidity();

    this.addTVShowForm.get('description').clearValidators();
    this.addTVShowForm.get('description').updateValueAndValidity();
   // this.addTVShowForm.get('image').clearValidators();
    //this.addTVShowForm.get('image').updateValueAndValidity();
  }
  

}
