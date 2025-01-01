import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const BlogPost = () => {
  const { blog_id } = useParams();
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const API_BASE_URL = 'http://localhost:8000'; // Add this line

  const fetchBlog = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/blogs/${blog_id}`);
      setBlog(response.data);
    } catch (error) {
      console.error("Error fetching blog:", error);
      toast.error("Failed to fetch blog post. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [blog_id]);

  useEffect(() => {
    fetchBlog();
  }, [fetchBlog]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h2 className="text-2xl text-gray-600">Blog post not found</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <article className="bg-white rounded-lg shadow-lg p-6">
        <header className="mb-6">
          <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
          <div className="flex items-center justify-between text-gray-600">
            <div>
              <p>By {blog.author}</p>
              <p>{new Date(blog.date).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
                {blog.category}
              </span>
            </div>
          </div>
        </header>

        {blog.featuredImage && (
          <img 
            src={blog.featuredImage} 
            alt={blog.title}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />
        )}

        <div className="prose max-w-none">
          {/* If your content is markdown, you might want to use a markdown renderer here */}
          <div className="whitespace-pre-wrap">{blog.content}</div>
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {blog.resources && blog.resources.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Resources:</h3>
            <ul className="list-disc list-inside">
              {blog.resources.map((resource, index) => (
                <li key={index} className="text-blue-500 hover:underline">
                  <a href={resource} target="_blank" rel="noopener noreferrer">
                    {resource}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <footer className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-gray-600">
            <p>Reading time: {blog.readingTime} minutes</p>
            <p>Grade Level: {blog.gradeLevel}</p>
          </div>
        </footer>
      </article>
    </div>
  );
};

export default BlogPost;