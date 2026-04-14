using Microsoft.AspNetCore.Identity;

namespace Day4.Models
{
    public class User:IdentityUser
    {
        public  string fullname { get; set; }
        public int  age { get; set; }
        public string address { get; set; }
    }
}
