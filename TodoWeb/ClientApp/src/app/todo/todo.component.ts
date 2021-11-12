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
    httpClient: HttpClient;

    constructor(http: HttpClient) {
        this.httpClient = http;
        http.get<Todo[]>(ApiPaths.ApiBaseUrl + 'todoitems').subscribe(result => {
            this.todos = result;
        }, error => console.error(error));
    }
    ngOnInit(): void {
    }

    saveTodo(todo: Todo): void {
        this.httpClient.put<any>(ApiPaths.ApiBaseUrl + 'todoitems/' + todo.id, {
            id: todo.id,
            name: todo.name,
            isComplete:todo.isComplete
        }).subscribe(result => {
        }, error => console.error(error));
    }

    deleteTodo(todo: Todo): void {
        this.httpClient.delete<any>(ApiPaths.ApiBaseUrl + 'todoitems/' + todo.id).subscribe(result => {
        }, error => console.error(error));
    }
}


export interface Todo {
    id: number;
    name: string;
    isComplete: boolean;
}