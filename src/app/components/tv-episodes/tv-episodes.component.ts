
import { Component, OnInit, ViewChild } from '@angular/core';
import {  NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { TVEpisode } from 'src/app/models/tvEpisode';
import { TVShow } from 'src/app/models/tvShow';
import { TvEpisodeService } from 'src/app/services/tv-episode.service';
import { TvShowService } from 'src/app/services/tv-show.service';

@Component({
  selector: 'app-tv-episodes',
  templateUrl: './tv-episodes.component.html',
  styleUrls: ['./tv-episodes.component.css']
})
export class TvEpisodesComponent implements OnInit {
 
  @ViewChild('addTVEpisodeForm') addTVEpisodeForm: NgForm;
  episodesNum: number;
  tvEpisodeToUpdate: TVEpisode;
  tvShow: TVShow;
  mode = "create";
  episodeNum: number = 1;
  tvShowId: string;
  tvEpisodeId: string;
  urlTvEpisode: string;
  numEpisode: string;
  isSubmited: boolean = false;

  constructor(private tvEpisodeSErv: TvEpisodeService, private route: ActivatedRoute,
     private addTVShowSErv: TvShowService) { }

  ngOnInit(): void {
    this.route.queryParamMap.pipe(switchMap((params: ParamMap) => {
      this.tvShowId = params.get('id');
      this.tvEpisodeId = params.get('episodeId');
      this.mode = params.get('mode');
      return this.addTVShowSErv.getTVShowById(this.tvShowId);
    }), switchMap((tvShow: TVShow) => {
      this.tvShow = tvShow;
      this.episodesNum = parseInt(this.tvShow.tvShowEpisodes);
      

      if(this.mode === 'update'){
        return this.tvEpisodeSErv.getTVEpisodeById(this.tvEpisodeId);
      } else if(this.mode === 'add'){
        this.numEpisode = (parseInt(tvShow.tvShowEpisodes) + 1).toString();
        return of(null);
      } else { 
        return of(null);
      }

    })).subscribe((data: any) => {
     if(this.mode === 'update'){
          this.tvEpisodeToUpdate = data;
          this.episodeNum = data.tvEpisodeNum;
          this.urlTvEpisode = data.tvEpisodeUrl;
      } 
    });
  
  }

  
  onSubmit(){
    if (this.mode === "create") {
      if(this.episodesNum !== 1){   
        let tvEpisode: TVEpisode = {
          tvShowName: this.tvShow.tvShowName,
          tvShowId: this.tvShow._id,
          tvShowPoster: this.tvShow.tvShowPoster,
          tvShowSeason: this.tvShow.tvShowSeason,
          tvShowReleaseDate: this.tvShow.tvShowReleaseDate,
          tvEpisodeUrl: this.addTVEpisodeForm.value.url,
          tvEpisodeNum: String(this.episodeNum),
          tvShowGenres: this.tvShow.tvShowGenres,
          tvEpisodeLanguage: this.tvShow.tvShowLanguage,
          tvEpisodeContry: this.tvShow.tvShowContry,
          createdAt: this.tvEpisodeSErv.getTimeStamp().toString(),
          updatedAt: ''
        }
        this.episodesNum -= 1;
        this.episodeNum +=1;
        this.isSubmited = true;
        this.tvEpisodeSErv.addTVEpisode(tvEpisode).subscribe((data) =>{
          this.isSubmited = false;
          this.addTVEpisodeForm.resetForm();
        });
      }else{
        let tvEpisode: TVEpisode = {
          tvShowName: this.tvShow.tvShowName,
          tvShowId: this.tvShow._id,
          tvShowPoster: this.tvShow.tvShowPoster,
          tvShowSeason: this.tvShow.tvShowSeason,
          tvShowReleaseDate: this.tvShow.tvShowReleaseDate,
          tvEpisodeUrl: this.addTVEpisodeForm.value.url,
          tvEpisodeNum: String(this.episodeNum),
          tvShowGenres: this.tvShow.tvShowGenres,
          tvEpisodeLanguage: this.tvShow.tvShowLanguage,
          tvEpisodeContry: this.tvShow.tvShowContry,
          createdAt: this.tvEpisodeSErv.getTimeStamp().toString(),
          updatedAt: ''
        }
        this.isSubmited = true;
        this.tvEpisodeSErv.addTVEpisode(tvEpisode).subscribe((data) =>{
        this.isSubmited = false;
        this.tvEpisodeSErv.onNavigateToAddTVShow();
        });
          
      } 
    }else if(this.mode === "add"){
      let tvEpisode: TVEpisode = {
        tvShowName: this.tvShow.tvShowName,
        tvShowId: this.tvShow._id,
        tvShowPoster: this.tvShow.tvShowPoster,
        tvShowSeason: this.tvShow.tvShowSeason,
        tvShowReleaseDate: this.tvShow.tvShowReleaseDate,
        tvEpisodeUrl: this.urlTvEpisode,
        tvEpisodeNum: this.numEpisode,
        tvShowGenres: this.tvShow.tvShowGenres,
        tvEpisodeLanguage: this.tvShow.tvShowLanguage,
        tvEpisodeContry: this.tvShow.tvShowContry,
        createdAt: this.tvEpisodeSErv.getTimeStamp().toString(),
        updatedAt: ''
      }
      this.isSubmited = true;
      this.tvEpisodeSErv.addTVEpisodeTable(tvEpisode, this.episodesNum).subscribe((data) =>{
        this.isSubmited = false;
        this.tvEpisodeSErv.onNavigateToTvEpisodes(this.tvShowId);
      });
    
    }else {
      let tvEpisode: TVEpisode = {
        tvShowName: this.tvShow.tvShowName,
        tvShowId: this.tvShow._id,
        tvShowPoster: this.tvShow.tvShowPoster,
        tvShowSeason: this.tvShow.tvShowSeason,
        tvShowReleaseDate: this.tvShow.tvShowReleaseDate,
        tvEpisodeUrl: this.addTVEpisodeForm.value.url,
        tvEpisodeNum: String(this.episodesNum),
        tvShowGenres: this.tvShow.tvShowGenres,
        tvEpisodeLanguage: this.tvShow.tvShowLanguage,
        tvEpisodeContry: this.tvShow.tvShowContry,
        createdAt: this.tvShow.createdAt,
        updatedAt: this.tvEpisodeSErv.getTimeStamp().toString()
      }
     
        this.tvEpisodeSErv.updateTVEpisode(this.tvEpisodeToUpdate._id, tvEpisode).subscribe((data) =>{
          this.tvEpisodeSErv.onNavigateToTvEpisodes(this.tvShow._id)
         // this.onClose();
        }); // TO DO
     
     
    }
  }

  canDeactivate(): boolean {
    if(this.mode === "create" || this.mode === 'add'){
      if(this.addTVEpisodeForm.valid === true && this.isSubmited === false){
        return false;
      }else{
        return true;
      }
    }

    if(this.mode === "update"){
      if(this.addTVEpisodeForm.valid === true && this.isSubmited === false){
        return true;
      } 
      if(this.addTVEpisodeForm.valid === true && this.isSubmited === true) {
        return true;
      }
    }

   
  }

  onNavigateToTVEpisodes(){
    this.tvEpisodeSErv.onNavigateToTvEpisodes(this.tvShow._id)
  }

}
