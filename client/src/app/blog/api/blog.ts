import { StaticImageData } from "next/image";
import postsData from '@/assets/posts.json';

export interface BlogPost {
  title: string;
  date: string;
  author: string;
  image?: StaticImageData | string;
  url: string;
}

const blogPosts: BlogPost[] = postsData.posts;

// 1. Featured Posts
export async function getFeaturedPosts(): Promise<BlogPost[]> {
  return blogPosts.slice(0, 3);
}

// 2. Recent Posts
export async function getRecentPosts(): Promise<BlogPost[]> {
  return blogPosts.slice(3, 9);
}

// 3. Archive Posts - all posts
export async function getArchivePosts(): Promise<BlogPost[]> {
  return blogPosts.slice(9);
}
