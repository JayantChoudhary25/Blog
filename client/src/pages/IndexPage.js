/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Post from "../post";

export default function IndexPage(){
    const [posts, setPosts] = useState([]);
    useEffect(()=>{
        fetch('http://localhost:4000/post').then(response => {
            response.json().then(posts => {
                console.log(posts);
            });
        })
    }, []);
    return(
        <>
            {posts.length > 0 && posts.map(post => (
                <Post {...post}/>
            ))}
        </>
    );
}