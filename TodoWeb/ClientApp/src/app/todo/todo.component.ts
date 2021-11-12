import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiPaths } from 'src/environments/environment';

@Component({
    selector: 'app-todo',
    templateUrl: './todo.component.html',
    styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

    public todos: Todo[] = [];

    constructor(http: HttpClient) {
        http.get<Todo[]>(ApiPaths.ApiBaseUrl + 'todoitems').subscribe(result => {
            this.todos = result;
        }, error => console.error(error));
    }
    ngOnInit(): void {
    }
}


export interface Todo {
    id: number;
    name: string;
    isComplete: boolean;
}