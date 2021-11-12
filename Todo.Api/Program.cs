var  TodoAllowSpecificOrigins = "_todoAllowSpecificOrigins";
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: TodoAllowSpecificOrigins,
                      corsBuilder =>
                      {
                          corsBuilder.WithOrigins(builder.Configuration.GetValue<string>("AllowedCors"));
                      });
});
var app = builder.Build();


// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}


app.MapGet("/", () => new Todos());

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
app.UseCors(TodoAllowSpecificOrigins);
app.UseAuthorization();

app.MapRazorPages();

app.Run();

class Todos
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public bool IsComplete { get; set; }
}