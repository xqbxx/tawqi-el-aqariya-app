using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace TawqiApi.Services
{
    public class SupabaseStorageService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        private readonly string _supabaseUrl;
        private readonly string _supabaseKey;
        private readonly string _bucketName;

        public SupabaseStorageService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            
            _supabaseUrl = _configuration["Supabase:Url"] ?? throw new ArgumentNullException("Supabase:Url is missing");
            _supabaseKey = _configuration["Supabase:Key"] ?? throw new ArgumentNullException("Supabase:Key is missing");
            _bucketName = _configuration["Supabase:BucketName"] ?? "properties-images";

            _httpClient.BaseAddress = new Uri(_supabaseUrl);
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _supabaseKey);
            // The anon key or service role key must be passed in the apikey header as well
            _httpClient.DefaultRequestHeaders.Add("apikey", _supabaseKey);
        }

        public async Task<string> UploadImageAsync(byte[] imageBytes, string fileName, string contentType = "image/webp")
        {
            var requestUri = $"/storage/v1/object/{_bucketName}/{fileName}";
            
            using var content = new ByteArrayContent(imageBytes);
            content.Headers.ContentType = new MediaTypeHeaderValue(contentType);

            var response = await _httpClient.PostAsync(requestUri, content);
            
            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to upload image to Supabase Storage: {error}");
            }

            return $"{_supabaseUrl}/storage/v1/object/public/{_bucketName}/{fileName}";
        }

        public async Task DeleteImageAsync(string publicUrl)
        {
            // Extract the file path from the public URL
            // Format: https://{projectId}.supabase.co/storage/v1/object/public/{bucketName}/{fileName}
            var prefix = $"{_supabaseUrl}/storage/v1/object/public/{_bucketName}/";
            if (!publicUrl.StartsWith(prefix))
            {
                // Not a Supabase storage URL for this bucket, skip deletion
                return;
            }

            var fileName = publicUrl.Substring(prefix.Length);
            
            // Supabase delete endpoint expects a DELETE request to /storage/v1/object/{bucketName} 
            // with a JSON body containing {"prefixes": ["file1.webp"]}
            var requestUri = $"/storage/v1/object/{_bucketName}";
            
            var payload = new { prefixes = new[] { fileName } };
            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var request = new HttpRequestMessage(HttpMethod.Delete, requestUri)
            {
                Content = content
            };

            var response = await _httpClient.SendAsync(request);

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                throw new Exception($"Failed to delete image from Supabase Storage: {error}");
            }
        }
    }
}
