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
        http.get<TodoMessage>(ApiPaths.TodoApi).subscribe(result => {
            console.log(result);
            this.message = result.message;
        }, error => console.error(error));
    }

    ngOnInit(): void {
    }

}

export interface TodoMessage {
    message:string;
 }