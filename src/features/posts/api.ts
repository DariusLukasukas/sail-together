// all Parse calls related to postsimport Parse from "@/lib/parse/client";

export async function getPosts(limit = 20) {
    const query = new Parse.Query("Post");

    // include user + location if you want richer data
    query.include("userId");
    query.include("locationId");

    query.descending("createdAt");
    query.limit(limit);

    try {
        const results = await query.find();
        return results.map(p => ({
            id: p.id,
            user: p.get("userId"),
            mediaUrl: p.get("mediaUrl"),
            mediaAlt: p.get("mediaAlt"),
            location: p.get("locationId"),
            likeCount: p.get("likeCount") || 0,
            commentCount: p.get("commentCount") || 0,
            createdAt: p.get("createdAt"),
        }));
    } catch (err: any) {
        console.error("Failed to fetch posts:", err.message);
        throw err;
    }
}

export async function createPost({ mediaUrl, mediaAlt, locationId }: { mediaUrl: string, mediaAlt: string, locationId: string }) {
    const Post = Parse.Object.extend("Post");
    const post = new Post();
    post.set("userId", Parse.User.current());
    post.set("mediaUrl", mediaUrl);
    post.set("mediaAlt", mediaAlt);
    if (locationId) post.set("locationId", locationId);

    const saved = await post.save();
    return saved;
}

export async function deletePost(postId: string) {
    const q = new Parse.Query("Post");
    const obj = await q.get(postId);
    await obj.destroy();
}