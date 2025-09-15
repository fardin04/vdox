import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: '20kb'}));
app.use(express.urlencoded({ extended: true, limit: '20kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// Routes
import userRouter from './routes/user.routes.js';
import videoRouter from './routes/video.routes.js';
import commentRouter from './routes/comment.routes.js';
import playlistRouter from './routes/playlist.routes.js';
import blogRouter from './routes/blog.routes.js';
import dashboardRouter from './routes/dashboard.routes.js';
import likeRouter from './routes/like.routes.js';
import subcriptionRouter from './routes/subcription.routes.js';

//Route Declarations

app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', videoRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/playlists', playlistRouter);
app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/subcriptions', subcriptionRouter);

app.get('/', (req, res) => {
    res.send('Welcome to the Vdox API');
});

export {app}