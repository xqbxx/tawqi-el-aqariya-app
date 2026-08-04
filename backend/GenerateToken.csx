using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

var jwtKey = "TawqiAqariyaSuperSecretKey_2024_xqbxx123!";
var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

var claims = new[]
{
    new Claim(JwtRegisteredClaimNames.Sub, "xqbxx"),
    new Claim("id", "1"),
    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
};

var token = new JwtSecurityToken(
    issuer: "TawqiApi",
    audience: "TawqiApp",
    claims: claims,
    expires: DateTime.Now.AddDays(7),
    signingCredentials: credentials);

var tokenStr = new JwtSecurityTokenHandler().WriteToken(token);
Console.WriteLine(tokenStr);
