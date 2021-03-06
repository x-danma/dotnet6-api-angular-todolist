using Microsoft.EntityFrameworkCore;
var TodoApiAllowSpecificOrigins = "_todoApiAllowSpecificOrigins";

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<TodoDb>(opt => opt.UseInMemoryDatabase("TodoList"));
builder.Services.AddDatabaseDeveloperPageExceptionFilter();


// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: TodoApiAllowSpecificOrigins,
                      corsBuilder =>
                      {
                          corsBuilder.WithOrigins(builder.Configuration.GetValue<string>("AllowedCors"))
                          .AllowAnyHeader()
                          .AllowAnyMethod();

                      });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors(TodoApiAllowSpecificOrigins);
app.UseHttpsRedirection();

app.MapGet("/version", () =>
{
    var versionConfig = new VersionConfig();
    builder.Configuration.GetSection(VersionConfig.VersionInfo).Bind(versionConfig);
    return Results.Ok(versionConfig);
});

app.MapGet("/todoitems", async (TodoDb db) =>
    await db.Todos.ToListAsync())
    .Produces<Todo[]>();

app.MapGet("/todoitems/complete", async (TodoDb db) =>
    await db.Todos.Where(t => t.IsComplete).ToListAsync())
    .Produces<Todo[]>();

app.MapGet("/todoitems/{id}", async (int id, TodoDb db) =>
    await db.Todos.FindAsync(id)
        is Todo todo
            ? Results.Ok(todo)
            : Results.NotFound())
    .Produces<Todo>()
    .Produces(StatusCodes.Status404NotFound);

app.MapPost("/todoitems", async (Todo todo, TodoDb db) =>
{
    db.Todos.Add(todo);
    await db.SaveChangesAsync();

    return Results.Created($"/todoitems/{todo.Id}", todo);
})
    .Produces<Todo>(StatusCodes.Status201Created);

app.MapPut("/todoitems/{id}", async (int id, Todo inputTodo, TodoDb db) =>
{
    var todo = await db.Todos.FindAsync(id);

    if (todo is null) return Results.NotFound();

    todo.Name = inputTodo.Name;
    todo.IsComplete = inputTodo.IsComplete;

    await db.SaveChangesAsync();

    return Results.NoContent();
})
    .Produces(StatusCodes.Status204NoContent)
    .Produces(StatusCodes.Status404NotFound);

app.MapDelete("/todoitems/{id}", async (int id, TodoDb db) =>
{
    if (await db.Todos.FindAsync(id) is Todo todo)
    {
        db.Todos.Remove(todo);
        await db.SaveChangesAsync();
        return Results.Ok(todo);
    }

    return Results.NotFound();
})
    .Produces<Todo>(StatusCodes.Status200OK)
    .Produces(StatusCodes.Status404NotFound);


app.Run();

class Todo
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public bool IsComplete { get; set; }
}

class TodoDb : DbContext
{
    public TodoDb(DbContextOptions<TodoDb> options)
        : base(options) { }

    public DbSet<Todo> Todos => Set<Todo>();
}

class VersionConfig
{
    public const string VersionInfo = "VersionInfo";
    public string? RunNumber { get; set; }
    public string? SHA { get; set; }
    public string? TimeStamp { get; set; }
    public string? WorkFlow { get; set; }

}