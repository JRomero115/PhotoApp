import { useState } from "react";
import { storage } from '../firebase';
import { ref, getDownloadURL, uploadBytesResumable, uploadString } from "firebase/storage";
import { Avatar } from "@material-ui/core";
import './Post.css'
import './ImageUpload.css'

const ImageUpload = ({ username }) => {
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState("");

    const handleChange = (e) => {
        e.preventDefault();
        const file = e.target[0].files[0];
        handleUpload(file);
    };

    const handleUpload = (file) => {
        if (!file) return;
        const storageRef = ref(storage, `images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadString(storageRef, caption).then((snapshot) => {
            console.log(caption);
            setCaption(caption);
        });

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const prog = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(prog);
            },
            (error) => console.log(error),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log("File available at", downloadURL);
                    document.querySelector(".imageUpload__image").src = downloadURL;
                });
            }
        );
    };

    return (
        <div className="post">
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt= {username}
                    src="/static/images/avatar/1.jpg"
                />
                <h3>{username}</h3>
            </div>
            <img className="imageUpload__image" />
            <h4 className="post__text"><strong>{username} </strong>
                {caption}</h4>

            <div className="imageUpload">
                <progress className="imageUpload__progress" value={progress} max="100" />
                <input
                    type="text"
                    placeholder="Enter a caption..."
                    onChange={(e) => setCaption(e.target.value)}
                    value={caption}
                />
                <form onSubmit={handleChange}>
                    <input type="file" className="input" />
                    <button className="imageUpload__button" type="submit">Upload</button>
                </form>
            </div>
        </div>
    );
}

export default ImageUpload;