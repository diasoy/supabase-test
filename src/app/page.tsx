/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Home() {
  const [users, setUsers] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: usersData, error: usersError } = await supabase
        .from("User")
        .select("*");
      const { data: postsData, error: postsError } = await supabase
        .from("Post")
        .select("*");

      if (usersError) {
        console.error("Error fetching users:", usersError);
      } else {
        setUsers(usersData);
      }

      if (postsError) {
        console.error("Error fetching posts:", postsError);
      } else {
        setPosts(postsData);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div>
        <h1>Users</h1>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              {user.name} ({user.email})
            </li>
          ))}
        </ul>
        <h1>Posts</h1>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              {post.title} - {post.content}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
