namespace Domain
{
    public class Comment
    {
        public int id { get; set; }
        public string Body { get; set; }
        public Activity Activity { get; set; }
        public AppUser Author { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}