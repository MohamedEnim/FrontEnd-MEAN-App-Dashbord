
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TVEpisode } from 'src/app/models/tvEpisode';
import { TVShow } from 'src/app/models/tvShow';
import { TvEpisodeService } from 'src/app/services/tv-episode.service';

@Component({
  selector: 'app-tv-episodes',
  templateUrl: './tv-episodes.component.html',
  styleUrls: ['./tv-episodes.component.css']
})
export class TvEpisodesComponent implements OnInit {
 
  episodesNum: number;
  addTVEpisodeForm: FormGroup;
  tvEpisodeToUpdate: TVEpisode;
  private mode = "create";

  constructor(public dialogRef: MatDialogRef<TvEpisodesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {tvShow: TVShow, mode: string, tvEpisode: TVEpisode},  private tvEpisodeSErv: TvEpisodeService) { }

  ngOnInit(): void {
    this.episodesNum = parseInt(this.data.tvShow.tvShowEpisodes);
    this.addTVEpisodeForm = new FormGroup({
      url: new FormControl(null, Validators.required),
    });
    if(this.data.mode === 'update'){
      this.mode = this.data.mode;
            this.tvEpisodeSErv.getTVEpisodeById(this.data.tvEpisode._id).subscribe((tvEpisode: TVEpisode) => {
                this.tvEpisodeToUpdate = tvEpisode;
                this.addTVEpisodeForm.setValue({
                  url: this.tvEpisodeToUpdate.tvEpisodeUrl,
                });
            });
    } else { 
      this.mode = this.data.mode;
    }
   console.log(this.mode);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(){
    if (this.mode === "create") {
      if(this.episodesNum !== 1){   
        let tvEpisode: TVEpisode = {
          tvShowName: this.data.tvShow.tvShowName,
          tvShowId: this.data.tvShow._id,
          tvShowPoster: this.data.tvShow.tvShowPoster,
          tvShowSeason: this.data.tvShow.tvShowSeason,
          tvShowReleaseDate: this.data.tvShow.tvShowReleaseDate,
          tvEpisodeUrl: this.addTVEpisodeForm.value.url,
          tvEpisodeNum: String(this.episodesNum),
          tvEpisodeLanguage: this.data.tvShow.tvShowLanguage,
          tvEpisodeContry: this.data.tvShow.tvShowContry,
          createdAt: this.tvEpisodeSErv.getTimeStamp().toString(),
          updatedAt: ''
        }
        this.episodesNum -= 1;
        this.tvEpisodeSErv.addTVEpisode(tvEpisode, this.episodesNum).subscribe((data) =>{
          this.resetFormAddTVEpisode(this.addTVEpisodeForm);
        });
      }else{
        let tvEpisode: TVEpisode = {
          tvShowName: this.data.tvShow.tvShowName,
          tvShowId: this.data.tvShow._id,
          tvShowPoster: this.data.tvShow.tvShowPoster,
          tvShowSeason: this.data.tvShow.tvShowSeason,
          tvShowReleaseDate: this.data.tvShow.tvShowReleaseDate,
          tvEpisodeUrl: this.addTVEpisodeForm.value.url,
          tvEpisodeNum: String(this.episodesNum),
          tvEpisodeLanguage: this.data.tvShow.tvShowLanguage,
          tvEpisodeContry: this.data.tvShow.tvShowContry,
          createdAt: this.tvEpisodeSErv.getTimeStamp().toString(),
          updatedAt: ''
        }
        this.tvEpisodeSErv.addTVEpisode(tvEpisode, this.episodesNum).subscribe((data) =>{
          this.onClose();
        });
          
      } 
    } else {
      let tvEpisode: TVEpisode = {
        tvShowName: this.data.tvShow.tvShowName,
        tvShowId: this.data.tvShow._id,
        tvShowPoster: this.data.tvShow.tvShowPoster,
        tvShowSeason: this.data.tvShow.tvShowSeason,
        tvShowReleaseDate: this.data.tvShow.tvShowReleaseDate,
        tvEpisodeUrl: this.addTVEpisodeForm.value.url,
        tvEpisodeNum: String(this.episodesNum),
        tvEpisodeLanguage: this.data.tvShow.tvShowLanguage,
        tvEpisodeContry: this.data.tvShow.tvShowContry,
        createdAt: this.tvEpisodeToUpdate.createdAt,
        updatedAt: this.tvEpisodeSErv.getTimeStamp().toString()
      }
     
       // this.tvEpisodeSErv.updateTVEpisode(this.tvEpisodeToUpdate._id, tvEpisode); // TO DO
     
     
    }
  }

  private resetFormAddTVEpisode(formGroup: FormGroup) {
    this.addTVEpisodeForm.reset();  
    this.addTVEpisodeForm.get('url').clearValidators();
    this.addTVEpisodeForm.get('url').updateValueAndValidity();
   
  }

}
