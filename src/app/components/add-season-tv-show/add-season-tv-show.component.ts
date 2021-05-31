import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Genre } from 'src/app/models/genre';
import { TVShow } from 'src/app/models/tvShow';
import { GenresMoviesService } from 'src/app/services/genres-movies.service';
import { TvShowService } from 'src/app/services/tv-show.service';
import { mimeType } from 'src/app/validators/mine-type.validator';

@Component({
  selector: 'app-add-season-tv-show',
  templateUrl: './add-season-tv-show.component.html',
  styleUrls: ['./add-season-tv-show.component.css']
})
export class AddSeasonTvShowComponent implements OnInit {

  @ViewChild('photoInput') photoInput;
  addTVShowForm: FormGroup;
  imagePreview: string;
  genres: Genre[] = [];
  mode = "create";
  tvShowId: string;
  tvShowToUpdate: TVShow;
  isSubmited: boolean = false;
  disable: boolean = true;

  constructor(private genresMoviesSErv: GenresMoviesService, private addTVShowSErv: TvShowService, 
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.addTVShowForm = new FormGroup({
      name: new FormControl(null , Validators.required),
      genre: new FormControl(null, Validators.required),
      language:  new FormControl(null, Validators.required),
      contry: new FormControl(null, Validators.required),
      season: new FormControl(null, Validators.required),
      release: new FormControl(null, Validators.required),
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
      this.genres =  genres;
        return this.addTVShowSErv.getTVShowById(this.tvShowId);  
    })).subscribe((tvShow: TVShow) => {
        this.addTVShowForm.patchValue({
          name: tvShow.tvShowName,
    });
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
     console.log( this.addTVShowForm.value.name);
      let tvShow: TVShow = {
        tvShowName: this.addTVShowForm.value.name,
        tvShowGenres: this.addTVShowForm.value.genre,
        tvShowLanguage: this.addTVShowForm.value.language,
        tvShowContry: this.addTVShowForm.value.contry,
        tvShowSeason: this.addTVShowForm.value.season,
        tvShowReleaseDate: this.addTVShowForm.value.release,//.format("DD/MM/YYYY/hh.mm.ss"),
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
    } 
   

  onNavigateToAllTVShows(){
     this.addTVShowSErv.onNavigateToAllTVShows();
  }

  canDeactivate(): boolean {
      if(this.addTVShowForm.valid === true && this.isSubmited === false){
        return false;
      }else{
        return true;
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

}
