import './App.css';
import Post from './components/Post';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import { auth } from './firebase';
import ImageUpload from './components/ImageUpload';
import axios from './axios'
import Pusher from 'pusher-js'
import { getAuth, updateProfile, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

// Add additional feature
import { addResponseMessage, Widget } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

const pusher = new Pusher('d636369041281e72fdda', {
    cluster: 'us3'
});

function getModalStyle() {
    const top = 50;
    const left = 50;
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

function App() {
    // Post Upload
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = useState(false)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [openSignIn, setOpenSignIn] = useState(false)
    const [posts, setPosts] = useState([
        {
            username: "strawberry10",
            caption: " Beach day! 🔥",
            imageUrl: "https://i.pinimg.com/564x/31/32/82/313282bea5e67041e0a5b0dcff1e063e.jpg"
        }, {
            username: "catlover",
            caption: " bike ride 🌼",
            imageUrl: "https://i.pinimg.com/564x/d9/e2/3e/d9e23e32ff1de0f996024404fd3835b4.jpg"
        }, {
            username: "yumyumyum",
            caption: " 💗💗💗",
            imageUrl: "https://i.pinimg.com/564x/26/3d/a8/263da89bc8652def71ca9f1d85d2d488.jpg"
        }
    ])
    const fetchPosts = async () => {
        await axios.get("/sync").then(response => setPosts(response.data))
    }
    const signUp = async (e) => {
        e.preventDefault()
        const { user } = await createUserWithEmailAndPassword(auth, email, password).catch(error => alert(error.message))
        console.log(`User ${user.uid} created`)
        await updateProfile(user, {
            displayName: username
        });
        console.log("User profile updated")
        setOpen(false)
    }
    const signIn = (e) => {
        e.preventDefault()
        signInWithEmailAndPassword(getAuth(), email, password)
            .catch(error => alert(error.message))
        setOpenSignIn(false)
    }
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(authUser => {
            if(authUser) {
                console.log(authUser)
                setUser(authUser)
            } else {
                setUser(null)
            } })
        return () => {
            unsubscribe()
        }
    }, [user, username])

    // Messaging feature
    const [openMessage, setOpenMessage] = useState(false)
    useEffect(() => {
        addResponseMessage('hi!');
    }, []);

    return (
        <div className="app">
            <Modal open={open} onClose={() => setOpen(false)}>
                <div style={modalStyle} className={classes.paper}>
                    <form className="app__signup">
                        <center>
                            <img className="app__headerImage" src="https://i.pinimg.com/originals/30/72/92/3072927ba0d6a6254719df9a97df48c4.png"
                                 alt="Header" />
                        </center>
                        <Input placeholder="username"
                               type="text"
                               value={username}
                               onChange={e => setUsername(e.target.value)}
                        />
                        <Input placeholder="email"
                               type="text"
                               value={email}
                               onChange={e => setEmail(e.target.value)}
                        />
                        <Input placeholder="password"
                               type="password"
                               value={password}
                               onChange={e => setPassword(e.target.value)}
                        />
                        <Button type="submit" onClick={signUp}>Sign Up</Button>
                    </form>
                </div>
            </Modal>
            <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
                <div style={modalStyle} className={classes.paper}>
                    <form className="app__signup">
                        <center>
                            <img className="app__headerImage" src="https://i.pinimg.com/originals/30/72/92/3072927ba0d6a6254719df9a97df48c4.png"
                                 alt="Header" />
                        </center>
                        <Input placeholder="email" type="text" value={email}
                               onChange={e => setEmail(e.target.value)}  />
                        <Input placeholder="password" type="password"
                               value={password}
                               onChange={e => setPassword(e.target.value)}  />
                        <Button type="submit" onClick={signIn}>Sign In</Button>
                    </form>
                </div>
            </Modal>
            <div className="app__header">
                <img className="app__logo" src="https://i.pinimg.com/originals/30/72/92/3072927ba0d6a6254719df9a97df48c4.png" alt="Header" />
                {user ? <Button onClick={() => auth.signOut()}>Logout</Button> :(
                    <div className="app__loginContainer">
                        <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
                        <Button onClick={() => setOpen(true)}>Sign Up</Button>
                    </div>
                )}
                {user ? (
                    <div className="app__loginContainer">
                        <Button onClick={() => setOpenMessage(true)}>Messenger</Button>
                        <Modal open={openMessage} onClose={() => setOpenMessage(false)}>
                            <Widget
                                title="Messenger"
                                subtitle="Welcome to the chat!"
                            />
                        </Modal>
                    </div>
                ) :
                    <h3></h3>
                }
            </div>
            <div className="app__posts">
                {posts.map(post => (
                    <Post key={post._id}
                          username={post.username}
                          caption={post.caption}
                          imageUrl={post.imageUrl}
                    />
                ))}
                {user ? <ImageUpload username={user.displayName} /> :
                    <h3 className="app__notLogin">Need to login to upload</h3>}
            </div>

        </div>
    );
}

export default App;