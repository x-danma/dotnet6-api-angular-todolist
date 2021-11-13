import { HttpClient, HttpResponse } from '@angular/common/http';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
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
            isComplete: todo.isComplete
        }).subscribe(result => {
        }, error => console.error(error));
    }

    deleteTodo(todo: Todo): void {
        this.httpClient.delete<Todo>(ApiPaths.ApiBaseUrl + 'todoitems/' + todo.id).subscribe(result => {
            this.todos.forEach((element, index) => {
                if(element.id === result.id) this.todos.splice(index, 1);
            })
        }, error => console.error(error));
    }
}


export interface Todo {
    id: number;
    name: string;
    isComplete: boolean;
}