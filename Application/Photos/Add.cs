using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Result<Photo>>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Photo>>
        {
            private readonly IPhotoAccessor _photoAccessor;
            private readonly DataContext _dataContext;
            private readonly IUserAccessor _userAccessor;

            public Handler(IPhotoAccessor photoAccessor, DataContext dataContext, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _dataContext = dataContext;
                _photoAccessor = photoAccessor;
            }

            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var userName = _userAccessor.GetUsername();
                var user = await _dataContext.Users.Include(i=> i.Photos).FirstOrDefaultAsync(i=> i.UserName == userName);
                if(user == null) return null;

                var uploadResult = await _photoAccessor.AddPhoto(request.File);
                if (uploadResult == null) return null;

                var photo = new Photo()
                {
                    Id = uploadResult.PublicId,
                    Url = uploadResult.Url,
                };

                if(!user.Photos.Any(i=> i.IsMain)) photo.IsMain = true;

                user.Photos.Add(photo);
                var result = await _dataContext.SaveChangesAsync() > 0;

                if(result) return Result<Photo>.Success(photo);
                
                return Result<Photo>.Failure("Problem adding photo.");
            }
        }
    }
}