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
        const savingTodo: Todo = {
            id: todo.id,
            name: todo.name,
            isComplete: todo.isComplete
        }

        if (savingTodo.id == 0) {
            this.httpClient.post<Todo>(ApiPaths.ApiBaseUrl + 'todoitems', savingTodo).subscribe(result => {
            }, error => console.error(error));
        }
        else{
            this.httpClient.put<any>(ApiPaths.ApiBaseUrl + 'todoitems/' + todo.id, savingTodo).subscribe(result => {
            }, error => console.error(error));
        }
    }

    deleteTodo(todo: Todo): void {
        this.httpClient.delete<Todo>(ApiPaths.ApiBaseUrl + 'todoitems/' + todo.id).subscribe(result => {
            this.todos.forEach((element, index) => {
                if (element.id === result.id) this.todos.splice(index, 1);
            })
        }, error => console.error(error));
    }

    createTodo(): void {
        this.todos.push({ id: 0, name: 'new todo', isComplete: false });
    }
}


export interface Todo {
    id: number;
    name: string;
    isComplete: boolean;
}