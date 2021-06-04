import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Genre } from 'src/app/models/genre';
import { TVShow } from 'src/app/models/tvShow';
import { GenresMoviesService } from 'src/app/services/genres-movies.service';
import { TvShowService } from 'src/app/services/tv-show.service';
import { mimeType } from 'src/app/validators/mine-type.validator';
import { TvEpisodesComponent } from '../tv-episodes/tv-episodes.component';
import * as _moment from 'moment';
import { ComponontCanDeactivate } from 'src/app/models/componont-can-deactivate';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
//import { default as _rollupMoment } from 'moment';

const moment = _moment; //_rollupMoment || _moment;

@Component({
  selector: 'app-add-tvshow',
  templateUrl: './add-tvshow.component.html',
  styleUrls: ['./add-tvshow.component.css'],
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
export class AddTvshowComponent implements OnInit, ComponontCanDeactivate  {

  @ViewChild('photoInput') photoInput;
  addTVShowForm: FormGroup;
  imagePreview: string;
  genres: Genre[] = [];
  mode = "create";
  tvShowId: string;
  tvShowToUpdate: TVShow;
  isSubmited: boolean = false;

  constructor(private genresMoviesSErv: GenresMoviesService, private addTVShowSErv: TvShowService, 
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.addTVShowForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      genre: new FormControl(null, Validators.required),
      language:  new FormControl(null, Validators.required),
      contry: new FormControl(null, Validators.required),
      season: new FormControl(null, Validators.required),
      release: new FormControl(new Date(), Validators.required),
      episode: new FormControl(null, Validators.required),
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
      if(this.tvShowId !== null && this.mode === 'update'){
        this.mode = 'update';
        return this.addTVShowSErv.getTVShowById(this.tvShowId);  
      } 
      else {
        this.mode = 'create';
        return of(null);
      }

    })).subscribe((data: any) => {
      if(this.mode === 'update'){
        this.tvShowToUpdate = data;
        let date = this.getStringToDate(this.tvShowToUpdate.tvShowReleaseDate);
        this.addTVShowForm.setValue({
          name: this.tvShowToUpdate.tvShowName,
          genre: this.tvShowToUpdate.tvShowGenres,      
          language:  this.tvShowToUpdate.tvShowLanguage,
          contry: this.tvShowToUpdate.tvShowContry,
          season: this.tvShowToUpdate.tvShowSeason,
          release: new Date(  parseInt(date.year), parseInt(date.month), parseInt(date.date)),
          episode: this.tvShowToUpdate.tvShowEpisodes,
          image: this.tvShowToUpdate.tvShowPoster
        });
        this.imagePreview = this.tvShowToUpdate.tvShowPoster;
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

  clearPictureAttachment() {
    this.photoInput.nativeElement.value = '';
   }

  onSubmit(){

    if (this.mode === "create") {
      const { year, month,  date } = this.addTVShowForm.value.release._i;
      const dateTf = year  + ',' + month  +  ',' + date;
      let tvShow: TVShow = {
        tvShowName: this.addTVShowForm.value.name,
        tvShowGenres: this.addTVShowForm.value.genre,
        tvShowLanguage: this.addTVShowForm.value.language,
        tvShowContry: this.addTVShowForm.value.contry,
        tvShowSeason: this.addTVShowForm.value.season,
        tvShowReleaseDate: dateTf,
        tvShowEpisodes: this.addTVShowForm.value.episode,
        tvShowPoster: this.addTVShowForm.value.image,
        createdAt: this.addTVShowSErv.getTimeStamp().toString(),
        updatedAt: ''
      }   
      this.isSubmited = true;
      this.addTVShowSErv.addTVShow(
        tvShow
      ).subscribe((tvShow: TVShow) => {
        this.isSubmited = false;
        this.clearPictureAttachment();
        this.imagePreview = null;

        this.addTVShowSErv.onNavigateToAddEpisode(tvShow._id, 'create');
        this.resetFormAddTVShow(this.addTVShowForm);

      });


    } else {
      const yearUp = new Date(this.addTVShowForm.value.release.toString()).getFullYear();
      const dateUp = new Date(this.addTVShowForm.value.release.toString()).getDate();
      const monthUp = new Date(this.addTVShowForm.value.release.toString()).getMonth() + 1;
      const dateTf = yearUp  + ',' + monthUp  +  ',' + dateUp;
      const tvShow: TVShow = {
        _id: this.tvShowToUpdate._id,
        tvShowName: this.addTVShowForm.value.name,
        tvShowGenres: this.addTVShowForm.value.genre,
        tvShowLanguage: this.addTVShowForm.value.language,
        tvShowContry: this.addTVShowForm.value.contry,
        tvShowSeason: this.addTVShowForm.value.season,
        tvShowReleaseDate: dateTf,
        tvShowEpisodes: this.addTVShowForm.value.episode,
        tvShowPoster: this.addTVShowForm.value.image,
        createdAt: this.tvShowToUpdate.createdAt,
        updatedAt: this.addTVShowSErv.getTimeStamp().toString()
      }; 
      if(tvShow.tvShowPoster === this.tvShowToUpdate.tvShowPoster){
        this.addTVShowSErv.updateTVShowSamePoster(this.tvShowToUpdate._id, tvShow).subscribe((tvShow: TVShow) => { 
          this.addTVShowSErv.onNavigateToAllTVShows() ;
        }); 
      }else{
        this.addTVShowSErv.updateTVShow(this.tvShowToUpdate._id, tvShow).subscribe((tvShow: TVShow) => { 
          this.addTVShowSErv.onNavigateToAllTVShows() ;
        });
      }
     
    }

   
    
  }

  onNavigateToAllTVShows(){
     this.addTVShowSErv.onNavigateToAllTVShows();
  }

  canDeactivate(): boolean {
    if(this.mode === "create"){
      if(this.addTVShowForm.valid === true && this.isSubmited === false){
        return false;
      }else{
        return true;
      }
    }

    if(this.mode === "update"){
      if(this.addTVShowForm.valid === true && this.isSubmited === false){
        return true;
      } 
      if(this.addTVShowForm.valid === true && this.isSubmited === true) {
        return true;
      }
    }

   
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
  }
  
  getStringToDate(dateStr: string){
    let date = {
     year: dateStr.split(',')[0],
     month: dateStr.split(',')[1],
     date: dateStr.split(',')[2],
   }
   return date
 }
}
