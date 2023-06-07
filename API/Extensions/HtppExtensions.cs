using System.Text.Json;
using Application.Core;

namespace API.Extensions
{
    public static class HtppExtensions
    {
        public static void AddPaginationHeader(this HttpResponse responce, int currentPage,
            int itemsPerPage, int totalItems, int totalPages)
        {
            var paginationHeader = new {
                currentPage,
                itemsPerPage,
                totalItems,
                totalPages
            };

            responce.Headers.Add("Pagination", JsonSerializer.Serialize(paginationHeader));
            responce.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }

        public static void AddPaginationHeader<T>(this HttpResponse responce, PagedList<T> list)
        {
            AddPaginationHeader(responce, list.CurrentPage, list.PageSize, list.TotalCount, list.TotalPages);
        }
    }
}