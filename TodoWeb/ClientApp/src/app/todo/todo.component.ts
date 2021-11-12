import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiPaths } from 'src/environments/environment';

@Component({
    selector: 'app-todo',
    templateUrl: './todo.component.html',
    styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

    public message: string = '';

    constructor(http: HttpClient) {
        http.get<string>(ApiPaths.ApiBaseUrl).subscribe(result => {
            this.message = result;
        }, error => console.error(error));
    }
    ngOnInit(): void {
    }
}


interface WeatherForecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}