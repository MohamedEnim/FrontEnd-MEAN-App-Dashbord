import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Movie } from 'src/app/models/movie';
import { TVEpisode } from 'src/app/models/tvEpisode';
import { TVShow } from 'src/app/models/tvShow';
import { TvEpisodeService } from 'src/app/services/tv-episode.service';


@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {

  tvShow: TVShow;
  movie: Movie;
  tvEpisode: TVEpisode;
  tvEpisodes: TVEpisode[];
  poster: string;
  name: string;
  language: string;
  contry: string;
  genres: string;
  duration: string;
  description: string;
  url: string;
  year: string;
  epsArray: number[];
  episodeNum: string;
  isSelected: number;
  urlSelectedEpisode: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: {model: any, type: string}, public dialogRef: MatDialogRef<DetailsComponent>,
  private tvEpisodeSErv: TvEpisodeService) { }


  ngOnInit(): void {
  
    if(this.data.type.includes('movie')){
      this.movie = this.data.model as Movie;
      this.poster = this.movie.moviePoster;
      this.name = this.movie.movieName;
      this.language = this.movie.movieLanguage;
      this.contry = this.movie.movieContry;
      this.genres = this.tableToString(this.movie.movieGenres);
      this.duration = this.getDurationToMinute(this.movie.duration).toString();
      this.description = this.movie.descriptionEN;
      this.url = this.movie.movieUrl;
      this.year = this.getYear(this.movie.movieReleaseDate);
    }

    if(this.data.type.includes('tvShow')){
      this.tvShow = this.data.model as TVShow;
      this.tvEpisodeSErv.getTVEpisodesById(this.tvShow._id).subscribe((tvEpisodes: TVEpisode[]) => {
      this.tvEpisodes = tvEpisodes;
      this.poster = this.tvShow.tvShowPoster;
      this.name = this.tvShow.tvShowName;
      this.language = this.tvShow.tvShowLanguage;
      this.contry = this.tvShow.tvShowContry;
      this.genres = this.tableToString(this.tvShow.tvShowGenres);
      this.year = this.getYear(this.tvShow.tvShowReleaseDate);
      this.epsArray = this.getEpisodesArray(this.tvShow.tvShowEpisodes);
  });
      
     
    }

    if(this.data.type.includes('episode')){
      this.tvEpisode = this.data.model as TVEpisode;
      this.poster = this.tvEpisode.tvShowPoster;
      this.name = this.tvEpisode.tvShowName;
      this.language = this.tvEpisode.tvEpisodeLanguage;
      this.contry = this.tvEpisode.tvEpisodeContry;
      this.genres = this.tableToString(this.tvEpisode.tvShowGenres);
      this.url = this.tvEpisode.tvEpisodeUrl;
      this.year = this.getYear(this.tvEpisode.tvShowReleaseDate);
      this.episodeNum = this.tvEpisode.tvEpisodeNum;
    }

    
  }

  tableToString(genres: [string]){
    let genresSTR: string = '';
    for(let genre of genres){
      genresSTR += genre + ', ';
    }
   let editGenresSTR = genresSTR.slice(0, -2);
    return editGenresSTR;
  }

  getYear(date: string){
    return date.split(',')[0];
  }

  getDurationToMinute(duration: string){
    return parseInt(duration.split(':')[0]) * 60 + parseInt(duration.split(':')[1]);

  }

  private getEpisodesArray(epsNumStr: string){
    const epsNumInt: number = parseInt(epsNumStr);
    let epsArray: number[] = [];
    for(let i=1; i<= epsNumInt; i++){
      epsArray.push(i);
    }
    return epsArray;
  }

  onSelectEpisode(episodeNumber: number){
    this.isSelected = episodeNumber;
    let tvEpisode = this.tvEpisodes.find(tvEpisode => tvEpisode.tvEpisodeNum === episodeNumber.toString());
    this.urlSelectedEpisode = tvEpisode.tvEpisodeUrl;
  }

  onClose(){
    this.dialogRef.close();
  }

}
