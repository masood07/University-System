using Day1.MapperConfig;
using Day4.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using static System.Net.Mime.MediaTypeNames;

namespace Day4
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            string txt = "";

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddAutoMapper(cfg => cfg.AddProfile<mappconfig>());
            builder.Services.AddCors(options =>
            {
                options.AddPolicy(txt,
                builder =>
                {
                    builder.AllowAnyOrigin();
                    // builder.WithOrigins("https://localhost:7085");
                    //builder.WithMethods("Post","get");
                    builder.AllowAnyMethod();
                    builder.AllowAnyHeader();
                });
            });

            builder.Services.AddOpenApi();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddDbContext<ITIContext>(op => op.UseSqlServer(builder.Configuration.GetConnectionString("iticon")));
            builder.Services.AddIdentity<User, IdentityRole>
                (s=>s.SignIn.RequireConfirmedEmail=false)
                .AddEntityFrameworkStores<ITIContext>();



            #region validate token 
            builder.Services.AddAuthentication(
                op =>
                {
                    op.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    // op.DefaultChallengeScheme= JwtBearerDefaults.AuthenticationScheme;
                    // op.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                }).AddJwtBearer(
                op =>
                {
                    #region  key
                    string key = "my secert key is track profional developer intake 46";
                    var seckey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key));

                    #endregion
                    op.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidateAudience = false,
                        ValidateIssuer = false,
                        IssuerSigningKey = seckey,
                        ValidateLifetime = true,
                    };





                });



            #endregion



            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            app.UseCors(txt);

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();


            app.MapControllers();

            app.Run();
        }
    }
}
