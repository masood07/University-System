using Day4.DTOs;
using Day4.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Day4.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public UserManager<User> _Usermanager { get; }
        public SignInManager<User> _Signmanager { get; }

        public UserController(UserManager<User> _usermanager ,SignInManager<User> _signmanager)
        {
            _Usermanager = _usermanager;
            _Signmanager = _signmanager;
        }

        [HttpPost("register")]
        public ActionResult register(addUserDTO stdto)
        {
            if (stdto == null) return BadRequest();
            if(ModelState.IsValid)
            {
                User s = new User()
                {
                    fullname = stdto.fullname,
                    age = stdto.age,
                    UserName = stdto.username,
                    Email = stdto.email,
                    address= "egypt"
                };
                var r = _Usermanager.CreateAsync(s, stdto.password).Result;
                if (r.Succeeded)
                {
                    var r2 = _Usermanager.AddToRoleAsync(s, "student").Result;
                    var r3 = _Usermanager.AddToRoleAsync(s, "teacher").Result;

                    if (r2.Succeeded) return Created();
                    else return BadRequest(r2.Errors);
                }
                else return BadRequest(r.Errors);

            }
            else
                return BadRequest(ModelState);

        }




        [HttpPost("login")]
        public ActionResult login(UserLoginDTo d)
        {
            var loginresult = _Signmanager.PasswordSignInAsync(d.username, d.password, false, false).Result;
            if(loginresult.Succeeded)
            {
                var user = _Usermanager.FindByNameAsync(d.username).Result;

                #region claims
                List<Claim> userdata = new List<Claim>();
                userdata.Add(new Claim("name", user.UserName));
                userdata.Add(new Claim(ClaimTypes.Email,user.Email));

                userdata.Add(new Claim(ClaimTypes.NameIdentifier,user.Id));

                var roles = _Usermanager.GetRolesAsync(user).Result;

                foreach (var itemrole in roles) {
                    userdata.Add(new Claim(ClaimTypes.Role, itemrole));

                }

                #endregion

                #region  key
                string key = "my secert key is track profional developer intake 46";
                var seckey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key));
                var signingcer = new SigningCredentials(seckey, SecurityAlgorithms.HmacSha256);

                #endregion

                //generate token object

                var token = new JwtSecurityToken(
                    claims:userdata,
                    expires:DateTime.Now.AddHours(1),
                    signingCredentials:signingcer
                    );
                //token object =encoding=> string
                var tokenstring = new JwtSecurityTokenHandler().WriteToken(token);


                return Ok(tokenstring);
            }

            return Unauthorized();
        }


        [HttpGet]
        [Authorize]
        public ActionResult get()
        {
            return Ok("welcome");
        }
    }
}
