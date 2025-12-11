using BillingService.Data;
using BillingService.Services;
using Microsoft.EntityFrameworkCore;
using SoapCore;
using System.ServiceModel;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddDbContext<BillingDbContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        ServerVersion.AutoDetect(builder.Configuration.GetConnectionString("DefaultConnection"))
    )
);

builder.Services.AddHttpClient<IAuthService, AuthService>();
builder.Services.AddScoped<IBillingService, BillingServiceImpl>();

builder.Services.AddSoapCore();

var app = builder.Build();

// Apply migrations automatically
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<BillingDbContext>();
    db.Database.Migrate();
}

// Configure SOAP endpoint
app.UseSoapEndpoint<IBillingService>("/BillingService.asmx", new SoapEncoderOptions(), SoapSerializer.XmlSerializer);

app.MapGet("/", () => "Billing Service (SOAP) is running. WSDL available at /BillingService.asmx?wsdl");

app.Run();
