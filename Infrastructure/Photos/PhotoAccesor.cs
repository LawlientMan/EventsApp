using Application.Interfaces;
using Application.Photos;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos
{
    public class PhotoAccesor : IPhotoAccessor
    {
        private readonly Cloudinary _cloudinary;
        public PhotoAccesor(IOptions<CloudinarySettings> config)
        {
            var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );

            _cloudinary = new Cloudinary(account);
        }

        public async Task<PhotoUploadResult> AddPhoto(IFormFile file)
        {
            if(file.Length > 0){
                await using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams(){
                  File = new FileDescription(file.FileName, stream),
                  Transformation = new Transformation().Height(500).Width(500).Crop("fill"),
                };

                var result = await _cloudinary.UploadAsync(uploadParams);
                if(result.Error != null){
                    throw new Exception(result.Error.Message);
                }

                return new PhotoUploadResult(){
                    PublicId = result.PublicId,
                    Url = result.SecureUrl.ToString()
                };
            }

            return null;
        }

        public async Task<string> DeletePhoto(string publicId)
        {
            var parameters = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(parameters);

            return string.Equals(result.Result, "ok", StringComparison.OrdinalIgnoreCase) ? result.Result: null ;
        }
    }
}